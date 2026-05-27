"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { cn } from "@/lib/cn";
import { localeFromPathname, t } from "@/lib/i18n";

/**
 * Persistent inquiry anchor — fades in once the visitor has scrolled past the
 * hero, stays glued to the lower-right corner through the body of the page,
 * and steps aside once Contact (or any /contact route) is reached so the
 * primary CTA inside the section reads cleanly. Mirrors the "Where to buy"
 * shortcut on premium international sites.
 */
export function FloatingInquiry() {
  const pathname = usePathname();
  const locale = localeFromPathname(pathname);
  const [visible, setVisible] = useState(false);

  const onHome = pathname === "/" || pathname === "/en";
  const onContact =
    pathname === "/contact" ||
    pathname.startsWith("/contact/") ||
    pathname === "/en/contact" ||
    pathname.startsWith("/en/contact/");

  useEffect(() => {
    if (onContact) {
      setVisible(false);
      return undefined;
    }

    const update = () => {
      // Subpages — keep visible until the local inquiry section enters the
      // viewport's lower half. Sub-page templates use either
      // [data-slide-id="contact"] or a #inquiry section. Treat either as
      // "we've already reached a primary CTA" and step aside.
      const inquiryAnchor =
        document.querySelector<HTMLElement>('[data-slide-id="contact"]') ||
        document.querySelector<HTMLElement>('#inquiry');

      if (!onHome) {
        if (!inquiryAnchor) {
          setVisible(true);
          return;
        }
        const reached =
          inquiryAnchor.getBoundingClientRect().top < window.innerHeight * 0.6;
        setVisible(!reached);
        return;
      }

      // Home — hold until the visitor scrolls past the hero, then hide
      // again once the closing contact slide is near.
      const hero = document.querySelector<HTMLElement>('[data-slide-id="hero"]');
      const heroBottom = hero ? hero.offsetTop + hero.offsetHeight : 0;
      const past = window.scrollY > heroBottom - window.innerHeight * 0.4;
      const reachedContact =
        inquiryAnchor !== null &&
        inquiryAnchor.getBoundingClientRect().top < window.innerHeight * 0.55;
      setVisible(past && !reachedContact);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [onHome, onContact]);

  return (
    <Link
      href={locale === "en" ? "/en/contact" : "/contact"}
      aria-label={t("cta.submitInquiry", locale)}
      className={cn(
        "group fixed z-40 transition-all duration-500 ease-out",
        "bottom-5 right-5 md:bottom-8 md:right-7",
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      )}
    >
      <span className="relative flex items-center gap-2.5 rounded-industrial bg-aviation-orange px-4 py-3 text-[11px] font-medium uppercase tracking-[0.22em] text-surface-warm shadow-[0_18px_48px_-14px_rgba(198,106,50,0.6)] md:px-5 md:py-3.5 md:text-xs">
        <span aria-hidden className="relative flex h-2 w-2">
          <span className="absolute inset-0 animate-ping rounded-full bg-surface-warm/70" />
          <span className="relative block h-2 w-2 rounded-full bg-surface-warm" />
        </span>
        <span className="hidden sm:inline">{t("cta.inquiry", locale)}</span>
        <span className="sm:hidden">{t("cta.inquiryShort", locale)}</span>
        <span
          aria-hidden
          className="font-numeric text-sm leading-none transition-transform duration-300 group-hover:translate-x-1"
        >
          →
        </span>
      </span>
    </Link>
  );
}
