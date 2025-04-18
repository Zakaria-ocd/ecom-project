/** @type {import('tailwindcss').Config} */
import shadcnAnimation from "tailwindcss-animate";
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
    backgroundImage: {
      "colored-gradient-text":
        'linear-gradient(to bottom right, theme("colors.rose.500"), theme("colors.orange.400"), theme("colors.rose.500"))',
    },
  },
  plugins: [shadcnAnimation],
};
