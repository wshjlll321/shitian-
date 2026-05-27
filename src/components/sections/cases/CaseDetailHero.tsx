import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/motion/Reveal.client";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getCaseStudies, getMediaAssets, getProducts, getScenarios } from "@/lib/cms";
import { pick, type Locale } from "@/lib/i18n";
import type { CaseStudy } from "@/types/content";

type CaseDetailHeroProps = {
  caseStudy: CaseStudy;
  locale?: Locale;
};

function displayTime(time: string, en: boolean): string {
  if (!time || time.includes("待确认")) return en ? "Ongoing" : "持续 · Ongoing";
  return time;
}

function displayLocation(location: string, en: boolean): string {
  if (!location || location.includes("待确认")) return en ? "Multiple sites in China" : "中国 · 多基地";
  return location;
}

export async function CaseDetailHero({ caseStudy, locale = "zh" }: CaseDetailHeroProps) {
  const en = locale === "en";
  const [allCases, allProducts, allScenarios, allMedia] = await Promise.all([
    getCaseStudies(),
    getProducts(),
    getScenarios(),
    getMediaAssets()
  ]);
  const cover = caseStudy.media[0]
    ? allMedia.find((item) => item.id === caseStudy.media[0])
    : undefined;
  const scenario = allScenarios.find((item) => item.slug === caseStudy.scenario);
  const products = caseStudy.productModels
    .map((model) => allProducts.find((item) => item.model === model))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const relatedCases = allCases
    .filter((c) => c.slug !== caseStudy.slug && c.scenario === caseStudy.scenario)
    .slice(0, 3);

  return (
    <>
      <section className="relative isolate overflow-hidden bg-carbon-black text-surface-warm">
        <div className="absolute inset-0">
          {cover ? (
            <Image src={cover.src} alt={cover.alt} fill priority sizes="100vw" className="object-cover opacity-55" />
          ) : (
            // Designed empty hero with grid texture + outlined case kicker.
            <>
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(54,66,55,0.55),rgba(17,17,17,1))]" />
              <div
                aria-hidden
                className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] [background-size:64px_64px]"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute -bottom-4 -right-4 select-none font-display font-semibold leading-none tracking-[-0.04em] text-[clamp(6rem,12vw,14rem)] md:-bottom-8 md:-right-8"
                style={{
                  WebkitTextStroke: "1px rgba(255,255,255,0.10)",
                  color: "transparent"
                }}
              >
                {caseStudy.productModels.join(" · ")}
              </span>
            </>
          )}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,17,17,0.92)_0%,rgba(17,17,17,0.6)_42%,rgba(17,17,17,0.2)_100%)]" />
        </div>

        <Container size="page" className="relative z-10 pb-20 pt-28 md:pb-24 md:pt-36">
          <Reveal>
            <p className="font-numeric text-xs uppercase tracking-[0.28em] text-aviation-orange">
              {displayLocation((en && caseStudy.locationEn) || caseStudy.location, en)} · {displayTime((en && caseStudy.timeEn) || caseStudy.time, en)}
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-7 max-w-4xl font-display text-[clamp(2.2rem,5vw,4.8rem)] font-semibold leading-[1.02] tracking-[-0.01em]">
              {pick(caseStudy, "title", locale)}
            </h1>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-5 max-w-xl text-[12px] uppercase tracking-[0.22em] text-surface-warm/55">
              {en ? "Platform" : "机型"} · {caseStudy.productModels.join(" / ")}
              {scenario ? <> · {en ? "Scenario" : "场景"} · {pick(scenario, "name", locale)}</> : null}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-7 max-w-2xl text-base leading-9 text-surface-warm/70 md:text-lg">
              {pick(caseStudy, "task", locale)}
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button href={`${en ? "/en/contact" : "/contact"}?case=${caseStudy.slug}`}>
                {en ? "Inquire about similar missions" : "咨询同类作业能力"}
              </Button>
              <Button href={en ? "/en/cases" : "/cases"} variant="contact">
                {en ? "Back to case list" : "返回案例列表"}
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>

      {caseStudy.keyData.length > 0 ? (
        <section className="border-y border-carbon-black/12 bg-surface-warm py-14 md:py-16">
          <Container size="page">
            <dl className="grid grid-cols-2 gap-y-10 sm:gap-x-12 md:grid-cols-4">
              {caseStudy.keyData.slice(0, 4).map((m) => (
                <div key={m.label} className="border-t border-aviation-orange/40 pt-5">
                  <dt className="text-[11px] uppercase tracking-[0.18em] text-metal-gray">{m.label}</dt>
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

      {/* Outcome — task → result split into a two-column editorial block
          so the case isn't just one paragraph repeated twice. */}
      <section className="bg-surface-porcelain py-24 md:py-32">
        <Container size="page">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <Reveal>
              <div>
                <p className="font-numeric text-xs uppercase tracking-[0.28em] text-metal-gray">
                  {en ? "Task" : "Task · 任务"}
                </p>
                <p className="mt-6 text-base leading-8 text-carbon-black/74 md:text-lg md:leading-9">
                  {pick(caseStudy, "task", locale)}
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.06}>
              <div>
                <p className="font-numeric text-xs uppercase tracking-[0.28em] text-aviation-orange">
                  {en ? "Outcome" : "Outcome · 结果"}
                </p>
                <p className="mt-6 text-base leading-8 text-carbon-black/74 md:text-lg md:leading-9">
                  {pick(caseStudy, "result", locale)}
                </p>
              </div>
            </Reveal>
          </div>

          {(scenario || products.length > 0) && (
            <div className="mt-16 grid gap-px overflow-hidden border border-carbon-black/12 bg-carbon-black/10 md:grid-cols-2">
              {scenario ? (
                <Link
                  href={en ? `/en/scenarios/${scenario.slug}` : `/scenarios/${scenario.slug}`}
                  className="group flex h-full flex-col justify-between gap-8 bg-surface-warm p-7 transition hover:bg-surface-porcelain md:p-9"
                >
                  <span className="font-numeric text-xs uppercase tracking-[0.22em] text-aviation-orange">
                    {en ? "Scenario" : "Scenario · 关联场景"}
                  </span>
                  <div>
                    <p className="font-display text-xl font-semibold leading-tight md:text-2xl">
                      {pick(scenario, "name", locale)} — {pick(scenario, "headline", locale)}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-carbon-black/64">{pick(scenario, "painPoint", locale)}</p>
                  </div>
                  <span className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-carbon-black/72 transition group-hover:text-aviation-orange">
                    {en ? "Open scenario" : "查看场景"}
                    <span aria-hidden className="font-numeric text-base">→</span>
                  </span>
                </Link>
              ) : null}
              {products.length > 0 ? (
                <div className="flex h-full flex-col justify-between gap-6 bg-surface-warm p-7 md:p-9">
                  <span className="font-numeric text-xs uppercase tracking-[0.22em] text-aviation-orange">
                    {en ? "Products" : "Products · 涉及机型"}
                  </span>
                  <ul className="grid divide-y divide-carbon-black/10">
                    {products.map((p) => (
                      <li key={p.slug}>
                        <Link
                          href={en ? `/en/products/${p.slug}` : `/products/${p.slug}`}
                          className="group flex items-baseline justify-between gap-4 py-4 transition hover:text-aviation-orange"
                        >
                          <span>
                            <span className="font-display text-lg font-semibold leading-tight">{p.model}</span>
                            <span className="mt-1 block text-[12px] text-carbon-black/55">{pick(p, "strategicRole", locale)}</span>
                          </span>
                          <span
                            aria-hidden
                            className="font-numeric text-base text-carbon-black/30 transition-transform duration-300 group-hover:translate-x-1"
                          >
                            →
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          )}
        </Container>
      </section>

      {/* Related cases — same scenario, three at most. Replaces the
          "查看旧站原文" external link with a path that keeps the visitor
          inside the new site. */}
      {relatedCases.length > 0 ? (
        <section className="bg-surface-warm py-24 md:py-28">
          <Container size="page">
            <div className="flex flex-col gap-3 border-b border-carbon-black/12 pb-6 md:flex-row md:items-baseline md:justify-between md:gap-10">
              <Reveal>
                <p className="font-numeric text-[11px] uppercase tracking-[0.28em] text-metal-gray">
                  {en ? "Related" : "Related · 同场景案例"}
                </p>
              </Reveal>
              <Reveal delay={0.05}>
                <p className="max-w-md text-[13px] leading-7 text-carbon-black/64">
                  {en ? "Adjacent missions in the same operating scenario." : "围绕同一作业场景，相邻的实证记录。"}
                </p>
              </Reveal>
            </div>
            <ul className="mt-10 grid gap-x-10 gap-y-10 md:grid-cols-3">
              {relatedCases.map((rc, i) => (
                <Reveal key={rc.slug} delay={i * 0.05} as="li">
                  <Link href={en ? `/en/cases/${rc.slug}` : `/cases/${rc.slug}`} className="group block">
                    <article className="border-t border-carbon-black/14 pt-5 transition group-hover:border-aviation-orange">
                      <p className="text-[11px] uppercase tracking-[0.22em] text-aviation-orange">
                        {displayLocation((en && rc.locationEn) || rc.location, en)} · {displayTime((en && rc.timeEn) || rc.time, en)}
                      </p>
                      <h3 className="mt-4 font-display text-lg font-semibold leading-tight md:text-xl">
                        {pick(rc, "title", locale)}
                      </h3>
                      <p className="mt-3 text-[13px] leading-7 text-carbon-black/64">{pick(rc, "result", locale)}</p>
                    </article>
                  </Link>
                </Reveal>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      {/* CTA */}
      <section className="bg-carbon-black py-24 text-surface-warm md:py-28">
        <Container size="page">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-end">
            <Reveal>
              <h2 className="font-display text-[clamp(2rem,4.4vw,4rem)] font-semibold leading-[1.04] tracking-[-0.01em]">
                {en ? (
                  <>
                    Take a similar mission
                    <br className="hidden md:block" />
                    {" "}into the next project.
                  </>
                ) : (
                  <>
                    把相似任务，
                    <br className="hidden md:block" />
                    落到下一个项目里。
                  </>
                )}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <div>
                <p className="text-sm leading-8 text-surface-warm/65">
                  {en
                    ? "Tell us the target scale and key constraints. Using this case as the baseline, we'll respond with platform selection and an execution plan."
                    : "告诉我们目标任务规模与关键约束，我们以这条案例为参考，反馈选型与作业组织建议。"}
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button href={`${en ? "/en/contact" : "/contact"}?case=${caseStudy.slug}`}>
                    {en ? "Submit inquiry" : "提交项目需求"}
                  </Button>
                  <Button href={en ? "/en/scenarios" : "/scenarios"} variant="contact">
                    {en ? "Browse scenarios" : "浏览应用场景"}
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
