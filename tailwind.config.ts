import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: '#0a0e1a',
        'navy-light': '#111827',
        gold: '#c9a84c',
        'gold-light': '#e0c068',
        seafoam: '#2d9e8d',
        'seafoam-light': '#3ab8a5',
        crimson: '#8b1a1a',
        'crimson-light': '#b02222',
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
      },
    },
  },
  plugins: [],
};

export default config;
