import type { ReactNode } from "react";

import { ScrollProgress } from "@/components/motion/ScrollProgress.client";
import { FloatingInquiry } from "@/components/layout/FloatingInquiry.client";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header.client";
import { LenisProvider } from "@/components/providers/LenisProvider.client";
import { MotionPrefsProvider } from "@/components/providers/MotionPrefsProvider.client";
import { getNavigation, getSiteProfile } from "@/lib/cms";

// Render public pages dynamically so edits saved in the admin appear
// immediately. Cascades to every page in the (site) group.
export const dynamic = "force-dynamic";

// Public-site layout — header, footer, smooth-scroll and motion providers.
// Scoped to the (site) route group so the admin area renders without any of
// this marketing chrome.
export default async function SiteLayout({ children }: { children: ReactNode }) {
  const [navigation, site] = await Promise.all([getNavigation(), getSiteProfile()]);

  return (
    <MotionPrefsProvider>
      <LenisProvider>
        <ScrollProgress />
        <Header navigation={navigation.primary} siteName={site.name} />
        <main>{children}</main>
        <Footer />
        <FloatingInquiry />
      </LenisProvider>
    </MotionPrefsProvider>
  );
}
