import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#f1ede5",
        ink: "#1a1a1a",
      },
      keyframes: {
        "spin-cw":   { from: { transform: "rotate(0deg)" }, to: { transform: "rotate(360deg)" } },
        "spin-ccw":  { from: { transform: "rotate(0deg)" }, to: { transform: "rotate(-360deg)" } },
        "halo":      {
          "0%":   { transform: "scale(0.95)", opacity: "0" },
          "40%":  { opacity: "0.18" },
          "100%": { transform: "scale(1.18)", opacity: "0" },
        },
      },
      animation: {
        "spin-cw-slow":   "spin-cw  3.6s linear infinite",
        "spin-ccw-slow":  "spin-ccw 5.4s linear infinite",
        "spin-cw-fast":   "spin-cw  2.0s linear infinite",
        "spin-ccw-fast":  "spin-ccw 2.4s linear infinite",
        "halo":           "halo 2.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
