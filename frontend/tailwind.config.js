/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: '#1A6B3C',        // primary brand
        'forest-dark': '#0F4A28',
        growth: '#2E7D32',        // buttons, hover
        harvest: '#F5A623',       // accent, badges
        'harvest-light': '#FCD789',
        earth: '#4E342E',         // body text
        slate: '#37474F',         // secondary text
        seedling: '#E8F5E9',      // card bg, tints
        sunlight: '#FEF3D7',      // warnings, callouts
        cream: '#FAFBF7',         // page bg
        border: '#D7E4DC',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}