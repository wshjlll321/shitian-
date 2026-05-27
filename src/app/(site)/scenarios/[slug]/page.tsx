import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ScenarioDetailView } from "@/components/sections/scenarios/ScenarioDetailPage";
import { getScenarioBySlug } from "@/lib/cms";
import { buildMetadata } from "@/lib/seo";

type ScenarioDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: ScenarioDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const scenario = await getScenarioBySlug(slug);

  if (!scenario) return {};

  return buildMetadata(
    {
      title: `${scenario.name} | 应用场景`,
      description: scenario.painPoint,
      keywords: [scenario.name, ...scenario.recommendedProducts]
    },
    `/scenarios/${scenario.slug}`
  );
}

export default async function ScenarioDetailPage({ params }: ScenarioDetailPageProps) {
  const { slug } = await params;
  const scenario = await getScenarioBySlug(slug);

  if (!scenario) {
    notFound();
  }

  return <ScenarioDetailView scenario={scenario} />;
}
