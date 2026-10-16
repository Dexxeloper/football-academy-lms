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
        brand: {
          50: "#f0fdf4",
          100: "#DCFCE7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16A34A",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          DEFAULT: "#16A34A",
          primary: "#16A34A",
          dark: "#166534",
          light: "#DCFCE7",
          hover: "#15803D",
        },
        surface: {
          DEFAULT: "#F7F9F8",
          card: "#FFFFFF",
          muted: "#F3F4F6",
          border: "#E5E7EB",
        },
      },
    },
  },
  plugins: [],
};
export default config;
