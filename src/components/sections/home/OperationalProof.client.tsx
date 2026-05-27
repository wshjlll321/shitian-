"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { CountUp } from "@/components/motion/CountUp.client";
import { Container } from "@/components/ui/Container";
import { useMotionPrefs } from "@/components/providers/MotionPrefsProvider.client";
import { pick, type Locale } from "@/lib/i18n";
import { easing } from "@/lib/motion/easing";
import type { HomeOperationalProofContent, MediaAsset } from "@/types/content";

/**
 * Operational proof — a single dark chapter that combines the cinematic
 * full-bleed photo with the four big numbers. All copy and metrics come
 * from the home-content singleton so admins can update annual totals,
 * site lists, and headlines without touching code.
 */
type OperationalProofProps = {
  media?: MediaAsset;
  content: HomeOperationalProofContent;
  locale?: Locale;
};

export function OperationalProof({
  media,
  content,
  locale = "zh"
}: OperationalProofProps) {
  const en = locale === "en";
  const reduce = useReducedMotion();
  const { isMobile } = useMotionPrefs();
  const enableKenBurns = !reduce && !isMobile;

  return (
    <section
      data-snap
      data-slide-id="proof"
      className="relative isolate flex min-h-screen w-full flex-col overflow-hidden bg-carbon-black text-surface-warm"
    >
      {/* Photo backdrop with slow Ken Burns */}
      <motion.div
        aria-hidden
        className="absolute inset-0"
        initial={enableKenBurns ? { scale: 1.03 } : false}
        whileInView={enableKenBurns ? { scale: 1.12 } : undefined}
        viewport={{ once: false, margin: "-20% 0px" }}
        transition={{ duration: 18, ease: "linear" }}
      >
        {media ? (
          <Image src={media.src} alt={media.alt} fill sizes="100vw" className="object-cover" />
        ) : null}
      </motion.div>

      {/* Overlay for legibility — darker on left for headline, lighter on right for image */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,16,14,0.82)_0%,rgba(15,16,14,0.58)_40%,rgba(15,16,14,0.2)_72%,rgba(15,16,14,0.55)_100%),linear-gradient(180deg,transparent_0%,transparent_55%,rgba(15,16,14,0.8)_100%)]"
      />

      <Container
        size="page"
        className="relative z-10 flex flex-1 flex-col justify-center py-28 md:py-32"
      >
        {/* Top eyebrow */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px" }}
          transition={{ duration: 0.8, ease: easing.out }}
          className="flex items-center gap-3"
        >
          <span aria-hidden className="block h-px w-6 bg-aviation-orange" />
          <p className="font-numeric text-[11px] uppercase tracking-[0.3em] text-aviation-orange">
            {pick(content, "eyebrow", locale)}
          </p>
        </motion.div>

        {/* Headline + subtitle — one cohesive block with the eyebrow and the
            numbers, vertically centred as a group on tall viewports. */}
        <div className="mt-10 max-w-4xl">
          <motion.h2
            initial={reduce ? false : { opacity: 0, y: 28 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px" }}
            transition={{ duration: 0.9, ease: easing.out }}
            className="font-display text-[clamp(2.2rem,6vw,5.6rem)] font-semibold leading-[0.98] tracking-[-0.015em]"
          >
            <span className="block">{pick(content, "headlineLine1", locale)}</span>
            <span className="block">{pick(content, "headlineLine2", locale)}</span>
          </motion.h2>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px" }}
            transition={{ duration: 0.9, delay: 0.1, ease: easing.out }}
            className="mt-7 max-w-lg text-sm leading-7 text-surface-warm/72 md:text-base md:leading-8"
          >
            {pick(content, "body", locale)}
          </motion.p>
        </div>

        {/* Bottom — four numbers like a flight readout */}
        <motion.dl
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px" }}
          transition={{ duration: 0.8, delay: 0.2, ease: easing.out }}
          className="mt-14 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-surface-warm/14 pt-8 md:grid-cols-4 md:gap-x-12"
        >
          {content.metrics.map((m) => {
            const label = (en && m.labelEn) || m.label;
            const unit = en ? (m.unitEn ?? m.unit) : m.unit;
            // Numeric values are stored as display strings ("80-120", "100",
            // "2-4") so the CountUp animation only kicks in for clean ints.
            const numeric = Number(m.value);
            return (
              <div key={m.label || m.value}>
                <dt className="text-[11px] uppercase tracking-[0.18em] text-surface-warm/55">
                  {label}
                </dt>
                <dd className="mt-3 flex items-baseline gap-2 font-numeric leading-none">
                  {Number.isFinite(numeric) && !m.value.includes("-") ? (
                    <CountUp
                      to={numeric}
                      duration={1.6}
                      className="text-[clamp(3rem,5.5vw,5.2rem)] font-semibold tracking-[-0.02em] text-surface-warm"
                    />
                  ) : (
                    <span className="text-[clamp(3rem,5.5vw,5.2rem)] font-semibold tracking-[-0.02em] text-surface-warm">
                      {m.value}
                    </span>
                  )}
                  {unit ? (
                    <span className="text-base text-surface-warm/55 md:text-lg">{unit}</span>
                  ) : null}
                </dd>
              </div>
            );
          })}
        </motion.dl>
      </Container>
    </section>
  );
}
