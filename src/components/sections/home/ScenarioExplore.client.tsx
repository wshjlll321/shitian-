"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal.client";
import { useMotionPrefs } from "@/components/providers/MotionPrefsProvider.client";
import { pick, type Locale } from "@/lib/i18n";
import { easing } from "@/lib/motion/easing";
import type { MediaAsset, Scenario } from "@/types/content";

const COPY = {
  enter: { zh: "进入场景详情", en: "Enter scenario" },
  cycling: { zh: "Auto cycling · hover to focus", en: "Auto cycling · hover to focus" },
  all: { zh: "All scenarios · 全部场景", en: "All scenarios" }
};

const AUTO_ADVANCE_MS = 5200;

/**
 * Single full-screen scenario slide. The big background image crossfades
 * between scenarios automatically (every 5.2s) and locks to whichever item
 * the user hovers / focuses / taps on the right-side picker.
 */
type ScenarioExploreProps = {
  allScenarios: Scenario[];
  mediaAssets: MediaAsset[];
  /** Ordered list of scenario slugs to feature; admin-editable on /admin/home. */
  featuredSlugs: string[];
  /** Section eyebrow in Chinese / English (the only headline copy this
   *  section carries — everything else comes from each scenario). */
  eyebrow: string;
  eyebrowEn?: string;
  locale?: Locale;
};

export function ScenarioExplore({
  allScenarios,
  mediaAssets,
  featuredSlugs,
  eyebrow,
  eyebrowEn,
  locale = "zh"
}: ScenarioExploreProps) {
  const en = locale === "en";
  const reduce = useReducedMotion();
  const { isMobile } = useMotionPrefs();
  const scenarios = featuredSlugs
    .map((slug) => allScenarios.find((s) => s.slug === slug))
    .filter((s): s is Scenario => Boolean(s));

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<number | null>(null);

  // Auto-rotation when not paused and not in reduced-motion
  useEffect(() => {
    if (reduce || isMobile || paused) return undefined;
    timerRef.current = window.setInterval(() => {
      setActive((i) => (i + 1) % scenarios.length);
    }, AUTO_ADVANCE_MS);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [reduce, isMobile, paused, scenarios.length]);

  const current = scenarios[active];

  return (
    <section
      data-snap
      data-slide-id="scenarios"
      className="relative isolate flex min-h-screen w-full flex-col overflow-hidden bg-carbon-black text-surface-warm"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="作业场景"
    >
      {/* Background images — crossfade */}
      <div className="absolute inset-0">
        {scenarios.map((s, i) => {
          const m = s.media[0] ? mediaAssets.find((asset) => asset.id === s.media[0]) : undefined;
          return (
            <motion.div
              key={s.slug}
              className="absolute inset-0"
              initial={false}
              animate={{ opacity: i === active ? 1 : 0 }}
              transition={{ duration: 0.9, ease: easing.inOut }}
            >
              {m ? (
                <Image
                  src={m.src}
                  alt={m.alt}
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(54,66,55,0.65),rgba(17,17,17,1))]" />
              )}
            </motion.div>
          );
        })}
        {/* Two-axis legibility scrim — left column protected to ~58% so the
            headline and paragraph never compete with bright crop or water
            imagery; right column gets a softer veil that still seats the
            scenario picker against any photo it lands on. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,16,14,0.92)_0%,rgba(15,16,14,0.82)_28%,rgba(15,16,14,0.45)_58%,rgba(15,16,14,0.2)_72%,rgba(15,16,14,0.7)_100%),linear-gradient(180deg,rgba(15,16,14,0.55)_0%,rgba(15,16,14,0.05)_22%,rgba(15,16,14,0.05)_52%,rgba(15,16,14,0.9)_100%)]"
        />
      </div>

      <Container size="page" className="relative z-10 flex flex-1 flex-col justify-center py-28 md:py-32">
        {/* Top — section header */}
        <div className="flex items-baseline justify-between">
          <Reveal>
            <div className="flex items-center gap-3">
              <span aria-hidden className="block h-px w-6 bg-aviation-orange" />
              <p className="font-numeric text-[11px] uppercase tracking-[0.3em] text-aviation-orange">
                {(en && eyebrowEn) || eyebrow}
              </p>
            </div>
          </Reveal>
          <p className="font-numeric text-[10px] uppercase tracking-[0.3em] text-surface-warm/45">
            {String(active + 1).padStart(2, "0")} / {String(scenarios.length).padStart(2, "0")}
          </p>
        </div>

        {/* Body — featured headline (left) + scenario picker (right) */}
        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.42fr)] lg:items-end">
          {current ? (
            <motion.div
              key={current.slug}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: easing.out }}
            >
              <p className="font-numeric text-[11px] uppercase tracking-[0.22em] text-aviation-orange">
                {pick(current, "name", locale)} · {current.recommendedProducts.slice(0, 2).join(" · ")}
              </p>
              <h2 className="mt-5 max-w-4xl font-display text-[clamp(2rem,4.8vw,4.4rem)] font-semibold leading-[1.0] tracking-[-0.015em]">
                {pick(current, "headline", locale)}
              </h2>
              <p className="mt-6 max-w-xl text-sm leading-7 text-surface-warm/72 md:text-base md:leading-8">
                {pick(current, "painPoint", locale)}
              </p>
              <Link
                href={en ? `/en/scenarios/${current.slug}` : `/scenarios/${current.slug}`}
                className="mt-8 inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.24em] text-surface-warm transition hover:text-aviation-orange"
              >
                {COPY.enter[locale]}
                <span aria-hidden className="font-numeric text-base">→</span>
              </Link>
            </motion.div>
          ) : null}

          {/* Picker — 8 scenario names, hover/click to lock */}
          <ul className="grid gap-1 self-stretch">
            {scenarios.map((s, i) => {
              const isActive = i === active;
              return (
                <li key={s.slug}>
                  <button
                    type="button"
                    onMouseEnter={() => {
                      setActive(i);
                      setPaused(true);
                    }}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    className={`group flex w-full items-center justify-between gap-3 border-l-2 px-4 py-2.5 text-left transition ${
                      isActive
                        ? "border-aviation-orange bg-surface-warm/[0.08]"
                        : "border-surface-warm/14 hover:bg-surface-warm/[0.04]"
                    }`}
                  >
                    <div className="flex min-w-0 items-baseline gap-3">
                      <span
                        className={`font-numeric text-[10px] uppercase tracking-[0.22em] transition ${
                          isActive ? "text-aviation-orange" : "text-surface-warm/45"
                        }`}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={`truncate text-sm transition ${
                          isActive ? "text-surface-warm" : "text-surface-warm/68"
                        }`}
                      >
                        {pick(s, "name", locale)}
                      </span>
                    </div>
                    <span
                      aria-hidden
                      className={`font-numeric text-sm transition ${
                        isActive ? "text-aviation-orange" : "text-surface-warm/30 group-hover:text-surface-warm/60"
                      }`}
                    >
                      →
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Bottom — progress + view all */}
        <div className="mt-8 flex items-center justify-between border-t border-surface-warm/14 pt-5">
          <div className="flex items-center gap-3">
            <span className="text-[11px] uppercase tracking-[0.22em] text-surface-warm/45">
              {COPY.cycling[locale]}
            </span>
            <span
              className={`block h-1 w-12 overflow-hidden rounded-sm bg-surface-warm/12`}
            >
              <motion.span
                key={`${active}-${paused ? "paused" : "playing"}`}
                className="block h-full origin-left bg-aviation-orange"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: paused || reduce || isMobile ? 0 : 1 }}
                transition={{ duration: AUTO_ADVANCE_MS / 1000, ease: "linear" }}
                style={{ transformOrigin: "left" }}
              />
            </span>
          </div>
          <Link
            href={en ? "/en/scenarios" : "/scenarios"}
            className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-surface-warm transition hover:text-aviation-orange"
          >
            {COPY.all[locale]}
            <span aria-hidden className="font-numeric text-base">→</span>
          </Link>
        </div>
      </Container>
    </section>
  );
}
