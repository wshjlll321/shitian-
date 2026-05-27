import { NewsIndex } from "@/components/sections/news/NewsIndex";
import { seoEntries } from "@/content/seo";
import { getNewsArticles } from "@/lib/cms";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata(seoEntries.news, "/news");

export default async function NewsPage() {
  const newsArticles = await getNewsArticles();
  return <NewsIndex newsArticles={newsArticles} />;
}
