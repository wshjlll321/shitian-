import Link from "next/link";

import { PageHero } from "@/components/layout/PageHero";
import { SectionRail, type RailItem } from "@/components/layout/SectionRail.client";
import { Reveal } from "@/components/motion/Reveal.client";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getTechnologyPillars } from "@/lib/cms";
import { pick, type Locale } from "@/lib/i18n";

const PAGE_COPY = {
  kicker: { zh: "Technology · 技术能力", en: "Technology" },
  title: { zh: "技术能力", en: "Engineering Capabilities" },
  subtitle: { zh: "Engineering Capabilities", en: "Flight, power, payload, and feedback" },
  lede: {
    zh: "飞行控制、动力总成、任务载荷与智能闭环——世天航空把整机系统能力拆解为四条工程主轴：地形跟随精度 ≤ 0.5 m、连续动力输出 46 kW、最大任务载荷 120 kg，并以 HIZONE 五步作业闭环把单次飞行扩展为可复用的作业系统。",
    en: "Flight control, powertrain, payload, and the HIZONE loop — Shitian Aviation organises the platform into four engineering axes: 0.5 m terrain-following precision, 46 kW sustained output, 120 kg max payload, and a five-stage HIZONE loop that turns a single sortie into a repeatable operating system."
  }
};

type Bi = { zh: string; en: string };
type GlanceMetric = {
  pillarId: string;
  value: string;
  unit: string;
  label: Bi;
};

const GLANCE: GlanceMetric[] = [
  { pillarId: "flight-control", value: "0.5", unit: "m", label: { zh: "地形跟随精度", en: "Terrain-following accuracy" } },
  { pillarId: "powertrain", value: "46", unit: "kW", label: { zh: "连续动力输出", en: "Sustained power" } },
  { pillarId: "payload", value: "120", unit: "kg", label: { zh: "最大任务载荷", en: "Max payload" } },
  { pillarId: "ai", value: "5", unit: "步", label: { zh: "HIZONE 作业闭环", en: "HIZONE loop stages" } }
];

type ScenarioRef = { slug: string; name: Bi };
const PILLAR_LINKS: Record<
  string,
  { products: { slug: string; model: string }[]; scenarios: ScenarioRef[] }
> = {
  "flight-control": {
    products: [
      { slug: "t280", model: "T280" },
      { slug: "s270", model: "S270" }
    ],
    scenarios: [
      { slug: "agriculture-plant-protection", name: { zh: "农业植保", en: "Agricultural protection" } },
      { slug: "emergency-lift", name: { zh: "应急吊运", en: "Emergency lift" } }
    ]
  },
  powertrain: {
    products: [
      { slug: "t280", model: "T280" },
      { slug: "s270", model: "S270" },
      { slug: "h15", model: "H15" },
      { slug: "h60", model: "H60" }
    ],
    scenarios: [
      { slug: "forestry-protection", name: { zh: "林业防护", en: "Forestry protection" } },
      { slug: "frost-protection", name: { zh: "果园防霜", en: "Frost defence" } }
    ]
  },
  payload: {
    products: [
      { slug: "t280", model: "T280" },
      { slug: "h60", model: "H60" }
    ],
    scenarios: [
      { slug: "emergency-lift", name: { zh: "应急吊运", en: "Emergency lift" } },
      { slug: "maritime-logistics", name: { zh: "海上物流", en: "Maritime logistics" } },
      { slug: "agriculture-plant-protection", name: { zh: "农业植保", en: "Agricultural protection" } }
    ]
  },
  ai: {
    products: [{ slug: "hizone", model: "HIZONE" }],
    scenarios: [
      { slug: "smart-field", name: { zh: "智慧场地", en: "Smart field" } },
      { slug: "golf-maintenance", name: { zh: "高尔夫", en: "Golf maintenance" } }
    ]
  }
};

const HIZONE_FLOW = [
  {
    code: "L-01",
    name: { zh: "感知", en: "Sense" },
    english: "Sensing",
    body: {
      zh: "卫星遥感 / 无人机巡查影像 / 地面传感，形成场地与农情的数据底座。",
      en: "Satellite remote sensing, UAV inspection imagery, and ground sensors assemble the field-and-crop data foundation."
    }
  },
  {
    code: "L-02",
    name: { zh: "分析", en: "Analyse" },
    english: "Analysis",
    body: {
      zh: "AI 模型在多源数据上识别地块状态、作业目标与环境约束。",
      en: "AI models read plot status, operating objectives, and environmental constraints across the multi-source dataset."
    }
  },
  {
    code: "L-03",
    name: { zh: "决策", en: "Decide" },
    english: "Decision",
    body: {
      zh: "生成精准处方图与作业方案，决定机型、航线、载荷与窗口。",
      en: "Generate precision prescription maps and operations plans — platform, route, payload, and time window."
    }
  },
  {
    code: "L-04",
    name: { zh: "执行", en: "Execute" },
    english: "Execution",
    body: {
      zh: "处方图转化为航线下发，T280 / S270 / H60 完成飞行作业。",
      en: "Prescription maps translate into flight routes. T280 / S270 / H60 execute the mission in the air."
    }
  },
  {
    code: "L-05",
    name: { zh: "反馈", en: "Feedback" },
    english: "Feedback",
    body: {
      zh: "实时回传作业效果，对照上周期数据，进入下一闭环。",
      en: "Real-time results telemetry, benchmarked against the previous cycle, feeds the next loop iteration."
    }
  }
];

const ENGINEERING_PROOF: Array<{ value: string; unit: Bi; label: Bi }> = [
  { value: "20", unit: { zh: "项", en: "" }, label: { zh: "实用新型专利", en: "Utility patents" } },
  { value: "81", unit: { zh: "例", en: "" }, label: { zh: "完成作业任务", en: "Operations delivered" } },
  { value: "5", unit: { zh: "条", en: "" }, label: { zh: "在产产品线", en: "Active product lines" } },
  { value: "2019", unit: { zh: "", en: "" }, label: { zh: "成立年份", en: "Founded" } }
];

const RAIL_LABELS: Record<string, Bi> = {
  "flight-control": { zh: "飞控", en: "Flight" },
  powertrain: { zh: "动力", en: "Power" },
  payload: { zh: "载荷", en: "Payload" },
  ai: { zh: "智能", en: "Loop" },
  "hizone-loop": { zh: "闭环", en: "Cycle" },
  "engineering-proof": { zh: "实绩", en: "Proof" }
};

const SECTION_COPY = {
  atGlanceEyebrow: { zh: "At a glance · 工程一览", en: "At a glance" },
  atGlanceNote: { zh: "四项关键指标，定位技术深度", en: "Four numbers, four engineering axes" },
  jumpTo: { zh: "跳转", en: "Jump" },
  appliedProducts: { zh: "应用机型", en: "Applied to" },
  matchingScenarios: { zh: "对应场景", en: "Matching scenarios" },
  hizoneEyebrow: { zh: "05 — HIZONE Loop · 作业闭环", en: "05 — HIZONE Loop" },
  hizoneHeadlineA: { zh: "五个阶段，", en: "Five stages —" },
  hizoneHeadlineB: {
    zh: "把一次飞行扩展为可复用的作业系统。",
    en: "extend a single sortie into a repeatable operating system."
  },
  loopBack: { zh: "↺ 回到 01", en: "↺ back to 01" },
  proofEyebrow: { zh: "06 — Engineering proof · 工程实绩", en: "06 — Engineering proof" },
  proofNote: {
    zh: "Shitian Aviation · 国家高新技术企业",
    en: "Shitian Aviation · National High-Tech Enterprise"
  },
  ctaHeadlineA: { zh: "把技术能力，", en: "Bring engineering capability" },
  ctaHeadlineB: { zh: "落进一项具体任务。", en: "into a concrete mission." },
  ctaBody: {
    zh: "请提交目标作业场景与关键约束，世天航空将从飞控、动力、载荷与智能闭环四个维度匹配技术方案。",
    en: "Share your target scenario and key constraints. Shitian Aviation will match a technical plan across flight control, powertrain, payload, and HIZONE loop."
  },
  ctaSubmit: { zh: "提交技术沟通", en: "Submit technical brief" },
  ctaFleet: { zh: "查看产品矩阵", en: "View fleet" }
};

export async function TechnologyPage({ locale = "zh" }: { locale?: Locale } = {}) {
  const technologyPillars = await getTechnologyPillars();
  const en = locale === "en";

  // The rail labels are translated here so the desktop side-rail reads
  // cleanly in both locales without having to thread a prop into the rail
  // component itself.
  const rail: RailItem[] = [
    { id: "flight-control", index: "01", label: RAIL_LABELS["flight-control"][locale] },
    { id: "powertrain", index: "02", label: RAIL_LABELS.powertrain[locale] },
    { id: "payload", index: "03", label: RAIL_LABELS.payload[locale] },
    { id: "ai", index: "04", label: RAIL_LABELS.ai[locale] },
    { id: "hizone-loop", index: "05", label: RAIL_LABELS["hizone-loop"][locale] },
    { id: "engineering-proof", index: "06", label: RAIL_LABELS["engineering-proof"][locale] }
  ];

  return (
    <>
      <SectionRail items={rail} />

      <PageHero
        kicker={PAGE_COPY.kicker[locale]}
        title={PAGE_COPY.title[locale]}
        subtitle={PAGE_COPY.subtitle[locale]}
        lede={PAGE_COPY.lede[locale]}
      />

      {/* Engineering at a glance — four hero metrics tied to the four
          pillars, so the page opens with a measurable promise rather than
          a wall of prose. Each tile is also an anchor link into the pillar
          deep-dive below. */}
      <section className="border-y border-carbon-black/12 bg-surface-warm py-16 md:py-20">
        <Container size="page">
          <div className="flex items-baseline justify-between gap-6 pb-7">
            <Reveal>
              <p className="font-numeric text-[11px] uppercase tracking-[0.28em] text-aviation-orange">
                {SECTION_COPY.atGlanceEyebrow[locale]}
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="hidden text-xs uppercase tracking-[0.22em] text-metal-gray md:block">
                {SECTION_COPY.atGlanceNote[locale]}
              </p>
            </Reveal>
          </div>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4 md:gap-x-12">
            {GLANCE.map((g) => (
              <Reveal key={g.pillarId} margin="0px">
                <a
                  href={`#${g.pillarId}`}
                  className="group block border-t border-aviation-orange/40 pt-5 transition hover:border-aviation-orange"
                >
                  <dt className="text-[11px] uppercase tracking-[0.18em] text-metal-gray">
                    {g.label[locale]}
                  </dt>
                  <dd className="mt-3 font-numeric text-[clamp(2rem,3.6vw,3.4rem)] font-semibold leading-none tracking-[-0.01em] text-carbon-black">
                    {g.value}
                    {g.unit ? <span className="ml-1 text-base text-metal-gray">{g.unit}</span> : null}
                  </dd>
                  <span className="mt-4 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-metal-gray transition group-hover:text-aviation-orange">
                    {SECTION_COPY.jumpTo[locale]} <span aria-hidden className="font-numeric">→</span>
                  </span>
                </a>
              </Reveal>
            ))}
          </dl>
        </Container>
      </section>


      {/* Pillar list — each pillar is a sub-section with sticky index column
          on desktop. Adds a cross-link footer per pillar so a reader can
          jump from the technology page to the products / scenarios that
          embody each capability. */}
      <section className="bg-surface-warm py-20 md:py-28">
        <Container size="page">
          <div className="grid gap-24 md:gap-32">
            {technologyPillars.map((pillar, pi) => {
              const links = PILLAR_LINKS[pillar.id];
              return (
                <article
                  key={pillar.id}
                  id={pillar.id}
                  className="grid gap-10 lg:grid-cols-[minmax(0,0.32fr)_minmax(0,1fr)] lg:items-start"
                >
                  <div className="lg:sticky lg:top-32 lg:self-start">
                    <Reveal>
                      <p className="font-numeric text-xs uppercase tracking-[0.28em] text-aviation-orange">
                        {pillar.index} · 0{pi + 1} / 04
                      </p>
                    </Reveal>
                    <Reveal delay={0.05}>
                      <h2 className="mt-6 font-display text-[clamp(2rem,3.6vw,3.4rem)] font-semibold leading-[1.04] tracking-[-0.01em]">
                        {pick(pillar, "title", locale)}
                      </h2>
                    </Reveal>
                    <Reveal delay={0.1}>
                      <p className="mt-5 max-w-sm text-sm leading-7 text-carbon-black/64">
                        {pick(pillar, "abstract", locale)}
                      </p>
                    </Reveal>
                  </div>

                  <div>
                    <Reveal>
                      <ul className="grid gap-3 border-t border-carbon-black/12 pt-6 sm:grid-cols-2 md:gap-4">
                        {(pick(pillar, "highlights", locale) as string[]).map((h) => (
                          <li
                            key={h}
                            className="flex gap-3 border-l border-carbon-black/12 pl-4 text-sm leading-7 text-carbon-black/74"
                          >
                            <span className="mt-2 block h-1 w-1 shrink-0 rounded-full bg-aviation-orange" />
                            {h}
                          </li>
                        ))}
                      </ul>
                    </Reveal>

                    <ol className="mt-10 divide-y divide-carbon-black/12 border-y border-carbon-black/12">
                      {pillar.detail.map((block, j) => (
                        <Reveal key={block.heading} delay={j * 0.05} as="li">
                          <div className="grid gap-3 py-7 md:grid-cols-[120px_minmax(0,1fr)] md:gap-12">
                            <span className="font-numeric text-xs uppercase tracking-[0.18em] text-metal-gray">
                              {pillar.index} / {String(j + 1).padStart(2, "0")}
                            </span>
                            <div>
                              <h3 className="font-display text-lg font-semibold leading-tight md:text-xl">
                                {(en && block.headingEn) || block.heading}
                              </h3>
                              <p className="mt-3 text-sm leading-7 text-carbon-black/64 md:text-base md:leading-8">
                                {(en && block.bodyEn) || block.body}
                              </p>
                            </div>
                          </div>
                        </Reveal>
                      ))}
                    </ol>

                    {/* Cross-link rail — products and scenarios that embody
                        this pillar. Same hairline-list grammar used across
                        the site, so the references feel like part of the
                        editorial flow rather than a tacked-on widget. */}
                    {links ? (
                      <Reveal margin="0px">
                        <div className="mt-8 grid gap-6 border-t border-carbon-black/10 pt-6 md:grid-cols-2 md:gap-12">
                          <div>
                            <p className="font-numeric text-[10px] uppercase tracking-[0.24em] text-metal-gray">
                              {SECTION_COPY.appliedProducts[locale]}
                            </p>
                            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                              {links.products.map((p) => (
                                <li key={p.slug}>
                                  <Link
                                    href={en ? `/en/products/${p.slug}` : `/products/${p.slug}`}
                                    className="text-carbon-black/72 transition hover:text-aviation-orange"
                                  >
                                    {p.model} <span aria-hidden className="text-metal-gray">→</span>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="font-numeric text-[10px] uppercase tracking-[0.24em] text-metal-gray">
                              {SECTION_COPY.matchingScenarios[locale]}
                            </p>
                            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                              {links.scenarios.map((s) => (
                                <li key={s.slug}>
                                  <Link
                                    href={en ? `/en/scenarios/${s.slug}` : `/scenarios/${s.slug}`}
                                    className="text-carbon-black/72 transition hover:text-aviation-orange"
                                  >
                                    {s.name[locale]} <span aria-hidden className="text-metal-gray">→</span>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </Reveal>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        </Container>
      </section>

      {/* HIZONE loop diagram — five-stage flow visualised as a horizontal
          ribbon, the "engineering schematic" the rest of the site implies
          but never actually draws. */}
      <section
        id="hizone-loop"
        className="relative bg-carbon-black py-24 text-surface-warm md:py-32"
      >
        <Container size="page" className="relative z-10">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.32fr)_minmax(0,1fr)] lg:items-end">
            <Reveal>
              <p className="font-numeric text-xs uppercase tracking-[0.28em] text-aviation-orange">
                {SECTION_COPY.hizoneEyebrow[locale]}
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="font-display text-[clamp(1.8rem,3.4vw,3.2rem)] font-semibold leading-[1.06] tracking-[-0.01em]">
                {SECTION_COPY.hizoneHeadlineA[locale]}
                <br className="hidden md:block" />
                {SECTION_COPY.hizoneHeadlineB[locale]}
              </h2>
            </Reveal>
          </div>

          <ol className="mt-14 grid gap-px overflow-hidden border border-surface-warm/14 bg-surface-warm/8 md:grid-cols-5">
            {HIZONE_FLOW.map((step, i) => (
              <Reveal key={step.code} delay={i * 0.05} as="li" margin="0px">
                <div className="relative flex h-full flex-col justify-between gap-7 bg-carbon-black p-6 md:p-7">
                  <div className="flex items-baseline justify-between">
                    <span className="font-numeric text-[10px] uppercase tracking-[0.24em] text-aviation-orange">
                      {step.code}
                    </span>
                    <span className="font-numeric text-[10px] uppercase tracking-[0.22em] text-surface-warm/45">
                      0{i + 1} / 05
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold leading-tight">
                      {step.name[locale]}
                      <span className="ml-2 font-numeric text-[10px] uppercase tracking-[0.22em] text-surface-warm/45">
                        {step.english}
                      </span>
                    </h3>
                    <p className="mt-3 text-[13px] leading-[1.6] text-surface-warm/68">{step.body[locale]}</p>
                  </div>
                  <span
                    aria-hidden
                    className="font-numeric text-base text-aviation-orange/80"
                  >
                    {i === HIZONE_FLOW.length - 1 ? SECTION_COPY.loopBack[locale] : "→"}
                  </span>
                </div>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      {/* Engineering proof strip — same numeric language as the homepage
          manifesto so the technology page closes with credibility before
          the CTA, not after. */}
      <section id="engineering-proof" className="border-b border-carbon-black/12 bg-surface-warm py-16 md:py-20">
        <Container size="page">
          <div className="flex items-baseline justify-between gap-6 pb-7">
            <Reveal>
              <p className="font-numeric text-[11px] uppercase tracking-[0.28em] text-metal-gray">
                {SECTION_COPY.proofEyebrow[locale]}
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="hidden text-xs uppercase tracking-[0.22em] text-metal-gray md:block">
                {SECTION_COPY.proofNote[locale]}
              </p>
            </Reveal>
          </div>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4 md:gap-x-12">
            {ENGINEERING_PROOF.map((p) => (
              <Reveal key={p.label.zh} margin="0px">
                <div className="border-t border-carbon-black/14 pt-5">
                  <dd className="font-numeric text-[clamp(2rem,3.6vw,3.4rem)] font-semibold leading-none tracking-[-0.01em] text-carbon-black">
                    {p.value}
                    {p.unit[locale] ? <span className="ml-1 text-base text-metal-gray">{p.unit[locale]}</span> : null}
                  </dd>
                  <dt className="mt-3 text-[11px] uppercase tracking-[0.18em] text-metal-gray">
                    {p.label[locale]}
                  </dt>
                </div>
              </Reveal>
            ))}
          </dl>
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-carbon-black py-24 text-surface-warm md:py-32">
        <Container size="page">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-end">
            <Reveal>
              <h2 className="font-display text-[clamp(2rem,4.4vw,4rem)] font-semibold leading-[1.04] tracking-[-0.01em]">
                {SECTION_COPY.ctaHeadlineA[locale]}
                <br className="hidden md:block" />
                {SECTION_COPY.ctaHeadlineB[locale]}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <div>
                <p className="text-sm leading-8 text-surface-warm/65">
                  {SECTION_COPY.ctaBody[locale]}
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button href={en ? "/en/contact" : "/contact"}>{SECTION_COPY.ctaSubmit[locale]}</Button>
                  <Button href={en ? "/en/products" : "/products"} variant="contact">
                    {SECTION_COPY.ctaFleet[locale]}
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
