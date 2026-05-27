import "server-only";

import { prisma } from "@/lib/db";
import type { TechPillar } from "@/content/technology";
import type {
  CaseStudy,
  CompanyProfile,
  ContactInfo,
  HomeContent,
  HomeHeroContent,
  MediaAsset,
  NavItem,
  NewsArticle,
  Product,
  Scenario,
  SeoEntry
} from "@/types/content";

/**
 * CMS data-access layer.
 *
 * The public site reads all of its content through these functions instead
 * of importing the static `src/content/*.ts` files. Each function returns
 * exactly the same shape the static files used to export, so page and
 * section components keep working with the existing `@/types/content`
 * types — only the data source changes (static file → SQLite database).
 *
 * Server-only: never import this from a client component. A Server
 * Component should fetch here and pass the result down as props.
 */

export type SiteProfile = {
  name: string;
  legalName: string;
  positioning: string;
  description: string;
  stats: Array<{ label: string; value: string }>;
  sourceUrls: string[];
};

export type NavigationData = {
  primary: NavItem[];
  footer: NavItem[];
};

export type CollectionOptions = {
  includeDrafts?: boolean;
};

async function collection<T>(type: string, options: CollectionOptions = {}): Promise<T[]> {
  const rows = await prisma.contentRecord.findMany({
    where: options.includeDrafts ? { type } : { type, status: "published" },
    orderBy: { sortOrder: "asc" }
  });
  return rows.map((row) => JSON.parse(row.data) as T);
}

async function singleton<T>(key: string): Promise<T> {
  const row = await prisma.singleton.findUnique({ where: { key } });
  if (!row) {
    throw new Error(`CMS singleton "${key}" missing — run \`npm run db:seed\`.`);
  }
  return JSON.parse(row.data) as T;
}

/* ----------------------------- Collections ----------------------------- */

export const getProducts = (options?: CollectionOptions) => collection<Product>("product", options);
export const getScenarios = (options?: CollectionOptions) =>
  collection<Scenario>("scenario", options);
export const getCaseStudies = (options?: CollectionOptions) =>
  collection<CaseStudy>("case", options);
export const getNewsArticles = (options?: CollectionOptions) =>
  collection<NewsArticle>("news", options);
export const getTechnologyPillars = (options?: CollectionOptions) =>
  collection<TechPillar>("technology", options);

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((item) => item.slug === slug);
}

export async function getScenarioBySlug(slug: string): Promise<Scenario | undefined> {
  const scenarios = await getScenarios();
  return scenarios.find((item) => item.slug === slug);
}

export async function getCaseBySlug(slug: string): Promise<CaseStudy | undefined> {
  const cases = await getCaseStudies();
  return cases.find((item) => item.slug === slug);
}

export async function getNewsBySlug(slug: string): Promise<NewsArticle | undefined> {
  const articles = await getNewsArticles();
  return articles.find((item) => item.slug === slug);
}

/* ------------------------------ Singletons ----------------------------- */

export const getCompanyProfile = () => singleton<CompanyProfile>("company");
export const getContactInfo = () => singleton<ContactInfo>("contact");

/**
 * Read the home-page singleton.
 *
 * Legacy rows seeded before the multi-section refactor only contain the
 * Hero fields at the top level. To keep the front-end booting cleanly
 * across both shapes, we detect the legacy layout and re-shape it into
 * the new HomeContent structure on the fly — sub-sections default to
 * empty containers so `pick()` and conditional render guards just work.
 */
export async function getHomeContent(): Promise<HomeContent> {
  const raw = await singleton<HomeContent | HomeHeroContent>("home");
  if ("hero" in (raw as HomeContent)) return raw as HomeContent;
  // Legacy shape — wrap and supply empty sections so callers stay typed.
  const empty = {
    eyebrow: "",
    headlineLine1: "",
    headlineLine2: "",
    body: "",
    metrics: [] as never[],
    capabilities: [] as string[],
    proofPoints: [] as never[],
    tail: "",
    headline: "",
    subhead: "",
    pillars: [] as never[],
    footerText: "",
    headlineTop: "",
    headlineSub: "",
    response: ""
  };
  return {
    hero: raw as HomeHeroContent,
    manifesto: empty as HomeContent["manifesto"],
    operationalProof: empty as HomeContent["operationalProof"],
    scenarios: {
      eyebrow: "05 — Scenarios · 作业现场",
      featured: [
        "agriculture-plant-protection",
        "emergency-lift",
        "orchard-pollination",
        "frost-protection",
        "maritime-logistics",
        "forestry-protection",
        "golf-maintenance",
        "smart-field"
      ]
    } as HomeContent["scenarios"],
    cases: {
      eyebrow: "Case proof · 任务实证",
      headline: "",
      body: "",
      featured: []
    } as HomeContent["cases"],
    tech: empty as HomeContent["tech"],
    trajectory: empty as HomeContent["trajectory"],
    inquiry: empty as HomeContent["inquiry"]
  };
}

/** Back-compat: callers still asking for just the hero get the new sub-tree. */
export const getHomeHero = async (): Promise<HomeHeroContent> =>
  (await getHomeContent()).hero;
export const getSiteProfile = () => singleton<SiteProfile>("site");
export const getNavigation = () => singleton<NavigationData>("nav");
export const getSeoEntries = () => singleton<Record<string, SeoEntry>>("seo");
export const getMediaAssets = () => singleton<MediaAsset[]>("media");

export async function getMediaById(id: string): Promise<MediaAsset | undefined> {
  const assets = await getMediaAssets();
  return assets.find((asset) => asset.id === id);
}

/**
 * Pre-built media index for admin forms — a flat { id -> { src, alt, kind } }
 * map so the admin's MediaPicker can render thumbnails (or video previews)
 * without an extra fetch.
 */
export async function getMediaIndex(): Promise<
  Record<string, { src: string; alt: string; kind: MediaAsset["kind"] }>
> {
  const assets = await getMediaAssets();
  const index: Record<string, { src: string; alt: string; kind: MediaAsset["kind"] }> = {};
  for (const asset of assets) {
    index[asset.id] = { src: asset.src, alt: asset.alt, kind: asset.kind };
  }
  return index;
}
