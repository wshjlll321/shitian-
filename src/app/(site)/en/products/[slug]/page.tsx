import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductDetailView } from "@/components/sections/products/ProductDetailPage";
import { getProductBySlug } from "@/lib/cms";
import { pick } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

type ProductDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  const name = pick(product, "displayName", "en");
  return buildMetadata(
    {
      title: `${name} | Fleet`,
      description: pick(product, "narrative", "en"),
      keywords: [product.model, pick(product, "category", "en"), pick(product, "strategicRole", "en")]
    },
    `/en/products/${product.slug}`,
    "en"
  );
}

export default async function ProductDetailPageEn({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  return <ProductDetailView product={product} locale="en" />;
}
