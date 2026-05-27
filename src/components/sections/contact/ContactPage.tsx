import { InquiryForm } from "@/components/sections/contact/InquiryForm.client";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/motion/Reveal.client";
import { Container } from "@/components/ui/Container";
import { getCaseStudies, getContactInfo, getProducts, getScenarios } from "@/lib/cms";
import { pick, type Locale } from "@/lib/i18n";

const PAGE_COPY = {
  kicker: { zh: "Contact · 联系我们", en: "Contact" },
  title: { zh: "联系我们", en: "Contact & Sales" },
  subtitle: { zh: "Contact & Sales", en: "Talk to a sales engineer" },
  lede: {
    zh: "国内与海外项目均由销售工程师统一对接。提交需求时，请尽量说明作业目标、面积、作业半径、时间窗口与关键约束——我们将在两个工作日内回复机型选型与配置方案。",
    en: "Domestic and international projects are handled by the sales engineering team. Please share mission objective, area, radius, time window, and key constraints — we respond within two business days with platform selection and configuration."
  }
};

const PROCESS = [
  {
    code: "P-01",
    title: { zh: "需求确认", en: "Brief Review" },
    english: "Brief Review",
    body: {
      zh: "销售工程师在两个工作日内回复，核对作业目标、面积、载荷规格、作业半径与执行时间窗口。",
      en: "A sales engineer responds within two business days to confirm mission objective, area, payload spec, radius, and execution window."
    }
  },
  {
    code: "P-02",
    title: { zh: "机型与方案建议", en: "Platform Proposal" },
    english: "Platform Proposal",
    body: {
      zh: "依据需求规格，输出 T280 / S270 / H 系列与 HIZONE 数字化平台的机型组合、配置参数与作业组织建议。",
      en: "Based on the brief, we issue a platform mix (T280 / S270 / H-series + HIZONE), configuration parameters, and operational organisation guidance."
    }
  },
  {
    code: "P-03",
    title: { zh: "项目对接", en: "Project Handover" },
    english: "Project Handover",
    body: {
      zh: "进入项目执行阶段，安排现场踏勘、试飞验证、商务报价、机组培训与作业团队部署。",
      en: "Project execution begins — site survey, test flights, commercial offer, crew training, and operations team deployment."
    }
  }
];

const SIDEBAR_COPY = {
  direct: { zh: "Direct contact · 直接联系", en: "Direct contact" },
  sales: { zh: "Sales contact · 商务对接", en: "Sales contact" },
  email: { zh: "Email · 邮件", en: "Email" },
  hq: { zh: "Headquarters · 总部", en: "Headquarters" },
  coverage: { zh: "Coverage · 服务区域", en: "Coverage" },
  coverageNote: {
    zh: "Sales inquiries answered in 中文 / English.",
    en: "Sales inquiries answered in 中文 / English."
  },
  social: { zh: "Social · 自媒体", en: "Social" }
};

const PROCESS_COPY = {
  eyebrow: { zh: "02 — Process · 接洽流程", en: "02 — Process" },
  note: {
    zh: "项目从需求确认到方案对接，全流程由销售工程师统筹，按工程化方式组织。",
    en: "From initial brief to project handover, the entire flow is owned by sales engineers and organised in an aviation-engineering rhythm."
  },
  response: {
    zh: "Response · 我们承诺在两个工作日内回复每一份具体需求。",
    en: "Response · every concrete brief receives a reply within two business days."
  }
};

export async function ContactPageView({ locale = "zh" }: { locale?: Locale } = {}) {
  const [contactInfo, products, scenarios, caseStudies] = await Promise.all([
    getContactInfo(),
    getProducts(),
    getScenarios(),
    getCaseStudies()
  ]);
  const en = locale === "en";
  const companyName = pick(contactInfo, "companyName", locale);
  const contactPerson = pick(contactInfo, "contactPerson", locale);

  return (
    <>
      <PageHero
        kicker={PAGE_COPY.kicker[locale]}
        title={PAGE_COPY.title[locale]}
        subtitle={PAGE_COPY.subtitle[locale]}
        lede={PAGE_COPY.lede[locale]}
      />

      <section className="bg-surface-warm py-20 md:py-28">
        <Container size="page">
          <div className="grid gap-14 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,1fr)]">
            {/* Sidebar — contact methods */}
            <aside className="lg:sticky lg:top-32 lg:self-start">
              <Reveal>
                <p className="font-numeric text-xs uppercase tracking-[0.28em] text-metal-gray">
                  {SIDEBAR_COPY.direct[locale]}
                </p>
              </Reveal>
              <Reveal delay={0.05}>
                <p className="mt-6 font-display text-2xl font-semibold leading-tight md:text-3xl">
                  {companyName}
                </p>
              </Reveal>

              <dl className="mt-10 grid gap-7 text-sm leading-7 text-carbon-black/72">
                <div className="border-t border-carbon-black/12 pt-4">
                  <dt className="text-[11px] uppercase tracking-[0.18em] text-metal-gray">
                    {SIDEBAR_COPY.sales[locale]}
                  </dt>
                  <dd className="mt-2">
                    {contactPerson} · {contactInfo.phone}
                    <br />
                    {contactInfo.telephone}
                  </dd>
                </div>
                <div className="border-t border-carbon-black/12 pt-4">
                  <dt className="text-[11px] uppercase tracking-[0.18em] text-metal-gray">
                    {SIDEBAR_COPY.email[locale]}
                  </dt>
                  <dd className="mt-2">
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="underline decoration-aviation-orange/40 underline-offset-4 transition hover:text-aviation-orange"
                    >
                      {contactInfo.email}
                    </a>
                  </dd>
                </div>
                <div className="border-t border-carbon-black/12 pt-4">
                  <dt className="text-[11px] uppercase tracking-[0.18em] text-metal-gray">
                    {SIDEBAR_COPY.hq[locale]}
                  </dt>
                  <dd className="mt-2">
                    {contactInfo.addresses.map((address) => (
                      <p key={address.value}>
                        {(en && address.valueEn) || address.value}
                      </p>
                    ))}
                  </dd>
                </div>
                <div className="border-t border-carbon-black/12 pt-4">
                  <dt className="text-[11px] uppercase tracking-[0.18em] text-metal-gray">
                    {SIDEBAR_COPY.coverage[locale]}
                  </dt>
                  <dd className="mt-2 text-carbon-black/72">
                    China · APAC · EMEA · Americas
                    <br />
                    <span className="text-[12px] text-metal-gray">
                      {SIDEBAR_COPY.coverageNote[locale]}
                    </span>
                  </dd>
                </div>
                <div className="border-t border-carbon-black/12 pt-4">
                  <dt className="text-[11px] uppercase tracking-[0.18em] text-metal-gray">
                    {SIDEBAR_COPY.social[locale]}
                  </dt>
                  <dd className="mt-2 text-carbon-black/56">
                    {contactInfo.social
                      .map((s) => (en && s.nameEn) || s.name)
                      .join(" · ")}
                  </dd>
                </div>
              </dl>
            </aside>

            {/* Form */}
            <Reveal delay={0.08}>
              <div className="border border-carbon-black/12 bg-surface-porcelain p-7 md:p-12">
                <InquiryForm
                  products={products}
                  scenarios={scenarios}
                  caseStudies={caseStudies}
                  locale={locale}
                />
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Process strip — clarifies what happens after the form is sent. The
          old page ended on the form with no commitment about response time,
          which made the CTA feel cold. */}
      <section className="border-t border-carbon-black/12 bg-surface-porcelain py-20 md:py-24">
        <Container size="page">
          <div className="flex flex-col gap-3 border-b border-carbon-black/12 pb-6 md:flex-row md:items-baseline md:justify-between md:gap-10">
            <Reveal>
              <p className="font-numeric text-[11px] uppercase tracking-[0.28em] text-aviation-orange">
                {PROCESS_COPY.eyebrow[locale]}
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="max-w-md text-[13px] leading-7 text-carbon-black/64">
                {PROCESS_COPY.note[locale]}
              </p>
            </Reveal>
          </div>
          <ol className="mt-10 grid gap-px overflow-hidden border border-carbon-black/12 bg-carbon-black/10 md:grid-cols-3">
            {PROCESS.map((step, i) => (
              <Reveal key={step.code} delay={i * 0.05} as="li" margin="0px">
                <div className="flex h-full flex-col justify-between gap-8 bg-surface-warm p-7 md:p-9">
                  <div className="flex items-baseline justify-between">
                    <span className="font-numeric text-[10px] uppercase tracking-[0.24em] text-aviation-orange">
                      {step.code}
                    </span>
                    <span aria-hidden className="font-numeric text-base text-aviation-orange/70">
                      {i === PROCESS.length - 1 ? "✓" : "→"}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold leading-tight md:text-xl">
                      {step.title[locale]}
                      <span className="ml-2 font-numeric text-[10px] uppercase tracking-[0.22em] text-metal-gray">
                        {step.english}
                      </span>
                    </h3>
                    <p className="mt-3 text-[13px] leading-[1.65] text-carbon-black/64">
                      {step.body[locale]}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
          <p className="mt-8 text-[11px] uppercase tracking-[0.22em] text-metal-gray">
            {PROCESS_COPY.response[locale]}
          </p>
        </Container>
      </section>
    </>
  );
}
