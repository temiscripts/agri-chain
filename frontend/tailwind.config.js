/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // AgriChain brand
        forest: '#1A6B3C',
        'forest-deep': '#134E2A',
        growth: '#2E7D32',
        gold: '#F5A623',
        'gold-soft': '#FEF3D7',
        earth: '#4E342E',
        slate: '#37474F',
        seedling: '#E8F5E9',
        'seedling-deep': '#C8E6C9',
        cream: '#FAFAF7',
        line: '#E5E7EB',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}