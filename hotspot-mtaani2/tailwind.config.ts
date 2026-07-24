import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eefaf1",
          100: "#d6f2dd",
          400: "#4cae6b",
          500: "#2f9653", // primary green (matches design)
          600: "#237c43",
          700: "#1c6236",
        },
        ink: {
          900: "#0f172a", // dark navy footer
          800: "#1e293b",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl2: "1rem",
      },
    },
  },
  plugins: [],
};

export default config;
