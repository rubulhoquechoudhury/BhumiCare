import type { Metadata } from "next";
import { Inter, Noto_Sans } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/language-context";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// Required for Assamese text rendering
const notoSans = Noto_Sans({
  subsets: ["latin", "devanagari"],
  variable: "--font-noto",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "BhumiCare AI — Tea Intelligence Platform",
  description:
    "AI-powered soil analysis, market intelligence, and multilingual advisor for tea cultivation. Analyze soil, predict market trends, and get recommendations in your language.",
  keywords: [
    "soil analysis",
    "tea cultivation",
    "AI agriculture",
    "BhumiCare",
    "tea market prediction",
    "Assam tea",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${notoSans.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans antialiased">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
