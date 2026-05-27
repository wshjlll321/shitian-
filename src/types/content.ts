export type Priority = "P0" | "P1" | "P2" | "P3";

export type MediaAsset = {
  id: string;
  kind: "image" | "video" | "qr" | "certificate" | "model" | "fallback";
  src: string;
  alt: string;
  source?: string;
  status: "pending-download" | "local" | "needs-confirmation";
};

export type MigratedImage = {
  originalSrc: string;
  src: string;
  alt: string;
  title?: string;
  fileName?: string;
  status?: "local" | "pending-download";
};

/**
 * Spec taxonomy — every product specification is filed under one of these
 * groups in the data, so the front-end can render grouped tables without
 * heuristics and a future CMS has a clear contract to enforce.
 */
export type SpecGroup =
  | "dimensions"
  | "performance"
  | "powertrain"
  | "mission"
  | "environment"
  | "system";

export const SPEC_GROUP_META: Record<
  SpecGroup,
  { code: string; name: string; english: string }
> = {
  dimensions: { code: "SP-01", name: "外形与重量", english: "Dimensions" },
  performance: { code: "SP-02", name: "飞行性能", english: "Performance" },
  powertrain: { code: "SP-03", name: "动力与能源", english: "Powertrain" },
  mission: { code: "SP-04", name: "任务与载荷", english: "Mission" },
  environment: { code: "SP-05", name: "环境与适应性", english: "Environment" },
  system: { code: "SP-06", name: "平台与系统", english: "System" }
};

export type ProductSpec = {
  label: string;
  value: string;
  unit?: string;
  note?: string;
  /** Required on Product.specifications (CMS contract); optional elsewhere. */
  group?: SpecGroup;
};

/**
 * Vehicles (T280, S270, H15, H60) render the standard cockpit-style detail
 * page. Platforms (HIZONE) suppress the airframe-specific sections like
 * specs-by-airframe-group and exploded-view hotspots, and surface
 * platform-native cards instead.
 */
export type ProductHeroVariant = "vehicle" | "platform";

export type ProductHotspot = {
  id: string;
  label: string;
  detail: string;
  position: [number, number, number];
};

export type Product = {
  slug: string;
  model: string;
  displayName: string;
  category: string;
  strategicRole: string;
  /** One-line marketing summary used on list cards and chip rails. */
  summary: string;
  positioning: string;
  narrative: string;
  keyCapabilities: string[];
  keyMetrics: ProductSpec[];
  specifications: ProductSpec[];
  scenarios: string[];
  relatedCases: string[];
  media: string[];
  /** Optional product photography slots — empty array is valid. */
  gallery: string[];
  /** Empty array is valid; the front-end falls back to a static image. */
  hotspots: ProductHotspot[];
  heroVariant: ProductHeroVariant;
  sourceUrls: string[];
  ctaContext: string;
  priority: Priority;
  /* ----- Optional English overlays (read via lib/i18n#pick) ----- */
  displayNameEn?: string;
  categoryEn?: string;
  strategicRoleEn?: string;
  summaryEn?: string;
  positioningEn?: string;
  narrativeEn?: string;
  keyCapabilitiesEn?: string[];
  ctaContextEn?: string;
};

export type Scenario = {
  slug: string;
  name: string;
  headline: string;
  painPoint: string;
  recommendedProducts: string[];
  taskFlow: string[];
  proofCases: string[];
  valueMetrics: ProductSpec[];
  media: string[];
  cta: string;
  priority: Priority;
  /* ----- Optional English overlays ----- */
  nameEn?: string;
  headlineEn?: string;
  painPointEn?: string;
  taskFlowEn?: string[];
  ctaEn?: string;
};

/**
 * CMS publishing status. Records without a status are treated as
 * "published" (legacy data assumption); future records authored via the
 * admin should set this explicitly.
 */
export type ContentStatus = "draft" | "published";

export type CaseStudy = {
  slug: string;
  title: string;
  /** One-line marketing summary for cards / featured cells. Optional;
   *  if absent, the index page falls back to `result`. */
  summary?: string;
  productModels: string[];
  scenario: string;
  /** Human location; "" or "待确认" → rendered as "中国 · 多基地". */
  location: string;
  /** Human date; "" or "待确认" → rendered as "持续 · Ongoing". */
  time: string;
  task: string;
  result: string;
  keyData: ProductSpec[];
  media: string[];
  /** Optional secondary images. */
  gallery?: string[];
  /** Internal trace of the original source; never surfaced in the UI. */
  sourceUrl?: string;
  status?: ContentStatus;
  priority: Priority;
  /**
   * When true, this case is automatically surfaced in the home page's
   * "Case proof" section. Operators flip this from the case edit page —
   * the home admin no longer needs to maintain a separate featured list.
   */
  showOnHomepage?: boolean;
  /* ----- Optional English overlays ----- */
  titleEn?: string;
  summaryEn?: string;
  locationEn?: string;
  timeEn?: string;
  taskEn?: string;
  resultEn?: string;
};

export type NewsArticle = {
  slug: string;
  title: string;
  category: "作业案例" | "企业动态" | "低空政策观察";
  publishedAt: string;
  summary: string;
  tags: string[];
  body: string[];
  /** Explicit cover image (media id); when absent, the first local image
   *  in `images[]` is used. CMS records should fill this. */
  cover?: string;
  images: MigratedImage[];
  videos: string[];
  /** Migration-only fields — kept for data traceability, never surfaced. */
  sourceUrl?: string;
  sourceRawFile?: string;
  status?: ContentStatus;
  priority: Priority;
  /* ----- Optional English overlays ----- */
  titleEn?: string;
  summaryEn?: string;
  bodyEn?: string[];
  categoryEn?: string;
};

/** True when the record should appear on the public site. */
export function isPublished(item: { status?: ContentStatus }): boolean {
  return item.status !== "draft";
}

export type CompanyMilestone = {
  year: string;
  title: string;
  description: string;
  status?: "confirmed" | "needs-confirmation";
  titleEn?: string;
  descriptionEn?: string;
};

export type CompanyProfile = {
  title: string;
  lead: string;
  proof: ProductSpec[];
  capabilities: Array<{
    title: string;
    description: string;
    titleEn?: string;
    descriptionEn?: string;
  }>;
  culture: Array<{
    title: string;
    description: string;
    titleEn?: string;
    descriptionEn?: string;
  }>;
  milestones: CompanyMilestone[];
  certifications: Array<{
    title: string;
    description: string;
    status: "pending-download" | "needs-confirmation";
    titleEn?: string;
    descriptionEn?: string;
  }>;
  manufacturing?: Array<{
    title: string;
    description: string;
    titleEn?: string;
    descriptionEn?: string;
  }>;
  global?: Array<{
    code: string;
    region: string;
    description: string;
    regionEn?: string;
    descriptionEn?: string;
  }>;
  /**
   * Field-reel tile grid on the public /about page. Each tile points at a
   * media asset (via mediaId) and carries a caption + year stamp; tile
   * shape (col-span / aspect) is set declaratively so editors can pick the
   * asymmetric magazine spread without writing CSS.
   */
  fieldReel?: Array<{
    mediaId: string;
    caption: string;
    captionEn?: string;
    year: string;
    /** Grid column span. Defaults to 2 on mobile; on md+ values like 3, 2
     *  produce the magazine asymmetry. */
    span?: "2" | "3";
    /** Card aspect. Defaults to 4/3-ish; "wide" → 16/10, "portrait" → 4/5. */
    aspect?: "wide" | "portrait";
  }>;
  /* ----- Optional English overlays for top-level fields ----- */
  titleEn?: string;
  leadEn?: string;
};

export type ContactInfo = {
  companyName: string;
  contactPerson: string;
  phone: string;
  telephone: string;
  email: string;
  website: string;
  addresses: Array<{
    value: string;
    status: "needs-confirmation" | "approved";
    valueEn?: string;
  }>;
  social: Array<{
    name: string;
    mediaId: string;
    status: "needs-download" | "local";
    nameEn?: string;
  }>;
  /* ----- Optional English overlays ----- */
  companyNameEn?: string;
  contactPersonEn?: string;
};

export type NavItem = {
  label: string;
  href: string;
  description?: string;
  labelEn?: string;
};

export type HomeHeroContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
  productFocus: string;
  metrics: ProductSpec[];
  proofPoints: string[];
  primaryCta: {
    label: string;
    href: string;
    labelEn?: string;
  };
  secondaryCta: {
    label: string;
    href: string;
    labelEn?: string;
  };
  globalCta: {
    label: string;
    href: string;
    labelEn?: string;
  };
  visual: {
    label: string;
    fallbackLabel: string;
    mediaId: string;
  };
  threeScene: {
    id: string;
    purpose: string;
    fallbackRequired: boolean;
  };
  sourceUrls: string[];
  /** Optional override for the cinematic backdrop. Falls back to `visual.mediaId`
   *  when unset. Admins point this at any image in the media library. */
  backgroundMediaId?: string;
  /* ----- Optional English overlays ----- */
  eyebrowEn?: string;
  titleEn?: string;
  subtitleEn?: string;
};

/**
 * Comprehensive editable copy + data for the home page.
 *
 * Lives alongside HomeHeroContent on the `home` singleton so admins can
 * maintain every section's headline, body, metrics and capability lines
 * from a single editor — no code change required for routine updates.
 *
 * Every visible field carries an optional `*En` overlay so the bilingual
 * `pick()` helper falls back to Chinese when an English translation has
 * not been written yet.
 */
export type HomeMetric = {
  /** Display value, e.g. "100", "120", "2-4", "81". */
  value: string;
  /** Unit suffix; empty string when no unit is shown. */
  unit: string;
  /** Chinese label, e.g. "作业半径". */
  label: string;
  /** Optional English label. */
  labelEn?: string;
  /** Optional English unit override (defaults to the Chinese one). */
  unitEn?: string;
};

export type HomeManifestoContent = {
  eyebrow: string;
  headlineLine1: string;
  headlineLine2: string;
  body: string;
  /** Engineering capability postures, displayed as a hairline-led list. */
  capabilities: string[];
  /** Four proof readouts in the bottom band. */
  proofPoints: HomeMetric[];
  /** Locale-tail (e.g. "National High-Tech Enterprise · Qingdao, China · Est. 2019"). */
  tail: string;
  /* English overlays */
  eyebrowEn?: string;
  headlineLine1En?: string;
  headlineLine2En?: string;
  bodyEn?: string;
  capabilitiesEn?: string[];
  tailEn?: string;
};

export type HomeOperationalProofContent = {
  eyebrow: string;
  headlineLine1: string;
  headlineLine2: string;
  body: string;
  /** Four big-number metrics rendered along the bottom of the slide. */
  metrics: HomeMetric[];
  /** Media id used as the full-bleed cinematic backdrop. Picked from the
   *  media library so admins can swap it without touching code. */
  mediaId?: string;
  /* English overlays */
  eyebrowEn?: string;
  headlineLine1En?: string;
  headlineLine2En?: string;
  bodyEn?: string;
};

/**
 * §5 — Scenarios. Just a section header + the picker list; the actual
 * scenario records come from the scenarios collection. Admins choose which
 * scenarios are featured on the home page (count is flexible).
 */
export type HomeScenariosContent = {
  eyebrow: string;
  /** Ordered list of scenario slugs to feature in the rotating spread. */
  featured: string[];
  eyebrowEn?: string;
};

/**
 * Bespoke "Case proof" section on the home page. Admins pick any number of
 * case slugs from the case library; the front-end lays them out as a card
 * grid whose size adapts to the array length.
 */
export type HomeCasesContent = {
  eyebrow: string;
  headline: string;
  body: string;
  /** Ordered list of case slugs to surface. Empty array hides the section. */
  featured: string[];
  eyebrowEn?: string;
  headlineEn?: string;
  bodyEn?: string;
};

export type HomeTechPillar = {
  id: string;
  code: string;
  metric: string;
  unit: string;
  name: string;
  english: string;
  role: string;
  caption: string;
  points: string[];
  /* English overlays */
  unitEn?: string;
  nameEn?: string;
  roleEn?: string;
  captionEn?: string;
  pointsEn?: string[];
};

export type HomeTechContent = {
  eyebrow: string;
  headline: string;
  subhead: string;
  pillars: HomeTechPillar[];
  footerText: string;
  /* English overlays */
  eyebrowEn?: string;
  headlineEn?: string;
  subheadEn?: string;
  footerTextEn?: string;
};

export type HomeTrajectoryContent = {
  eyebrow: string;
  headline: string;
  /** Media id for the floating "platform of record" plate that anchors the
   *  treadmill. Admins can swap to any product/case image from the library. */
  mediaId?: string;
  /* English overlays */
  eyebrowEn?: string;
  headlineEn?: string;
};

export type HomeInquiryContent = {
  eyebrow: string;
  headlineTop: string;
  headlineSub: string;
  body: string;
  response: string;
  /* English overlays */
  eyebrowEn?: string;
  headlineTopEn?: string;
  headlineSubEn?: string;
  bodyEn?: string;
  responseEn?: string;
};

/**
 * Aggregate home-page content singleton.
 *
 * The `hero` block keeps the historical HomeHeroContent shape (so existing
 * code paths and the seeded SQLite row stay backward-compatible). New
 * editable sections live alongside it under their own typed keys.
 */
export type HomeContent = {
  hero: HomeHeroContent;
  manifesto: HomeManifestoContent;
  operationalProof: HomeOperationalProofContent;
  scenarios: HomeScenariosContent;
  cases: HomeCasesContent;
  tech: HomeTechContent;
  trajectory: HomeTrajectoryContent;
  inquiry: HomeInquiryContent;
};

export type SeoEntry = {
  title: string;
  description: string;
  keywords?: string[];
  titleEn?: string;
  descriptionEn?: string;
};
