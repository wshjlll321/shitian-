import { ScenarioIndex } from "@/components/sections/scenarios/ScenarioIndex";
import { seoEntries } from "@/content/seo";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata(seoEntries.scenarios, "/scenarios");

export default function ScenariosPage() {
  return <ScenarioIndex />;
}
