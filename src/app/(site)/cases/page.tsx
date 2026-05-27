import { CaseIndex } from "@/components/sections/cases/CaseIndex";
import { seoEntries } from "@/content/seo";
import { getCaseStudies, getMediaAssets } from "@/lib/cms";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata(seoEntries.cases, "/cases");

export default async function CasesPage() {
  const [caseStudies, mediaAssets] = await Promise.all([getCaseStudies(), getMediaAssets()]);
  return <CaseIndex caseStudies={caseStudies} mediaAssets={mediaAssets} />;
}
