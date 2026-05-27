import { HomeShell } from "@/components/sections/home/HomeShell";
import { seoEntries } from "@/content/seo";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata(seoEntries.home, "/");

export default async function HomePage() {
  return <HomeShell locale="zh" />;
}
