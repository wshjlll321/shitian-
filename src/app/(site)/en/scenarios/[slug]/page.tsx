import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ScenarioDetailView } from "@/components/sections/scenarios/ScenarioDetailPage";
import { getScenarioBySlug } from "@/lib/cms";
import { pick } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

type ScenarioDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ScenarioDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const scenario = await getScenarioBySlug(slug);
  if (!scenario) return {};
  const name = pick(scenario, "name", "en");
  return buildMetadata(
    {
      title: `${name} | Scenarios`,
      description: pick(scenario, "painPoint", "en"),
      keywords: [name, ...scenario.recommendedProducts]
    },
    `/en/scenarios/${scenario.slug}`,
    "en"
  );
}

export default async function ScenarioDetailPageEn({ params }: ScenarioDetailPageProps) {
  const { slug } = await params;
  const scenario = await getScenarioBySlug(slug);
  if (!scenario) notFound();
  return <ScenarioDetailView scenario={scenario} locale="en" />;
}
