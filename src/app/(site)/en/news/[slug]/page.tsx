import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { NewsDetail } from "@/components/sections/news/NewsDetail";
import { getNewsArticles, getNewsBySlug } from "@/lib/cms";
import { pick } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

type NewsDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const articles = await getNewsArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: NewsDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);
  if (!article) return {};
  const title = pick(article, "title", "en");
  return buildMetadata(
    {
      title: `${title} | News`,
      description: pick(article, "summary", "en"),
      keywords: [title, (article.categoryEn || article.category), ...article.tags]
    },
    `/en/news/${article.slug}`,
    "en"
  );
}

export default async function NewsDetailPageEn({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);
  if (!article) notFound();
  return <NewsDetail article={article} locale="en" />;
}
