import type { Metadata } from "next";

import { siteProfile } from "@/content/site";
import type { Locale } from "@/lib/i18n";
import type { SeoEntry } from "@/types/content";

export function buildMetadata(
  entry: SeoEntry,
  path = "/",
  locale: Locale = "zh"
): Metadata {
  const title = locale === "en" && entry.titleEn ? entry.titleEn : entry.title;
  const description =
    locale === "en" && entry.descriptionEn ? entry.descriptionEn : entry.description;

  const isEnglish = path === "/en" || path.startsWith("/en/");
  const zhPath = isEnglish ? (path === "/en" ? "/" : path.slice(3) || "/") : path;
  const enPath = isEnglish ? path : path === "/" ? "/en" : `/en${path}`;

  return {
    title,
    description,
    keywords: entry.keywords,
    alternates: {
      canonical: path,
      languages: {
        "zh-CN": zhPath,
        en: enPath
      }
    },
    openGraph: {
      title,
      description,
      siteName: siteProfile.name,
      type: "website",
      locale: locale === "en" ? "en_US" : "zh_CN"
    }
  };
}
