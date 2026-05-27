import { CaseIndex } from "@/components/sections/cases/CaseIndex";
import { seoEntries } from "@/content/seo";
import { getCaseStudies, getMediaAssets } from "@/lib/cms";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata(seoEntries.cases, "/en/cases", "en");

export default async function CasesPageEn() {
  const [caseStudies, mediaAssets] = await Promise.all([getCaseStudies(), getMediaAssets()]);
  return <CaseIndex caseStudies={caseStudies} mediaAssets={mediaAssets} locale="en" />;
}
