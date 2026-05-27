"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { altLocaleHref, pick, type Locale } from "@/lib/i18n";
import { easing } from "@/lib/motion/easing";
import type { HomeHeroContent, MediaAsset } from "@/types/content";

type HeroImmersiveProps = {
  homeHero: HomeHeroContent;
  /** Optional backdrop resolved from the media library; when absent the
   *  built-in fallback image keeps the slide stable. */
  media?: MediaAsset;
  locale?: Locale;
};

export function HeroImmersive({ homeHero, media, locale = "zh" }: HeroImmersiveProps) {
  const reduce = useReducedMotion();

  const enter = (delay = 0) =>
    reduce
      ? { initial: false }
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 1.0, delay, ease: easing.out }
        };

  const eyebrow = pick(homeHero, "eyebrow", locale);
  const title = pick(homeHero, "title", locale);
  const subtitle = pick(homeHero, "subtitle", locale);
  // English title splits on the western comma; Chinese on the full-width one.
  const titleLines = locale === "en"
    ? title.split(",").map((s) => s.trim()).filter(Boolean)
    : title.split("，");
  const primaryLabel = (locale === "en" && homeHero.primaryCta.labelEn) || homeHero.primaryCta.label;
  const secondaryLabel =
    (locale === "en" && homeHero.secondaryCta.labelEn) || homeHero.secondaryCta.label;
  const primaryHref = locale === "en" ? altLocaleHref(homeHero.primaryCta.href, "en") : homeHero.primaryCta.href;
  const secondaryHref = locale === "en" ? altLocaleHref(homeHero.secondaryCta.href, "en") : homeHero.secondaryCta.href;

  return (
    <section
      data-snap
      data-slide-id="hero"
      className="relative isolate flex h-screen w-full flex-col overflow-hidden bg-carbon-black text-surface-warm"
      aria-labelledby="hero-title"
    >
      {/* Atmospheric backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_72%_38%,rgba(198,106,50,0.18),transparent_45%),linear-gradient(180deg,#171816_0%,#0f100e_100%)]"
      />

      {/* Cinematic product photo or video — anchors the slide with a real
          aviation product asset. When admins pick a video media asset, it
          plays inline as an autoplay/loop/muted backdrop (browsers require
          muted for autoplay); otherwise we fall back to the static photo
          with a slow ken-burns scale-in. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        initial={reduce ? false : { scale: 1.05, opacity: 0 }}
        animate={reduce ? undefined : { scale: 1.0, opacity: 1 }}
        transition={{ duration: 2.4, ease: easing.out }}
      >
        {media?.kind === "video" ? (
          <video
            src={media.src}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={homeHero.visual.fallbackLabel}
            className="absolute inset-0 h-full w-full object-cover object-[60%_50%]"
          />
        ) : (
          <Image
            src={media?.src ?? "/media/old-site/images/63580a43d1b3.jpg"}
            alt={media?.alt ?? homeHero.visual.fallbackLabel}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[60%_50%]"
          />
        )}
        {/* Photo's own duotone wash — pushes the photo into the carbon-black
            palette so it sits cohesively with the rest of the slide rather
            than looking like a stock image dropped in. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,16,14,0.35)_0%,rgba(15,16,14,0.25)_45%,rgba(15,16,14,0.55)_100%)] mix-blend-multiply"
        />
      </motion.div>

      {/* Cinematic stage — strong bottom-half darkening so the
          oversized title is unconditionally legible over the 3D drone, while
          the upper half stays open for the rotor blade silhouette. The left
          wash anchors the type column on a darker surface. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(15,16,14,0.60)_0%,rgba(15,16,14,0.18)_18%,rgba(15,16,14,0.08)_42%,rgba(15,16,14,0.65)_70%,rgba(15,16,14,0.96)_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-2/3 bg-[linear-gradient(90deg,rgba(15,16,14,0.80)_0%,rgba(15,16,14,0.40)_40%,rgba(15,16,14,0)_100%)]"
      />

      {/* Top-left registration mark — reads as a printed coordinate stamp.
          Adds a sense of "this is a piece of certified hardware" without
          crowding the centre. Sits left of the slide dots so they don't fight. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-32 z-[6] hidden -translate-x-1/2 items-center gap-3 font-numeric text-[10px] uppercase tracking-[0.36em] text-surface-warm/35 md:flex"
      >
        <span className="block h-px w-8 bg-surface-warm/25" />
        <span>N 36.30° · E 120.39°</span>
        <span className="block h-px w-8 bg-surface-warm/25" />
      </div>

      {/* Chapter glyph — outlined oversized "01" anchored bottom-right, mirrors
          the light sections (02/06/08) so the rhythm is continuous on dark too. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-12 -right-4 select-none font-numeric font-semibold leading-none tracking-[-0.04em] text-[clamp(8rem,16vw,18rem)] md:-bottom-16 md:-right-8"
        style={{
          WebkitTextStroke: "1px rgba(245,241,234,0.08)",
          color: "transparent"
        }}
      >
        01
      </span>

      {/* Corner crosshair brackets — flight-deck framing */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[5]">
        <span className="absolute left-5 top-24 block h-3 w-3 border-l border-t border-surface-warm/25 md:left-10 md:top-24" />
        <span className="absolute right-5 top-24 block h-3 w-3 border-r border-t border-surface-warm/25 md:right-10 md:top-24" />
      </div>

      {/* Top eyebrow */}
      <Container size="page" className="relative z-10 pt-32 md:pt-28">
        <motion.div {...enter(0)} className="flex items-center gap-3">
          <span aria-hidden className="block h-px w-6 bg-aviation-orange" />
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-aviation-orange">
            {eyebrow}
          </p>
        </motion.div>
      </Container>

      {/* Slow horizontal scan line — barely-visible radar sweep that crosses
          the slide every ~14s, keeping the static drone feeling "live" */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-[4] h-px bg-[linear-gradient(90deg,transparent_0%,rgba(198,106,50,0)_15%,rgba(198,106,50,0.45)_50%,rgba(198,106,50,0)_85%,transparent_100%)]"
        initial={{ y: 0, opacity: 0 }}
        animate={reduce ? { opacity: 0 } : { y: ["0vh", "100vh"], opacity: [0, 0.6, 0.6, 0] }}
        transition={
          reduce
            ? undefined
            : { duration: 14, ease: "linear", repeat: Infinity, repeatDelay: 4, times: [0, 0.15, 0.85, 1] }
        }
      />

      {/* Headline pinned bottom-left, two-line Chinese, oversized */}
      <Container size="page" className="relative z-10 mt-auto pb-16 md:pb-20">
        {/* Tactical specsheet strip — sits above the headline like a printed
            type plate. Reads as instrument hardware, not marketing chrome.
            Each cell uses border separators so it reads as a flight readout. */}
        <motion.div
          {...enter(0.08)}
          className="mb-8 flex flex-wrap items-stretch gap-x-0 gap-y-2 text-[10px] uppercase tracking-[0.26em] text-surface-warm/65"
        >
          <span className="flex items-center gap-2 border-l-2 border-aviation-orange pl-3 pr-5">
            <span aria-hidden className="block h-1.5 w-1.5 rounded-full bg-aviation-orange data-pulse" />
            <span className="text-aviation-orange">T280 · Heavy Lift</span>
          </span>
          <span className="hidden items-center border-l border-surface-warm/15 px-5 md:flex">
            80–120 kg <span className="ml-1.5 text-surface-warm/45">PAYLOAD</span>
          </span>
          <span className="hidden items-center border-l border-surface-warm/15 px-5 md:flex">
            100 km <span className="ml-1.5 text-surface-warm/45">RANGE</span>
          </span>
          <span className="hidden items-center border-l border-r border-surface-warm/15 px-5 md:flex">
            2–4 h <span className="ml-1.5 text-surface-warm/45">ENDURANCE</span>
          </span>
        </motion.div>

        <motion.h1
          id="hero-title"
          {...enter(0.12)}
          className="relative max-w-[18ch] font-display text-[clamp(2.6rem,7.2vw,7rem)] font-semibold leading-[0.96] tracking-[-0.015em] text-surface-warm"
          style={{
            textShadow:
              "0 4px 28px rgba(15,16,14,0.85), 0 2px 6px rgba(15,16,14,0.7), 0 1px 0 rgba(0,0,0,0.5)"
          }}
        >
          {titleLines.map((part, i, arr) => (
            <span key={i} className="block">
              {part}
              {i < arr.length - 1 ? (
                <span className="text-aviation-orange">{locale === "en" ? "," : "，"}</span>
              ) : null}
            </span>
          ))}
        </motion.h1>

        <motion.p
          {...enter(0.22)}
          className="mt-9 max-w-xl text-sm leading-7 text-surface-warm/78 md:text-base md:leading-8"
          style={{ textShadow: "0 2px 10px rgba(15,16,14,0.55)" }}
        >
          {subtitle}
        </motion.p>

        <motion.div {...enter(0.32)} className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Button href={primaryHref} className="group min-h-[3.5rem] px-8 text-[15px]">
            <span>{primaryLabel}</span>
            <span aria-hidden className="font-numeric text-lg transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Button>
          <Button href={secondaryHref} variant="ghost" className="min-h-[3.5rem] border-surface-warm/30 px-8 text-[15px] text-surface-warm hover:border-aviation-orange hover:text-aviation-orange">
            {secondaryLabel}
          </Button>
        </motion.div>
      </Container>

      {/* Scroll indicator — bottom-right, a small flight-deck readout that
          tells the user this is the first of several chapters. Vertical
          orange tick falls then resets, like a descending altitude bar. */}
      <motion.div
        aria-hidden
        {...enter(0.5)}
        className="pointer-events-none absolute bottom-6 right-5 z-10 hidden items-center gap-3 md:bottom-8 md:right-10 md:flex"
      >
        <span className="font-numeric text-[10px] uppercase tracking-[0.32em] text-surface-warm/55">
          Scroll · 01 / 08
        </span>
        <span className="relative block h-9 w-px overflow-hidden bg-surface-warm/15">
          <motion.span
            className="absolute inset-x-0 top-0 block h-3 bg-aviation-orange"
            initial={{ y: -16 }}
            animate={reduce ? { y: 0 } : { y: ["-100%", "120%"] }}
            transition={
              reduce
                ? undefined
                : { duration: 2.4, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.2 }
            }
          />
        </span>
      </motion.div>
    </section>
  );
}
