import { TechnologyPage } from "@/components/sections/technology/TechnologyPage";
import { seoEntries } from "@/content/seo";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata(seoEntries.technology, "/technology");

export default function TechnologyRoute() {
  return <TechnologyPage />;
}
