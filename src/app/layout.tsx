import type { Metadata } from "next";
import { Inter, Noto_Sans_SC } from "next/font/google";
import type { ReactNode } from "react";

import "./globals.css";

import { siteProfile } from "@/content/site";

// Chinese face — Google's Noto Sans SC. Latin subset alone would be preloaded
// but never used on Chinese-heavy pages, so we skip preload and let the browser
// fetch on demand under the font-display: swap policy.
const sansChinese = Noto_Sans_SC({
  weight: ["400", "500", "600"],
  variable: "--font-sc",
  display: "swap",
  preload: false
});

// Latin face — Inter. Only 400 and 600 are actually used in the codebase
// (regular for kickers / metric digits, semibold for big numerics and headings).
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-latin",
  display: "swap"
});

export const metadata: Metadata = {
  title: {
    default: `${siteProfile.name} | ${siteProfile.positioning}`,
    template: `%s | ${siteProfile.name}`
  },
  description: siteProfile.description,
  metadataBase: new URL("https://www.shitianuav.com")
};

// Root layout — only html/body/fonts. The marketing chrome (header, footer,
// scroll providers) lives in the (site) route-group layout; the admin area
// has its own layout, so it stays free of the public site shell.
export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="zh-CN" className={`${sansChinese.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
