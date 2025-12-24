/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'system-ui', 'sans-serif'],
      },
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
      keyframes: {
        loaderGlow: {
          '0%': { transform: 'translateX(0)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateX(180%)', opacity: '0' },
        },
      },
      animation: {
        'loader-glow': 'loaderGlow 2.2s ease-in-out forwards',
      },
    },
  },
  plugins: [],
}

