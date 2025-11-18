/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        assistant: ['Assistant', 'sans-serif'],
        rubik: ['Rubik', 'sans-serif'],
        heebo: ['Heebo', 'sans-serif'],
      },
      colors: {
        gold: {
          DEFAULT: '#d4af37',
          light: '#f4d378',
          dark: '#a08628',
        }
      }
    },
  },
  plugins: [],
}

