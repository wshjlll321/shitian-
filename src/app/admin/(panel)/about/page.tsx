import { AboutContentForm } from "@/components/admin/AboutContentForm.client";
import { getCompanyProfile, getMediaIndex } from "@/lib/cms";

export const metadata = { title: "关于页内容 · 世天航空后台" };

export default async function AdminAboutPage() {
  const [company, mediaIndex] = await Promise.all([
    getCompanyProfile(),
    getMediaIndex()
  ]);
  return <AboutContentForm company={company} mediaIndex={mediaIndex} />;
}
