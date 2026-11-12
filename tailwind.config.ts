import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: "#0F172A", 800: "#13203f", 700: "#1b2b52" },
        brand: { DEFAULT: "#2563EB", 600: "#1d4ed8" },
        cyan2: "#06B6D4",
        teal2: "#14B8A6",
        mist: "#F8FAFC",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Noto Sans Devanagari", "system-ui", "sans-serif"],
        display: ["var(--font-grotesk)", "var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: { glow: "0 0 60px -10px rgba(37,99,235,.55)" },
    },
  },
  plugins: [],
};
export default config;
