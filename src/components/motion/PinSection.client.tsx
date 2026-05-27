"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

import { useMotionPrefs } from "@/components/providers/MotionPrefsProvider.client";
import { loadGsap } from "@/lib/motion/gsap";

type PinSectionProps = {
  children: ReactNode;
  /**
   * Total scroll distance for the pinned area, expressed in viewport heights.
   * 1 = pin for one extra screen of scroll, 2 = two screens, etc.
   */
  scrollHeight?: number;
  /** Class applied to the outer wrapper that owns the scroll length. */
  className?: string;
  /** Class applied to the inner sticky stage. */
  innerClassName?: string;
  style?: CSSProperties;
};

export function PinSection({
  children,
  scrollHeight = 2,
  className,
  innerClassName,
  style
}: PinSectionProps) {
  const { reducedMotion, isMobile } = useMotionPrefs();
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const stage = stageRef.current;
    if (!wrapper || !stage) return undefined;

    if (reducedMotion || isMobile) {
      return undefined;
    }

    let trigger: gsap.plugins.ScrollTrigger | undefined;
    let cancelled = false;

    loadGsap().then(({ ScrollTrigger }) => {
      if (cancelled) return;
      trigger = ScrollTrigger.create({
        trigger: wrapper,
        start: "top top",
        end: () => `+=${window.innerHeight * scrollHeight}`,
        pin: stage,
        pinSpacing: false,
        invalidateOnRefresh: true
      });
    });

    return () => {
      cancelled = true;
      trigger?.kill();
    };
  }, [reducedMotion, isMobile, scrollHeight]);

  const wrapperHeight =
    reducedMotion || isMobile
      ? undefined
      : `calc(100vh + 100vh * ${scrollHeight})`;

  return (
    <div
      ref={wrapperRef}
      className={className}
      style={{ position: "relative", height: wrapperHeight, ...style }}
    >
      <div
        ref={stageRef}
        className={innerClassName}
        style={{
          position: "relative",
          height: "100vh",
          width: "100%",
          overflow: "hidden"
        }}
      >
        {children}
      </div>
    </div>
  );
}
