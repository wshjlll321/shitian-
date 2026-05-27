import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CaseDetailHero } from "@/components/sections/cases/CaseDetailHero";
import { getCaseBySlug } from "@/lib/cms";
import { buildMetadata } from "@/lib/seo";

type CaseDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: CaseDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = await getCaseBySlug(slug);

  if (!caseStudy) return {};

  return buildMetadata(
    {
      title: `${caseStudy.title} | 案例`,
      description: caseStudy.result,
      keywords: [caseStudy.title, ...caseStudy.productModels]
    },
    `/cases/${caseStudy.slug}`
  );
}

export default async function CaseDetailPage({ params }: CaseDetailPageProps) {
  const { slug } = await params;
  const caseStudy = await getCaseBySlug(slug);

  if (!caseStudy) {
    notFound();
  }

  return <CaseDetailHero caseStudy={caseStudy} />;
}
