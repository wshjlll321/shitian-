"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Container } from "@/components/ui/Container";
import { altLocaleHref, localeFromPathname, pick, t } from "@/lib/i18n";
import type { ContactInfo, NavItem } from "@/types/content";
import type { SiteProfile } from "@/lib/cms";

const REGIONS = [
  { code: "CN", labelZh: "中国 · 总部", labelEn: "China · Origin" },
  { code: "APAC", labelZh: "亚太", labelEn: "Asia–Pacific" },
  { code: "EMEA", labelZh: "欧洲与中东", labelEn: "EMEA" },
  { code: "AMS", labelZh: "美洲", labelEn: "Americas" }
];

const COPY = {
  mast: {
    zh: ["在青岛设计制造,", "面向全球低空作业。"],
    en: ["Engineered in Qingdao,", "operating worldwide."]
  },
  initiate: { zh: "发起项目", en: "Initiate a project" },
  index: { zh: "网站地图", en: "Index" },
  contact: { zh: "联系我们", en: "Contact" },
  rightsTail: {
    zh: "面向低空作业的航空级工程能力。",
    en: "Aviation-grade engineering for low-altitude operations."
  }
};

type FooterViewProps = {
  contactInfo: ContactInfo;
  footerNavigation: NavItem[];
  siteProfile: SiteProfile;
};

export function FooterView({ contactInfo, footerNavigation, siteProfile }: FooterViewProps) {
  const pathname = usePathname();
  const locale = localeFromPathname(pathname);
  const en = locale === "en";

  const companyName = pick(contactInfo, "companyName", locale);
  const contactPerson = pick(contactInfo, "contactPerson", locale);
  const address = contactInfo.addresses[0];
  const addressValue = address
    ? (en && address.valueEn) || address.value
    : "";

  return (
    <footer className="relative isolate overflow-hidden bg-carbon-black pt-24 text-surface-warm">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[60vh] bg-[radial-gradient(ellipse_at_22%_0%,rgba(198,106,50,0.10),transparent_55%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:linear-gradient(rgba(245,241,234,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(245,241,234,0.6)_1px,transparent_1px)] [background-size:64px_64px]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-10 left-0 right-0 select-none text-center font-display font-semibold leading-none tracking-[-0.04em] text-[clamp(6rem,18vw,18rem)] md:-bottom-16"
        style={{
          WebkitTextStroke: "1px rgba(245,241,234,0.06)",
          color: "transparent"
        }}
      >
        SHITIAN
      </span>

      <Container size="page" className="relative z-10">
        <div className="grid gap-10 border-b border-surface-warm/14 pb-16 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-end">
          <p className="font-display text-[clamp(2.4rem,4.8vw,4.6rem)] font-semibold leading-[1.04] tracking-[-0.015em] display-gradient">
            {COPY.mast[locale][0]}
            <br />
            {COPY.mast[locale][1]}
          </p>
          <div className="grid gap-3">
            <Link
              href={en ? "/en/contact" : "/contact"}
              className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-surface-warm transition hover:text-aviation-orange"
            >
              <span className="h-px w-8 bg-surface-warm/40" />
              {COPY.initiate[locale]}
            </Link>
            <a
              href={`mailto:${contactInfo.email}`}
              className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-surface-warm/72 transition hover:text-aviation-orange"
            >
              <span className="h-px w-8 bg-surface-warm/24" />
              {contactInfo.email}
            </a>
          </div>
        </div>

        <div className="grid gap-y-6 border-b border-surface-warm/14 py-10 sm:grid-cols-4">
          {REGIONS.map((r) => (
            <div key={r.code} className="flex items-baseline gap-3">
              <span className="font-numeric text-[11px] uppercase tracking-[0.22em] text-aviation-orange">
                {r.code}
              </span>
              <span className="text-sm text-surface-warm/68">{en ? r.labelEn : r.labelZh}</span>
            </div>
          ))}
        </div>

        <div className="grid gap-12 py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.6fr)_minmax(0,1fr)]">
          <div>
            <p className="font-numeric text-[11px] uppercase tracking-[0.22em] text-surface-warm/45">
              Shitian Aviation
            </p>
            <p className="mt-6 font-display text-lg font-semibold leading-tight">
              {siteProfile.name}
            </p>
            <p className="mt-4 max-w-md text-sm leading-7 text-surface-warm/65">
              {siteProfile.description}
            </p>
          </div>

          <nav
            className="grid gap-2 text-sm"
            aria-label={en ? "Footer navigation" : "页脚导航"}
          >
            <p className="font-numeric text-[11px] uppercase tracking-[0.22em] text-surface-warm/45">
              {COPY.index[locale]}
            </p>
            <div className="mt-4 grid gap-2.5">
              {footerNavigation.map((item) => {
                const href = en ? altLocaleHref(item.href, "en") : item.href;
                const label = pick(item, "label", locale);
                return (
                  <Link
                    key={item.href}
                    href={href}
                    className="text-surface-warm/72 transition hover:text-aviation-orange"
                  >
                    {label}
                  </Link>
                );
              })}
            </div>
          </nav>

          <address className="not-italic text-sm leading-7 text-surface-warm/68">
            <p className="font-numeric text-[11px] uppercase tracking-[0.22em] text-surface-warm/45">
              {COPY.contact[locale]}
            </p>
            <div className="mt-4 grid gap-1.5">
              <p>{contactPerson} · {contactInfo.phone}</p>
              <p>{contactInfo.telephone}</p>
              <p>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="underline decoration-aviation-orange/40 underline-offset-4 hover:text-aviation-orange"
                >
                  {contactInfo.email}
                </a>
              </p>
              {addressValue ? (
                <p className="mt-3 max-w-xs text-surface-warm/55">{addressValue}</p>
              ) : null}
            </div>
          </address>
        </div>

        <div className="flex flex-col gap-2 border-t border-surface-warm/12 pb-32 pt-8 text-[11px] uppercase tracking-[0.18em] text-surface-warm/40 md:flex-row md:items-center md:justify-between md:pb-40">
          <p>© {new Date().getFullYear()} {companyName}</p>
          <p>{COPY.rightsTail[locale]}</p>
        </div>
      </Container>
    </footer>
  );
}
