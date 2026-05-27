import type { Metadata } from "next";
import { Inter, Noto_Sans_SC } from "next/font/google";
import { headers } from "next/headers";
import type { ReactNode } from "react";

import "./globals.css";

import { siteProfile } from "@/content/site";
import { localeFromPathname } from "@/lib/i18n";

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
//
// The `<html lang>` attribute is resolved from the request path so /en/*
// pages announce English to assistive tech and search engines while the
// default Chinese routes keep zh-CN.
export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const headerList = await headers();
  const pathname =
    headerList.get("x-invoke-path") ??
    headerList.get("x-pathname") ??
    headerList.get("next-url") ??
    "/";
  const lang = localeFromPathname(pathname) === "en" ? "en" : "zh-CN";

  return (
    <html lang={lang} className={`${sansChinese.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
