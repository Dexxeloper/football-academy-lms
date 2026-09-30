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
        navy: {
          DEFAULT: "#0b1329",
          dark: "#060b17",
          light: "#142247",
          card: "#111c38",
          border: "#1e2e5c",
        },
        emerald: {
          accent: "#10b981",
          hover: "#059669",
          glow: "rgba(16, 185, 129, 0.15)",
        },
      },
    },
  },
  plugins: [],
};
export default config;
