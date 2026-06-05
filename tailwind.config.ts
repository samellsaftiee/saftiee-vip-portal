import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50:  "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#C9A84C",
          600: "#B8860B",
          700: "#92660A",
          800: "#78530A",
          900: "#5c3e08",
        },
        blush: {
          50:  "#fff0f5",
          100: "#ffe4ef",
          200: "#ffcce0",
          300: "#ffaac9",
          400: "#ff80b0",
          500: "#F4A0BD",
          600: "#e8739e",
          700: "#cc4f7d",
          800: "#a83563",
          900: "#7d2049",
        },
        cream: "#FDF8F3",
        ink:   "#1a1410",
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "Georgia", "serif"],
        body:    ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        mono:    ["var(--font-dm-mono)", "monospace"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #C9A84C 0%, #fde68a 50%, #B8860B 100%)",
        "hero-gradient": "linear-gradient(160deg, #FDF8F3 0%, #fff0f5 50%, #fffbeb 100%)",
        "card-shimmer": "linear-gradient(105deg, transparent 40%, rgba(201,168,76,0.08) 50%, transparent 60%)",
      },
      boxShadow: {
        "gold-sm":  "0 2px 8px rgba(201,168,76,0.18)",
        "gold-md":  "0 4px 20px rgba(201,168,76,0.22)",
        "gold-lg":  "0 8px 40px rgba(201,168,76,0.28)",
        "blush-sm": "0 2px 8px rgba(244,160,189,0.18)",
        "luxury":   "0 20px 60px rgba(26,20,16,0.12), 0 4px 16px rgba(201,168,76,0.15)",
      },
      animation: {
        "shimmer":     "shimmer 2.5s infinite",
        "fade-up":     "fadeUp 0.6s ease forwards",
        "float":       "float 4s ease-in-out infinite",
        "pulse-gold":  "pulseGold 2s ease-in-out infinite",
      },
      keyframes: {
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-8px)" },
        },
        pulseGold: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(201,168,76,0.4)" },
          "50%":      { boxShadow: "0 0 0 10px rgba(201,168,76,0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
