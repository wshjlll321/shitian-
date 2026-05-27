"use client";

import { useEffect, useState } from "react";

export type RailItem = {
  id: string;
  index: string;
  label: string;
};

type SectionRailProps = {
  items: RailItem[];
};

/**
 * Right-edge floating chapter rail for long editorial inner pages. Mirrors
 * the home-page SlideDots aesthetic so product / technology / scenario
 * detail pages share a visual language with the homepage instead of
 * inheriting a generic horizontal TOC bar.
 *
 * - Vertical tick marks, anchored right-edge, vertically centred.
 * - Active tick: orange, 24px long.
 * - Inactive: short, semi-opaque metal-gray.
 * - Section label shows only for the active row + on hover.
 * - Scroll-position based active state with rAF throttling (more
 *   predictable than IntersectionObserver on long pages where two
 *   sections can be intersecting simultaneously).
 */
export function SectionRail({ items }: SectionRailProps) {
  const [active, setActive] = useState<string>(items[0]?.id ?? "");

  useEffect(() => {
    const elements = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return undefined;

    let ticking = false;
    const update = () => {
      // Trigger line at 30% from the top of the viewport — that's where
      // the section "feels" current to a reader.
      const triggerY = window.scrollY + window.innerHeight * 0.3;
      let current = elements[0]!.id;
      for (const el of elements) {
        if (el.offsetTop <= triggerY) current = el.id;
      }
      setActive(current);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items]);

  return (
    <nav
      aria-label="Page sections"
      className="pointer-events-none fixed right-4 top-1/2 z-30 hidden -translate-y-1/2 lg:block"
    >
      <ol className="pointer-events-auto flex flex-col gap-5">
        {items.map((item) => {
          const isActive = item.id === active;
          return (
            <li key={item.id} className="flex justify-end">
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "true" : undefined}
                className="group flex items-center justify-end gap-3 mix-blend-difference"
              >
                <span
                  className={`whitespace-nowrap text-[10px] uppercase tracking-[0.22em] transition-all duration-300 ${
                    isActive
                      ? "text-aviation-orange opacity-100"
                      : "text-surface-warm opacity-0 group-hover:opacity-60"
                  }`}
                >
                  <span className="font-numeric">{item.index}</span>
                  <span className="ml-2">{item.label}</span>
                </span>
                <span
                  aria-hidden
                  className={`block transition-all duration-300 ${
                    isActive
                      ? "h-[2px] w-6 bg-aviation-orange"
                      : "h-px w-3 bg-surface-warm/40 group-hover:w-5 group-hover:bg-surface-warm/80"
                  }`}
                />
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
