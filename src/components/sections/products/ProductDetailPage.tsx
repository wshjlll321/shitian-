import Image from "next/image";
import Link from "next/link";

import { SectionRail, type RailItem } from "@/components/layout/SectionRail.client";
import { Reveal } from "@/components/motion/Reveal.client";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getCaseStudies, getMediaAssets, getScenarios } from "@/lib/cms";
import {
  SPEC_GROUP_META,
  type Product,
  type ProductSpec,
  type SpecGroup as SpecGroupKey
} from "@/types/content";

import { pick, type Locale } from "@/lib/i18n";

const COPY = {
  rail: {
    overview: { zh: "概览", en: "Overview" },
    capabilities: { zh: "能力", en: "Capability" },
    gallery: { zh: "影像", en: "Gallery" },
    specs: { zh: "参数", en: "Specs" },
    scenarios: { zh: "场景", en: "Scenarios" },
    cases: { zh: "案例", en: "Cases" },
    inquiry: { zh: "咨询", en: "Inquiry" }
  },
  viewSpecs: { zh: "查看完整参数", en: "View specifications" },
  capabilitiesHeadline: {
    zh: "把参数转化为可在任务现场执行的能力。",
    en: "Turn specifications into capabilities that execute in the field."
  },
  galleryEyebrow: { zh: "03 — Gallery · 装备影像", en: "03 — Gallery" },
  galleryHeadlinePlatform: { zh: "界面与作业闭环。", en: "Interface and operating loop." },
  galleryHeadlineVehicle: { zh: "整机、挂载、作业现场。", en: "Airframe, mounts, and site." },
  specsEyebrow: { zh: "04 — Specification · 完整参数", en: "04 — Specifications" },
  specsHeadlineSuffix: { zh: "完整参数", en: "full specifications" },
  specsLede: {
    zh: "完整参数面向选型工程师，按外形、性能、动力、任务、环境分组列出，便于核对项目可行性。",
    en: "Full specifications for selection engineers: dimensions, performance, powertrain, mission, environment, and platform — grouped so feasibility can be checked at a glance."
  },
  scenariosEyebrow: { zh: "05 — Scenarios · 关联场景", en: "05 — Scenarios" },
  scenariosHeadline: {
    zh: "从产品能力，进入真实任务。",
    en: "From product capability into real missions."
  },
  casesEyebrow: { zh: "06 — Case proof · 任务实证", en: "06 — Case proof" },
  casesHeadlinePrefix: { zh: "以真实任务，验证 ", en: "Validating " },
  casesHeadlineSuffix: { zh: " 的能力。", en: " through real missions." },
  inquiryHeadlineA: { zh: "围绕 ", en: "Plan a mission" },
  inquiryHeadlineB: { zh: "，", en: " around the " },
  inquiryHeadlineC: { zh: "规划你的低空作业任务。", en: " platform." },
  inquiryBody: {
    zh: "提交作业区域、载荷需求、作业半径与场景目标，世天航空将协助判断机型选型与实施方案。",
    en: "Share your area, payload, radius, and scenario objectives. Shitian Aviation will advise on platform selection and execution."
  },
  submit: { zh: "提交项目需求", en: "Submit inquiry" },
  backMatrix: { zh: "返回产品矩阵", en: "Back to fleet" }
};

type ProductDetailViewProps = {
  product: Product;
  locale?: Locale;
};

type SpecGroup = { code: string; name: string; english: string; specs: ProductSpec[] };

/**
 * Group specifications by the data's `group` field. Render order follows
 * the canonical spec taxonomy in SPEC_GROUP_META; groups with no items are
 * skipped so HIZONE (platform) doesn't show empty "外形与重量" sections.
 */
function groupSpecifications(specs: ProductSpec[]): SpecGroup[] {
  const order: SpecGroupKey[] = [
    "dimensions",
    "performance",
    "powertrain",
    "mission",
    "environment",
    "system"
  ];

  const buckets = new Map<SpecGroupKey, ProductSpec[]>();
  for (const key of order) buckets.set(key, []);

  for (const spec of specs) {
    const key = (spec.group ?? "mission") as SpecGroupKey;
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key)!.push(spec);
  }

  return order
    .filter((k) => (buckets.get(k)?.length ?? 0) > 0)
    .map((k) => ({ ...SPEC_GROUP_META[k], specs: buckets.get(k)! }));
}

export async function ProductDetailView({ product, locale = "zh" }: ProductDetailViewProps) {
  const en = locale === "en";
  const [allCases, allScenarios, allMedia] = await Promise.all([
    getCaseStudies(),
    getScenarios(),
    getMediaAssets()
  ]);
  const relatedCases = product.relatedCases
    .map((slug) => allCases.find((item) => item.slug === slug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const relatedScenarios = product.scenarios
    .map((slug) => allScenarios.find((item) => item.slug === slug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const heroMedia = product.media[0]
    ? allMedia.find((item) => item.id === product.media[0])
    : undefined;
  const specGroups = groupSpecifications(product.specifications);
  const isPlatform = product.heroVariant === "platform";

  // Rail items — same ordinal language as the home's chapter eyebrows, so
  // the page feels like a continuation of the editorial system rather than
  // a generic tabbed spec sheet.
  const galleryItems = product.gallery
    .map((id) => allMedia.find((item) => item.id === id))
    .filter((m): m is NonNullable<typeof m> => Boolean(m));

  const rail: RailItem[] = [
    { id: "overview", index: "01", label: COPY.rail.overview[locale] },
    { id: "capabilities", index: "02", label: COPY.rail.capabilities[locale] },
    ...(galleryItems.length > 0 ? [{ id: "gallery", index: "03", label: COPY.rail.gallery[locale] }] : []),
    ...(specGroups.length > 0 ? [{ id: "specs", index: "04", label: COPY.rail.specs[locale] }] : []),
    ...(relatedScenarios.length > 0 ? [{ id: "scenarios", index: "05", label: COPY.rail.scenarios[locale] }] : []),
    ...(relatedCases.length > 0 ? [{ id: "cases", index: "06", label: COPY.rail.cases[locale] }] : []),
    { id: "inquiry", index: "07", label: COPY.rail.inquiry[locale] }
  ];

  return (
    <>
      <SectionRail items={rail} />

      {/* Hero — split layout: copy left, 3D / image right */}
      <section
        id="overview"
        className="relative overflow-hidden bg-carbon-black pb-16 pt-28 text-surface-warm md:pb-24 md:pt-32"
      >
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_82%_28%,rgba(198,106,50,0.08),transparent_55%),linear-gradient(180deg,#171816_0%,#0f100e_100%)]"
        />
        <Container size="page" className="relative z-10">
          <div className="grid gap-14 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-end">
            <div>
              <Reveal>
                <p className="font-numeric text-xs uppercase tracking-[0.28em] text-aviation-orange">
                  {pick(product, "category", locale)}
                </p>
              </Reveal>
              <Reveal delay={0.05}>
                {/* Split the display name into model code and series name so
                    "T280" never gets glued to the first Chinese character,
                    avoiding awkward mid-phrase breaks like "T280 重载燃油无 / 人直升机". */}
                <h1 className="mt-7 font-display text-[clamp(2.1rem,4.2vw,4.2rem)] font-semibold leading-[1.06] tracking-[-0.01em]">
                  {(() => {
                    const displayName = pick(product, "displayName", locale);
                    const m = displayName.match(/^(\S+)\s+(.+)$/);
                    if (!m) return displayName;
                    return (
                      <>
                        <span className="block">{m[1]}</span>
                        <span className="block">{m[2]}</span>
                      </>
                    );
                  })()}
                </h1>
              </Reveal>
              <Reveal delay={0.08}>
                <p className="mt-5 max-w-xl text-[13px] uppercase tracking-[0.22em] text-surface-warm/55">
                  {pick(product, "strategicRole", locale)}
                </p>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-7 max-w-xl text-base leading-9 text-surface-warm/68 md:text-lg">
                  {pick(product, "narrative", locale)}
                </p>
              </Reveal>
              <Reveal delay={0.16}>
                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <Button href={`${en ? "/en/contact" : "/contact"}?product=${product.slug}`}>
                    {pick(product, "ctaContext", locale)}
                  </Button>
                  <Button href="#specs" variant="contact">
                    {COPY.viewSpecs[locale]}
                  </Button>
                </div>
              </Reveal>
            </div>

            <Reveal
              delay={0.2}
              className="relative aspect-[4/3] overflow-hidden border border-surface-warm/12 lg:aspect-auto lg:h-[520px]"
            >
              {heroMedia ? (
                <Image
                  src={heroMedia.src}
                  alt={heroMedia.alt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-surface-warm/[0.04]">
                  <span className="font-numeric text-sm uppercase tracking-[0.24em] text-surface-warm/40">
                    {product.model}
                  </span>
                </div>
              )}
              {/* Bottom-edge model tag — keeps the photo reading as a
                  catalogued product plate. */}
              <span className="absolute bottom-3 left-3 border border-surface-warm/30 bg-carbon-black/55 px-2.5 py-1 font-numeric text-[10px] uppercase tracking-[0.22em] text-surface-warm backdrop-blur-sm">
                {product.model}
              </span>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Big metrics strip */}
      <section className="border-b border-carbon-black/12 bg-surface-warm py-14 md:py-16">
        <Container size="page">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4 md:gap-x-12">
            {product.keyMetrics.slice(0, 4).map((m) => (
              <div key={m.label} className="border-t border-aviation-orange/40 pt-5">
                <dt className="text-[11px] uppercase tracking-[0.18em] text-metal-gray">
                  {m.label}
                </dt>
                <dd className="mt-3 font-numeric text-[clamp(2rem,3.6vw,3.4rem)] font-semibold leading-none tracking-[-0.01em] text-carbon-black">
                  {m.value}
                  {m.unit ? <span className="ml-1 text-base text-metal-gray">{m.unit}</span> : null}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* Key capabilities — narrative */}
      <section id="capabilities" className="bg-surface-porcelain py-24 md:py-32">
        <Container size="page">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.32fr)_minmax(0,1fr)] lg:items-start">
            <Reveal>
              <p className="font-numeric text-xs uppercase tracking-[0.28em] text-metal-gray">
                {locale === "en" ? "02 — Capabilities" : "02 — Capabilities · 能力"}
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="font-display text-[clamp(1.8rem,3.2vw,3rem)] font-semibold leading-[1.08] tracking-[-0.01em]">
                {COPY.capabilitiesHeadline[locale]}
              </h2>
            </Reveal>
          </div>
          <ol className="mt-16 grid gap-px overflow-hidden border border-carbon-black/12 bg-carbon-black/10 sm:grid-cols-2">
            {(pick(product, "keyCapabilities", locale) as string[]).map((c, i) => (
              <Reveal key={c} delay={i * 0.05} as="li">
                <div className="flex h-full flex-col justify-between gap-8 bg-surface-warm p-7 md:p-9">
                  <p className="font-numeric text-xs uppercase tracking-[0.22em] text-aviation-orange">
                    Cap / 0{i + 1}
                  </p>
                  <p className="font-display text-xl font-semibold leading-tight md:text-2xl">{c}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      {/* Gallery — six real images per product, sourced from the migrated
          media library. First tile spans two columns on desktop so the
          grid reads as a magazine spread rather than a uniform thumbnail
          wall. Captions carry context (operation site or component) so
          each image works as evidence, not decoration. */}
      {galleryItems.length > 0 ? (
        <section id="gallery" className="bg-surface-warm py-24 md:py-32">
          <Container size="page">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.32fr)_minmax(0,1fr)] lg:items-end">
              <Reveal>
                <p className="font-numeric text-xs uppercase tracking-[0.28em] text-metal-gray">
                  {COPY.galleryEyebrow[locale]}
                </p>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="font-display text-[clamp(1.8rem,3.2vw,3rem)] font-semibold leading-[1.08] tracking-[-0.01em]">
                  {isPlatform ? COPY.galleryHeadlinePlatform[locale] : COPY.galleryHeadlineVehicle[locale]}
                </h2>
              </Reveal>
            </div>

            <ul className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
              {galleryItems.slice(0, 6).map((m, i) => (
                <Reveal
                  key={m.id}
                  delay={i * 0.04}
                  as="li"
                  className={`relative overflow-hidden bg-carbon-black/8 ${i === 0 ? "col-span-2 md:col-span-2" : "col-span-1"} ${isPlatform ? "aspect-[16/10]" : "aspect-[4/3]"}`}
                >
                  <Image
                    src={m.src}
                    alt={m.alt}
                    fill
                    sizes="(max-width:768px) 100vw, (max-width:1280px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-precision hover:scale-[1.03]"
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-[linear-gradient(180deg,transparent_0%,rgba(15,16,14,0.78)_100%)]"
                  />
                  <p className="absolute inset-x-0 bottom-0 p-4 text-[12px] leading-snug text-surface-warm md:p-5 md:text-[13px]">
                    {m.alt}
                  </p>
                </Reveal>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      {/* Specs table — grouped */}
      {specGroups.length > 0 ? (
        <section id="specs" className="bg-surface-warm py-24 md:py-32">
          <Container size="page">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.32fr)_minmax(0,1fr)] lg:items-start lg:gap-16">
              <div className="lg:sticky lg:top-32">
                <Reveal>
                  <p className="font-numeric text-xs uppercase tracking-[0.28em] text-metal-gray">
                    {COPY.specsEyebrow[locale]}
                  </p>
                </Reveal>
                <Reveal delay={0.05}>
                  <h2 className="mt-6 font-display text-3xl font-semibold leading-tight md:text-5xl">
                    {product.model} {COPY.specsHeadlineSuffix[locale]}
                  </h2>
                </Reveal>
                <Reveal delay={0.1}>
                  <p className="mt-5 text-sm leading-7 text-carbon-black/60">
                    {COPY.specsLede[locale]}
                  </p>
                </Reveal>
                <Reveal delay={0.15}>
                  <ul className="mt-8 hidden gap-2 text-[12px] uppercase tracking-[0.2em] text-metal-gray lg:grid">
                    {specGroups.map((g) => (
                      <li key={g.code}>
                        <a
                          href={`#${g.code.toLowerCase()}`}
                          className="flex items-center gap-3 transition hover:text-aviation-orange"
                        >
                          <span className="font-numeric text-aviation-orange">{g.code}</span>
                          {en ? g.english : g.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              </div>

              <div className="grid gap-14">
                {specGroups.map((group) => (
                  <Reveal key={group.code} margin="0px">
                    <div id={group.code.toLowerCase()}>
                      <div className="flex items-baseline justify-between border-b border-aviation-orange/40 pb-3">
                        <h3 className="font-display text-lg font-semibold leading-tight md:text-xl">
                          {en ? group.english : group.name}
                        </h3>
                        <span className="font-numeric text-[10px] uppercase tracking-[0.22em] text-metal-gray">
                          {group.code} · {group.english}
                        </span>
                      </div>
                      <dl className="divide-y divide-carbon-black/10">
                        {group.specs.map((spec) => (
                          <div
                            key={`${spec.label}-${spec.value}`}
                            className="grid gap-3 py-4 md:grid-cols-[200px_1fr] md:gap-8 md:py-5"
                          >
                            <dt className="text-sm text-metal-gray">{spec.label}</dt>
                            <dd className="text-base text-carbon-black">
                              {spec.value}
                              {spec.unit ? <span className="ml-1 text-metal-gray">{spec.unit}</span> : null}
                              {spec.note ? (
                                <span className="ml-2 text-sm text-metal-gray">{spec.note}</span>
                              ) : null}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </Container>
        </section>
      ) : null}

      {/* Related scenarios */}
      {relatedScenarios.length > 0 ? (
        <section id="scenarios" className="bg-carbon-black py-24 text-surface-warm md:py-32">
          <Container size="page">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.32fr)_minmax(0,1fr)] lg:items-end">
              <Reveal>
                <p className="font-numeric text-xs uppercase tracking-[0.28em] text-surface-warm/45">
                  {COPY.scenariosEyebrow[locale]}
                </p>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="font-display text-[clamp(1.8rem,3.2vw,3rem)] font-semibold leading-[1.08] tracking-[-0.01em]">
                  {COPY.scenariosHeadline[locale]}
                </h2>
              </Reveal>
            </div>
            <ul className="mt-16 grid gap-px overflow-hidden border border-surface-warm/14 bg-surface-warm/10 md:grid-cols-2 lg:grid-cols-3">
              {relatedScenarios.slice(0, 6).map((s, i) => (
                <Reveal key={s.slug} delay={i * 0.05} as="li">
                  <Link
                    href={en ? `/en/scenarios/${s.slug}` : `/scenarios/${s.slug}`}
                    className="group flex h-full flex-col justify-between gap-8 bg-carbon-black p-7 transition hover:bg-carbon-black/60 md:p-9"
                  >
                    <span className="font-numeric text-xs uppercase tracking-[0.22em] text-aviation-orange">
                      {pick(s, "name", locale)}
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-semibold leading-tight md:text-xl">
                        {pick(s, "headline", locale)}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-surface-warm/60">{pick(s, "painPoint", locale)}</p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      {/* Related cases */}
      {relatedCases.length > 0 ? (
        <section id="cases" className="bg-surface-warm py-24 md:py-32">
          <Container size="page">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.32fr)_minmax(0,1fr)] lg:items-end">
              <Reveal>
                <p className="font-numeric text-xs uppercase tracking-[0.28em] text-metal-gray">
                  {COPY.casesEyebrow[locale]}
                </p>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="font-display text-[clamp(1.8rem,3.2vw,3rem)] font-semibold leading-[1.08] tracking-[-0.01em]">
                  {COPY.casesHeadlinePrefix[locale]}{product.model}{COPY.casesHeadlineSuffix[locale]}
                </h2>
              </Reveal>
            </div>
            <ul className="mt-16 grid gap-x-10 gap-y-12 md:grid-cols-2">
              {relatedCases.slice(0, 4).map((c, i) => (
                <Reveal key={c.slug} delay={i * 0.05} as="li">
                  <Link href={en ? `/en/cases/${c.slug}` : `/cases/${c.slug}`} className="group block">
                    <article className="border-t border-carbon-black/14 pt-6 transition group-hover:border-aviation-orange">
                      <p className="text-[11px] uppercase tracking-[0.22em] text-aviation-orange">
                        {((en && c.locationEn) || c.location)} · {((en && c.timeEn) || c.time)}
                      </p>
                      <h3 className="mt-4 font-display text-xl font-semibold leading-tight md:text-2xl">
                        {pick(c, "title", locale)}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-carbon-black/64">{pick(c, "result", locale)}</p>
                      {c.keyData.length > 0 ? (
                        <dl className="mt-5 flex flex-wrap gap-x-7 gap-y-3 text-sm">
                          {c.keyData.slice(0, 3).map((k) => (
                            <div key={k.label}>
                              <dt className="text-xs text-metal-gray">{k.label}</dt>
                              <dd className="font-numeric text-lg text-carbon-black">
                                {k.value}
                                {k.unit ? <span className="ml-1 text-xs text-metal-gray">{k.unit}</span> : null}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      ) : null}
                    </article>
                  </Link>
                </Reveal>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      {/* Inquiry CTA */}
      <section id="inquiry" className="bg-carbon-black py-24 text-surface-warm md:py-32">
        <Container size="page">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-end">
            <Reveal>
              <h2 className="font-display text-[clamp(2rem,4.4vw,4rem)] font-semibold leading-[1.04] tracking-[-0.01em]">
                {locale === "en" ? (
                  <>
                    Plan a mission
                    <br className="hidden md:block" />
                    {" "}around the {product.model} platform.
                  </>
                ) : (
                  <>
                    围绕 {product.model}，
                    <br className="hidden md:block" />
                    规划你的低空作业任务。
                  </>
                )}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <div>
                <p className="text-sm leading-8 text-surface-warm/65">
                  {COPY.inquiryBody[locale]}
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button href={`${en ? "/en/contact" : "/contact"}?product=${product.slug}`}>{COPY.submit[locale]}</Button>
                  <Button href={en ? "/en/products" : "/products"} variant="contact">
                    {COPY.backMatrix[locale]}
                  </Button>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
