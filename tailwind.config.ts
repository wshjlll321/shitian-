import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/content/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        carbon: {
          black: "rgb(var(--color-carbon-black) / <alpha-value>)",
          graphite: "rgb(var(--color-graphite) / <alpha-value>)"
        },
        surface: {
          warm: "rgb(var(--color-warm-white) / <alpha-value>)",
          porcelain: "rgb(var(--color-porcelain) / <alpha-value>)",
          ash: "rgb(var(--color-ash-gray) / <alpha-value>)"
        },
        metal: {
          gray: "rgb(var(--color-metal-gray) / <alpha-value>)",
          silver: "rgb(var(--color-steel-silver) / <alpha-value>)"
        },
        aviation: {
          green: "rgb(var(--color-aviation-green) / <alpha-value>)",
          orange: "rgb(var(--color-burnt-orange) / <alpha-value>)",
          red: "rgb(var(--color-signal-red) / <alpha-value>)"
        }
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "system-ui", "sans-serif"],
        numeric: ["var(--font-numeric)", "var(--font-sans)", "system-ui", "sans-serif"]
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "30": "7.5rem",
        "40": "10rem"
      },
      borderRadius: {
        industrial: "var(--radius-md)"
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        deep: "var(--shadow-deep)",
        industrial: "var(--shadow-industrial)"
      },
      transitionTimingFunction: {
        precision: "var(--ease-precision)"
      }
    }
  },
  plugins: []
};

export default config;
