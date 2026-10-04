import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        win: {
          bg: "#0d1117",
          surface: "#161b22",
          panel: "#1c2128",
          border: "#30363d",
          accent: "#22d3ee",
          "accent-dim": "#0891b2",
          text: "#e6edf3",
          muted: "#8b949e",
          taskbar: "#0a0e14",
          hover: "#21262d",
        },
        nothing: {
          bg: "#000000",
          surface: "#0d0d0d",
          card: "#1a1a1a",
          border: "#ffffff14",
          red: "#D71921",
          text: "#ffffff",
          muted: "#ffffff73",
          dim: "#ffffff40",
          hover: "#242424",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Segoe UI", "system-ui", "sans-serif"],
        mono: ["var(--font-cascadia)", "Consolas", "monospace"],
      },
      boxShadow: {
        window: "0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(48, 54, 61, 0.8)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        blink: "blink 1s step-end infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
