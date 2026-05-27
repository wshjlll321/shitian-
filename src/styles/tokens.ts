export const designTokens = {
  color: {
    carbonBlack: "#111111",
    graphite: "#1E1F1D",
    warmWhite: "#F5F1EA",
    porcelain: "#FAF8F3",
    metalGray: "#8C8F8A",
    ashGray: "#D8D5CD",
    steelSilver: "#B7BAB2",
    aviationGreen: "#364237",
    burntOrange: "#C66A32",
    signalRed: "#A33A2B"
  },
  radius: {
    none: "0",
    sm: "4px",
    md: "8px",
    lg: "12px"
  },
  motion: {
    easePrecision: "cubic-bezier(0.22, 1, 0.36, 1)",
    fast: "180ms",
    standard: "520ms",
    cinematic: "1100ms"
  },
  layout: {
    page: "1440px",
    content: "1200px",
    reading: "720px"
  }
} as const;
