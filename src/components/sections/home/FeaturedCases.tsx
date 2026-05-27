import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal.client";
import { pick, type Locale } from "@/lib/i18n";
import type { CaseStudy, HomeCasesContent, MediaAsset } from "@/types/content";

type FeaturedCasesProps = {
  content: HomeCasesContent;
  /** Already-resolved + ordered cases. HomeShell aggregates these from the
   *  `showOnHomepage` toggle on each case, so this section receives a final
   *  list and just renders. */
  cases: CaseStudy[];
  mediaAssets: MediaAsset[];
  locale?: Locale;
};

/**
 * Home §"Case proof" — surfaces a hand-picked subset of records from the
 * cases library. The admin selects any number of slugs in
 * `home.cases.featured`; this section adapts its grid to the count:
 *
 *   1 card  → single hero-width card
 *   2 cards → two-up split
 *   3+      → 3-column grid that wraps
 *
 * The section silently disables itself when no slugs are picked.
 */
export function FeaturedCases({
  content,
  cases,
  mediaAssets,
  locale = "zh"
}: FeaturedCasesProps) {
  const en = locale === "en";
  // Cases arrive already filtered and ordered by HomeShell.
  const featured = cases;
  if (featured.length === 0) return null;

  // Pick a column count that matches the data — gives the operator the
  // "flexible count" they asked for without needing to tune CSS.
  const n = featured.length;
  const gridCols =
    n === 1
      ? "grid-cols-1"
      : n === 2
        ? "grid-cols-1 md:grid-cols-2"
        : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

  return (
    <section
      data-snap
      data-slide-id="cases"
      className="relative flex min-h-screen w-full flex-col overflow-hidden bg-surface-warm text-carbon-black"
      aria-label={en ? "Featured case proof" : "案例实证"}
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_92%_92%,rgba(198,106,50,0.05),transparent_55%)]"
      />

      <Container
        size="page"
        className="relative z-10 flex flex-1 flex-col justify-center py-28 md:py-32"
      >
        <Reveal>
          <div className="flex items-center gap-3">
            <span aria-hidden className="block h-px w-6 bg-aviation-orange" />
            <p className="font-numeric text-[11px] uppercase tracking-[0.3em] text-aviation-orange">
              {pick(content, "eyebrow", locale)}
            </p>
          </div>
        </Reveal>
        <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)] lg:items-end">
          <Reveal delay={0.05}>
            <h2 className="font-display text-[clamp(2.2rem,4.4vw,4.4rem)] font-semibold leading-[1.04] tracking-[-0.015em]">
              {pick(content, "headline", locale)}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-sm leading-7 text-carbon-black/64 md:text-base md:leading-8">
              {pick(content, "body", locale)}
            </p>
          </Reveal>
        </div>

        <ul className={`mt-14 grid gap-px overflow-hidden border border-carbon-black/12 bg-carbon-black/10 ${gridCols}`}>
          {featured.map((c, i) => {
            const cover = c.media[0]
              ? mediaAssets.find((m) => m.id === c.media[0])
              : undefined;
            const href = en ? `/en/cases/${c.slug}` : `/cases/${c.slug}`;
            const location = (en && c.locationEn) || c.location || (en ? "China · multi-site" : "中国 · 多基地");
            const time = (en && c.timeEn) || c.time || (en ? "Ongoing" : "持续");
            const summary = (en && (c.summaryEn || c.resultEn)) || c.summary || c.result;
            return (
              <Reveal key={c.slug} delay={i * 0.05} as="li">
                <Link
                  href={href}
                  className="group flex h-full flex-col overflow-hidden bg-surface-warm transition hover:bg-surface-porcelain"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-carbon-black/4">
                    {cover ? (
                      <Image
                        src={cover.src}
                        alt={cover.alt}
                        fill
                        sizes={n === 1 ? "100vw" : n === 2 ? "(max-width:768px) 100vw, 50vw" : "(max-width:768px) 100vw, 33vw"}
                        className="object-cover transition-transform duration-700 ease-precision group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(54,66,55,0.18),rgba(17,17,17,0.06))]" />
                    )}
                    <span className="absolute left-4 top-4 bg-carbon-black/80 px-2 py-1 font-numeric text-[10px] uppercase tracking-[0.22em] text-surface-warm">
                      {c.productModels.slice(0, 2).join(" · ")}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col gap-4 p-6 md:p-7">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-aviation-orange">
                      {location} · {time}
                    </p>
                    <h3 className="font-display text-lg font-semibold leading-tight md:text-xl">
                      {pick(c, "title", locale)}
                    </h3>
                    {summary ? (
                      <p className="text-sm leading-7 text-carbon-black/64">{summary}</p>
                    ) : null}
                    {c.keyData.length > 0 ? (
                      <dl className="mt-auto flex flex-wrap gap-x-6 gap-y-2 border-t border-carbon-black/10 pt-3 text-[12px]">
                        {c.keyData.slice(0, 3).map((k) => (
                          <div key={k.label}>
                            <dt className="text-[10px] uppercase tracking-[0.18em] text-metal-gray">
                              {k.label}
                            </dt>
                            <dd className="mt-1 font-numeric text-sm font-semibold text-carbon-black">
                              {k.value}
                              {k.unit ? <span className="ml-1 text-[10px] text-metal-gray">{k.unit}</span> : null}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    ) : null}
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </ul>

        <div className="mt-10 flex justify-end">
          <Link
            href={en ? "/en/cases" : "/cases"}
            className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-carbon-black transition hover:text-aviation-orange"
          >
            {en ? "All cases" : "All cases · 全部案例"}
            <span aria-hidden className="font-numeric text-base transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </Container>
    </section>
  );
}
