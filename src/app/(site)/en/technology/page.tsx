import { TechnologyPage } from "@/components/sections/technology/TechnologyPage";
import { seoEntries } from "@/content/seo";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata(seoEntries.technology, "/en/technology", "en");

export default function TechnologyRouteEn() {
  return <TechnologyPage locale="en" />;
}
