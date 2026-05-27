import { HomeShell } from "@/components/sections/home/HomeShell";
import { seoEntries } from "@/content/seo";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata(seoEntries.home, "/en", "en");

export default async function HomePageEn() {
  return <HomeShell locale="en" />;
}
