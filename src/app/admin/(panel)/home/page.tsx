import { HomeContentForm } from "@/components/admin/HomeContentForm.client";
import {
  getCaseStudies,
  getHomeContent,
  getMediaIndex,
  getProducts,
  getScenarios
} from "@/lib/cms";
import { isPublished } from "@/types/content";
import type { RelationOption } from "@/components/admin/RelationPicker.client";

export const metadata = { title: "主页内容 · 世天航空后台" };

export default async function AdminHomePage() {
  const [home, mediaIndex, allScenarios, allCases, products] = await Promise.all([
    getHomeContent(),
    getMediaIndex(),
    getScenarios(),
    getCaseStudies(),
    getProducts()
  ]);

  const scenarioOptions: RelationOption[] = allScenarios.map((s) => ({
    value: s.slug,
    label: s.name,
    secondary: s.recommendedProducts.slice(0, 3).join(" · ")
  }));

  // Cases on the homepage are now driven by the per-case `showOnHomepage`
  // toggle. We surface the resolved list here as a read-only preview so
  // editors see exactly what's about to ship — and we link them straight
  // to the case edit page if they want to flip the switch.
  const homepageCases = allCases
    .filter((c) => isPublished(c) && c.showOnHomepage === true)
    .map((c) => ({
      slug: c.slug,
      title: c.title,
      titleEn: c.titleEn,
      location: c.location,
      time: c.time,
      priority: c.priority
    }));

  const productMatrixProducts = products.map((product) => ({
    slug: product.slug,
    model: product.model,
    displayName: product.displayName,
    summary: product.summary,
    category: product.category,
    mediaCount: product.media.length,
    metricLabels: product.keyMetrics.slice(0, 3).map((metric) => metric.label)
  }));

  return (
    <HomeContentForm
      home={home}
      mediaIndex={mediaIndex}
      scenarioOptions={scenarioOptions}
      homepageCases={homepageCases}
      productMatrixProducts={productMatrixProducts}
    />
  );
}
