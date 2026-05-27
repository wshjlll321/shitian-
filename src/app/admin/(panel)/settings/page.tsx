import { SettingsForm } from "@/components/admin/SettingsForm.client";
import { getContactInfo, getHomeHero, getSiteProfile } from "@/lib/cms";

export const metadata = { title: "公司信息 · 世天航空后台" };

export default async function AdminSettingsPage() {
  const [site, contact, home] = await Promise.all([
    getSiteProfile(),
    getContactInfo(),
    getHomeHero()
  ]);
  return <SettingsForm site={site} contact={contact} home={home} />;
}
