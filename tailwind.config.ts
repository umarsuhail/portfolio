import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // Enables dark mode support via class
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      colors: {
        backgroundLight: "#FFFFFF", // light mode background
        backgroundDark: "bg-gray-900", // dark mode background
        textLight: "#1A1A1A", // light mode text
        textDark: "#FFFFFF", // dark mode text
      },
      keyframes: {
        fadeInUp: {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        fadeInDown: {
          "0%": {
            opacity: "0",
            transform: "translateY(-20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0px)",
          },
        },
        fadeInRight: {
          "0%": {
            opacity: "0",
            transform: "translateX(-200px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0px)",
          },
        },
        gradient: {
          '0%': {
            backgroundPosition: '0% 50%',
          },
          '50%': {
            backgroundPosition: '100% 50%',
          },
          '100%': {
            backgroundPosition: '0% 50%',
          },
        },
        glow: {
          '0%': {
            textShadow: '0 0 5px rgba(243, 166, 179, 0.5), 0 0 10px rgba(243, 166, 179, 0.5), 0 0 15px rgba(243, 166, 179, 0.5), 0 0 20px rgba(255, 0, 150, 0.5), 0 0 25px rgba(255, 0, 150, 0.5)',
          },
          '50%': {
            textShadow: '0 0 10px rgba(243, 166, 179, 0.8), 0 0 20px rgba(243, 166, 179, 0.8), 0 0 30px rgba(243, 166, 179, 0.8), 0 0 40px rgba(255, 0, 150, 0.7), 0 0 50px rgba(255, 0, 150, 0.7)',
          },
          '100%': {
            textShadow: '0 0 20px rgba(243, 166, 179, 1), 0 0 30px rgba(243, 166, 179, 1), 0 0 40px rgba(243, 166, 179, 1), 0 0 50px rgba(255, 0, 150, 1), 0 0 60px rgba(255, 0, 150, 1)',
          },
        }
      },
      animation: {
        fadeInUp: "fadeInUp 1s ease-out",
        fadeInDown: "fadeInDown 1s ease-in",
        fadeInRight: "fadeInRight 1s ease-in",
        glow: 'glow 1.5s infinite alternate',
        gradient: 'gradient 5s ease infinite',

      },
    },
  },
  plugins: [],
};

export default config;
