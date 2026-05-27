import { ProductIndex } from "@/components/sections/products/ProductIndex";
import { seoEntries } from "@/content/seo";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata(seoEntries.products, "/products");

export default function ProductsPage() {
  return <ProductIndex />;
}
