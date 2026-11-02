import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        atmosphere: {
          bg: "#081522",
          surface: "#102538",
          elevated: "#183249",
          border: "#28445B",
          ice: "#61C7E7",
          teal: "#47C8C1",
          text: "#F1F7FC",
          muted: "#A1B6C8",
          warning: "#E9B45A",
          severe: "#E76B70",
          safe: "#5AC49E",
        },
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "Manrope", "sans-serif"],
        heading: ["var(--font-dmsans)", "DM Sans", "sans-serif"],
        mono: ["var(--font-mono)", "IBM Plex Mono", "monospace"],
      },
      boxShadow: {
        atmospheric: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        glow: "0 0 20px rgba(97, 199, 231, 0.25)",
        hazard: "0 0 24px rgba(231, 107, 112, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
