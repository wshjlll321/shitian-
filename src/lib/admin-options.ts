import "server-only";

import { getCaseStudies, getProducts, getScenarios } from "@/lib/cms";
import type { RelationOption } from "@/components/admin/RelationPicker.client";

/**
 * Build the set of selectable options the admin forms use for relation
 * fields (scenarios, cases, product models / slugs). Fetched on each admin
 * edit page so dropdowns always reflect the latest content.
 */
export async function getRelationOptions(): Promise<{
  scenarios: RelationOption[];
  cases: RelationOption[];
  productModels: RelationOption[];
  productSlugs: RelationOption[];
}> {
  const [scenarios, cases, products] = await Promise.all([
    getScenarios(),
    getCaseStudies(),
    getProducts()
  ]);

  return {
    scenarios: scenarios.map((s) => ({ value: s.slug, label: s.name })),
    cases: cases.map((c) => ({
      value: c.slug,
      label: c.title,
      secondary: c.location || undefined
    })),
    productModels: products.map((p) => ({
      value: p.model,
      label: p.displayName,
      secondary: p.model
    })),
    productSlugs: products.map((p) => ({
      value: p.slug,
      label: p.displayName,
      secondary: p.model
    }))
  };
}
