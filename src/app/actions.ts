"use server";

import { supabase } from "@/lib/supabase";
import sharp from "sharp";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createProject(formData: FormData) {
  const appName = formData.get("appName") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const tone = formData.get("tone") as string;
  const brandColor = formData.get("brandColor") as string;
  const whatsNew = formData.get("whatsNew") as string;
  const promotionalText = formData.get("promotionalText") as string;
  const iconFile = formData.get("icon") as File;
  const iconUrl = formData.get("iconUrl") as string;
  const iconId = formData.get("iconId") as string;

  if (!appName || (!iconFile && !iconUrl && !iconId)) {
    throw new Error("App name and icon are required");
  }

  // 1. Process Icon to Buffer early to catch errors
  let iconBuffer: Buffer;
  try {
    if (iconFile && iconFile.size > 0) {
      iconBuffer = Buffer.from(await iconFile.arrayBuffer());
    } else if (iconId) {
        // Fetch High-Res from Noun Project Download endpoint
        const pureColor = (brandColor || "#000000").replace("#", "");
        const KEY = process.env.NOUN_PROJECT_KEY;
        const SECRET = process.env.NOUN_PROJECT_SECRET;
        
        if (!KEY || !SECRET) throw new Error("Noun Project credentials missing");

        const OAuth = (await import("oauth-1.0a")).default;
        const crypto = await import("crypto");
        const oauth = new OAuth({
            consumer: { key: KEY, secret: SECRET },
            signature_method: 'HMAC-SHA1',
            hash_function(base_string, key) {
                return crypto.createHmac('sha1', key).update(base_string).digest('base64');
            },
        });

        const downloadUrl = `https://api.thenounproject.com/v2/icon/${iconId}/download?color=${pureColor}&filetype=png&size=1024`;
        const headers = oauth.toHeader(oauth.authorize({ url: downloadUrl, method: 'GET' }));
        
        const res = await fetch(downloadUrl, { headers: { ...headers, 'Accept': 'image/png' } });
        if (res.ok && res.headers.get("content-type")?.includes("image")) {
            iconBuffer = Buffer.from(await res.arrayBuffer());
        } else {
            // Fallback to thumbnail URL if download fails
            const fallbackRes = await fetch(iconUrl);
            iconBuffer = Buffer.from(await fallbackRes.arrayBuffer());
        }
    } else if (iconUrl) {
      const iconRes = await fetch(iconUrl);
      if (!iconRes.ok) throw new Error("Failed to fetch selected icon");
      iconBuffer = Buffer.from(await iconRes.arrayBuffer());
    } else {
      throw new Error("Icon is required");
    }
  } catch (err: any) {
    throw new Error(`Icon processing failed: ${err.message}`);
  }

  // 2. Save project in Supabase
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .insert({
      app_name: appName,
      description: description || "",
      category: category || "Utilities",
      tone: tone || "Minimalist",
      brand_color: brandColor || "#000000",
    })
    .select()
    .single();

  if (projectError) throw projectError;

  // 3. Generate Assets with Sharp
  const assets = [
    { name: "icon.png", size: 1024, type: "icon" },
    { name: "adaptive-icon.png", size: 1024, type: "adaptive-icon", padding: 200 },
    { name: "splash.png", width: 1284, height: 2778, type: "splash" },
    { name: "favicon.png", size: 48, type: "favicon" },
  ];

  for (const asset of assets) {
    let processedBuffer: Buffer;

    if (asset.type === "splash") {
      processedBuffer = await sharp({
        create: {
          width: asset.width!,
          height: asset.height!,
          channels: 4,
          background: brandColor || "#FFFFFF",
        },
      })
      .composite([
        {
          input: await sharp(iconBuffer).resize(400, 400).toBuffer(),
          gravity: "center",
        },
      ])
      .png()
      .toBuffer();
    } else if (asset.type === "adaptive-icon") {
      processedBuffer = await sharp(iconBuffer)
        .resize(asset.size! - (asset.padding || 0))
        .extend({
          top: (asset.padding || 0) / 2,
          bottom: (asset.padding || 0) / 2,
          left: (asset.padding || 0) / 2,
          right: (asset.padding || 0) / 2,
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png()
        .toBuffer();
    } else {
      processedBuffer = await sharp(iconBuffer)
        .resize(asset.size, asset.size)
        .png()
        .toBuffer();
    }

    const filePath = `${project.id}/${asset.name}`;
    const { error: storageError } = await supabase.storage
      .from("assets")
      .upload(filePath, processedBuffer, {
        contentType: "image/png",
        upsert: true,
      });

    if (storageError) {
      console.error(`Error uploading ${asset.name}:`, storageError);
      continue;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("assets")
      .getPublicUrl(filePath);

    await supabase.from("assets").insert({
      project_id: project.id,
      type: asset.type,
      file_url: publicUrl,
    });
  }

  // 4. Generate AI Metadata
  let iosData, androidData;
  try {
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      You are an expert App Store Optimization (ASO) specialist.
      Generate creative, high-converting App Store and Google Play metadata for the following app:
      
      App Name: ${appName}
      User's Basic Description: ${description}
      Category: ${category}
      Marketing Tone: ${tone}
      ${whatsNew ? `What's New in This Release: ${whatsNew}` : ''}
      ${promotionalText ? `Promotional Highlights: ${promotionalText}` : ''}
      
      Your Goal: Create professional, conversion-optimized metadata that stays WITHIN character limits.
      
      Expansion Strategy: 
      If the user input is brief, infer professional features and benefits standard for top ${category} apps.
      
      Requirements:
      1. iOS Title: EXACTLY 30 chars max. Catchy, keyword-optimized.
      2. iOS Subtitle: EXACTLY 30 chars max. High-impact value proposition.
      3. iOS Keywords: EXACTLY 100 chars max. High-volume, comma-separated keywords.
      4. iOS Description: 2000-3500 characters (MUST be under 4000). Structure:
         - Opening hook (2-3 sentences)
         - Core value proposition
         - 5-8 key features with "-" bullets
         - Brief closing call-to-action
      5. Android Title: EXACTLY 50 chars max.
      6. Android Short Description: EXACTLY 80 chars max. Punchy value prop.
      7. Android Long Description: 2000-3500 characters (MUST be under 4000).
         - Professional but conversational tone
         - Address user pain points
         - List 6-10 key features
         - Natural keyword integration
      8. What's New: ${whatsNew ? '170 chars max. Creative, non-technical summary of: ' + whatsNew : '170 chars max. Generic first release message.'}
      9. Promotional Text: 170 chars max. A punchy highlight of a current feature or promotion for the App Store.
      
      STRICT CONSTRAINTS:
      - Character Limits are HARD LIMITS. Never exceed them.
      - Formatting: NO emojis, NO markdown, NO hashtags.
      - Style: Plain text only. Use "-" for bullets.
      - Quality: Professional copywriting, not robotic.
      
      Return ONLY a JSON object with these keys: 
      "ios_title", "ios_subtitle", "ios_keywords", "ios_description", "android_title", "android_short_desc", "android_long_desc", "whats_new", "promotional_text"
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const jsonStr = text.includes("```json") ? text.split("```json")[1].split("```")[0].trim() : text;
    const aiResult = JSON.parse(jsonStr);
    
    iosData = { 
      title: aiResult.ios_title.slice(0, 30), 
      subtitle: aiResult.ios_subtitle.slice(0, 30), 
      keywords: aiResult.ios_keywords.slice(0, 100), 
      description: aiResult.ios_description.slice(0, 4000),
      whats_new: aiResult.whats_new?.slice(0, 170) || "Initial release",
      promotional_text: aiResult.promotional_text?.slice(0, 170) || ""
    };
    androidData = { 
      title: aiResult.android_title.slice(0, 50), 
      short_desc: aiResult.android_short_desc.slice(0, 80), 
      long_desc: aiResult.android_long_desc.slice(0, 4000),
      whats_new: aiResult.whats_new?.slice(0, 500) || "Initial release"
    };
  } catch (error) {
    console.error("AI Generation failed:", error);
    iosData = { title: appName.slice(0, 30), subtitle: `The best ${category} app`.slice(0, 30), keywords: `${appName}, ${category}, mobile`, description: description };
    androidData = { title: appName, short_desc: (description || "").slice(0, 80), long_desc: description };
  }

  await supabase.from("metadata").insert({ project_id: project.id, ios_data: iosData, android_data: androidData });

  revalidatePath("/dashboard");
  return { id: project.id };
}

export async function deleteProject(id: string) {
  await supabase.from("projects").delete().eq("id", id);
  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function searchIcons(query: string) {
  if (!query) return [];
  const KEY = process.env.NOUN_PROJECT_KEY;
  const SECRET = process.env.NOUN_PROJECT_SECRET;
  if (!KEY || !SECRET) return [];

  try {
    const OAuth = (await import("oauth-1.0a")).default;
    const crypto = await import("crypto");
    const oauth = new OAuth({
      consumer: { key: KEY, secret: SECRET },
      signature_method: 'HMAC-SHA1',
      hash_function(base_string, key) {
        return crypto.createHmac('sha1', key).update(base_string).digest('base64');
      },
    });

    const request_data = {
      url: `https://api.thenounproject.com/v2/icon?query=${encodeURIComponent(query)}&limit=24`,
      method: 'GET',
    };

    const headers = oauth.toHeader(oauth.authorize(request_data));
    const response = await fetch(request_data.url, { headers: { ...headers, 'Accept': 'application/json' } });
    if (!response.ok) return [];
    const data = await response.json();
    return data.icons || [];
  } catch (error) {
    return [];
  }
}

export async function regenerateField(projectId: string, fieldKey: string, platform: 'ios' | 'android') {
  const { data: project } = await supabase.from("projects").select("*").eq("id", projectId).single();
  const { data: metadata } = await supabase.from("metadata").select("*").eq("project_id", projectId).single();
  
  if (!project || !metadata) throw new Error("Project or metadata not found");

  const { GoogleGenerativeAI } = await import("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const fieldLabels: Record<string, string> = {
    title: "App Title",
    subtitle: "Subtitle",
    description: "Long Description",
    keywords: "Keywords",
    short_desc: "Short Description",
    whats_new: "What's New",
    promotional_text: "Promotional Text"
  };

  const limits: Record<string, number> = {
      title: platform === 'ios' ? 30 : 50,
      subtitle: 30,
      short_desc: 80,
      promotional_text: 170,
      whats_new: 170,
      keywords: 100,
      description: 4000,
      long_desc: 4000
  };

  const currentData = platform === 'ios' ? metadata.ios_data : metadata.android_data;
  const currentValue = currentData[fieldKey] || "";

  const prompt = `
    You are an ASO specialist. Regenerate the ${fieldLabels[fieldKey] || fieldKey} for the following app on ${platform.toUpperCase()}:
    
    App Name: ${project.app_name}
    Base Description: ${project.description}
    Category: ${project.category}
    Tone: ${project.tone}
    Current Value: ${currentValue}
    
    STRICT CONSTRAINTS:
    - Max characters: ${limits[fieldKey] || 4000}
    - NO emojis, NO markdown, NO hashtags.
    - Return ONLY the plain text for the regenerated field. Do not include any JSON or labels.
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const newText = response.text().trim();

  const updatedMetadata = platform === 'ios' 
    ? { ...metadata.ios_data, [fieldKey]: newText }
    : { ...metadata.android_data, [fieldKey]: newText };

  const updateKey = platform === 'ios' ? 'ios_data' : 'android_data';

  await supabase
    .from("metadata")
    .update({ [updateKey]: updatedMetadata })
    .eq("project_id", projectId);

  revalidatePath(`/project/${projectId}`);
  return newText;
}

export async function updateProjectIcon(formData: FormData) {
  const projectId = formData.get("projectId") as string;
  const brandColor = formData.get("brandColor") as string;
  const iconFile = formData.get("icon") as File;
  const iconUrl = formData.get("iconUrl") as string;
  const iconId = formData.get("iconId") as string;

  if (!projectId || (!iconFile && !iconUrl && !iconId)) {
    throw new Error("Project ID and icon are required");
  }

  // 1. Process Icon to Buffer
  let iconBuffer: Buffer;
  if (iconFile && iconFile.size > 0) {
    iconBuffer = Buffer.from(await iconFile.arrayBuffer());
  } else if (iconId) {
      const pureColor = (brandColor || "#000000").replace("#", "");
      const KEY = process.env.NOUN_PROJECT_KEY;
      const SECRET = process.env.NOUN_PROJECT_SECRET;
      if (!KEY || !SECRET) throw new Error("Noun Project credentials missing");
      const OAuth = (await import("oauth-1.0a")).default;
      const crypto = await import("crypto");
      const oauth = new OAuth({
          consumer: { key: KEY, secret: SECRET },
          signature_method: 'HMAC-SHA1',
          hash_function(base_string, key) {
              return crypto.createHmac('sha1', key).update(base_string).digest('base64');
          },
      });
      const downloadUrl = `https://api.thenounproject.com/v2/icon/${iconId}/download?color=${pureColor}&filetype=png&size=1024`;
      const headers = oauth.toHeader(oauth.authorize({ url: downloadUrl, method: 'GET' }));
      const res = await fetch(downloadUrl, { headers: { ...headers, 'Accept': 'image/png' } });
      if (res.ok && res.headers.get("content-type")?.includes("image")) {
          iconBuffer = Buffer.from(await res.arrayBuffer());
      } else {
          const fallbackRes = await fetch(iconUrl);
          iconBuffer = Buffer.from(await fallbackRes.arrayBuffer());
      }
  } else {
    const iconRes = await fetch(iconUrl);
    if (!iconRes.ok) throw new Error("Failed to fetch selected icon");
    iconBuffer = Buffer.from(await iconRes.arrayBuffer());
  }

  // 2. Update project brand color
  await supabase.from("projects").update({ brand_color: brandColor }).eq("id", projectId);

  // 3. Generate and Update Assets
  const assets = [
    { name: "icon.png", size: 1024, type: "icon" },
    { name: "adaptive-icon.png", size: 1024, type: "adaptive-icon", padding: 200 },
    { name: "splash.png", width: 1284, height: 2778, type: "splash" },
    { name: "favicon.png", size: 48, type: "favicon" },
  ];

  for (const asset of assets) {
    let processedBuffer: Buffer;
    if (asset.type === "splash") {
      processedBuffer = await sharp({
        create: {
          width: asset.width!,
          height: asset.height!,
          channels: 4,
          background: brandColor || "#FFFFFF",
        },
      })
      .composite([{ input: await sharp(iconBuffer).resize(400, 400).toBuffer(), gravity: "center" }])
      .png()
      .toBuffer();
    } else if (asset.type === "adaptive-icon") {
      processedBuffer = await sharp(iconBuffer)
        .resize(asset.size! - (asset.padding || 0))
        .extend({
          top: (asset.padding || 0) / 2,
          bottom: (asset.padding || 0) / 2,
          left: (asset.padding || 0) / 2,
          right: (asset.padding || 0) / 2,
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png()
        .toBuffer();
    } else {
      processedBuffer = await sharp(iconBuffer).resize(asset.size, asset.size).png().toBuffer();
    }

    const filePath = `${projectId}/${asset.name}`;
    await supabase.storage.from("assets").upload(filePath, processedBuffer, { contentType: "image/png", upsert: true });
    
    const { data: { publicUrl } } = supabase.storage.from("assets").getPublicUrl(filePath);
    await supabase.from("assets").update({ file_url: publicUrl }).eq("project_id", projectId).eq("type", asset.type);
  }

  revalidatePath(`/project/${projectId}`);
  return { success: true };
}
