import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f0f9f9',
          100: '#d0eeee',
          200: '#a3dcdc',
          300: '#6bc3c3',
          400: '#3aa8a8',
          500: '#1e8e8e',
          600: '#167272',
          700: '#125c5c',
          800: '#0f4848',
          900: '#0c3838',
        },
      },
    },
  },
  plugins: [],
};

export default config;
