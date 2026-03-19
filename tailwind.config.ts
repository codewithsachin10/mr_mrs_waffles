import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0F0F0F",
        foreground: "#F5F5DC",
        chocolate: {
          950: "#0F0F0F", // Deep chocolate black
          900: "#1A1513",
          800: "#2D2420",
        },
        caramel: {
          500: "#FFB347", // Caramel gold
          600: "#E69B3A",
        },
        waffle: {
          500: "#8B4513", // Chocolate brown
          600: "#6F370E",
        },
        cream: {
          50: "#F5F5DC", // Cream / off-white
          100: "#EBEBD0",
        },
        strawberry: {
          500: "#FF4D6D", // Strawberry red
          600: "#E63956",
        },
      },
      fontFamily: {
        heading: ["var(--font-heading)"],
        body: ["var(--font-body)"],
      },
    },
  },
  plugins: [],
} satisfies Config;
