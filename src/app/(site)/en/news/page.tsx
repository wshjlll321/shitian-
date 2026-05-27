import { NewsIndex } from "@/components/sections/news/NewsIndex";
import { seoEntries } from "@/content/seo";
import { getMediaIndex, getNewsArticles } from "@/lib/cms";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata(seoEntries.news, "/en/news", "en");

export default async function NewsPageEn() {
  const [newsArticles, mediaIndex] = await Promise.all([getNewsArticles(), getMediaIndex()]);
  return <NewsIndex newsArticles={newsArticles} mediaIndex={mediaIndex} locale="en" />;
}
