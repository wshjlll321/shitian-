import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CaseDetailHero } from "@/components/sections/cases/CaseDetailHero";
import { getCaseBySlug } from "@/lib/cms";
import { pick } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

type CaseDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: CaseDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = await getCaseBySlug(slug);
  if (!caseStudy) return {};
  const title = pick(caseStudy, "title", "en");
  return buildMetadata(
    {
      title: `${title} | Case`,
      description: pick(caseStudy, "result", "en"),
      keywords: [title, ...caseStudy.productModels]
    },
    `/en/cases/${caseStudy.slug}`,
    "en"
  );
}

export default async function CaseDetailPageEn({ params }: CaseDetailPageProps) {
  const { slug } = await params;
  const caseStudy = await getCaseBySlug(slug);
  if (!caseStudy) notFound();
  return <CaseDetailHero caseStudy={caseStudy} locale="en" />;
}
