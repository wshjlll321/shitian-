import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type ContainerProps = {
  children: ReactNode;
  className?: string;
  size?: "page" | "content" | "reading";
};

const sizeClassName = {
  page: "max-w-[var(--container-page)]",
  content: "max-w-[var(--container-content)]",
  reading: "max-w-[var(--container-reading)]"
};

export function Container({ children, className, size = "content" }: ContainerProps) {
  return (
    <div className={cn("mx-auto w-full px-5 md:px-8 xl:px-12", sizeClassName[size], className)}>
      {children}
    </div>
  );
}
