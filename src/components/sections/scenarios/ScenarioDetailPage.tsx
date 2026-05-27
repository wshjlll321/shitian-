import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/motion/Reveal.client";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getCaseStudies, getMediaAssets, getProducts } from "@/lib/cms";
import { pick, type Locale } from "@/lib/i18n";
import type { Scenario } from "@/types/content";

type ScenarioDetailViewProps = {
  scenario: Scenario;
  locale?: Locale;
};

export async function ScenarioDetailView({ scenario, locale = "zh" }: ScenarioDetailViewProps) {
  const en = locale === "en";
  const [allCases, allProducts, allMedia] = await Promise.all([
    getCaseStudies(),
    getProducts(),
    getMediaAssets()
  ]);
  const cases = scenario.proofCases
    .map((slug) => allCases.find((item) => item.slug === slug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const products = scenario.recommendedProducts
    .map((model) => allProducts.find((item) => item.model === model))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const heroMedia = scenario.media[0]
    ? allMedia.find((item) => item.id === scenario.media[0])
    : undefined;

  return (
    <>
      {/* Hero — full-bleed scenario image with overlay copy */}
      <section className="relative isolate overflow-hidden bg-carbon-black text-surface-warm">
        <div className="absolute inset-0">
          {heroMedia ? (
            <Image
              src={heroMedia.src}
              alt={heroMedia.alt}
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-60"
            />
          ) : (
            // Designed empty hero — engineering grid + outlined scenario
            // name keeps the missing-media state on-brand, instead of
            // bleeding a flat gradient across the viewport.
            <>
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(54,66,55,0.55),rgba(17,17,17,1))]" />
              <div
                aria-hidden
                className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] [background-size:64px_64px]"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute -bottom-4 -right-4 select-none font-display font-semibold leading-none tracking-[-0.04em] text-[clamp(7rem,14vw,16rem)] md:-bottom-8 md:-right-8"
                style={{
                  WebkitTextStroke: "1px rgba(255,255,255,0.10)",
                  color: "transparent"
                }}
              >
                {pick(scenario, "name", locale)}
              </span>
            </>
          )}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,17,17,0.92)_0%,rgba(17,17,17,0.6)_42%,rgba(17,17,17,0.2)_100%)]" />
        </div>

        <Container size="page" className="relative z-10 pb-20 pt-28 md:pb-24 md:pt-36">
          <Reveal>
            <p className="font-numeric text-xs uppercase tracking-[0.28em] text-aviation-orange">
              {scenario.name}
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-7 max-w-4xl font-display text-[clamp(2.4rem,5.4vw,5.4rem)] font-semibold leading-[1.0] tracking-[-0.01em]">
              {pick(scenario, "headline", locale)}
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-7 max-w-2xl text-base leading-9 text-surface-warm/70 md:text-lg">
              {pick(scenario, "painPoint", locale)}
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button href={`${en ? "/en/contact" : "/contact"}?scenario=${scenario.slug}`}>
                {pick(scenario, "cta", locale)}
              </Button>
              <Button href="#proof" variant="contact">
                {en ? "See case proof" : "查看案例证明"}
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Value metrics */}
      {scenario.valueMetrics.length > 0 ? (
        <section className="border-y border-carbon-black/12 bg-surface-warm py-14 md:py-16">
          <Container size="page">
            <dl className="grid grid-cols-1 gap-y-8 sm:grid-cols-2 md:grid-cols-4 md:gap-x-12">
              {scenario.valueMetrics.slice(0, 4).map((m) => (
                <div key={m.label} className="border-t border-aviation-orange/40 pt-5">
                  <dt className="text-[11px] uppercase tracking-[0.18em] text-metal-gray">
                    {m.label}
                  </dt>
                  <dd className="mt-3 font-numeric text-[clamp(1.7rem,3vw,2.8rem)] font-semibold leading-none tracking-[-0.01em] text-carbon-black">
                    {m.value}
                    {m.unit ? <span className="ml-1 text-base text-metal-gray">{m.unit}</span> : null}
                  </dd>
                </div>
              ))}
            </dl>
          </Container>
        </section>
      ) : null}

      {/* Task flow */}
      <section className="bg-surface-porcelain py-24 md:py-32">
        <Container size="page">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.32fr)_minmax(0,1fr)] lg:items-end">
            <Reveal>
              <p className="font-numeric text-xs uppercase tracking-[0.28em] text-metal-gray">
                {en ? "Task flow" : "作业流程 · Task flow"}
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="font-display text-[clamp(1.8rem,3.2vw,3rem)] font-semibold leading-[1.06] tracking-[-0.01em]">
                {en ? (
                  <>
                    Operations aren't a demo —
                    <br className="hidden md:block" />
                    {" "}they're an organised mission chain.
                  </>
                ) : (
                  <>
                    作业不是展示，
                    <br className="hidden md:block" />
                    而是可组织的任务链路。
                  </>
                )}
              </h2>
            </Reveal>
          </div>
          <ol
            className="mt-16 grid gap-px overflow-hidden border border-carbon-black/12 bg-carbon-black/10"
            style={{
              gridTemplateColumns: `repeat(${scenario.taskFlow.length}, minmax(0,1fr))`
            }}
          >
            {/* Mobile fallback — when columns can't all fit, the grid above
                still defines N columns but each cell stays wide enough; on
                small viewports we drop to a stacked 2-col layout via the
                inner override. */}
            {(pick(scenario, "taskFlow", locale) as string[]).map((step, i, arr) => (
              <Reveal key={step} delay={i * 0.04} as="li" margin="0px">
                <div className="flex h-full flex-col justify-between gap-7 bg-surface-warm p-6 md:p-7">
                  <div className="flex items-baseline justify-between">
                    <span className="font-numeric text-xs uppercase tracking-[0.22em] text-aviation-orange">
                      Step · 0{i + 1}
                    </span>
                    <span
                      aria-hidden
                      className="font-numeric text-sm text-aviation-orange/70"
                    >
                      {i === arr.length - 1 ? "✓" : "→"}
                    </span>
                  </div>
                  <p className="font-display text-base font-semibold leading-snug md:text-lg">
                    {step}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      {/* Recommended products */}
      {products.length > 0 ? (
        <section className="bg-surface-warm py-24 md:py-32">
          <Container size="page">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.32fr)_minmax(0,1fr)] lg:items-end">
              <Reveal>
                <p className="font-numeric text-xs uppercase tracking-[0.28em] text-metal-gray">
                  {en ? "Product match" : "推荐机型 · Product match"}
                </p>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="font-display text-[clamp(1.8rem,3.2vw,3rem)] font-semibold leading-[1.06] tracking-[-0.01em]">
                  {en ? "Recommended platform mix." : "推荐的装备组合。"}
                </h2>
              </Reveal>
            </div>
            <ul className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {products.map((p, i) => {
                const m = p.media[0] ? allMedia.find((item) => item.id === p.media[0]) : undefined;
                return (
                  <Reveal key={p.slug} delay={i * 0.05} as="li">
                    <Link
                      href={en ? `/en/products/${p.slug}` : `/products/${p.slug}`}
                      className="group flex h-full flex-col overflow-hidden border border-carbon-black/10 bg-surface-porcelain transition hover:border-carbon-black/40"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-carbon-black/4">
                        {m ? (
                          <Image
                            src={m.src}
                            alt={m.alt}
                            fill
                            sizes="(max-width:768px) 100vw, 33vw"
                            className="object-cover transition-transform duration-700 ease-precision group-hover:scale-[1.03]"
                          />
                        ) : null}
                      </div>
                      <div className="flex flex-1 flex-col gap-4 p-6 md:p-7">
                        <p className="text-[11px] uppercase tracking-[0.22em] text-aviation-orange">
                          {p.model}
                        </p>
                        <h3 className="font-display text-lg font-semibold leading-tight md:text-xl">
                          {pick(p, "strategicRole", locale)}
                        </h3>
                        <p className="text-sm leading-7 text-carbon-black/64">{pick(p, "positioning", locale)}</p>
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
            </ul>
          </Container>
        </section>
      ) : null}

      {/* Case proof */}
      {cases.length > 0 ? (
        <section id="proof" className="bg-carbon-black py-24 text-surface-warm md:py-32">
          <Container size="page">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.32fr)_minmax(0,1fr)] lg:items-end">
              <Reveal>
                <p className="font-numeric text-xs uppercase tracking-[0.28em] text-surface-warm/45">
                  {en ? "Case proof" : "Case proof · 任务实证"}
                </p>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="font-display text-[clamp(1.8rem,3.2vw,3rem)] font-semibold leading-[1.06] tracking-[-0.01em]">
                  {en ? "Missions already flown in the field." : "在真实场景中，已经发生过的事。"}
                </h2>
              </Reveal>
            </div>
            <ul className="mt-16 grid gap-x-10 gap-y-12 md:grid-cols-2">
              {cases.map((c, i) => (
                <Reveal key={c.slug} delay={i * 0.05} as="li">
                  <article className="border-t border-surface-warm/16 pt-6">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-aviation-orange">
                      {((en && c.locationEn) || c.location)} · {((en && c.timeEn) || c.time)}
                    </p>
                    <h3 className="mt-4 font-display text-xl font-semibold leading-tight md:text-2xl">
                      {pick(c, "title", locale)}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-surface-warm/68">{pick(c, "result", locale)}</p>
                    {c.keyData.length > 0 ? (
                      <dl className="mt-5 flex flex-wrap gap-x-7 gap-y-3 text-sm">
                        {c.keyData.slice(0, 3).map((k) => (
                          <div key={k.label}>
                            <dt className="text-xs text-surface-warm/50">{k.label}</dt>
                            <dd className="font-numeric text-lg text-surface-warm">
                              {k.value}
                              {k.unit ? <span className="ml-1 text-xs text-surface-warm/55">{k.unit}</span> : null}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    ) : null}
                  </article>
                </Reveal>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      {/* CTA */}
      <section className="bg-surface-warm py-24 md:py-32">
        <Container size="page">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-end">
            <Reveal>
              <h2 className="font-display text-[clamp(2rem,4.4vw,4rem)] font-semibold leading-[1.04] tracking-[-0.01em]">
                {en ? (
                  <>
                    Make your "{pick(scenario, "name", "en")}"
                    <br className="hidden md:block" />
                    {" "}our next case study.
                  </>
                ) : (
                  <>
                    围绕「{scenario.name}」，
                    <br className="hidden md:block" />
                    把你的任务变成我们的下一个案例。
                  </>
                )}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <div>
                <p className="text-sm leading-8 text-carbon-black/64">
                  {en
                    ? "Send the operating area, surface, time window, and key constraints — we'll recommend a platform and an execution plan."
                    : "提交作业区域、面积、时间窗口与关键约束，我们会反馈推荐机型与作业组织方式。"}
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button href={`${en ? "/en/contact" : "/contact"}?scenario=${scenario.slug}`}>
                    {pick(scenario, "cta", locale)}
                  </Button>
                  <Button href={en ? "/en/scenarios" : "/scenarios"} variant="contact">
                    {en ? "Other scenarios" : "查看其他场景"}
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
