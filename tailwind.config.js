/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '1.5rem',
          md: '1.5rem',
        },
        screens: {
          sm: '100%',
          md: '1000px',
          lg: '1000px',
          xl: '1000px',
        },
      },
    },
  },
  plugins: [],
}

