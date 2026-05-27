import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "contact";

const variantClassName: Record<ButtonVariant, string> = {
  primary:
    "btn-glow bg-aviation-orange text-surface-warm hover:bg-aviation-orange/95 focus-visible:outline-aviation-orange",
  secondary:
    "border border-carbon-black/25 bg-transparent text-carbon-black hover:border-carbon-black hover:bg-carbon-black/[0.04] focus-visible:outline-carbon-black",
  ghost:
    "border border-current/15 bg-transparent text-current hover:bg-current/5 focus-visible:outline-current",
  contact:
    "border border-carbon-black/15 bg-transparent text-carbon-black hover:border-aviation-orange hover:text-aviation-orange focus-visible:outline-aviation-orange"
};

type SharedProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
};

type ButtonProps = SharedProps &
  ComponentPropsWithoutRef<"button"> & {
    href?: never;
  };

type LinkButtonProps = SharedProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, "className"> & {
    href: string;
  };

export function Button(props: ButtonProps | LinkButtonProps) {
  const { children, variant = "primary", className } = props;
  const baseClassName = cn(
    "inline-flex min-h-12 items-center justify-center gap-2 rounded-industrial px-5 text-sm font-medium transition duration-200 ease-precision focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
    variantClassName[variant],
    className
  );

  if ("href" in props && props.href) {
    const { href, variant: _variant, className: _className, children: _children, ...linkProps } = props;

    return (
      <Link href={href} className={baseClassName} {...linkProps}>
        {children}
      </Link>
    );
  }

  const buttonProps = props as ButtonProps;
  const { variant: _variant, className: _className, children: _children, href: _href, ...nativeButtonProps } = buttonProps;

  return (
    <button className={baseClassName} {...nativeButtonProps}>
      {children}
    </button>
  );
}
