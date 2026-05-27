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
import type { NewsArticle } from "@/types/content";

type NewsIndexProps = {
  newsArticles: NewsArticle[];
  mediaIndex?: Record<string, { src: string; alt: string }>;
  locale?: Locale;
};

type NewsImage = {
  src: string;
  alt: string;
};

type ChipKey = "all" | "作业案例" | "企业动态" | "低空政策观察";

const CHIPS: { key: ChipKey; labelZh: string; labelEn: string; english: string }[] = [
  { key: "all", labelZh: "全部", labelEn: "All", english: "All" },
  { key: "作业案例", labelZh: "作业案例", labelEn: "Operations", english: "Operations" },
  { key: "企业动态", labelZh: "企业动态", labelEn: "Company", english: "Company" },
  { key: "低空政策观察", labelZh: "低空政策", labelEn: "Policy", english: "Policy" }
];

const COPY = {
  kicker: { zh: "News · 新闻动态", en: "News" },
  title: { zh: "新闻动态", en: "News & Press Releases" },
  subtitle: { zh: "News & Press Releases", en: "Operations log and company updates" },
  lede: {
    zh: "世天航空动态分三条主线——作业案例记录任务实录与现场数据，企业动态披露团队、产品与项目里程碑，行业政策聚焦低空经济的趋势研究与产业观察。",
    en: "Three streams: operations records (missions delivered and field data), company updates (team, products, milestones), and policy insights tracking the low-altitude economy."
  },
  ongoing: { zh: "持续 · Ongoing", en: "Ongoing" },
  filter: { zh: "02 · Filter", en: "02 · Filter" },
  records: { zh: "条记录", en: "records" },
  noMatches: { zh: "No matches · 当前筛选下没有动态", en: "No news under the current filter" },
  resetFilter: { zh: "重置筛选 · Reset →", en: "Reset filter →" },
  newsLabel: { zh: "Shitian · 实录", en: "Shitian · log" },
  closingA: { zh: "获取完整资料，", en: "Pick up the full file," },
  closingB: { zh: "启动项目对接。", en: "open a project conversation." },
  closingBody: {
    zh: "如需获取作业案例完整数据、技术资料或商务合作信息，欢迎通过下方入口提交项目需求。",
    en: "Need the full mission record, datasheets, or partnership terms? Submit a brief through the channels below."
  },
  submit: { zh: "提交项目需求", en: "Submit inquiry" },
  viewCases: { zh: "查看作业案例", en: "See case studies" }
};

function formatDate(value: string, locale: Locale) {
  return value ? value.slice(0, 10) : COPY.ongoing[locale];
}

function getTags(article: NewsArticle) {
  return Array.isArray(article.tags) ? article.tags : [];
}

function getCover(
  article: NewsArticle,
  mediaIndex: Record<string, { src: string; alt: string }>
): NewsImage | undefined {
  if (article.cover && mediaIndex[article.cover]) {
    return mediaIndex[article.cover];
  }

  const legacy = Array.isArray(article.images)
    ? article.images.find((image) => image.status === "local")
    : undefined;
  return legacy ? { src: legacy.src, alt: legacy.alt } : undefined;
}

function NewsListItem({
  article,
  index,
  locale,
  mediaIndex
}: {
  article: NewsArticle;
  index: number;
  locale: Locale;
  mediaIndex: Record<string, { src: string; alt: string }>;
}) {
  const en = locale === "en";
  const cover = getCover(article, mediaIndex);
  const tags = getTags(article);
  const category = (en && article.categoryEn) || article.category;
  const href = en ? `/en/news/${article.slug}` : `/news/${article.slug}`;
  return (
    <Reveal as="li" margin="0px">
      <Link
        href={href}
        className="group relative grid gap-8 py-10 transition-colors duration-300 hover:bg-surface-warm/40 md:grid-cols-[110px_minmax(0,1.2fr)_minmax(0,1fr)] md:items-center md:py-12"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute left-0 top-1/2 block h-0 w-[3px] -translate-y-1/2 bg-aviation-orange transition-all duration-500 ease-precision group-hover:h-2/3"
        />
        <p className="font-numeric text-sm uppercase tracking-[0.18em] text-aviation-orange md:text-base">
          {String(index + 1).padStart(2, "0")} /
          <br className="hidden md:block" /> {category}
        </p>
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-metal-gray">
            {formatDate(article.publishedAt, locale)}
          </p>
          <h3 className="mt-3 font-display text-xl font-semibold leading-tight md:text-2xl">
            {pick(article, "title", locale)}
          </h3>
          <p className="mt-3 line-clamp-3 max-w-xl text-sm leading-7 text-carbon-black/64">
            {pick(article, "summary", locale)}
          </p>
          {tags.length > 0 ? (
            <p className="mt-4 truncate text-[11px] uppercase tracking-[0.18em] text-metal-gray">
              {tags.slice(0, 3).join(" · ")}
            </p>
          ) : null}
        </div>
        <div className="card-sheen relative aspect-[16/10] overflow-hidden bg-carbon-black">
          {cover ? (
            <Image
              src={cover.src}
              alt={cover.alt || pick(article, "title", locale)}
              fill
              sizes="(max-width:768px) 100vw, 33vw"
              className="object-cover transition-transform duration-700 ease-precision group-hover:scale-[1.03]"
            />
          ) : (
            <>
              <div
                aria-hidden
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_72%_28%,rgba(198,106,50,0.22),transparent_55%),linear-gradient(135deg,#1b1c1a_0%,#0f100e_100%)]"
              />
              <div
                aria-hidden
                className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(245,241,234,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(245,241,234,0.6)_1px,transparent_1px)] [background-size:32px_32px]"
              />
              <span aria-hidden className="absolute left-3 top-3 h-2.5 w-2.5 border-l border-t border-surface-warm/30" />
              <span aria-hidden className="absolute right-3 top-3 h-2.5 w-2.5 border-r border-t border-surface-warm/30" />
              <span aria-hidden className="absolute bottom-3 left-3 h-2.5 w-2.5 border-b border-l border-surface-warm/30" />
              <span aria-hidden className="absolute bottom-3 right-3 h-2.5 w-2.5 border-b border-r border-surface-warm/30" />
              <div className="relative z-10 flex h-full flex-col justify-between p-5">
                <div className="flex items-center gap-2">
                  <span aria-hidden className="block h-px w-5 bg-aviation-orange" />
                  <span className="font-numeric text-[10px] uppercase tracking-[0.26em] text-aviation-orange">
                    {category}
                  </span>
                </div>
                <div className="flex items-end justify-between gap-3">
                  <span className="font-numeric text-[10px] uppercase tracking-[0.22em] text-surface-warm/55">
                    {COPY.newsLabel[locale]}
                  </span>
                  <span
                    className="font-display font-semibold leading-none tracking-[-0.04em] text-[clamp(2.4rem,5vw,3.6rem)]"
                    style={{
                      WebkitTextStroke: "1px rgba(245,241,234,0.35)",
                      color: "transparent"
                    }}
                  >
                    News
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </Link>
    </Reveal>
  );
}

export function NewsIndex({ newsArticles, mediaIndex = {}, locale = "zh" }: NewsIndexProps) {
  const en = locale === "en";
  const [chip, setChip] = useState<ChipKey>("all");

  const published = useMemo(() => newsArticles.filter(isPublished), [newsArticles]);
  const filtered = useMemo(
    () => (chip === "all" ? published : published.filter((a) => a.category === chip)),
    [chip, published]
  );

  return (
    <>
      <PageHero
        kicker={COPY.kicker[locale]}
        title={COPY.title[locale]}
        subtitle={COPY.subtitle[locale]}
        lede={COPY.lede[locale]}
      />

      <section className="bg-surface-warm py-20 md:py-28">
        <Container size="page">
          <div className="flex flex-col gap-5 border-b border-carbon-black/12 pb-6 md:flex-row md:items-center md:justify-between md:gap-10">
            <div className="flex items-baseline gap-4">
              <span className="font-numeric text-[11px] uppercase tracking-[0.24em] text-metal-gray">
                {COPY.filter[locale]}
              </span>
              <p className="text-[12px] uppercase tracking-[0.2em] text-metal-gray">
                {filtered.length} {COPY.records[locale]}
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

          {filtered.length > 0 ? (
            <ol className="divide-y divide-carbon-black/10 border-b border-carbon-black/12">
              {filtered.map((article, i) => (
                <NewsListItem
                  key={article.slug}
                  article={article}
                  index={i}
                  locale={locale}
                  mediaIndex={mediaIndex}
                />
              ))}
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

      <section className="bg-carbon-black py-24 text-surface-warm md:py-28">
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
                  <Button href={en ? "/en/cases" : "/cases"} variant="contact">
                    {COPY.viewCases[locale]}
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
