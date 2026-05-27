"use client";

import { useEffect, useRef, useState } from "react";

import { useMotionPrefs } from "@/components/providers/MotionPrefsProvider.client";

type CountUpProps = {
  to: number;
  from?: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  format?: (value: number) => string;
  threshold?: number;
};

export function CountUp({
  to,
  from = 0,
  duration = 1.6,
  decimals = 0,
  prefix,
  suffix,
  className,
  format,
  threshold = 0.4
}: CountUpProps) {
  const { reducedMotion } = useMotionPrefs();
  const ref = useRef<HTMLSpanElement | null>(null);
  const [value, setValue] = useState(reducedMotion ? to : from);
  const playedRef = useRef(false);

  useEffect(() => {
    if (reducedMotion) {
      setValue(to);
      return undefined;
    }

    const node = ref.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !playedRef.current) {
            playedRef.current = true;
            const start = performance.now();
            const tick = (now: number) => {
              const t = Math.min(1, (now - start) / (duration * 1000));
              const eased = 1 - Math.pow(1 - t, 3);
              setValue(from + (to - from) * eased);
              if (t < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
        });
      },
      { threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [from, to, duration, reducedMotion, threshold]);

  const display = format ? format(value) : value.toFixed(decimals);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
