"use client";

import { useEffect, useState, type MouseEvent } from "react";

type Slide = {
  id: string;
  label: string;
};

type SlideDotsProps = {
  slides: Slide[];
};

/**
 * Fixed right-edge slide navigator. Inactive dots use mix-blend-mode:
 * difference against pure white so they remain visible on both dark and
 * light slides. Active dot is solid aviation orange.
 */
export function SlideDots({ slides }: SlideDotsProps) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const findElements = () =>
      slides
        .map((s) => document.querySelector<HTMLElement>(`[data-slide-id="${s.id}"]`))
        .filter((el): el is HTMLElement => el !== null);

    let elements = findElements();
    if (elements.length === 0) {
      requestAnimationFrame(() => {
        elements = findElements();
      });
    }

    const onScroll = () => {
      if (elements.length === 0) elements = findElements();
      const center = window.scrollY + window.innerHeight / 2;
      let best = 0;
      let bestDistance = Infinity;
      elements.forEach((el, i) => {
        const mid = el.offsetTop + el.offsetHeight / 2;
        const d = Math.abs(mid - center);
        if (d < bestDistance) {
          bestDistance = d;
          best = i;
        }
      });
      setActive(best);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [slides]);

  const jumpTo = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.querySelector<HTMLElement>(`[data-slide-id="${id}"]`);
    if (el) {
      window.scrollTo({ top: el.offsetTop, behavior: "smooth" });
    }
  };

  return (
    <nav
      aria-label="首页章节导航"
      className="pointer-events-none fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 md:right-7 md:flex"
    >
      <ul className="pointer-events-auto grid gap-3">
        {slides.map((slide, i) => {
          const isActive = i === active;
          const isNext = i === active + 1;
          return (
            <li key={slide.id}>
              <a
                href={`#${slide.id}`}
                onClick={(e) => jumpTo(e, slide.id)}
                aria-label={`跳到 ${slide.label}`}
                aria-current={isActive ? "true" : undefined}
                className="group flex items-center gap-3"
              >
                <span
                  className={`whitespace-nowrap font-numeric text-[10px] uppercase tracking-[0.22em] transition-opacity duration-300 ${
                    isActive
                      ? "text-aviation-orange opacity-100"
                      : isNext
                        ? "text-aviation-orange opacity-0 group-hover:opacity-70"
                        : "text-aviation-orange opacity-0 group-hover:opacity-70"
                  }`}
                >
                  {slide.label}
                </span>
                {isActive ? (
                  <span className="block h-[3px] w-9 rounded-sm bg-aviation-orange transition-all duration-300" />
                ) : isNext ? (
                  <span className="block h-[3px] w-6 rounded-sm bg-aviation-orange/45 transition-all duration-300 group-hover:w-8 group-hover:bg-aviation-orange/80" />
                ) : (
                  <span
                    className="block h-[3px] w-4 rounded-sm bg-white transition-all duration-300 group-hover:w-6"
                    style={{ mixBlendMode: "difference" }}
                  />
                )}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
