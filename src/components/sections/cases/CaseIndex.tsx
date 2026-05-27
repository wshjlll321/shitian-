"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/motion/Reveal.client";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { pick, type Locale } from "@/lib/i18n";
import { isPublished } from "@/types/content";
import type { CaseStudy, MediaAsset } from "@/types/content";

type CaseIndexProps = {
  caseStudies: CaseStudy[];
  mediaAssets: MediaAsset[];
  locale?: Locale;
};

const COPY = {
  kicker: { zh: "Case Studies · 案例档案", en: "Case Studies" },
  title: { zh: "案例档案", en: "Case Studies" },
  subtitle: { zh: "Operational Case Studies", en: "Real missions delivered" },
  lede: {
    zh: "每一个案例都按任务建档——作业地点、时间、机型、任务类型、关键参数与作业结果一并归档。截至 2025 年 12 月，世天航空已沉淀 81 例真实低空作业案例，覆盖农林植保、应急救援、海上物流与精细化场地五大方向。",
    en: "Every operation enters our archive — site, date, platform, mission type, key parameters, and result. As of December 2025, Shitian Aviation has filed 81 real missions across agriculture, emergency response, maritime logistics, and precision-venue operations."
  },
  featured: { zh: "Featured · 头条案例", en: "Featured" },
  filter: { zh: "02 · Filter", en: "02 · Filter" },
  recordsTail: { zh: "条记录", en: "records" },
  readFull: { zh: "阅读完整案例", en: "Read full case" },
  noMatches: { zh: "No matches · 当前筛选下没有案例", en: "No matches for the current filter" },
  resetFilter: { zh: "重置筛选 ·  Reset filter →", en: "Reset filter →" },
  ongoing: { zh: "持续 · Ongoing", en: "Ongoing" },
  multiBase: { zh: "中国 · 多基地", en: "Multiple sites in China" },
  closingA: { zh: "找到相似任务，", en: "Find a similar mission," },
  closingB: { zh: "复用同类作业能力。", en: "reuse the proven capability." },
  closingBody: {
    zh: "请提交目标作业场景与关键约束，销售工程师将以最接近的真实案例为基础，回复机型选型与作业组织方案。",
    en: "Share the target scenario and key constraints. A sales engineer will respond with platform selection and an execution plan grounded in the closest real-world case."
  },
  submit: { zh: "提交项目需求", en: "Submit inquiry" },
  browseScenarios: { zh: "浏览应用场景", en: "Browse scenarios" }
};

// Filter taxonomy is derived from the case data so chips stay in sync if
// new cases land. Chip = visible label + matcher predicate.
type ChipKey = "all" | "t280" | "s270" | "h-series" | "hizone" | "agri" | "emergency";

const CHIPS: { key: ChipKey; labelZh: string; labelEn: string; english: string }[] = [
  { key: "all", labelZh: "全部", labelEn: "All", english: "All" },
  { key: "t280", labelZh: "T280", labelEn: "T280", english: "Heavy lift" },
  { key: "s270", labelZh: "S270", labelEn: "S270", english: "Long endurance" },
  { key: "h-series", labelZh: "H 系列", labelEn: "H-series", english: "Electric" },
  { key: "hizone", labelZh: "HIZONE", labelEn: "HIZONE", english: "Digital" },
  { key: "agri", labelZh: "农林作业", labelEn: "Agriculture", english: "Agriculture" },
  { key: "emergency", labelZh: "应急 / 海事", labelEn: "Emergency / Maritime", english: "Emergency / Maritime" }
];

function matches(chip: ChipKey, item: CaseStudy) {
  switch (chip) {
    case "all":
      return true;
    case "t280":
      return item.productModels.includes("T280");
    case "s270":
      return item.productModels.includes("S270");
    case "h-series":
      return item.productModels.some((m) => m === "H15" || m === "H60");
    case "hizone":
      return item.productModels.includes("HIZONE");
    case "agri":
      return ["agriculture-plant-protection", "orchard-pollination", "frost-protection", "forestry-protection"].includes(
        item.scenario
      );
    case "emergency":
      return ["emergency-lift", "maritime-logistics"].includes(item.scenario);
    default:
      return true;
  }
}

// "待确认" leaks operational metadata to visitors. Re-frame as an editorial
// "持续 / Ongoing" tag where the date isn't yet pinned.
function displayTime(time: string, locale: Locale): string {
  if (!time || time.includes("待确认")) return COPY.ongoing[locale];
  return time;
}

function displayLocation(location: string, locale: Locale): string {
  if (!location || location.includes("待确认")) return COPY.multiBase[locale];
  return location;
}

export function CaseIndex({ caseStudies, mediaAssets, locale = "zh" }: CaseIndexProps) {
  const [chip, setChip] = useState<ChipKey>("all");
  const en = locale === "en";
  const cHref = (slug: string) => (en ? `/en/cases/${slug}` : `/cases/${slug}`);

  // CMS-aware: hide drafts, then apply chip filter on the published set.
  const published = useMemo(() => caseStudies.filter(isPublished), [caseStudies]);

  // Featured = the first P0 case that has media — gives the page a strong
  // hero before the row list. Falls back to the first P0 case if none of
  // them have media.
  const featured = useMemo(() => {
    return (
      published.find((c) => c.priority === "P0" && c.media.length > 0) ??
      published.find((c) => c.priority === "P0") ??
      published[0]
    );
  }, [published]);

  const filtered = useMemo(() => published.filter((c) => matches(chip, c)), [chip, published]);
  const rest = filtered.filter((c) => c.slug !== featured?.slug);
  const featuredMedia = featured?.media[0]
    ? mediaAssets.find((m) => m.id === featured.media[0])
    : undefined;
  const featuredVisible = chip === "all" || (featured ? matches(chip, featured) : false);

  return (
    <>
      <PageHero
        kicker={COPY.kicker[locale]}
        title={COPY.title[locale]}
        subtitle={COPY.subtitle[locale]}
        lede={COPY.lede[locale]}
      />

      {/* Featured case — large editorial spread, replaces the silent first
          row in the old layout. Only shown when the current filter still
          matches the featured case. */}
      {featured && featuredVisible ? (
        <section className="border-b border-carbon-black/12 bg-surface-warm py-16 md:py-24">
          <Container size="page">
            <Reveal>
              <p className="font-numeric text-[11px] uppercase tracking-[0.28em] text-aviation-orange">
                {COPY.featured[locale]}
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <Link
                href={cHref(featured.slug)}
                className="group mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center"
              >
                <div className="relative aspect-[5/3] overflow-hidden bg-carbon-black/4">
                  {featuredMedia ? (
                    <Image
                      src={featuredMedia.src}
                      alt={featuredMedia.alt}
                      fill
                      sizes="(max-width:1024px) 100vw, 55vw"
                      className="object-cover transition-transform duration-1000 ease-precision group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(54,66,55,0.18),rgba(17,17,17,0.06))]" />
                  )}
                  <span className="absolute left-0 top-5 flex items-center gap-2 bg-aviation-orange px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.24em] text-surface-warm">
                    Featured · {featured.productModels[0]}
                  </span>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-metal-gray">
                    {displayLocation((en && featured.locationEn) || featured.location, locale)} · {displayTime((en && featured.timeEn) || featured.time, locale)}
                  </p>
                  <h2 className="mt-4 font-display text-[clamp(1.8rem,3.6vw,3rem)] font-semibold leading-[1.06] tracking-[-0.01em]">
                    {pick(featured, "title", locale)}
                  </h2>
                  <p className="mt-5 max-w-xl text-sm leading-7 text-carbon-black/64 md:text-base md:leading-8">
                    {(en && (featured.summaryEn || featured.resultEn)) || featured.summary || featured.result}
                  </p>
                  {featured.keyData.length > 0 ? (
                    <dl className="mt-7 flex flex-wrap gap-x-9 gap-y-4 border-t border-carbon-black/12 pt-6">
                      {featured.keyData.slice(0, 4).map((k) => (
                        <div key={k.label}>
                          <dt className="text-[11px] uppercase tracking-[0.18em] text-metal-gray">
                            {k.label}
                          </dt>
                          <dd className="mt-1.5 font-numeric text-xl font-semibold leading-none text-carbon-black md:text-2xl">
                            {k.value}
                            {k.unit ? <span className="ml-1 text-sm text-metal-gray">{k.unit}</span> : null}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}
                  <span className="mt-7 inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.24em] text-carbon-black transition group-hover:text-aviation-orange">
                    {COPY.readFull[locale]}
                    <span
                      aria-hidden
                      className="font-numeric text-base transition-transform duration-300 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </span>
                </div>
              </Link>
            </Reveal>
          </Container>
        </section>
      ) : null}

      {/* Filter chips + row list */}
      <section className="bg-surface-warm py-16 md:py-24">
        <Container size="page">
          <div className="flex flex-col gap-5 border-b border-carbon-black/12 pb-6 md:flex-row md:items-center md:justify-between md:gap-10">
            <div className="flex items-baseline gap-4">
              <span className="font-numeric text-[11px] uppercase tracking-[0.24em] text-metal-gray">
                {COPY.filter[locale]}
              </span>
              <p className="text-[12px] uppercase tracking-[0.2em] text-metal-gray">
                {filtered.length} {COPY.recordsTail[locale]}
              </p>
            </div>
            <ul className="flex flex-wrap gap-2">
              {CHIPS.map((c) => {
                const isActive = c.key === chip;
                return (
                  <li key={c.key}>
                    <button
                      type="button"
                      onClick={() => setChip(c.key)}
                      className={`border px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] transition ${
                        isActive
                          ? "border-aviation-orange bg-aviation-orange text-surface-warm"
                          : "border-carbon-black/15 text-carbon-black/72 hover:border-carbon-black/40"
                      }`}
                    >
                      {en ? c.labelEn : c.labelZh}
                      <span className="ml-1.5 text-[9px] opacity-70">{c.english}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {rest.length > 0 ? (
            <ol className="divide-y divide-carbon-black/10 border-b border-carbon-black/12">
              {rest.map((c, i) => {
                const media = c.media[0]
                  ? mediaAssets.find((m) => m.id === c.media[0])
                  : undefined;
                return (
                  <Reveal key={c.slug} as="li" margin="0px">
                    <Link
                      href={cHref(c.slug)}
                      className="group grid gap-8 py-10 md:grid-cols-[110px_minmax(0,1.2fr)_minmax(0,1fr)] md:items-center md:py-12"
                    >
                      <p className="font-numeric text-sm uppercase tracking-[0.18em] text-aviation-orange md:text-base">
                        {String(i + 1).padStart(2, "0")} /
                        <br className="hidden md:block" /> {c.productModels.join(" · ")}
                      </p>

                      <div>
                        <p className="text-[11px] uppercase tracking-[0.22em] text-metal-gray">
                          {displayLocation((en && c.locationEn) || c.location, locale)} · {displayTime((en && c.timeEn) || c.time, locale)}
                        </p>
                        <h3 className="mt-3 font-display text-xl font-semibold leading-tight md:text-2xl">
                          {pick(c, "title", locale)}
                        </h3>
                        <p className="mt-3 max-w-xl text-sm leading-7 text-carbon-black/64">{(en && (c.summaryEn || c.resultEn)) || c.summary || c.result}</p>
                        {c.keyData.length > 0 ? (
                          <dl className="mt-5 flex flex-wrap gap-x-7 gap-y-3 text-sm">
                            {c.keyData.slice(0, 3).map((k) => (
                              <div key={k.label}>
                                <dt className="text-[11px] text-metal-gray">{k.label}</dt>
                                <dd className="font-numeric text-base text-carbon-black">
                                  {k.value}
                                  {k.unit ? <span className="ml-1 text-xs text-metal-gray">{k.unit}</span> : null}
                                </dd>
                              </div>
                            ))}
                          </dl>
                        ) : null}
                      </div>

                      <div className="relative aspect-[16/10] overflow-hidden bg-carbon-black/4">
                        {media ? (
                          <Image
                            src={media.src}
                            alt={media.alt}
                            fill
                            sizes="(max-width:768px) 100vw, 40vw"
                            className="object-cover transition-transform duration-700 ease-precision group-hover:scale-[1.03]"
                          />
                        ) : (
                          // Designed empty cell — outlined scenario kicker over
                          // a low-contrast gradient, so missing media doesn't
                          // dominate the row but still feels deliberate.
                          <div className="absolute inset-0 flex flex-col justify-between bg-[linear-gradient(135deg,rgba(54,66,55,0.14),rgba(17,17,17,0.04))] p-4">
                            <span className="font-numeric text-[10px] uppercase tracking-[0.22em] text-carbon-black/40">
                              {c.productModels.join(" · ")}
                            </span>
                            <span
                              className="self-end font-display font-semibold leading-none tracking-[-0.04em] text-[clamp(2rem,4vw,3rem)]"
                              style={{
                                WebkitTextStroke: "1px rgba(17,17,17,0.18)",
                                color: "transparent"
                              }}
                            >
                              Case
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
            </ol>
          ) : (
            <div className="py-20 text-center">
              <p className="font-numeric text-[11px] uppercase tracking-[0.22em] text-metal-gray">
                {COPY.noMatches[locale]}
              </p>
              <button
                type="button"
                onClick={() => setChip("all")}
                className="mt-4 text-sm text-aviation-orange transition hover:underline"
              >
                {COPY.resetFilter[locale]}
              </button>
            </div>
          )}
        </Container>
      </section>

      <section className="bg-carbon-black py-24 text-surface-warm md:py-32">
        <Container size="page">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-end">
            <Reveal>
              <h2 className="font-display text-[clamp(2rem,4.4vw,4rem)] font-semibold leading-[1.04] tracking-[-0.01em]">
                {COPY.closingA[locale]}
                <br className="hidden md:block" />
                {COPY.closingB[locale]}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <div>
                <p className="text-sm leading-8 text-surface-warm/65">
                  {COPY.closingBody[locale]}
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button href={en ? "/en/contact" : "/contact"}>{COPY.submit[locale]}</Button>
                  <Button href={en ? "/en/scenarios" : "/scenarios"} variant="contact">
                    {COPY.browseScenarios[locale]}
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
