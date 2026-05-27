/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: '#0A2540',
        green: '#1D9E75',
        surface: '#F5F7FA',
        ganado: '#1D9E75',
        perdido: '#D32F2F',
        pendiente: '#E89B17',
        anulado: '#888780',
        'text-secondary': '#5A6B85',
        'text-muted': '#A0A8B5',
        'text-accent': '#B8D4F4',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        'jetbrains-mono': ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
