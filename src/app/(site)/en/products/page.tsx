import { ProductIndex } from "@/components/sections/products/ProductIndex";
import { seoEntries } from "@/content/seo";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata(seoEntries.products, "/en/products", "en");

export default function ProductsPageEn() {
  return <ProductIndex locale="en" />;
}
