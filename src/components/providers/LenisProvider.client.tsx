"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { useMotionPrefs } from "@/components/providers/MotionPrefsProvider.client";

export function LenisProvider({ children }: { children: ReactNode }) {
  const { smoothScrollEnabled } = useMotionPrefs();
  const pathname = usePathname();

  // Home uses CSS scroll-snap; Lenis would fight the browser snap engine.
  const isHome = pathname === "/";

  useEffect(() => {
    if (!smoothScrollEnabled || isHome) {
      return undefined;
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.2
    });

    let frame = 0;

    function raf(time: number) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    }

    frame = requestAnimationFrame(raf);

    const onScroll = () => {
      window.dispatchEvent(new Event("lenis:scroll"));
    };
    lenis.on("scroll", onScroll);

    return () => {
      cancelAnimationFrame(frame);
      lenis.off("scroll", onScroll);
      lenis.destroy();
    };
  }, [smoothScrollEnabled, isHome]);

  return <>{children}</>;
}
