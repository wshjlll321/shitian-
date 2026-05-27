import { createElement, type ElementType, type ReactNode } from "react";

import { cn } from "@/lib/cn";

type SectionTone = "light" | "dark" | "warm" | "transparent";

type SectionProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  tone?: SectionTone;
  id?: string;
};

const toneClassName: Record<SectionTone, string> = {
  light: "bg-surface-porcelain text-carbon-black",
  warm: "bg-surface-warm text-carbon-black",
  dark: "bg-carbon-black text-surface-warm",
  transparent: "bg-transparent"
};

export function Section({ children, as: Component = "section", className, tone = "transparent", id }: SectionProps) {
  return createElement(
    Component,
    {
      id,
      className: cn("relative overflow-hidden py-20 md:py-30", toneClassName[tone], className)
    },
    children
  );
}
