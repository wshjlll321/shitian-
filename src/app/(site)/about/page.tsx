import { AboutPage } from "@/components/sections/about/AboutPage";
import { seoEntries } from "@/content/seo";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata(seoEntries.about, "/about");

export default function AboutRoute() {
  return <AboutPage />;
}
