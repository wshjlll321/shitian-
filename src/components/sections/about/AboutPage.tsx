import Image from "next/image";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/motion/Reveal.client";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getCompanyProfile, getContactInfo, getMediaAssets } from "@/lib/cms";
import { pick, type Locale } from "@/lib/i18n";

const COPY = {
  kicker: { zh: "About · 关于世天", en: "About" },
  title: { zh: "关于世天", en: "About Shitian" },
  subtitle: { zh: "Company Profile", en: "Company Profile" },

  capabilitiesEyebrow: { zh: "02 — Capabilities", en: "02 — Capabilities" },
  capabilitiesTitle: { zh: "核心能力", en: "Core Capabilities" },
  capabilitiesSub: { zh: "Core Capabilities", en: "Engineering pillars" },

  cultureEyebrow: { zh: "03 — Culture · 工作方式", en: "03 — Culture" },
  cultureTitle: { zh: "经营理念", en: "Operating Principles" },
  cultureSub: { zh: "Operating Principles", en: "How we run" },

  manufacturingEyebrow: { zh: "04 — Manufacturing", en: "04 — Manufacturing" },
  manufacturingTitle: { zh: "制造与交付", en: "Manufacturing & Delivery" },
  manufacturingSub: { zh: "Manufacturing & Delivery", en: "From bench to airframe" },

  credentialsEyebrow: { zh: "05 — Credentials · 资质与技术沉淀", en: "05 — Credentials" },
  credentialsTitle: { zh: "资质与技术沉淀", en: "Certifications & IP" },
  credentialsSub: { zh: "Certifications & IP", en: "Institutional trust signals" },

  fieldReelEyebrow: { zh: "06 — Field reel · 真实任务现场", en: "06 — Field reel" },
  fieldReelTitle: { zh: "作业现场", en: "Field Operations" },
  fieldReelSub: { zh: "Field Operations", en: "Real missions, real cameras" },
  fieldReelNote: {
    zh: "共 81 例作业案例 · 跨农林、应急、海上、智慧场地四类任务方向",
    en: "81 documented operations across agriculture, emergency, maritime and smart-venue missions"
  },
  fieldReelCta: { zh: "查看全部案例", en: "All case studies" },

  trajectoryEyebrow: { zh: "07 — Trajectory · 发展节点", en: "07 — Trajectory" },
  trajectoryTitle: {
    zh: "一条从研发到真实任务的品牌发展线。",
    en: "A trajectory from engineering bench to real missions."
  },
  scrollHint: { zh: "横向滑动 · Scroll", en: "Scroll horizontally" },

  globalEyebrow: { zh: "08 — Global delivery", en: "08 — Global delivery" },
  globalTitleA: { zh: "Made in Qingdao,", en: "Made in Qingdao," },
  globalTitleB: { zh: "delivered worldwide.", en: "delivered worldwide." },

  ctaHeadlineA: { zh: "获取企业资料，", en: "Pick up the company brief," },
  ctaHeadlineB: { zh: "开启合作沟通。", en: "open a partnership conversation." },
  ctaBody: {
    zh: "联系世天航空获取产品资料、企业资质与项目合作沟通。",
    en: "Contact Shitian Aviation for product datasheets, credentials, and project partnership."
  },
  ctaSubmit: { zh: "提交合作沟通", en: "Submit partnership inquiry" },

  beliefPrefix: { zh: "Belief", en: "Belief" },
  phasePrefix: { zh: "Phase", en: "Phase" }
};

const CERT_KIND = [
  { zh: "国家级认定", en: "National" },
  { zh: "授权知识产权", en: "IP portfolio" },
  { zh: "学府联合研发", en: "Academic" }
];

export async function AboutPage({ locale = "zh" }: { locale?: Locale } = {}) {
  const [companyProfile, contactInfo, mediaAssets] = await Promise.all([
    getCompanyProfile(),
    getContactInfo(),
    getMediaAssets()
  ]);
  const milestones = companyProfile.milestones.filter((m) => m.status !== "needs-confirmation");
  const en = locale === "en";

  // Resolve field-reel tiles from the admin-managed media library so each
  // image swap on /admin/about (or /admin/media) takes effect immediately.
  const fieldReelTiles = (companyProfile.fieldReel ?? []).map((tile) => {
    const asset = mediaAssets.find((m) => m.id === tile.mediaId);
    return {
      src: asset?.src ?? "",
      caption: (en && tile.captionEn) || tile.caption,
      year: tile.year,
      span: tile.span === "3" ? "col-span-2 md:col-span-3" : "col-span-2 md:col-span-2",
      aspect: tile.aspect === "portrait" ? "aspect-[4/5]" : "aspect-[16/10]"
    };
  });

  return (
    <>
      <PageHero
        kicker={COPY.kicker[locale]}
        title={pick(companyProfile, "title", locale) || COPY.title[locale]}
        subtitle={COPY.subtitle[locale]}
        lede={pick(companyProfile, "lead", locale)}
      />

      {/* Proof strip */}
      <section className="border-y border-carbon-black/12 bg-surface-warm py-14 md:py-16">
        <Container size="page">
          <dl className="grid grid-cols-2 gap-y-10 sm:gap-x-12 md:grid-cols-4">
            {companyProfile.proof.map((p) => (
              <div key={p.label} className="border-t border-aviation-orange/40 pt-5">
                <dt className="text-[11px] uppercase tracking-[0.18em] text-metal-gray">{p.label}</dt>
                <dd className="mt-3 font-numeric text-[clamp(2rem,3.6vw,3.4rem)] font-semibold leading-none tracking-[-0.01em] text-carbon-black">
                  {p.value}
                  {p.unit ? <span className="ml-1 text-base text-metal-gray">{p.unit}</span> : null}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* Capabilities */}
      <section className="bg-surface-porcelain py-24 md:py-32">
        <Container size="page">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.32fr)_minmax(0,1fr)] lg:items-end">
            <Reveal>
              <p className="font-numeric text-xs uppercase tracking-[0.28em] text-metal-gray">
                {COPY.capabilitiesEyebrow[locale]}
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="font-display text-[clamp(2rem,3.6vw,3.4rem)] font-semibold leading-[1.04] tracking-[-0.01em]">
                {COPY.capabilitiesTitle[locale]}
                <br className="hidden md:block" />
                <span className="text-metal-gray">{COPY.capabilitiesSub[locale]}</span>
              </h2>
            </Reveal>
          </div>

          <ol className="mt-16 divide-y divide-carbon-black/12 border-y border-carbon-black/12">
            {companyProfile.capabilities.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.05} as="li">
                <div className="grid gap-3 py-10 md:grid-cols-[120px_minmax(0,1fr)_minmax(0,1.2fr)] md:gap-12">
                  <span className="font-numeric text-xs uppercase tracking-[0.18em] text-aviation-orange">
                    Cap / 0{i + 1}
                  </span>
                  <h3 className="font-display text-xl font-semibold leading-tight md:text-2xl">
                    {pick(c, "title", locale)}
                  </h3>
                  <p className="text-sm leading-7 text-carbon-black/64 md:text-base md:leading-8">
                    {pick(c, "description", locale)}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      {/* Culture — three-column manifesto on carbon-black. Lives between
          two light sections so the page rhythm gets a deliberate breath;
          the aviation-orange top-rule keeps the columns inside the same
          engineering grammar as the metric strip. */}
      <section className="bg-carbon-black py-24 text-surface-warm md:py-32">
        <Container size="page">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.32fr)_minmax(0,1fr)] lg:items-end">
            <Reveal>
              <p className="font-numeric text-xs uppercase tracking-[0.28em] text-surface-warm/45">
                {COPY.cultureEyebrow[locale]}
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="font-display text-[clamp(2rem,3.6vw,3.4rem)] font-semibold leading-[1.04] tracking-[-0.01em]">
                {COPY.cultureTitle[locale]}
                <br className="hidden md:block" />
                <span className="text-surface-warm/55">{COPY.cultureSub[locale]}</span>
              </h2>
            </Reveal>
          </div>

          <ul className="mt-16 grid gap-x-12 gap-y-14 md:grid-cols-3">
            {companyProfile.culture.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.05} as="li">
                <div className="border-t border-aviation-orange/50 pt-6">
                  <span className="font-numeric text-xs uppercase tracking-[0.22em] text-aviation-orange">
                    {COPY.beliefPrefix[locale]} / 0{i + 1}
                  </span>
                  <h3 className="mt-6 font-display text-2xl font-semibold leading-tight md:text-3xl">
                    {pick(c, "title", locale)}
                  </h3>
                  <p className="mt-5 text-sm leading-7 text-surface-warm/68 md:text-base md:leading-8">
                    {pick(c, "description", locale)}
                  </p>
                </div>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* Manufacturing — short chain */}
      {companyProfile.manufacturing ? (
        <section className="bg-surface-warm py-24 md:py-32">
          <Container size="page">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.32fr)_minmax(0,1fr)] lg:items-end">
              <Reveal>
                <p className="font-numeric text-xs uppercase tracking-[0.28em] text-metal-gray">
                  {COPY.manufacturingEyebrow[locale]}
                </p>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="font-display text-[clamp(2rem,3.6vw,3.4rem)] font-semibold leading-[1.04] tracking-[-0.01em]">
                  {COPY.manufacturingTitle[locale]}
                  <br className="hidden md:block" />
                  <span className="text-metal-gray">{COPY.manufacturingSub[locale]}</span>
                </h2>
              </Reveal>
            </div>

            <ol className="mt-16 grid gap-px overflow-hidden border border-carbon-black/12 bg-carbon-black/10 md:grid-cols-2 lg:grid-cols-4">
              {companyProfile.manufacturing.map((m, i) => (
                <Reveal key={m.title} delay={i * 0.05} as="li">
                  <div className="flex h-full flex-col justify-between gap-8 bg-surface-porcelain p-7 md:p-9">
                    <span className="font-numeric text-xs uppercase tracking-[0.22em] text-aviation-orange">
                      {COPY.phasePrefix[locale]} / 0{i + 1}
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-semibold leading-tight md:text-xl">
                        {pick(m, "title", locale)}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-carbon-black/64">{pick(m, "description", locale)}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ol>
          </Container>
        </section>
      ) : null}

      {/* Credentials — institutional trust signals shown as three card
          categories: national certification, IP portfolio, academic
          partnership. Category eyebrows reframe the content positively
          instead of exposing migration state. */}
      <section className="border-y border-carbon-black/12 bg-surface-porcelain py-20 md:py-24">
        <Container size="page">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.32fr)_minmax(0,1fr)] lg:items-end">
            <Reveal>
              <p className="font-numeric text-xs uppercase tracking-[0.28em] text-metal-gray">
                {COPY.credentialsEyebrow[locale]}
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="font-display text-[clamp(1.8rem,3vw,2.8rem)] font-semibold leading-[1.04] tracking-[-0.01em]">
                {COPY.credentialsTitle[locale]}
                <br className="hidden md:block" />
                <span className="text-metal-gray">{COPY.credentialsSub[locale]}</span>
              </h2>
            </Reveal>
          </div>

          <ul className="mt-14 grid gap-x-8 gap-y-8 md:grid-cols-3">
            {companyProfile.certifications.map((cert, i) => {
              const kind = CERT_KIND[i];
              const kindLabel = kind
                ? en
                  ? kind.en
                  : `${kind.zh} · ${kind.en}`
                : "Credential";
              return (
                <Reveal key={cert.title} delay={i * 0.05} as="li">
                  <article className="flex h-full flex-col gap-6 border border-carbon-black/12 bg-surface-warm p-7 md:p-8">
                    <span className="font-numeric text-[10px] uppercase tracking-[0.22em] text-aviation-orange">
                      {kindLabel}
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-semibold leading-tight md:text-xl">
                        {pick(cert, "title", locale)}
                      </h3>
                      <p className="mt-4 text-sm leading-7 text-carbon-black/64">
                        {pick(cert, "description", locale)}
                      </p>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </ul>
        </Container>
      </section>

      {/* Field reel — six real operational photos from the migrated news
          archive, arranged as an asymmetric 6-card grid. Captions carry
          location · date · equipment so each tile reads as proof rather
          than decoration. Uses next/image for responsive loading. */}
      <section className="bg-surface-warm py-20 md:py-24">
        <Container size="page">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.32fr)_minmax(0,1fr)] lg:items-end">
            <Reveal>
              <p className="font-numeric text-xs uppercase tracking-[0.28em] text-metal-gray">
                {COPY.fieldReelEyebrow[locale]}
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="font-display text-[clamp(1.8rem,3vw,2.8rem)] font-semibold leading-[1.04] tracking-[-0.01em]">
                {COPY.fieldReelTitle[locale]}
                <br className="hidden md:block" />
                <span className="text-metal-gray">{COPY.fieldReelSub[locale]}</span>
              </h2>
            </Reveal>
          </div>

          <ul className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-6 md:gap-4">
            {fieldReelTiles.filter((t) => t.src).map((tile, i) => (
              <Reveal
                key={`${tile.src}-${i}`}
                delay={i * 0.04}
                as="li"
                className={`relative overflow-hidden bg-carbon-black/8 ${tile.span} ${tile.aspect}`}
              >
                <Image
                  src={tile.src}
                  alt={tile.caption}
                  fill
                  sizes="(max-width:768px) 100vw, (max-width:1280px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-precision hover:scale-[1.03]"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-[linear-gradient(180deg,transparent_0%,rgba(15,16,14,0.78)_100%)]"
                />
                <div className="absolute inset-x-0 bottom-0 flex items-baseline justify-between gap-3 p-4 text-surface-warm md:p-5">
                  <span className="text-[12px] leading-snug md:text-[13px]">{tile.caption}</span>
                  <span className="font-numeric text-[10px] uppercase tracking-[0.22em] text-aviation-orange">
                    {tile.year}
                  </span>
                </div>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={0.2}>
            <div className="mt-10 flex items-baseline justify-between gap-6 border-t border-carbon-black/12 pt-6">
              <p className="text-[12px] leading-6 text-metal-gray">
                {COPY.fieldReelNote[locale]}
              </p>
              <Button href={en ? "/en/cases" : "/cases"} variant="contact">
                {COPY.fieldReelCta[locale]}
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Timeline — native horizontal scroll, no pin. Header includes an
          explicit "← 横向滑动 →" affordance so the interaction is obvious
          before the user reaches the rail. Card heights are natural and
          cards align top in the scroll strip, so there's no 100vh empty
          area above them. */}
      <section className="relative bg-carbon-black py-20 text-surface-warm md:py-24">
        <Container size="page">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-10">
            <div className="grid gap-6 md:grid-cols-[minmax(0,0.32fr)_minmax(0,1fr)] md:items-end md:gap-10">
              <Reveal>
                <p className="font-numeric text-xs uppercase tracking-[0.28em] text-surface-warm/45">
                  {COPY.trajectoryEyebrow[locale]}
                </p>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="font-display text-[clamp(1.8rem,3vw,2.8rem)] font-semibold leading-[1.04] tracking-[-0.01em]">
                  {COPY.trajectoryTitle[locale]}
                </h2>
              </Reveal>
            </div>
            <Reveal delay={0.1}>
              <div className="flex items-center gap-3 self-start whitespace-nowrap md:self-end">
                <span aria-hidden className="font-numeric text-aviation-orange">←</span>
                <span className="font-numeric text-[11px] uppercase tracking-[0.24em] text-surface-warm/55">
                  {COPY.scrollHint[locale]}
                </span>
                <span aria-hidden className="font-numeric text-aviation-orange">→</span>
              </div>
            </Reveal>
          </div>
        </Container>

        {/* Hairline track baseline running across the rail at the year's
            visual axis — makes the whole rail read as one continuous line. */}
        <div className="relative mt-12">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-[78px] h-px bg-surface-warm/12 md:top-[88px]"
          />
          <ol
            className="flex snap-x snap-mandatory gap-8 overflow-x-auto px-6 pb-10 md:gap-10 md:px-10 lg:px-20 [scrollbar-color:rgba(245,241,234,0.25)_transparent] [scrollbar-width:thin]"
            style={{ scrollPaddingInlineStart: "1.5rem" }}
          >
            {milestones.map((m, i) => (
              <li
                key={m.year + m.title}
                className="relative w-[78vw] shrink-0 snap-start border-l border-surface-warm/16 pl-6 md:w-[22rem] md:pl-7"
              >
                {/* Year dot anchored to the baseline */}
                <span
                  aria-hidden
                  className="absolute -left-[5px] top-[78px] block h-2.5 w-2.5 rounded-full bg-aviation-orange md:top-[88px]"
                />
                <p className="font-numeric text-[11px] uppercase tracking-[0.26em] text-aviation-orange">
                  {String(i + 1).padStart(2, "0")} / {String(milestones.length).padStart(2, "0")}
                </p>
                <p className="mt-3 font-numeric text-[clamp(2.2rem,3.6vw,3.2rem)] font-semibold leading-none tracking-[-0.02em] text-surface-warm">
                  {m.year}
                </p>
                <h3 className="mt-7 font-display text-base font-semibold leading-tight md:text-lg">
                  {pick(m, "title", locale)}
                </h3>
                <p className="mt-3 text-[13px] leading-7 text-surface-warm/68">
                  {pick(m, "description", locale)}
                </p>
              </li>
            ))}
            <li aria-hidden className="w-12 shrink-0" />
          </ol>
        </div>
      </section>

      {/* Global reach */}
      {companyProfile.global ? (
        <section className="bg-surface-warm py-24 md:py-32">
          <Container size="page">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.32fr)_minmax(0,1fr)] lg:items-end">
              <Reveal>
                <p className="font-numeric text-xs uppercase tracking-[0.28em] text-metal-gray">
                  {COPY.globalEyebrow[locale]}
                </p>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="font-display text-[clamp(2rem,3.6vw,3.4rem)] font-semibold leading-[1.04] tracking-[-0.01em]">
                  {COPY.globalTitleA[locale]}
                  <br className="hidden md:block" />
                  {COPY.globalTitleB[locale]}
                </h2>
              </Reveal>
            </div>

            <ul className="mt-16 grid gap-px overflow-hidden border border-carbon-black/12 bg-carbon-black/10 sm:grid-cols-2">
              {companyProfile.global.map((g, i) => (
                <Reveal key={g.code} delay={i * 0.05} as="li">
                  <article className="flex h-full flex-col justify-between gap-10 bg-surface-porcelain p-7 md:p-9">
                    <div className="flex items-baseline justify-between">
                      <span className="font-numeric text-xs uppercase tracking-[0.22em] text-aviation-orange">
                        {g.code}
                      </span>
                      <span className="font-numeric text-xs text-metal-gray">/ 0{i + 1}</span>
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-semibold leading-tight md:text-2xl">
                        {(en && g.regionEn) || g.region}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-carbon-black/64">
                        {(en && g.descriptionEn) || g.description}
                      </p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      {/* Inquiry CTA */}
      <section className="bg-carbon-black py-24 text-surface-warm md:py-32">
        <Container size="page">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-end">
            <Reveal>
              <h2 className="font-display text-[clamp(2rem,4.4vw,4rem)] font-semibold leading-[1.04] tracking-[-0.01em]">
                {COPY.ctaHeadlineA[locale]}
                <br className="hidden md:block" />
                {COPY.ctaHeadlineB[locale]}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <div>
                <p className="text-sm leading-8 text-surface-warm/65">
                  {COPY.ctaBody[locale]}
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button href={en ? "/en/contact" : "/contact"}>{COPY.ctaSubmit[locale]}</Button>
                  <Button href={`mailto:${contactInfo.email}`} variant="contact">
                    International — {contactInfo.email}
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
