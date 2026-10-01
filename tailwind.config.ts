import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#241D28",
        cloud: "#D2C2D8",
        raspberry: {
          DEFAULT: "#A45B92",
          dark: "#8B4A7A",
        },
        gold: {
          DEFAULT: "#A6A1D9",
          dark: "#8B85C7",
        },
        forest: {
          DEFAULT: "#5B4066",
          light: "#7A5D82",
        },
        paper: "#D9CFDD",
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
