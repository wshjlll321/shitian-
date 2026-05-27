"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal.client";
import { pick, type Locale } from "@/lib/i18n";
import { easing } from "@/lib/motion/easing";
import type { HomeTechContent } from "@/types/content";

type TechPillarsProps = {
  content: HomeTechContent;
  locale?: Locale;
};

/**
 * §6 — Engineering pillars. Reads its full content (eyebrow, headline,
 * subhead, 4 pillars and footer) from the admin-editable home singleton.
 */
export function TechPillars({ content, locale = "zh" }: TechPillarsProps) {
  const reduce = useReducedMotion();
  const en = locale === "en";

  return (
    <section
      data-snap
      data-slide-id="tech"
      className="relative flex min-h-screen w-full flex-col overflow-hidden bg-surface-warm text-carbon-black"
      aria-label="技术能力"
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_8%_96%,rgba(198,106,50,0.06),transparent_55%)]"
      />

      <Container
        size="page"
        className="relative z-10 flex flex-1 flex-col justify-center py-28 md:py-32"
      >
        <div>
          <Reveal>
            <div className="flex items-center gap-3">
              <span aria-hidden className="block h-px w-6 bg-aviation-orange" />
              <p className="font-numeric text-[11px] uppercase tracking-[0.3em] text-aviation-orange">
                {pick(content, "eyebrow", locale)}
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-4 max-w-4xl font-display text-[clamp(2.2rem,4.4vw,4.4rem)] font-semibold leading-[1.0] tracking-[-0.015em]">
              {pick(content, "headline", locale)}
              <br />
              <span className="text-metal-gray">{pick(content, "subhead", locale)}</span>
            </h2>
          </Reveal>

          {/* Loop line — 感知 / 决策 / 执行 / 反馈 inline */}
          <Reveal delay={0.1}>
            <ul className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] uppercase tracking-[0.22em]">
              {content.pillars.map((p, i) => (
                <li key={p.id} className="flex items-center gap-3">
                  <span className="text-carbon-black/70">
                    {(en && p.roleEn) || p.role}
                  </span>
                  <span aria-hidden className="font-numeric text-aviation-orange/70">
                    {i === content.pillars.length - 1 ? "↺" : "→"}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-y-10 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-4 lg:gap-x-10">
          {content.pillars.map((p, i) => {
            const name = (en && p.nameEn) || p.name;
            const caption = (en && p.captionEn) || p.caption;
            const points =
              en && p.pointsEn && p.pointsEn.length > 0 ? p.pointsEn : p.points;
            const unit = en ? (p.unitEn ?? p.unit) : p.unit;
            return (
              <motion.article
                key={p.id}
                initial={reduce ? false : { opacity: 0, y: 18 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px" }}
                transition={{ duration: 0.7, ease: easing.out, delay: i * 0.06 }}
                className={`relative flex flex-col gap-7 ${
                  i > 0 ? "lg:border-l lg:border-carbon-black/10 lg:pl-10" : ""
                }`}
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-numeric text-[10px] uppercase tracking-[0.24em] text-aviation-orange">
                    {p.code}
                  </span>
                  <span className="font-numeric text-[10px] uppercase tracking-[0.22em] text-metal-gray">
                    0{i + 1} / 0{content.pillars.length}
                  </span>
                </div>

                <div className="flex flex-col gap-5">
                  <div className="flex items-baseline gap-1.5 font-numeric leading-none">
                    <span className="text-[clamp(2.4rem,4vw,4rem)] font-semibold tracking-[-0.02em] text-carbon-black">
                      {p.metric}
                    </span>
                    <span className="text-sm text-metal-gray md:text-base">{unit}</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <h3 className="font-display text-lg font-semibold leading-tight md:text-xl">
                      {name}
                    </h3>
                    <span className="font-numeric text-[10px] uppercase tracking-[0.22em] text-metal-gray">
                      {p.english}
                    </span>
                  </div>
                  <p className="text-[13px] leading-[1.6] text-carbon-black/64">{caption}</p>
                </div>

                <ul className="grid gap-2 border-t border-carbon-black/10 pt-4 text-[12px] leading-[1.55] text-carbon-black/72">
                  {points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2.5">
                      <span
                        aria-hidden
                        className="mt-[9px] block h-px w-2.5 shrink-0 bg-aviation-orange"
                      />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </motion.article>
            );
          })}
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-carbon-black/12 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl text-xs leading-6 text-carbon-black/55">
            {pick(content, "footerText", locale)}
          </p>
          <Link
            href={locale === "en" ? "/en/technology" : "/technology"}
            className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-carbon-black transition hover:text-aviation-orange"
          >
            {en ? "Deep dive · Full engineering capability" : "Deep dive · 完整技术能力"}
            <span aria-hidden className="font-numeric text-base">→</span>
          </Link>
        </div>
      </Container>
    </section>
  );
}
