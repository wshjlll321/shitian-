import { ContactPageView } from "@/components/sections/contact/ContactPage";
import { seoEntries } from "@/content/seo";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata(seoEntries.contact, "/contact");

export default function ContactPage() {
  return <ContactPageView />;
}
