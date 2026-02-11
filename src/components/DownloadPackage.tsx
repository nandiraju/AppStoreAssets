"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import JSZip from "jszip";
import { toast } from "sonner";

export default function DownloadPackage({ project }: { project: any }) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    const zip = new JSZip();

    try {
      toast.info("Preparing your download package...");
      
      // 1. Add Assets
      const assetsFolder = zip.folder("expo-assets");
      for (const asset of project.assets || []) {
        const response = await fetch(asset.file_url);
        const blob = await response.blob();
        assetsFolder?.file(asset.type === 'adaptive-icon' ? 'adaptive-icon.png' : `${asset.type}.png`, blob);
      }

      // 2. Add Metadata
      const metadata = project.metadata?.[0];
      if (metadata) {
        const iosText = `
TITLE: ${metadata.ios_data.title}
SUBTITLE: ${metadata.ios_data.subtitle}
KEYWORDS: ${metadata.ios_data.keywords}

DESCRIPTION:
${metadata.ios_data.description}
        `.trim();

        const androidText = `
TITLE: ${metadata.android_data.title}
SHORT DESCRIPTION: ${metadata.android_data.short_desc}

LONG DESCRIPTION:
${metadata.android_data.long_desc}
        `.trim();

        zip.file("ios-metadata.txt", iosText);
        zip.file("android-metadata.txt", androidText);
      }

      // 3. Add App Config Snippet
      const appConfig = {
        expo: {
          icon: "./assets/icon.png",
          splash: {
            image: "./assets/splash.png",
            resizeMode: "contain",
            backgroundColor: project.brand_color || "#FFFFFF"
          },
          android: {
            adaptiveIcon: {
              foregroundImage: "./assets/adaptive-icon.png",
              backgroundColor: project.brand_color || "#FFFFFF"
            }
          }
        }
      };
      zip.file("app-config.json", JSON.stringify(appConfig, null, 2));

      // 4. Generate and Download
      const content = await zip.generateAsync({ type: "blob" });
      const url = window.URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${project.app_name.replace(/\s+/g, '-').toLowerCase()}-assets.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success("Package downloaded successfully!");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to generate download package");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Button 
      onClick={handleDownload} 
      disabled={downloading}
      className="font-bold rounded-2xl bg-black hover:bg-zinc-800 text-white px-8 shadow-lg shadow-zinc-200 transition-all active:scale-[0.98]"
    >
      {downloading ? (
        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Preparing...</>
      ) : (
        <><Download className="mr-2 h-4 w-4" /> Download Package</>
      )}
    </Button>
  );
}
