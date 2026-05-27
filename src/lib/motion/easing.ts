export const easing = {
  out: [0.22, 1, 0.36, 1] as const,
  inOut: [0.83, 0, 0.17, 1] as const,
  enter: [0.16, 1, 0.3, 1] as const
};

export const easingCss = {
  out: "cubic-bezier(0.22, 1, 0.36, 1)",
  inOut: "cubic-bezier(0.83, 0, 0.17, 1)",
  enter: "cubic-bezier(0.16, 1, 0.3, 1)"
};

export const duration = {
  fast: 0.18,
  standard: 0.52,
  cinematic: 1.1
};
