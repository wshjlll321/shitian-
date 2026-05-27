"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

import { easing } from "@/lib/motion/easing";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  /** Vertical distance in px. Default 18. */
  distance?: number;
  /** Animation duration in seconds. Default 0.7. */
  duration?: number;
  /** Re-trigger every time. Default false (once). */
  repeat?: boolean;
  /** Negative margin for IntersectionObserver. Default "-12% 0px". */
  margin?: string;
  className?: string;
  as?: "div" | "section" | "article" | "header" | "footer" | "li";
};

export function Reveal({
  children,
  delay = 0,
  distance = 18,
  duration = 0.7,
  repeat = false,
  margin = "-12% 0px",
  className,
  as = "div"
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const MotionTag = motion[as];

  return (
    <MotionTag
      className={className}
      initial={shouldReduceMotion ? false : { opacity: 0, y: distance }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: !repeat, margin: margin as `${number}% 0px` }}
      transition={{ duration, delay, ease: easing.out }}
    >
      {children}
    </MotionTag>
  );
}
