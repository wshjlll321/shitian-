import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { NewsDetail } from "@/components/sections/news/NewsDetail";
import { getNewsArticles, getNewsBySlug } from "@/lib/cms";
import { buildMetadata } from "@/lib/seo";

type NewsDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const articles = await getNewsArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: NewsDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);

  if (!article) return {};

  return buildMetadata(
    {
      title: `${article.title} | 品牌动态`,
      description: article.summary,
      keywords: [article.title, article.category, ...article.tags]
    },
    `/news/${article.slug}`
  );
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);

  if (!article) {
    notFound();
  }

  return <NewsDetail article={article} />;
}
