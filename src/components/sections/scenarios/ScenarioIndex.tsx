import Image from "next/image";
import Link from "next/link";

import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/motion/Reveal.client";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getMediaAssets, getScenarios } from "@/lib/cms";
import { pick, type Locale } from "@/lib/i18n";

type Bi = { zh: string; en: string };
type Domain = {
  code: string;
  name: Bi;
  english: string;
  intent: Bi;
  slugs: string[];
};

const DOMAINS: Domain[] = [
  {
    code: "D-01",
    name: { zh: "农林作业", en: "Agriculture & forestry" },
    english: "Agriculture & forestry",
    intent: {
      zh: "大面积植保、果园授粉、夜间防霜、林业防护，覆盖主流低空农业任务。",
      en: "Large-area crop protection, orchard pollination, overnight frost defence, and forestry — mainstream low-altitude agricultural missions."
    },
    slugs: ["agriculture-plant-protection", "orchard-pollination", "frost-protection", "forestry-protection"]
  },
  {
    code: "D-02",
    name: { zh: "应急与海事", en: "Emergency & maritime" },
    english: "Emergency & maritime",
    intent: {
      zh: "山地吊运、应急投送、海上点对点物流，承担重载与复杂环境运输任务。",
      en: "Mountain lifts, emergency delivery, and ship-to-shore logistics — heavy payload missions in complex environments."
    },
    slugs: ["emergency-lift", "maritime-logistics"]
  },
  {
    code: "D-03",
    name: { zh: "数字化场地", en: "Digital field operations" },
    english: "Digital field operations",
    intent: {
      zh: "高尔夫养护、智慧场地，依托 HIZONE 平台完成感知-决策-执行-反馈闭环。",
      en: "Golf maintenance and smart venues delivered through the HIZONE sense → decide → execute → feedback loop."
    },
    slugs: ["golf-maintenance", "smart-field"]
  }
];

const COPY = {
  kicker: { zh: "Scenarios · 应用场景", en: "Scenarios" },
  title: { zh: "应用场景", en: "Application Scenarios" },
  subtitle: { zh: "Application Scenarios", en: "Where Shitian helicopters operate" },
  lede: {
    zh: "从大田植保到海上物流，世天航空在八类真实低空作业场景中持续部署。每个场景都对应明确的机型组合、关键参数与已交付的案例编号——把作业的复杂度变成可被衡量的工程指标。",
    en: "From cotton-field protection to ship-to-shore logistics, Shitian Aviation operates across eight low-altitude mission categories. Each carries a defined platform pairing, key parameters, and a numbered list of delivered cases — turning operational complexity into measurable engineering targets."
  },
  recommended: { zh: "推荐机型", en: "Recommended platforms" },
  scenePrefix: { zh: "Scene · ", en: "Scene · " },
  closingA: { zh: "未列出的场景，", en: "Custom scenarios," },
  closingB: { zh: "同样欢迎对接。", en: "we'd like to hear about them." },
  closingBody: {
    zh: "电力巡线、矿区运输、海岛补给、特种植保——只要任务描述清晰，世天航空都可反馈机型选型与作业组织建议。",
    en: "Power-line patrol, mine logistics, island resupply, specialty agriculture — given a clear mission brief, Shitian Aviation can recommend platform selection and an execution plan."
  },
  submit: { zh: "提交场景需求", en: "Submit scenario brief" },
  viewCases: { zh: "查看作业案例", en: "See case studies" }
};

export async function ScenarioIndex({ locale = "zh" }: { locale?: Locale } = {}) {
  const [scenarios, mediaAssets] = await Promise.all([getScenarios(), getMediaAssets()]);
  const en = locale === "en";
  const sHref = (slug: string) => (en ? `/en/scenarios/${slug}` : `/scenarios/${slug}`);

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
          {DOMAINS.map((domain, di) => {
            const items = scenarios.filter((s) => domain.slugs.includes(s.slug));
            return (
              <div key={domain.code} className={di === 0 ? "" : "mt-24 md:mt-28"}>
                <Reveal>
                  <div className="flex flex-col gap-3 border-b border-carbon-black/12 pb-6 md:flex-row md:items-baseline md:justify-between md:gap-10">
                    <div className="flex items-baseline gap-4">
                      <span className="font-numeric text-[11px] uppercase tracking-[0.24em] text-aviation-orange">
                        {domain.code}
                      </span>
                      <h2 className="font-display text-2xl font-semibold leading-tight md:text-3xl">
                        {domain.name[locale]}
                        <span className="ml-3 font-numeric text-[10px] uppercase tracking-[0.22em] text-metal-gray">
                          {domain.english}
                        </span>
                      </h2>
                    </div>
                    <p className="max-w-md text-[13px] leading-7 text-carbon-black/64">
                      {domain.intent[locale]}
                    </p>
                  </div>
                </Reveal>

                <ul className="mt-10 grid gap-8 md:grid-cols-2">
                  {items.map((s, i) => {
                    const media = s.media[0]
                      ? mediaAssets.find((m) => m.id === s.media[0])
                      : undefined;
                    const teaser = s.valueMetrics[0];
                    const absoluteIndex = scenarios.findIndex((x) => x.slug === s.slug);
                    return (
                      <Reveal key={s.slug} delay={i * 0.05} as="li">
                        <Link
                          href={sHref(s.slug)}
                          className="group flex h-full flex-col overflow-hidden border border-carbon-black/10 bg-surface-porcelain transition hover:border-carbon-black/40"
                        >
                          <div className="relative aspect-[16/10] overflow-hidden bg-carbon-black/4">
                            {media ? (
                              <Image
                                src={media.src}
                                alt={media.alt}
                                fill
                                sizes="(max-width:768px) 100vw, 50vw"
                                className="object-cover transition-transform duration-700 ease-precision group-hover:scale-[1.03]"
                              />
                            ) : (
                              <div className="absolute inset-0 flex flex-col justify-between bg-[linear-gradient(135deg,rgba(54,66,55,0.14),rgba(17,17,17,0.04))] p-6">
                                <span className="font-numeric text-[10px] uppercase tracking-[0.24em] text-carbon-black/40">
                                  {COPY.scenePrefix[locale]}{domain.english}
                                </span>
                                <span
                                  className="self-end font-display font-semibold leading-none tracking-[-0.04em] text-[clamp(2.8rem,6vw,5rem)]"
                                  style={{
                                    WebkitTextStroke: "1px rgba(17,17,17,0.18)",
                                    color: "transparent"
                                  }}
                                >
                                  {pick(s, "name", locale)}
                                </span>
                              </div>
                            )}
                            <span className="absolute left-5 top-5 bg-carbon-black/80 px-2 py-1 font-numeric text-[10px] uppercase tracking-[0.22em] text-surface-warm">
                              {String(absoluteIndex + 1).padStart(2, "0")} / {String(scenarios.length).padStart(2, "0")}
                            </span>
                          </div>

                          <div className="flex flex-1 flex-col justify-between gap-6 p-6 md:p-7">
                            <div>
                              <p className="text-[11px] uppercase tracking-[0.22em] text-aviation-orange">
                                {pick(s, "name", locale)}
                              </p>
                              <h3 className="mt-4 font-display text-xl font-semibold leading-tight md:text-2xl">
                                {pick(s, "headline", locale)}
                              </h3>
                              <p className="mt-3 text-sm leading-7 text-carbon-black/64">
                                {pick(s, "painPoint", locale)}
                              </p>
                            </div>

                            <div className="flex flex-wrap items-baseline gap-x-6 gap-y-3 border-t border-carbon-black/10 pt-5">
                              {teaser ? (
                                <div>
                                  <p className="text-[10px] uppercase tracking-[0.18em] text-metal-gray">
                                    {teaser.label}
                                  </p>
                                  <p className="mt-1 flex items-baseline gap-1 font-numeric leading-none">
                                    <span className="text-base font-semibold tracking-[-0.01em] text-carbon-black md:text-lg">
                                      {teaser.value}
                                    </span>
                                    {teaser.unit ? (
                                      <span className="text-[11px] text-metal-gray">{teaser.unit}</span>
                                    ) : null}
                                  </p>
                                </div>
                              ) : null}
                              <div className="flex-1">
                                <p className="text-[10px] uppercase tracking-[0.18em] text-metal-gray">
                                  {COPY.recommended[locale]}
                                </p>
                                <p className="mt-1 text-xs text-carbon-black/72">
                                  {s.recommendedProducts.slice(0, 4).join(" · ")}
                                </p>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </Reveal>
                    );
                  })}
                </ul>
              </div>
            );
          })}
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
                <p className="max-w-md text-sm leading-8 text-surface-warm/65">
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
