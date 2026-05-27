export const breakpoints = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280
} as const;

export const mediaQuery = {
  mobile: `(max-width: ${breakpoints.mobile - 1}px)`,
  tablet: `(min-width: ${breakpoints.mobile}px) and (max-width: ${breakpoints.tablet - 1}px)`,
  desktopUp: `(min-width: ${breakpoints.tablet}px)`,
  reducedMotion: "(prefers-reduced-motion: reduce)",
  coarsePointer: "(pointer: coarse)"
} as const;
