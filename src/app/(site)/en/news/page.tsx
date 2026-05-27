import { NewsIndex } from "@/components/sections/news/NewsIndex";
import { seoEntries } from "@/content/seo";
import { getNewsArticles } from "@/lib/cms";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata(seoEntries.news, "/en/news", "en");

export default async function NewsPageEn() {
  const newsArticles = await getNewsArticles();
  return <NewsIndex newsArticles={newsArticles} locale="en" />;
}
