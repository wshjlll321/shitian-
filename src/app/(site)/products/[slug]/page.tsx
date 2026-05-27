import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductDetailView } from "@/components/sections/products/ProductDetailPage";
import { getProductBySlug } from "@/lib/cms";
import { buildMetadata } from "@/lib/seo";

type ProductDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {};
  }

  return buildMetadata(
    {
      title: `${product.displayName} | 产品中心`,
      description: product.narrative,
      keywords: [product.model, product.category, product.strategicRole]
    },
    `/products/${product.slug}`
  );
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailView product={product} />;
}
