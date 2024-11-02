import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Figtree', ...defaultTheme.fontFamily.sans],
      },
      padding: {
        "p": "0.12rem"
      },
      height: {
        "carousel_mobile": "540%"
      },
      fontSize : {
        "mobile" : "0.5rem"
      },
      screens: {
        'screen320': { 'raw': '(max-width: 320px) and (max-height: 680px)' },
        'tablet': { 'raw': '(max-width: 768px) and (max-height: 1080px)' },
      },
    },
  },
  plugins: [],
}