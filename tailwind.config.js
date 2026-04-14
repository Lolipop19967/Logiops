/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          50:  '#f3f0ff',
          100: '#e9e3ff',
          200: '#d4c5f9',
          300: '#b49ef5',
          400: '#9370eb',
          500: '#7c3aed',
          600: '#6d28d9',
          700: '#5b21b6',
          800: '#4c1d95',
          900: '#3b1173',
          950: '#2e0d6e',
        },
      },
    },
  },
  plugins: [],
}
