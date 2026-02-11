import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "AppStoreForge | Store-Ready Assets in Minutes",
  description: "Generate iOS/Android metadata and Expo assets with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body
        className={`${dmSans.variable} font-sans antialiased bg-[#F9FAFB]`}
      >
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
