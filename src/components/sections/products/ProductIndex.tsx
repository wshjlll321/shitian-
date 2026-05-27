import Image from "next/image";
import Link from "next/link";

import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/motion/Reveal.client";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getMediaAssets, getProducts } from "@/lib/cms";
import { pick, type Locale } from "@/lib/i18n";

type Bi = { zh: string; en: string };
type GroupKey = "heavy-lift" | "electric" | "platform";

const GROUPS: { key: GroupKey; code: string; name: Bi; english: string; intent: Bi; slugs: string[] }[] = [
  {
    key: "heavy-lift",
    code: "G-01",
    name: { zh: "燃油重载平台", en: "Heavy-lift fuel platforms" },
    english: "Heavy-lift fuel platforms",
    intent: {
      zh: "面向重载、远航时、复杂场景的核心作业平台。",
      en: "Core platforms built for heavy payload, long endurance, and complex missions."
    },
    slugs: ["t280", "s270"]
  },
  {
    key: "electric",
    code: "G-02",
    name: { zh: "电动专项作业", en: "Electric specialised platforms" },
    english: "Electric specialised platforms",
    intent: {
      zh: "面向巡查、电动植保和小面积高频任务的轻型装备。",
      en: "Light platforms for patrol, electric agricultural protection, and small high-frequency missions."
    },
    slugs: ["h15", "h60"]
  },
  {
    key: "platform",
    code: "G-03",
    name: { zh: "数字化中枢", en: "Digital operations hub" },
    english: "Digital operations platform",
    intent: {
      zh: "把感知、分析、决策、执行、反馈连成一条作业闭环。",
      en: "Stitches sensing, analysis, decision, execution, and feedback into a closed operations loop."
    },
    slugs: ["hizone"]
  }
];

const DECISIONS: { hint: Bi; need: Bi; pick: string; slug: string }[] = [
  {
    hint: { zh: "大面积棉田 / 山地吊运 / 海上投送", en: "Large cotton fields · mountain lifts · maritime delivery" },
    need: { zh: "100kg+ 任务载荷，2h+ 航时", en: "100 kg+ payload, 2 h+ endurance" },
    pick: "T280",
    slug: "t280"
  },
  {
    hint: { zh: "果园授粉 / 防霜 / 林业防护", en: "Orchard pollination · frost defence · forestry" },
    need: { zh: "长航时燃油作业，100km 控制半径", en: "Long-endurance fuel ops, 100 km radius" },
    pick: "S270",
    slug: "s270"
  },
  {
    hint: { zh: "山林巡查 / 应急前置 / 复杂环境", en: "Forest patrol · forward emergency · harsh environments" },
    need: { zh: "单人部署，低温运行", en: "Single-operator deploy, cold-weather capable" },
    pick: "H15",
    slug: "h15"
  },
  {
    hint: { zh: "小面积高频植保 / 喷洒播撒", en: "High-frequency small-area protection · spray & spread" },
    need: { zh: "20 公顷/小时电动植保", en: "20 ha/hour electric coverage" },
    pick: "H60",
    slug: "h60"
  },
  {
    hint: { zh: "智慧农业 / 智慧场地 / 高尔夫", en: "Smart farming · smart venues · golf" },
    need: { zh: "AI 处方图 + 任务闭环", en: "AI prescription maps + closed-loop ops" },
    pick: "HIZONE",
    slug: "hizone"
  }
];

const COPY = {
  pageKicker: { zh: "Products · 产品矩阵", en: "Products · Fleet" },
  pageTitle: { zh: "产品矩阵", en: "Heavy-lift portfolio" },
  pageSubtitle: { zh: "Heavy-Lift UAV Portfolio", en: "Heavy-Lift UAV Portfolio" },
  pageLede: {
    zh: "围绕燃油重载、电动专项与数字化中枢三条产品线，世天航空为大田植保、果园授粉、林业防护、应急吊运、海上物流与精细化场地作业，提供一支可被调度的整机队伍。",
    en: "Three product lines — heavy-fuel platforms, electric specialists, and a digital operations hub — together form a dispatchable fleet for cotton-field protection, orchard pollination, forestry defence, emergency lifts, maritime delivery, and precision site work."
  },
  decisionEyebrow: { zh: "How to choose · 怎么选", en: "How to choose" },
  decisionNote: { zh: "依任务场景与作业指标，定位合适机型", en: "Pick by scenario and operational target" },
  matrixEyebrow: { zh: "Capability matrix · 能力对比", en: "Capability matrix" },
  matrixHeadline: {
    zh: "四项关键指标，一屏看完整支机队。",
    en: "Four metrics, the whole fleet at a glance."
  },
  thModel: { zh: "Model · 机型", en: "Model" },
  thPayload: { zh: "载荷", en: "Payload" },
  thDuration: { zh: "航时 / 续航", en: "Endurance" },
  thRange: { zh: "半径 / 范围", en: "Radius" },
  thKey: { zh: "关键指标", en: "Key metric" },
  flagshipBadge: { zh: "Flagship", en: "Flagship" },
  fallbackCta: { zh: "查看产品详情", en: "View product detail" },
  closingTitleA: { zh: "说明你的任务，", en: "Describe the mission," },
  closingTitleB: { zh: "我们交付合适的机型。", en: "we'll match the platform." },
  closingBody: {
    zh: "请提交作业区域、面积、载荷、半径与时间窗口，销售工程师将在两个工作日内回复机型建议、配置组合与作业实施路径。",
    en: "Share your operating area, payload, radius, and time window. A sales engineer will respond within two business days with platform recommendations, configurations, and an execution plan."
  },
  submit: { zh: "提交项目需求", en: "Submit inquiry" },
  viewScenarios: { zh: "查看作业场景", en: "See operating scenarios" }
};

export async function ProductIndex({ locale = "zh" }: { locale?: Locale } = {}) {
  const [products, mediaAssets] = await Promise.all([getProducts(), getMediaAssets()]);
  const en = locale === "en";
  const productHref = (slug: string) => (en ? `/en/products/${slug}` : `/products/${slug}`);

  return (
    <>
      <PageHero
        kicker={COPY.pageKicker[locale]}
        title={COPY.pageTitle[locale]}
        subtitle={COPY.pageSubtitle[locale]}
        lede={COPY.pageLede[locale]}
      />

      {/* Decision strip — "how to choose" row, points scanning visitors at
          the right product without forcing them to read every detail block. */}
      <section className="border-y border-carbon-black/12 bg-surface-warm py-16 md:py-20">
        <Container size="page">
          <div className="flex items-baseline justify-between gap-6 pb-7">
            <Reveal>
              <p className="font-numeric text-[11px] uppercase tracking-[0.28em] text-aviation-orange">
                {COPY.decisionEyebrow[locale]}
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="hidden text-xs uppercase tracking-[0.22em] text-metal-gray md:block">
                {COPY.decisionNote[locale]}
              </p>
            </Reveal>
          </div>
          <ol className="grid gap-px border border-carbon-black/12 bg-carbon-black/10 sm:grid-cols-2 lg:grid-cols-5">
            {DECISIONS.map((d, i) => (
              <Reveal key={d.slug} delay={i * 0.04} as="li">
                <Link
                  href={productHref(d.slug)}
                  className="group flex h-full flex-col justify-between gap-5 bg-surface-warm p-5 transition hover:bg-surface-porcelain md:p-6"
                >
                  <div>
                    <p className="font-numeric text-[10px] uppercase tracking-[0.24em] text-aviation-orange">
                      0{i + 1}
                    </p>
                    <p className="mt-3 text-[13px] leading-[1.55] text-carbon-black/72">{d.hint[locale]}</p>
                    <p className="mt-2 text-[12px] leading-[1.55] text-metal-gray">{d.need[locale]}</p>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="font-display text-lg font-semibold leading-none">{d.pick}</span>
                    <span
                      aria-hidden
                      className="font-numeric text-sm text-carbon-black/30 transition-all duration-300 group-hover:translate-x-1 group-hover:text-aviation-orange"
                    >
                      →
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      {/* Comparison matrix — every product, four metrics aligned in a single
          scan-friendly table. The chrome stays editorial: no zebra stripes,
          just hairline rules and a single orange tag for the flagship row. */}
      <section className="bg-surface-porcelain py-20 md:py-28">
        <Container size="page">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.32fr)_minmax(0,1fr)] lg:items-end">
            <Reveal>
              <p className="font-numeric text-[11px] uppercase tracking-[0.28em] text-metal-gray">
                {COPY.matrixEyebrow[locale]}
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="font-display text-[clamp(1.8rem,3.2vw,3rem)] font-semibold leading-[1.08] tracking-[-0.01em]">
                {COPY.matrixHeadline[locale]}
              </h2>
            </Reveal>
          </div>

          {/* Header row + data rows — uses CSS grid so columns stay aligned
              across products even when key metric labels differ slightly. */}
          <div className="mt-12 overflow-x-auto">
            <div className="min-w-[760px] border-t-2 border-carbon-black/20">
              <div className="grid grid-cols-[minmax(0,1.4fr)_repeat(4,minmax(0,1fr))] gap-x-6 border-b border-carbon-black/12 py-5 text-[11px] uppercase tracking-[0.2em] text-metal-gray">
                <span className="flex items-center gap-2">
                  <span aria-hidden className="block h-px w-4 bg-aviation-orange" />
                  {COPY.thModel[locale]}
                </span>
                <span>{COPY.thPayload[locale]}</span>
                <span>{COPY.thDuration[locale]}</span>
                <span>{COPY.thRange[locale]}</span>
                <span>{COPY.thKey[locale]}</span>
              </div>
              {products.map((p) => {
                const m = p.keyMetrics;
                const payload = m.find((x) => x.label.includes("载荷")) ?? m[0];
                const duration =
                  m.find((x) => x.label.includes("航时") || x.label.includes("续航")) ?? m[1];
                const range =
                  m.find((x) => x.label.includes("半径") || x.label.includes("范围")) ?? m[2];
                // Pick a 4th distinct metric — fall back to undefined when the
                // product only carries three, so the column stays blank instead
                // of duplicating an already-shown cell (HIZONE only has 3).
                const used = new Set([payload, duration, range].filter(Boolean));
                const fourth = m.find((x) => !used.has(x));
                const isFlagship = p.priority === "P0" && p.slug === "t280";
                return (
                  <Reveal key={p.slug} as="div" margin="0px">
                    <Link
                      href={productHref(p.slug)}
                      className={`group relative grid grid-cols-[minmax(0,1.4fr)_repeat(4,minmax(0,1fr))] items-baseline gap-x-6 border-b border-carbon-black/8 py-6 transition hover:bg-surface-warm md:py-7 ${
                        isFlagship ? "bg-aviation-orange/[0.04]" : ""
                      }`}
                    >
                      {/* Left rail accent — orange tick on flagship row,
                          appears on hover for the rest. */}
                      <span
                        aria-hidden
                        className={`pointer-events-none absolute left-0 top-0 block h-full w-0.5 transition ${
                          isFlagship ? "bg-aviation-orange" : "bg-transparent group-hover:bg-aviation-orange/40"
                        }`}
                      />
                      <span>
                        <span className="flex items-baseline gap-3">
                          <span className="font-display text-xl font-semibold leading-none md:text-2xl">
                            {p.model}
                          </span>
                          {isFlagship ? (
                            <span className="bg-aviation-orange px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.22em] text-surface-warm">
                              {COPY.flagshipBadge[locale]}
                            </span>
                          ) : null}
                        </span>
                        <span className="mt-2 block text-[12px] leading-snug text-metal-gray">
                          {pick(p, "strategicRole", locale)}
                        </span>
                      </span>
                      {[payload, duration, range, fourth].map((cell, i) => (
                        <span key={`${p.slug}-${i}`} className="block">
                          <span className="block text-[10px] uppercase tracking-[0.2em] text-metal-gray">
                            {cell?.label ?? "—"}
                          </span>
                          <span className="mt-2 block font-numeric font-semibold leading-none tracking-[-0.01em] text-carbon-black">
                            <span className="text-lg md:text-xl">{cell?.value ?? "—"}</span>
                            {cell?.unit ? (
                              <span className="ml-1 text-[11px] text-metal-gray">{cell.unit}</span>
                            ) : null}
                          </span>
                        </span>
                      ))}
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      {/* Editorial groups — products organised by task role, each group a
          short kicker + the product rows that belong to it. Restores the
          "matrix" frame while still letting each product carry its full
          image / copy / capabilities. */}
      <section className="bg-surface-warm py-24 md:py-32">
        <Container size="page">
          {GROUPS.map((group, gi) => {
            const groupProducts = products.filter((p) => group.slugs.includes(p.slug));
            return (
              <div key={group.key} className={gi === 0 ? "" : "mt-24 md:mt-28"}>
                <Reveal>
                  <div className="flex flex-col gap-3 border-b border-carbon-black/12 pb-6 md:flex-row md:items-baseline md:justify-between md:gap-10">
                    <div className="flex items-baseline gap-4">
                      <span className="font-numeric text-[11px] uppercase tracking-[0.24em] text-aviation-orange">
                        {group.code}
                      </span>
                      <h2 className="font-display text-2xl font-semibold leading-tight md:text-3xl">
                        {group.name[locale]}
                        <span className="ml-3 font-numeric text-[10px] uppercase tracking-[0.22em] text-metal-gray">
                          {group.english}
                        </span>
                      </h2>
                    </div>
                    <p className="max-w-md text-[13px] leading-7 text-carbon-black/64">
                      {group.intent[locale]}
                    </p>
                  </div>
                </Reveal>

                <ol className="divide-y divide-carbon-black/10">
                  {groupProducts.map((product, i) => {
                    const hero = product.media[0]
                      ? mediaAssets.find((m) => m.id === product.media[0])
                      : undefined;
                    const absoluteIndex = products.findIndex((p) => p.slug === product.slug);
                    return (
                      <Reveal key={product.slug} as="li" delay={i * 0.05} margin="0px">
                        <Link
                          href={productHref(product.slug)}
                          className="group grid gap-8 py-12 md:grid-cols-[110px_minmax(0,1fr)_minmax(0,1.1fr)] md:items-center md:py-14"
                        >
                          <p className="font-numeric text-sm uppercase tracking-[0.18em] text-aviation-orange md:text-base">
                            {String(absoluteIndex + 1).padStart(2, "0")} /
                            <br className="hidden md:block" /> {product.model}
                          </p>

                          <div>
                            <h3 className="font-display text-2xl font-semibold leading-tight md:text-4xl">
                              {pick(product, "displayName", locale)}
                            </h3>
                            <p className="mt-3 max-w-md text-sm leading-7 text-carbon-black/64 md:text-base md:leading-8">
                              {pick(product, "positioning", locale)}
                            </p>
                            <ul className="mt-5 grid grid-cols-2 gap-x-5 gap-y-1.5 text-[12.5px] leading-relaxed text-carbon-black/68">
                              {(pick(product, "keyCapabilities", locale) as string[]).slice(0, 4).map((c) => (
                                <li key={c} className="flex items-start gap-2">
                                  <span aria-hidden className="mt-[8px] block h-px w-2 shrink-0 bg-aviation-orange" />
                                  <span>{c}</span>
                                </li>
                              ))}
                            </ul>
                            <span className="mt-6 inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-carbon-black/72 transition group-hover:text-aviation-orange">
                              {pick(product, "ctaContext", locale) || COPY.fallbackCta[locale]}
                              <span aria-hidden className="font-numeric text-base transition-transform duration-300 group-hover:translate-x-1">→</span>
                            </span>
                          </div>

                          <div className="relative aspect-[16/10] overflow-hidden bg-carbon-black/4">
                            {hero ? (
                              <Image
                                src={hero.src}
                                alt={hero.alt}
                                fill
                                sizes="(max-width:768px) 100vw, 40vw"
                                className="object-cover transition-transform duration-700 ease-precision group-hover:scale-[1.03]"
                              />
                            ) : null}
                            {/* Top-edge readout — first 2 keyMetrics, glued to
                                the photo so each row gets at-a-glance numbers
                                without breaking the rhythm of the list. */}
                            <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 bg-[linear-gradient(180deg,rgba(15,16,14,0.7)_0%,rgba(15,16,14,0.15)_60%,transparent_100%)] px-4 pt-3 pb-8 text-surface-warm">
                              {product.keyMetrics.slice(0, 2).map((m) => (
                                <div key={m.label}>
                                  <p className="text-[9px] uppercase tracking-[0.22em] text-surface-warm/55">
                                    {m.label}
                                  </p>
                                  <p className="mt-1 flex items-baseline gap-1 font-numeric leading-none">
                                    <span className="text-sm font-semibold tracking-[-0.01em] md:text-base">
                                      {m.value}
                                    </span>
                                    {m.unit ? <span className="text-[10px] text-surface-warm/55">{m.unit}</span> : null}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </Link>
                      </Reveal>
                    );
                  })}
                </ol>
              </div>
            );
          })}
        </Container>
      </section>

      {/* Closing CTA — turns the dead end after the last row into a clear
          next step, with two buttons sized to match the rest of the site. */}
      <section className="bg-carbon-black py-24 text-surface-warm md:py-28">
        <Container size="page">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-end">
            <Reveal>
              <h2 className="font-display text-[clamp(2rem,4.4vw,4rem)] font-semibold leading-[1.04] tracking-[-0.01em]">
                {COPY.closingTitleA[locale]}
                <br className="hidden md:block" />
                {COPY.closingTitleB[locale]}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <div>
                <p className="max-w-md text-sm leading-8 text-surface-warm/65">
                  {COPY.closingBody[locale]}
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button href={en ? "/en/contact" : "/contact"}>{COPY.submit[locale]}</Button>
                  <Button href={en ? "/en/scenarios" : "/scenarios"} variant="contact">
                    {COPY.viewScenarios[locale]}
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
