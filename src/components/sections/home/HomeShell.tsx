import { BrandTimeline } from "@/components/sections/home/BrandTimeline.client";
import { FeaturedCases } from "@/components/sections/home/FeaturedCases";
import { HeroImmersive } from "@/components/sections/home/HeroImmersive.client";
import { InquiryCTA } from "@/components/sections/home/InquiryCTA";
import { Manifesto } from "@/components/sections/home/Manifesto";
import { OperationalProof } from "@/components/sections/home/OperationalProof.client";
import { ProductMatrix } from "@/components/sections/home/ProductMatrix";
import { ScenarioExplore } from "@/components/sections/home/ScenarioExplore.client";
import { SlideDots } from "@/components/sections/home/SlideDots.client";
import { TechPillars } from "@/components/sections/home/TechPillars.client";
import { HomeSnapEffect } from "@/components/providers/HomeSnapEffect.client";
import {
  getCaseStudies,
  getCompanyProfile,
  getHomeContent,
  getMediaAssets,
  getScenarios
} from "@/lib/cms";
import type { Locale } from "@/lib/i18n";
import { isPublished } from "@/types/content";

/**
 * Shared bilingual home composition. Every section's editable copy now
 * comes from the `home` singleton; sub-section types ensure each block
 * receives exactly the data it needs without prop drilling everything
 * through the shell.
 */
export async function HomeShell({ locale }: { locale: Locale }) {
  const [home, scenarios, mediaAssets, companyProfile, allCases] = await Promise.all([
    getHomeContent(),
    getScenarios(),
    getMediaAssets(),
    getCompanyProfile(),
    getCaseStudies()
  ]);

  // Backdrop assets are resolved here so each section just receives a
  // ready-to-render MediaAsset and never knows the lookup key.
  const heroMedia = home.hero.backgroundMediaId
    ? mediaAssets.find((asset) => asset.id === home.hero.backgroundMediaId)
    : undefined;
  const proofMedia = home.operationalProof.mediaId
    ? mediaAssets.find((asset) => asset.id === home.operationalProof.mediaId)
    : undefined;
  const timelineMedia = home.trajectory.mediaId
    ? mediaAssets.find((asset) => asset.id === home.trajectory.mediaId)
    : undefined;

  // Featured cases are now aggregated automatically — any published case
  // with `showOnHomepage: true` joins the home §"Case proof" section. The
  // legacy `home.cases.featured` array is still honoured as a fallback so
  // existing data keeps working until an editor flips the case-level
  // toggle. Order: priority (P0 first), then DB sortOrder via array order.
  const priorityRank: Record<string, number> = { P0: 0, P1: 1, P2: 2, P3: 3 };
  const taggedCases = allCases.filter(
    (c) => isPublished(c) && c.showOnHomepage === true
  );
  const legacyFeatured = home.cases.featured
    .map((slug) => allCases.find((c) => c.slug === slug))
    .filter(
      (c): c is NonNullable<typeof c> =>
        Boolean(c) && isPublished(c!) && c!.showOnHomepage !== true
    );
  const featuredCases = [...taggedCases, ...legacyFeatured].sort(
    (a, b) => (priorityRank[a.priority] ?? 9) - (priorityRank[b.priority] ?? 9)
  );
  const showCases = featuredCases.length > 0;

  const SLIDES = [
    { id: "hero", label: "01 · Platform" },
    { id: "brand", label: "02 · About" },
    { id: "proof", label: "03 · Record" },
    { id: "products", label: "04 · Fleet" },
    { id: "scenarios", label: "05 · Scenarios" },
    ...(showCases ? [{ id: "cases", label: "06 · Case proof" }] : []),
    { id: "tech", label: `${showCases ? "07" : "06"} · Engineering` },
    { id: "journey", label: `${showCases ? "08" : "07"} · Trajectory` },
    { id: "contact", label: `${showCases ? "09" : "08"} · Engage` }
  ];

  return (
    <>
      <HomeSnapEffect />
      <SlideDots slides={SLIDES} />
      <HeroImmersive homeHero={home.hero} media={heroMedia} locale={locale} />
      <Manifesto content={home.manifesto} locale={locale} />
      <OperationalProof
        media={proofMedia}
        content={home.operationalProof}
        locale={locale}
      />
      <ProductMatrix locale={locale} />
      <ScenarioExplore
        allScenarios={scenarios}
        mediaAssets={mediaAssets}
        featuredSlugs={home.scenarios.featured}
        eyebrow={home.scenarios.eyebrow}
        eyebrowEn={home.scenarios.eyebrowEn}
        locale={locale}
      />
      {showCases ? (
        <FeaturedCases
          content={home.cases}
          cases={featuredCases}
          mediaAssets={mediaAssets}
          locale={locale}
        />
      ) : null}
      <TechPillars content={home.tech} locale={locale} />
      <BrandTimeline
        milestones={companyProfile.milestones}
        content={home.trajectory}
        media={timelineMedia}
        locale={locale}
      />
      <InquiryCTA content={home.inquiry} locale={locale} />
    </>
  );
}
