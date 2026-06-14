import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Landing page brand colors
        'ff5d22': '#ff5d22',
        '39ff14': '#39ff14',
        '3b82f6': '#3b82f6',
        'fcfaf2': '#fcfaf2',
        '0a0a0c': '#0a0a0c',
        '0f0f12': '#0f0f12',
        '121215': '#121215',
        '18181c': '#18181c',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
