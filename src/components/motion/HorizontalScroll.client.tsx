"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { useMotionPrefs } from "@/components/providers/MotionPrefsProvider.client";
import { loadGsap } from "@/lib/motion/gsap";

type HorizontalScrollProps = {
  children: ReactNode;
  /** Class applied to the wrapper that owns the scroll length. */
  className?: string;
  /** Class applied to the inner track that moves horizontally. */
  trackClassName?: string;
};

export function HorizontalScroll({ children, className, trackClassName }: HorizontalScrollProps) {
  const { reducedMotion, isMobile } = useMotionPrefs();
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (reducedMotion || isMobile) return undefined;
    const wrapper = wrapperRef.current;
    const track = trackRef.current;
    if (!wrapper || !track) return undefined;

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled) return;

      const compute = () => track.scrollWidth - wrapper.clientWidth;

      const tween = gsap.to(track, {
        x: () => -compute(),
        ease: "none",
        scrollTrigger: {
          trigger: wrapper,
          start: "top top",
          end: () => `+=${compute()}`,
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });

      cleanup = () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [reducedMotion, isMobile]);

  // On mobile / reduced motion: native horizontal overflow.
  if (reducedMotion || isMobile) {
    return (
      <div
        ref={wrapperRef}
        className={className}
        style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}
      >
        <div ref={trackRef} className={trackClassName} style={{ display: "flex" }}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={wrapperRef}
      className={className}
      style={{ position: "relative", overflow: "hidden", height: "100vh" }}
    >
      <div
        ref={trackRef}
        className={trackClassName}
        style={{ display: "flex", height: "100%", willChange: "transform" }}
      >
        {children}
      </div>
    </div>
  );
}
