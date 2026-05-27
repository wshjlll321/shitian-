"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";
import { altLocaleHref, localeFromPathname, pick, t } from "@/lib/i18n";
import type { NavItem } from "@/types/content";

type Tone = "dark" | "light";

type HeaderProps = {
  navigation: NavItem[];
  siteName: string;
};

// Tone map for the home page — matches each slide's background colour family.
const HOME_SLIDE_TONES: Record<string, Tone> = {
  hero: "dark",
  brand: "light",
  proof: "dark",
  products: "light",
  scenarios: "dark",
  tech: "light",
  journey: "dark",
  contact: "light"
};

export function Header({ navigation, siteName }: HeaderProps) {
  const pathname = usePathname();
  const locale = localeFromPathname(pathname);
  const [tone, setTone] = useState<Tone>("dark");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const onHome = pathname === "/" || pathname === "/en";

  useEffect(() => {
    if (!onHome) {
      // Sub-pages all open with a dark PageHero. Start the header in dark
      // tone so the nav stays legible over the hero photo, and switch to
      // light once the user scrolls past ~70vh into the porcelain body.
      const detectSub = () => {
        const past = window.scrollY > window.innerHeight * 0.7;
        setScrolled(window.scrollY > 24);
        setTone(past ? "light" : "dark");
      };
      detectSub();
      window.addEventListener("scroll", detectSub, { passive: true });
      window.addEventListener("resize", detectSub);
      return () => {
        window.removeEventListener("scroll", detectSub);
        window.removeEventListener("resize", detectSub);
      };
    }

    const detect = () => {
      setScrolled(window.scrollY > 24);

      // Find which slide section the viewport's top-portion is on
      const slides = document.querySelectorAll<HTMLElement>("[data-slide-id]");
      if (slides.length === 0) return;
      const probe = window.innerHeight * 0.18; // ~18% down from top, under header
      let activeId: string | null = null;
      slides.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= probe && rect.bottom > probe) {
          activeId = el.dataset.slideId ?? null;
        }
      });
      if (activeId && HOME_SLIDE_TONES[activeId]) {
        setTone(HOME_SLIDE_TONES[activeId]);
      }
    };

    detect();
    window.addEventListener("scroll", detect, { passive: true });
    window.addEventListener("resize", detect);
    return () => {
      window.removeEventListener("scroll", detect);
      window.removeEventListener("resize", detect);
    };
  }, [onHome]);

  // Close mobile sheet on navigation
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isDark = tone === "dark";
  // Solid-enough translucent shell — on dark slides we always need a strong
  // tint or the warm text dissolves into bright photos (rescue, scenarios).
  // On light slides porcelain glass is fine.
  const shellClass = isDark
    ? scrolled
      ? "bg-carbon-black/82 text-surface-warm"
      : "bg-carbon-black/55 text-surface-warm"
    : scrolled
      ? "bg-surface-porcelain/92 text-carbon-black"
      : "bg-surface-porcelain/75 text-carbon-black";

  return (
    <>
      {/* Top fade overlay — always-on legibility insurance for the top ~120px
          of any slide. On dark slides it's a dark→transparent fade; on light
          slides a porcelain→transparent fade. Sits BEHIND the header backdrop
          and IN FRONT of the slide so even fully transparent header glass
          stays readable. */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none fixed inset-x-0 top-0 z-40 h-32 transition-opacity duration-[600ms]",
          isDark
            ? "bg-[linear-gradient(180deg,rgba(15,16,14,0.55)_0%,rgba(15,16,14,0.25)_50%,transparent_100%)]"
            : "bg-[linear-gradient(180deg,rgba(250,248,243,0.55)_0%,rgba(250,248,243,0.25)_50%,transparent_100%)]"
        )}
      />
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 backdrop-blur-lg transition-[background-color,color,border-color] duration-[600ms] ease-precision",
          shellClass,
          // Subtle bottom hairline that adapts to tone — barely visible on hero
          // so the header doesn't read as a separate slab, gets a touch stronger
          // once scrolled
          isDark
            ? scrolled || open
              ? "border-b border-surface-warm/15"
              : "border-b border-surface-warm/0"
            : "border-b border-carbon-black/10"
        )}
      >
        <Container
          size="page"
          className="flex min-h-[var(--header-height)] items-center justify-between gap-6"
        >
          <Link
            href={locale === "en" ? "/en" : "/"}
            className="group flex items-center gap-3 leading-none"
            aria-label={locale === "en" ? `${siteName} home` : `${siteName} 首页`}
          >
            {/* Brand mark — small orange tick + pulsing dot, reads as an
                "online / operations active" status indicator. */}
            <span
              aria-hidden
              className="relative flex h-9 w-9 items-center justify-center border border-aviation-orange/55"
            >
              <span className="block h-1.5 w-1.5 rounded-full bg-aviation-orange data-pulse" />
              <span
                className={cn(
                  "absolute -bottom-1 -right-1 block h-2 w-2 border-b border-r",
                  isDark ? "border-surface-warm/40" : "border-carbon-black/30"
                )}
              />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-base font-semibold tracking-[-0.005em] transition-colors duration-300 group-hover:text-aviation-orange">
                {siteName}
              </span>
              <span
                className={cn(
                  "mt-1 hidden text-[10px] tracking-[0.18em] xl:block transition-colors duration-[600ms]",
                  isDark ? "text-surface-warm/55" : "text-metal-gray"
                )}
              >
                SHITIAN AVIATION
              </span>
            </span>
          </Link>

          <nav
            className="hidden items-center gap-6 lg:flex"
            aria-label={locale === "en" ? "Primary navigation" : "主导航"}
          >
            {navigation.map((item, i) => {
              const href = locale === "en" ? altLocaleHref(item.href, "en") : item.href;
              const active = href === "/" || href === "/en"
                ? pathname === href
                : pathname.startsWith(href);
              const label = pick(item, "label", locale);
              return (
                <Link
                  key={item.href}
                  href={href}
                  className={cn(
                    "group relative flex items-baseline gap-1.5 py-1 text-[13px] font-medium transition-all duration-300",
                    active
                      ? "opacity-100"
                      : "opacity-70 hover:opacity-100"
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "font-numeric text-[9px] tracking-[0.18em] transition-all duration-300",
                      active
                        ? "text-aviation-orange opacity-100"
                        : isDark
                          ? "text-surface-warm/45 opacity-0 group-hover:opacity-70"
                          : "text-metal-gray/70 opacity-0 group-hover:opacity-70"
                    )}
                  >
                    0{i + 1}
                  </span>
                  <span>{label}</span>
                  {/* Active underline — slightly wider with halo. Hover state
                      reveals the same line at low opacity so the link reads
                      as interactive even when not active. */}
                  <span
                    aria-hidden
                    className={cn(
                      "absolute -bottom-1 left-0 h-[2px] w-full origin-left transition-transform duration-500 ease-precision",
                      active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                      "bg-aviation-orange"
                    )}
                    style={active ? { boxShadow: "0 0 8px rgba(198,106,50,0.65)" } : undefined}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-5 lg:flex">
            {/* Locale picker — toggles between the mirrored Chinese and
                English URLs for the current page. */}
            <div
              aria-label={locale === "en" ? "Language" : "语言切换"}
              className={cn(
                "flex items-center gap-1.5 font-numeric text-[10px] uppercase tracking-[0.22em] transition-colors duration-[600ms]",
                isDark ? "text-surface-warm/55" : "text-metal-gray"
              )}
            >
              <Link
                href={altLocaleHref(pathname, "zh")}
                aria-current={locale === "zh" ? "true" : undefined}
                title="简体中文"
                className={
                  locale === "zh"
                    ? "text-aviation-orange"
                    : "opacity-60 transition-opacity hover:opacity-100"
                }
              >
                CN
              </Link>
              <span aria-hidden className="opacity-30">/</span>
              <Link
                href={altLocaleHref(pathname, "en")}
                aria-current={locale === "en" ? "true" : undefined}
                title="English"
                className={
                  locale === "en"
                    ? "text-aviation-orange"
                    : "opacity-60 transition-opacity hover:opacity-100"
                }
              >
                EN
              </Link>
            </div>
            <span
              aria-hidden
              className={cn(
                "block h-3 w-px transition-colors duration-[600ms]",
                isDark ? "bg-surface-warm/20" : "bg-carbon-black/15"
              )}
            />
            <Button
              href={locale === "en" ? "/en/contact" : "/contact"}
              variant={isDark ? "contact" : "secondary"}
              className="group min-h-10 px-5 text-xs uppercase tracking-[0.2em]"
            >
              <span>{locale === "en" ? "Inquiry" : t("cta.inquiry", "zh")}</span>
              <span aria-hidden className="font-numeric text-sm transition-transform duration-300 group-hover:translate-x-0.5">
                →
              </span>
            </Button>
          </div>

          <button
            type="button"
            aria-label={open ? "关闭菜单" : "打开菜单"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 items-center gap-2 border border-current/20 px-3 text-xs uppercase tracking-[0.18em] lg:hidden"
          >
            {open ? "Close" : "Menu"}
          </button>
        </Container>

        {/* Mobile sheet — always porcelain panel for readable picker */}
        {open ? (
          <div className="border-t border-carbon-black/10 bg-surface-porcelain text-carbon-black lg:hidden">
            <Container size="page" className="grid gap-1 py-5">
              {navigation.map((item, i) => {
                const href = locale === "en" ? altLocaleHref(item.href, "en") : item.href;
                const active = href === "/" || href === "/en"
                  ? pathname === href
                  : pathname.startsWith(href);
                const label = pick(item, "label", locale);
                return (
                  <Link
                    key={item.href}
                    href={href}
                    className={cn(
                      "flex items-center justify-between border-b border-carbon-black/10 py-4 text-base",
                      active ? "text-aviation-orange" : "text-carbon-black"
                    )}
                  >
                    <span>{label}</span>
                    <span
                      className={cn(
                        "font-numeric text-[11px] uppercase tracking-[0.22em]",
                        active ? "text-aviation-orange" : "text-metal-gray"
                      )}
                    >
                      0{i + 1}
                    </span>
                  </Link>
                );
              })}
              <div className="pt-5">
                <Button
                  href={locale === "en" ? "/en/contact" : "/contact"}
                  className="w-full"
                >
                  {t("cta.submitInquiry", locale)}
                </Button>
              </div>
              {/* Mobile locale picker */}
              <div className="flex items-center justify-center gap-3 border-t border-carbon-black/10 pt-4 font-numeric text-[11px] uppercase tracking-[0.24em] text-metal-gray">
                <Link
                  href={altLocaleHref(pathname, "zh")}
                  className={locale === "zh" ? "text-aviation-orange" : "hover:text-aviation-orange"}
                >
                  CN
                </Link>
                <span aria-hidden className="opacity-30">/</span>
                <Link
                  href={altLocaleHref(pathname, "en")}
                  className={locale === "en" ? "text-aviation-orange" : "hover:text-aviation-orange"}
                >
                  EN
                </Link>
              </div>
            </Container>
          </div>
        ) : null}
      </header>

      {/* Spacer for non-home pages so content doesn't slide under header */}
      {onHome ? null : <div aria-hidden style={{ height: "var(--header-height)" }} />}
    </>
  );
}
