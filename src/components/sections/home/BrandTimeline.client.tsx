"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { Container } from "@/components/ui/Container";
import { useMotionPrefs } from "@/components/providers/MotionPrefsProvider.client";
import { pick, type Locale } from "@/lib/i18n";
import { easing } from "@/lib/motion/easing";
import type { CompanyMilestone, HomeTrajectoryContent } from "@/types/content";

const STATIC = {
  milestone: { zh: "MILESTONE", en: "MILESTONE" },
  upcoming: { zh: " · upcoming", en: " · upcoming" }
};

const AUTO_ADVANCE_MS = 6500;
const WHEEL_COOLDOWN_MS = 900;
const TRACK_TRANSITION_MS = 1500;
const SLOT_REM = 22; // 22rem = 352px per slot — more breathing room around each year

/**
 * Treadmill timeline: T280 stays at the centre, the year track slides under
 * it. Year items have FIXED-HEIGHT slots — year number container is `h-24`,
 * caption container `h-14` — so the active year's larger type and visible
 * caption never compress siblings during transitions. Hover does NOT switch
 * the active year; only click / keyboard focus does.
 */
type BrandTimelineProps = {
  milestones: CompanyMilestone[];
  content: HomeTrajectoryContent;
  /** Plate image for the floating "platform of record" badge above the
   *  treadmill. Falls back to the T280 hero shot when unset. */
  media?: { src: string; alt: string };
  locale?: Locale;
};

export function BrandTimeline({
  milestones,
  content,
  media,
  locale = "zh"
}: BrandTimelineProps) {
  const reduce = useReducedMotion();
  const { isMobile } = useMotionPrefs();
  const nodes = milestones;

  const sectionRef = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const activeRef = useRef(0);
  const lastWheelRef = useRef(0);
  const inViewRef = useRef(false);
  // Tracks whether the cursor is currently inside the timeline interaction
  // zone (T280 + year track + description). The wheel hijack only fires
  // when this is true — over the section header or empty space the wheel
  // bubbles through and the page snaps to the next slide as normal.
  const inZoneRef = useRef(false);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    if (reduce || isMobile || paused) return undefined;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % nodes.length);
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(id);
  }, [reduce, isMobile, paused, nodes.length]);

  useEffect(() => {
    if (reduce || isMobile) return undefined;
    const section = sectionRef.current;
    if (!section) return undefined;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          inViewRef.current = entry.isIntersecting && entry.intersectionRatio > 0.65;
        });
      },
      { threshold: [0, 0.65, 1] }
    );
    io.observe(section);

    const onWheel = (event: WheelEvent) => {
      if (!inViewRef.current) return;
      // Only intercept the wheel when the cursor is inside the timeline
      // interaction zone. Anywhere else inside the section, the page snaps
      // to the next/prev slide as normal.
      if (!inZoneRef.current) return;
      if (event.deltaY === 0) return;
      const direction = event.deltaY > 0 ? 1 : -1;
      const idx = activeRef.current;
      if (direction > 0 && idx >= nodes.length - 1) return;
      if (direction < 0 && idx <= 0) return;
      event.preventDefault();
      const now = Date.now();
      if (now - lastWheelRef.current < WHEEL_COOLDOWN_MS) return;
      lastWheelRef.current = now;
      setActive(idx + direction);
      setPaused(true);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      io.disconnect();
      window.removeEventListener("wheel", onWheel);
    };
  }, [reduce, isMobile, nodes.length]);

  const current = nodes[active];

  if (isMobile || reduce) {
    return (
      <section
        data-snap
        data-slide-id="journey"
        className="bg-carbon-black py-24 text-surface-warm md:py-32"
      >
        <Container size="page">
          <div className="mb-10">
            <div className="flex items-center gap-3">
              <span aria-hidden className="block h-px w-6 bg-aviation-orange" />
              <p className="font-numeric text-[11px] uppercase tracking-[0.3em] text-aviation-orange">
                {pick(content, "eyebrow", locale)}
              </p>
            </div>
            <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold leading-tight md:text-4xl">
              {pick(content, "headline", locale)}
            </h2>
          </div>
          <ol className="grid gap-7">
            {nodes.map((m, i) => (
              <li
                key={m.year + m.title}
                className="grid gap-2 border-l-2 border-aviation-orange/40 pl-5"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-numeric text-sm uppercase tracking-[0.18em] text-aviation-orange">
                    {m.year}
                  </span>
                  <span className="font-numeric text-[10px] uppercase tracking-[0.22em] text-surface-warm/45">
                    {String(i + 1).padStart(2, "0")} / {String(nodes.length).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="font-display text-lg font-semibold leading-tight">{pick(m, "title", locale)}</h3>
                <p className="text-sm leading-7 text-surface-warm/64">{pick(m, "description", locale)}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>
    );
  }

  const trackShift = `calc(-${active * SLOT_REM + SLOT_REM / 2}rem)`;
  const trackTransition = `transform ${TRACK_TRANSITION_MS}ms cubic-bezier(0.65, 0, 0.35, 1)`;

  return (
    <section
      ref={sectionRef}
      data-snap
      data-slide-id="journey"
      className="relative isolate flex h-screen w-full flex-col overflow-hidden bg-carbon-black text-surface-warm"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="品牌发展线"
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_78%,rgba(198,106,50,0.07),transparent_58%),linear-gradient(180deg,#0f100e_0%,#171816_100%)]"
      />

      <Container
        size="page"
        className="relative z-10 flex h-full flex-col pt-28 pb-12 md:pt-24 md:pb-14"
      >
        {/* Top — header */}
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span aria-hidden className="block h-px w-6 bg-aviation-orange" />
              <p className="font-numeric text-[11px] uppercase tracking-[0.3em] text-aviation-orange">
                {pick(content, "eyebrow", locale)}
              </p>
            </div>
            <h2 className="mt-4 max-w-3xl font-display text-[clamp(2rem,3.6vw,3.6rem)] font-semibold leading-[1.02] tracking-[-0.015em]">
              {pick(content, "headline", locale)}
            </h2>
          </div>
          <p className="font-numeric text-[10px] uppercase tracking-[0.3em] text-surface-warm/40">
            {String(active + 1).padStart(2, "0")} / {String(nodes.length).padStart(2, "0")}
          </p>
        </div>

        {/* Middle — T280 + track + description, vertically centered as one
            block. Mouse enter/leave on this wrapper toggles the wheel-hijack
            zone: scrolling inside advances milestones, outside (header /
            empty space) the page snaps to the next slide as normal. */}
        <div
          className="relative my-auto"
          onMouseEnter={() => {
            inZoneRef.current = true;
          }}
          onMouseLeave={() => {
            inZoneRef.current = false;
          }}
        >
          {/* Marker visual — a clipped T280 plate floats above the active
              year, replacing the previous low-contrast 3D scene. The frame's
              corner ticks and serial label give the slide a "catalogue plate"
              feel and provide weight against the dark background. */}
          <div className="relative flex h-[200px] justify-center md:h-[220px]">
            <motion.div
              animate={{ y: [0, -8, 0, 8, 0] }}
              transition={{ duration: 4.6, ease: "easeInOut", repeat: Infinity }}
              className="relative h-full w-[380px] md:w-[460px]"
            >
              <div className="relative h-full w-full overflow-hidden border border-surface-warm/12">
                <Image
                  src={media?.src ?? "/media/products/product-t280-hero.jpg"}
                  alt={media?.alt ?? "T280 重载燃油无人直升机"}
                  fill
                  sizes="460px"
                  className="object-cover"
                  priority={false}
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,16,14,0.18)_0%,rgba(15,16,14,0)_30%,rgba(15,16,14,0)_70%,rgba(15,16,14,0.55)_100%)]"
                />
                {/* Corner ticks */}
                <span aria-hidden className="absolute top-0 left-0 h-3 w-3 border-t border-l border-aviation-orange/70" />
                <span aria-hidden className="absolute top-0 right-0 h-3 w-3 border-t border-r border-aviation-orange/70" />
                <span aria-hidden className="absolute bottom-0 left-0 h-3 w-3 border-b border-l border-aviation-orange/70" />
                <span aria-hidden className="absolute bottom-0 right-0 h-3 w-3 border-b border-r border-aviation-orange/70" />
                <span className="absolute bottom-2 left-2 font-numeric text-[10px] uppercase tracking-[0.22em] text-surface-warm/70">
                  T280 · platform of record
                </span>
              </div>
            </motion.div>

            {/* Tether — vertical line from plate down to the active year */}
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-full h-6 w-px -translate-x-1/2 bg-gradient-to-b from-aviation-orange/70 to-transparent"
            />
          </div>

          {/* Year track clipper — fixed total height of 200px so transitions
              never reflow the slide. Each year slot has fixed-height boxes
              for the year number and the caption. */}
          <div className="relative mt-4 h-[200px] overflow-hidden">
            {/* Dashed baseline */}
            <svg
              className="absolute left-0 right-0 top-[88px] h-2 w-full overflow-visible"
              preserveAspectRatio="none"
              aria-hidden
            >
              <line
                x1="0%"
                y1="50%"
                x2="100%"
                y2="50%"
                stroke="rgba(245, 241, 234, 0.12)"
                strokeWidth={1}
                strokeDasharray="2 8"
              />
            </svg>

            {/* Sliding year strip */}
            <ul
              className="absolute top-0 flex h-full items-start"
              style={{
                left: "50%",
                transform: `translateX(${trackShift})`,
                transition: trackTransition
              }}
            >
              {nodes.map((m, i) => {
                const isActive = i === active;
                const distance = Math.abs(i - active);
                const opacity = isActive ? 1 : Math.max(0.2, 0.7 - distance * 0.14);
                // Gentle zigzag only for non-active years; active settles at y=0
                const naturalYShift = i % 2 === 0 ? -14 : 14;
                const yShift = isActive ? 0 : naturalYShift;

                return (
                  <li
                    key={m.year + m.title}
                    className="flex w-[22rem] flex-shrink-0 flex-col items-center text-center"
                    style={{
                      transform: `translateY(${yShift}px)`,
                      opacity,
                      transition: `transform ${TRACK_TRANSITION_MS}ms cubic-bezier(0.65, 0, 0.35, 1), opacity 700ms ease`
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setActive(i);
                        setPaused(true);
                      }}
                      onFocus={() => setActive(i)}
                      className="group flex w-full flex-col items-center"
                      aria-label={`${m.year} ${m.title}`}
                    >
                      {/* Year — fixed height container, no wrap so years like
                          "2022 · 11" stay on a single line at every font size */}
                      <div className="flex h-24 w-full items-end justify-center overflow-visible">
                        <span
                          className={`whitespace-nowrap font-numeric font-semibold leading-none tracking-[-0.02em] transition-all duration-[1100ms] ease-out ${
                            isActive
                              ? "text-[clamp(2.4rem,4vw,4rem)] text-aviation-orange"
                              : "text-[clamp(1.4rem,2.2vw,2.2rem)] text-surface-warm/55 group-hover:text-surface-warm/80"
                          }`}
                        >
                          {m.year}
                        </span>
                      </div>

                      {/* Tether dot — small orange marker below the year */}
                      <span
                        className={`mt-3 block rounded-full transition-all duration-[700ms] ${
                          isActive
                            ? "h-2 w-2 bg-aviation-orange shadow-[0_0_0_4px_rgba(198,106,50,0.18)]"
                            : "h-1.5 w-1.5 bg-surface-warm/30"
                        }`}
                      />

                      {/* Caption — fixed-height container; content visible
                          only for active year. Reserved space prevents reflow. */}
                      <div className="mt-4 h-14 w-full px-2">
                        <span
                          className={`block text-[12px] leading-[18px] transition-all duration-[900ms] ease-out ${
                            isActive
                              ? "translate-y-0 opacity-100 text-surface-warm/72"
                              : "translate-y-1 opacity-0"
                          }`}
                          aria-hidden={!isActive}
                        >
                          {pick(m, "title", locale)}
                        </span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Edge fade masks */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-carbon-black via-carbon-black/85 to-transparent"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-carbon-black via-carbon-black/85 to-transparent"
            />
          </div>

          {/* Milestone description — sits directly under the timeline so the
              active narrative is right where the eye lands, not buried at the
              bottom of the slide. */}
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easing.out }}
            className="mx-auto mt-8 max-w-2xl text-center"
          >
            <p className="font-numeric text-[11px] uppercase tracking-[0.22em] text-aviation-orange">
              {STATIC.milestone[locale]} {String(active + 1).padStart(2, "0")} / {String(nodes.length).padStart(2, "0")}
              {current.status === "needs-confirmation" ? STATIC.upcoming[locale] : ""}
            </p>
            <p className="mt-3 text-sm leading-7 text-surface-warm/72 md:text-base md:leading-8">
              {pick(current, "description", locale)}
            </p>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
