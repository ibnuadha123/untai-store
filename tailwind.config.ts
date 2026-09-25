import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#221B22",
        cloud: "#ECE7E9",
        raspberry: {
          DEFAULT: "#C6355F",
          dark: "#A32A4C",
        },
        gold: {
          DEFAULT: "#E8AE3D",
          dark: "#C9932A",
        },
        forest: {
          DEFAULT: "#3C5A48",
          light: "#4F7460",
        },
        paper: "#F5F1F0",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Archivo", "sans-serif"],
      },
      borderRadius: {
        strap: "2rem",
      },
      maxWidth: {
        prose: "38rem",
      },
    },
  },
  plugins: [],
};

export default config;
