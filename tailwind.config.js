/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,html}", // Scans all files in src for Tailwind classes
  ],
  theme: {
    extend: {
      colors: {
        // Your original brand colors
        brand: {
          DEFAULT: "#10B981",
          dark: "#0e9f6e",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
    },
  },
  plugins: [],
};
