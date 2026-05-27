import { FooterView } from "@/components/layout/FooterView.client";
import { getContactInfo, getNavigation, getSiteProfile } from "@/lib/cms";

/**
 * Footer — server component that fetches CMS singletons and hands them to
 * the bilingual client view. The split keeps `prisma` and `server-only`
 * usage off the client bundle while still letting the rendered copy switch
 * between zh and en based on the current pathname.
 */
export async function Footer() {
  const [contactInfo, navigation, siteProfile] = await Promise.all([
    getContactInfo(),
    getNavigation(),
    getSiteProfile()
  ]);

  return (
    <FooterView
      contactInfo={contactInfo}
      footerNavigation={navigation.footer}
      siteProfile={siteProfile}
    />
  );
}
