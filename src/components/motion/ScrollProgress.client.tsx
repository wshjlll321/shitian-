"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <>
      {/* Background track — barely-visible hairline so the progress fill has
          a rail to ride on. Same colour as the warm-white text at very low
          opacity so it adapts to both dark and light tones. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-[80] h-[2px] bg-[linear-gradient(90deg,rgba(245,241,234,0.04)_0%,rgba(245,241,234,0.06)_50%,rgba(245,241,234,0.04)_100%)]"
      />
      {/* Progress fill — gradient + soft halo so it reads as a heated metal
          bar rather than a flat solid block. */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[81] h-[2px] w-full origin-left bg-[linear-gradient(90deg,rgba(198,106,50,0.0)_0%,rgba(198,106,50,0.85)_25%,rgb(232,128,60)_55%,rgba(198,106,50,0.85)_85%,rgba(198,106,50,0.45)_100%)]"
        style={{
          scaleX,
          boxShadow: "0 0 12px rgba(198,106,50,0.55), 0 0 24px rgba(198,106,50,0.25)"
        }}
      />
    </>
  );
}
