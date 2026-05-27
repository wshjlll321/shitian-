import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal.client";
import { pick, type Locale } from "@/lib/i18n";
import { getMediaAssets, getProducts } from "@/lib/cms";

const COPY = {
  eyebrow: { zh: "04 — Fleet · 产品矩阵", en: "04 — Fleet · Heavy-lift portfolio" },
  viewDetail: { zh: "查看 T280 详情", en: "View T280 detail" },
  requestPlan: { zh: "申请 T280 作业方案", en: "Request T280 mission plan" },
  supporting: { zh: "Supporting fleet · 旁系机型", en: "Supporting fleet" },
  allProducts: { zh: "All products", en: "All products" }
};

/**
 * Flagship spread. The T280 photo bleeds off the left edge of the viewport
 * so the slide reads as a magazine spread rather than a stock card. The copy
 * column sits in a narrow gutter on the right with a vertical orange tether
 * connecting the photo to the model name. Spec readout is a flight-deck
 * horizontal bar with hairline dividers — the three numbers carry the same
 * editorial weight as the model name.
 */
export async function ProductMatrix({ locale = "zh" }: { locale?: Locale } = {}) {
  const [products, mediaAssets] = await Promise.all([getProducts(), getMediaAssets()]);
  const [flagship, ...rest] = products;
  const flagshipMedia = flagship?.media[0]
    ? mediaAssets.find((m) => m.id === flagship.media[0])
    : undefined;
  const en = locale === "en";
  const productHref = (slug: string) => (en ? `/en/products/${slug}` : `/products/${slug}`);

  return (
    <section
      data-snap
      data-slide-id="products"
      className="relative flex h-auto min-h-screen w-full flex-col overflow-hidden bg-surface-warm text-carbon-black lg:h-screen"
      aria-label="产品矩阵"
    >
      {/* Soft orange spill from bottom-right to add warmth without color */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_94%_92%,rgba(198,106,50,0.06),transparent_55%)]"
      />

      {/* Middle — flagship spread. The photo column is full-bleed (breaks out
          of the page container on the left) while the copy column stays inside
          the container so the T280 sits with breathing room. Eyebrow lives
          INSIDE the copy column now so the photo can hug the top of the slide
          and the slide doesn't carry a band of empty grid above the spread. */}
      {flagship ? (
        <div className="relative z-10 flex min-h-0 flex-1 items-stretch pt-20 md:pt-20">
          <div className="grid w-full grid-cols-1 items-stretch lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-0">
            {/* Photo — bleeds to the LEFT edge of the viewport, fills 1fr height */}
            <Reveal delay={0.06} className="relative self-stretch">
              <Link
                href={productHref(flagship.slug)}
                className="group relative block aspect-[5/4] w-full overflow-hidden lg:aspect-auto lg:h-full lg:min-h-[440px]"
              >
                {flagshipMedia ? (
                  <Image
                    src={flagshipMedia.src}
                    alt={flagshipMedia.alt}
                    fill
                    sizes="(max-width:1024px) 100vw, 60vw"
                    className="object-cover transition-transform duration-1000 ease-precision group-hover:scale-[1.03]"
                  />
                ) : null}
                {/* Vignette + bottom darkening so the badge stays legible */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(15,16,14,0.22)_0%,rgba(15,16,14,0)_28%,rgba(15,16,14,0)_70%,rgba(15,16,14,0.45)_100%)]"
                />
                {/* Flagship badge */}
                <span className="absolute left-4 top-4 flex items-center gap-2 border border-surface-warm/35 bg-carbon-black/55 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.24em] text-surface-warm backdrop-blur-sm md:left-6 md:top-6">
                  <span className="block h-1.5 w-1.5 bg-aviation-orange" />
                  Flagship · {flagship.model}
                </span>
                {/* Corner registration mark — bottom right of photo */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute bottom-4 right-4 hidden font-numeric text-[10px] uppercase tracking-[0.3em] text-surface-warm/70 md:block"
                >
                  RT · PL · TR · LG
                </span>
              </Link>
            </Reveal>

            {/* Copy column — inside the container gutter on the right */}
            <Reveal delay={0.14} className="relative flex flex-col justify-center self-stretch px-6 py-8 md:px-10 md:py-0 lg:pl-12 lg:pr-[max(2.5rem,calc((100vw-1440px)/2+2.5rem))] lg:py-10">
              {/* Vertical orange tether — connects the photo to the copy */}
              <span
                aria-hidden
                className="absolute left-0 top-1/2 hidden h-24 w-px -translate-y-1/2 bg-gradient-to-b from-aviation-orange/0 via-aviation-orange to-aviation-orange/0 lg:block"
              />

              {/* Section eyebrow lives in the copy column so the photo flushes
                  to the top of the slide with no dead grid band above it. */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span aria-hidden className="block h-px w-6 bg-aviation-orange" />
                  <p className="font-numeric text-[11px] uppercase tracking-[0.3em] text-aviation-orange">
                    {COPY.eyebrow[locale]}
                  </p>
                </div>
                <p className="font-numeric text-[10px] uppercase tracking-[0.3em] text-metal-gray">
                  01 / 0{1 + rest.length}
                </p>
              </div>

              <p className="mt-7 font-numeric text-[11px] uppercase tracking-[0.28em] text-aviation-orange">
                {pick(flagship, "category", locale)}
              </p>
              <h2 className="mt-3 font-display text-[clamp(3.2rem,6.4vw,6.4rem)] font-semibold leading-[0.92] tracking-[-0.03em]">
                {flagship.model}
              </h2>

              {/* Spec bar — three readouts in a row. Smaller numbers + larger
                  units + wider gutters so the values never crash and "kg /
                  km / h" stay legible. */}
              <dl className="mt-7 grid grid-cols-3 gap-x-6 border-y border-carbon-black/12 py-5">
                {flagship.keyMetrics.slice(0, 3).map((m, i) => (
                  <div
                    key={m.label}
                    className={i > 0 ? "border-l border-carbon-black/10 pl-6" : ""}
                  >
                    <dt className="text-[10px] uppercase tracking-[0.22em] text-metal-gray">
                      {m.label}
                    </dt>
                    <dd className="mt-2.5 flex items-baseline gap-1.5 font-numeric leading-none">
                      <span className="whitespace-nowrap text-[clamp(1.5rem,2.2vw,2.2rem)] font-semibold tracking-[-0.015em] text-carbon-black">
                        {m.value}
                      </span>
                      {m.unit ? <span className="text-sm text-metal-gray md:text-base">{m.unit}</span> : null}
                    </dd>
                  </div>
                ))}
              </dl>

              <p className="mt-6 max-w-lg text-[14px] leading-[1.7] text-carbon-black/68 md:text-[15px]">
                {pick(flagship, "narrative", locale)}
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
                <Button
                  href={productHref(flagship.slug)}
                  className="group min-h-[2.875rem] px-5 text-[13px]"
                >
                  <span>{COPY.viewDetail[locale]}</span>
                  <span aria-hidden className="font-numeric text-base transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Button>
                <Link
                  href={en ? "/en/contact" : "/contact"}
                  className="group inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.22em] text-metal-gray transition hover:text-aviation-orange"
                >
                  <span aria-hidden className="block h-px w-5 bg-metal-gray/60 transition group-hover:bg-aviation-orange" />
                  {COPY.requestPlan[locale]}
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      ) : null}

      {/* Bottom — compact fleet index */}
      <Container size="page" className="relative z-10 pb-6 md:pb-8">
        <div className="flex flex-col gap-3 border-t border-carbon-black/12 pt-5">
          <div className="flex items-baseline justify-between">
            <p className="font-numeric text-[10px] uppercase tracking-[0.28em] text-metal-gray">
              {COPY.supporting[locale]} 0{rest.length}
            </p>
            <Link
              href={en ? "/en/products" : "/products"}
              className="group flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-carbon-black transition hover:text-aviation-orange"
            >
              {COPY.allProducts[locale]}
              <span aria-hidden className="font-numeric text-base transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
          <ol className="grid sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-carbon-black/10">
            {rest.map((product, i) => (
              <Reveal key={product.slug} delay={i * 0.04} as="li" margin="0px">
                <Link
                  href={productHref(product.slug)}
                  className="group flex h-full items-baseline gap-3 px-3 py-2.5 transition hover:bg-carbon-black/[0.03]"
                >
                  <span className="font-numeric text-[10px] uppercase tracking-[0.22em] text-aviation-orange">
                    0{i + 2}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="font-display text-sm font-semibold leading-tight md:text-base">
                      {product.model}
                    </span>
                    <span className="mt-0.5 block truncate text-[11px] leading-snug text-carbon-black/55">
                      {pick(product, "summary", locale)}
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className="font-numeric text-sm text-carbon-black/25 transition-all duration-300 group-hover:translate-x-1 group-hover:text-aviation-orange"
                  >
                    →
                  </span>
                </Link>
              </Reveal>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
