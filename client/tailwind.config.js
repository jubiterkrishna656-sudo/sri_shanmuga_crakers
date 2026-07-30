/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Poppins', 'sans-serif']
      },
      colors: {
        primary: { 50: '#fff7ed', 100: '#ffedd5', 200: '#fed7aa', 300: '#fdba74', 400: '#fb923c', 500: '#f97316', 600: '#ea580c', 700: '#c2410c' },
        festive: { red: '#dc2626', gold: '#f59e0b', green: '#16a34a', orange: '#ea580c', purple: '#7c3aed' }
      }
    }
  },
  plugins: []
};
