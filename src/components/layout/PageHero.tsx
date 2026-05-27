import type { ReactNode } from "react";

import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal.client";
import { cn } from "@/lib/cn";

type PageHeroProps = {
  kicker: string;
  title: ReactNode;
  subtitle?: ReactNode;
  lede?: ReactNode;
  tone?: "dark" | "light";
  align?: "left" | "split";
  meta?: ReactNode;
  children?: ReactNode;
};

export function PageHero({
  kicker,
  title,
  subtitle,
  lede,
  tone = "dark",
  align = "left",
  meta,
  children
}: PageHeroProps) {
  const isDark = tone === "dark";

  return (
    <section
      className={cn(
        "relative isolate overflow-hidden pb-14 pt-24 md:pb-20 md:pt-28",
        isDark ? "bg-carbon-black text-surface-warm" : "bg-surface-warm text-carbon-black"
      )}
    >
      {/* Background — gradient wash matched to the home sections */}
      <div
        aria-hidden
        className={cn(
          "absolute inset-0",
          isDark
            ? "bg-[radial-gradient(ellipse_at_82%_28%,rgba(198,106,50,0.12),transparent_50%),linear-gradient(180deg,#171816_0%,#0f100e_100%)]"
            : "bg-[radial-gradient(ellipse_at_88%_18%,rgba(198,106,50,0.10),transparent_50%)]"
        )}
      />

      {/* Dim aviation-orange spotlight under the headline — adds depth and
          makes the type feel illuminated rather than printed on a flat slab. */}
      {isDark ? (
        <div
          aria-hidden
          className="pointer-events-none absolute left-0 top-1/2 h-[60vh] w-[60vw] -translate-y-1/2 bg-[radial-gradient(circle_at_30%_50%,rgba(198,106,50,0.10),transparent_62%)]"
        />
      ) : null}

      <Container size="page" className="relative z-10">
        {align === "split" ? (
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.32fr)_minmax(0,1fr)] lg:items-end">
            <Reveal>
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="block h-px w-6 bg-aviation-orange"
                />
                <p
                  className={cn(
                    "font-numeric text-[11px] uppercase tracking-[0.3em] text-aviation-orange"
                  )}
                >
                  {kicker}
                </p>
              </div>
            </Reveal>
            <div>
              <Reveal delay={0.05}>
                <h1 className="font-display text-[clamp(2.2rem,4.6vw,4.4rem)] font-semibold leading-[1.04] tracking-[-0.01em]">
                  {title}
                </h1>
              </Reveal>
              {subtitle ? (
                <Reveal delay={0.07}>
                  <p
                    className={cn(
                      "mt-4 font-numeric text-[12px] uppercase tracking-[0.28em]",
                      isDark ? "text-surface-warm/55" : "text-metal-gray"
                    )}
                  >
                    {subtitle}
                  </p>
                </Reveal>
              ) : null}
              {lede ? (
                <Reveal delay={0.1}>
                  <div
                    className={cn(
                      "mt-6 max-w-2xl text-[15px] leading-[1.85] md:text-base md:leading-[1.9]",
                      isDark ? "text-surface-warm/72" : "text-carbon-black/68"
                    )}
                  >
                    {lede}
                  </div>
                </Reveal>
              ) : null}
              {meta ? <Reveal delay={0.16}>{meta}</Reveal> : null}
            </div>
          </div>
        ) : (
          <div className="max-w-5xl">
            <Reveal>
              <div className="flex items-center gap-3">
                <span aria-hidden className="block h-px w-8 bg-aviation-orange" />
                <p className="font-numeric text-[11px] uppercase tracking-[0.32em] text-aviation-orange">
                  {kicker}
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <h1
                className={cn(
                  "mt-6 font-display text-[clamp(2.4rem,5.2vw,5rem)] font-semibold leading-[1.04] tracking-[-0.015em]",
                  isDark ? "display-gradient" : "display-gradient-dark"
                )}
              >
                {title}
              </h1>
            </Reveal>
            {subtitle ? (
              <Reveal delay={0.07}>
                <p
                  className={cn(
                    "mt-4 font-numeric text-[12px] uppercase tracking-[0.3em]",
                    isDark ? "text-surface-warm/55" : "text-metal-gray"
                  )}
                >
                  {subtitle}
                </p>
              </Reveal>
            ) : null}
            {lede ? (
              <Reveal delay={0.1}>
                <div
                  className={cn(
                    "mt-6 max-w-2xl text-[15px] leading-[1.85] md:text-base md:leading-[1.9]",
                    isDark ? "text-surface-warm/72" : "text-carbon-black/68"
                  )}
                >
                  {lede}
                </div>
              </Reveal>
            ) : null}
            {meta ? <Reveal delay={0.16}>{meta}</Reveal> : null}
          </div>
        )}
        {children}
      </Container>

      {/* Bottom hairline — closes the chapter cleanly into whatever comes
          next, the way the home sections' bottom borders do. */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-px",
          isDark ? "bg-surface-warm/10" : "bg-carbon-black/10"
        )}
      />
    </section>
  );
}
