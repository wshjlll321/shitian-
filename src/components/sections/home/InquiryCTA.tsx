import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal.client";
import { pick, t, type Locale } from "@/lib/i18n";
import { getContactInfo } from "@/lib/cms";
import type { HomeInquiryContent } from "@/types/content";

const STATIC = {
  internationalPrefix: { zh: "International · ", en: "International · " },
  directLine: { zh: "Direct Line · 直接联络", en: "Direct Line" },
  hours: {
    zh: "工作日 09:00–18:00 受理项目咨询。海外业务请优先发送邮件，附作业目标、面积与时间窗口。",
    en: "Business hours 09:00–18:00. International inquiries: please email with mission objective, area, and window."
  },
  sales: { zh: "Sales · 业务对接", en: "Sales" },
  office: { zh: "Office · 公司座机", en: "Office" },
  email: { zh: "Email · 邮件", en: "Email" },
  address: { zh: "Address · 公司地址", en: "Address" }
};

/**
 * Final outro. Marked as a snap target with `scroll-snap-stop: normal` so the
 * engine recognises it as a destination from Journey but allows the user to
 * scroll past into the Footer. HomeSnapEffect also disables snap entirely
 * once Contact is mostly in view, so the closing block + Footer become a
 * free-scrolling read. Layout is a two-column spread — outro copy on the
 * left, a contact readout on the right — so the right half of the slide
 * carries weight instead of going empty.
 */
type InquiryCTAProps = { content: HomeInquiryContent; locale?: Locale };

export async function InquiryCTA({ content, locale = "zh" }: InquiryCTAProps) {
  const contactInfo = await getContactInfo();
  const primaryAddress = contactInfo.addresses[0];
  const addressValue = primaryAddress
    ? (locale === "en" && primaryAddress.valueEn) || primaryAddress.value
    : undefined;
  const companyName = pick(contactInfo, "companyName", locale);
  const contactPerson = pick(contactInfo, "contactPerson", locale);
  const submitLabel = t("cta.submitInquiry", locale);

  return (
    <section
      data-snap
      data-slide-id="contact"
      style={{ scrollSnapStop: "normal" }}
      className="relative overflow-hidden bg-surface-warm pt-28 pb-20 text-carbon-black md:pt-32 md:pb-24"
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_18%_82%,rgba(198,106,50,0.10),transparent_55%)]"
      />

      {/* Quiet engineering grid texture — keeps light sections in rhythm */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(17,17,17,1)_1px,transparent_1px),linear-gradient(90deg,rgba(17,17,17,1)_1px,transparent_1px)] [background-size:64px_64px]"
      />

      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-10 -right-4 select-none font-numeric font-semibold leading-none tracking-[-0.04em] text-[clamp(8rem,16vw,18rem)] md:-bottom-14 md:-right-8"
        style={{
          WebkitTextStroke: "1px rgba(17,17,17,0.07)",
          color: "transparent"
        }}
      >
        08
      </span>

      <Container size="page" className="relative z-10">
        <Reveal>
          <div className="flex items-center gap-3">
            <span aria-hidden className="block h-px w-6 bg-aviation-orange" />
            <p className="font-numeric text-[11px] uppercase tracking-[0.3em] text-aviation-orange">
              {pick(content, "eyebrow", locale)}
            </p>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
          {/* Left — outro statement + primary CTAs */}
          <div>
            <Reveal delay={0.05}>
              <h2 className="max-w-3xl font-display text-[clamp(2.4rem,5.4vw,5.4rem)] font-semibold leading-[0.98] tracking-[-0.015em]">
                {pick(content, "headlineTop", locale)}
                <br className="hidden md:block" />
                <span className="text-metal-gray">{pick(content, "headlineSub", locale)}</span>
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-7 max-w-xl text-base leading-8 text-carbon-black/64 md:text-lg md:leading-9">
                {pick(content, "body", locale)}
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Button
                  href={locale === "en" ? "/en/contact" : "/contact"}
                  className="group min-h-[3.25rem] px-7 text-[15px]"
                >
                  <span>{submitLabel}</span>
                  <span aria-hidden className="font-numeric text-lg transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Button>
                <Button href={`mailto:${contactInfo.email}`} variant="secondary" className="min-h-[3.25rem] px-7 text-[15px]">
                  {STATIC.internationalPrefix[locale]}{contactInfo.email}
                </Button>
              </div>
            </Reveal>
            <Reveal delay={0.28}>
              <p className="mt-6 text-[11px] uppercase tracking-[0.22em] text-metal-gray">
                {pick(content, "response", locale)}
              </p>
            </Reveal>
          </div>

          {/* Right — contact readout card. No background fill, just a
              hairline frame so it reads as part of the warm-paper layout. */}
          <Reveal delay={0.18}>
            <aside
              aria-label="联系方式"
              className="spec-card relative grid h-full content-start gap-7 p-7 md:p-9"
            >
              {/* Corner brackets — read as a technical readout frame */}
              <span aria-hidden className="pointer-events-none absolute left-2 top-2 h-2 w-2 border-l border-t border-aviation-orange/50" />
              <span aria-hidden className="pointer-events-none absolute right-2 top-2 h-2 w-2 border-r border-t border-aviation-orange/50" />
              <span aria-hidden className="pointer-events-none absolute bottom-2 left-2 h-2 w-2 border-b border-l border-aviation-orange/50" />
              <span aria-hidden className="pointer-events-none absolute bottom-2 right-2 h-2 w-2 border-b border-r border-aviation-orange/50" />

              <header>
                <p className="font-numeric text-[10px] uppercase tracking-[0.28em] text-aviation-orange">
                  {STATIC.directLine[locale]}
                </p>
                <p className="mt-2 font-display text-lg font-semibold leading-tight md:text-xl">
                  {companyName}
                </p>
              </header>

              <p className="text-sm leading-7 text-carbon-black/64">
                {STATIC.hours[locale]}
              </p>

              <dl className="grid gap-5">
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.22em] text-metal-gray">
                    {STATIC.sales[locale]}
                  </dt>
                  <dd className="mt-1.5 font-numeric text-base text-carbon-black md:text-lg">
                    {contactPerson} · {contactInfo.phone}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.22em] text-metal-gray">
                    {STATIC.office[locale]}
                  </dt>
                  <dd className="mt-1.5 font-numeric text-base text-carbon-black md:text-lg">
                    {contactInfo.telephone}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.22em] text-metal-gray">
                    {STATIC.email[locale]}
                  </dt>
                  <dd className="mt-1.5">
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="font-numeric text-base text-carbon-black transition-colors hover:text-aviation-orange md:text-lg"
                    >
                      {contactInfo.email}
                    </a>
                  </dd>
                </div>
                {addressValue ? (
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.22em] text-metal-gray">
                      {STATIC.address[locale]}
                    </dt>
                    <dd className="mt-1.5 text-sm leading-[1.7] text-carbon-black/72">
                      {addressValue}
                    </dd>
                  </div>
                ) : null}
              </dl>
            </aside>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
