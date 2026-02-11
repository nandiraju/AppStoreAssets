Perfect.
Simple. Clean. Buildable in **AntiGravity**.
No over-engineering. No enterprise complexity. Just vibe coding. 🚀

Below is your **Vibe Code Instruction Spec**.

---

# 🎨 AppStoreForge

### Vibe Code Instructions for AntiGravity

Stack: Next.js + Supabase (MCP) + Tailwind + shadcn + Quicksand

---

# 🧠 Core Idea

Build a clean, modern web app where:

User enters:

- App Name
- Short description
- Category
- Tone
- Brand color
- Upload 1024x1024 icon

System generates:

- iOS metadata
- Android metadata
- Expo-ready assets
- app.json snippet
- Downloadable ZIP

Keep it simple. Minimal DB. No heavy auth logic.

---

# 🧱 Tech Stack Rules

- Next.js (App Router)
- Tailwind CSS
- shadcn/ui
- Google Font: Quicksand
- Supabase via MCP Server
- Sharp for image resizing
- Use Server Actions
- Deployed on Vercel

---

# 🎨 Design Direction (Very Important)

Style should be:

- Ultra clean
- Soft shadows
- Rounded-2xl cards
- Smooth hover animations
- Neutral light background
- Accent = user brand color
- Lots of whitespace
- Calm startup aesthetic
- Modern SaaS vibe

Use:

- Cards
- Tabs
- Progress indicators
- Subtle motion
- No clutter

---

# 🖋️ Typography

Use Google Font: **Quicksand**

- Headings: font-semibold
- Body: font-normal
- Tracking slightly wide
- Soft, friendly feel

---

# 🗂️ Pages

## 1️⃣ Home Page

Hero section:

- Big headline:

  > Generate Store-Ready App Assets in Minutes

- Subtext

- CTA button → "Create Project"

---

## 2️⃣ Dashboard Page

Simple grid of project cards:

Card contains:

- App name
- Created date
- Generate button
- View button

Floating button:

- New Project

---

## 3️⃣ New Project Page

Form fields:

- App Name
- Short Description
- Category (dropdown)
- Tone (dropdown)
- Brand Color (color picker)
- Upload Icon (drag + drop)

Primary Button:
✨ Generate Everything

Show loading animation while generating.

---

# 🧠 Generation Flow

When user clicks Generate:

### Step 1 — Save project in Supabase

Table: projects

Only store:

- id
- app_name
- description
- brand_color
- created_at

Keep it minimal.

---

### Step 2 — Generate AI Metadata

Call AI:

Return:

- ios_title
- ios_subtitle
- ios_keywords
- ios_description
- android_title
- android_short_desc
- android_long_desc

Store in:
Table: metadata

---

### Step 3 — Generate Expo Assets (Sharp)

From uploaded icon:

Create:

- icon.png (1024x1024)
- adaptive-icon.png (with padding)
- splash.png (1284x2778 centered logo)
- favicon.png (48x48)

Store files in:
Supabase Storage bucket: `assets`

Save URLs in:
Table: assets

---

### Step 4 — Generate app.json Snippet

Generate text block like:

```json
{
  "expo": {
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#BRAND_COLOR"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#BRAND_COLOR"
      }
    }
  }
}
```

---

# 🖼️ Screenshot Generator (Simple Version)

Do NOT overcomplicate.

Just:

- Generate blank device frame
- Overlay:
  - App name
  - Feature headline

- Export:
  - 1290x2796
  - 1080x1920

Store in Supabase.

---

# 📦 Export Button

On click "Download Package":

Create ZIP with:

```
/expo-assets
/icon.png
/adaptive-icon.png
/splash.png
/favicon.png

/ios-metadata.txt
/android-metadata.txt
/app-config.json
```

Return download link.

---

# 🗃️ Supabase Tables (Minimal)

### projects

- id
- app_name
- description
- brand_color
- created_at

### metadata

- project_id
- ios_data (json)
- android_data (json)

### assets

- project_id
- type
- file_url

That’s it. No overdesign.

---

# 🧩 shadcn Components to Use

- Card
- Tabs
- Input
- Textarea
- Select
- Button
- Dialog
- Badge
- Progress
- Skeleton (loading)

---

# ✨ Animations

Use:

- hover:scale-[1.02]
- transition-all duration-200
- soft fade-in
- shimmer loading for generation

Keep motion subtle. No chaos.

---

# 🎯 UX Philosophy

This should feel like:

- Linear
- Effortless
- Magical
- Fast
- No cognitive overload

User should:
Enter app name → click once → get everything.

---

# 🔥 Vibe Coding Instructions for AntiGravity

Use this prompt:

> Build a clean SaaS web app called AppStoreForge using Next.js App Router, Tailwind, shadcn/ui, and Google Font Quicksand.
>
> The app allows users to create a project, upload a 1024x1024 icon, and generate Expo-compatible assets and App Store metadata using AI.
>
> Use Supabase MCP server for database and storage.
>
> Use Sharp for image resizing.
>
> Keep the database minimal.
>
> The UI should be ultra clean, modern, soft shadows, rounded-2xl, spacious, startup aesthetic.
>
> Do not overcomplicate security or architecture.
>
> Focus on smooth UX and simple flow.

---

# 🚀 MVP Scope (Keep It Tight)

Do NOT add:

- Teams
- Roles
- Permissions
- Billing
- Multi-language
- Analytics
- Advanced ASO scoring

Just:

Generate → Download → Done.

---
