import { ContactPageView } from "@/components/sections/contact/ContactPage";
import { seoEntries } from "@/content/seo";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata(seoEntries.contact, "/en/contact", "en");

export default function ContactPageEn() {
  return <ContactPageView locale="en" />;
}
