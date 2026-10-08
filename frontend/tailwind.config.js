/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#D97706', // Deep Jaggery Amber
          hover: '#C06805',
          light: '#FDE68A',
          dark: '#B45309',
        },
        secondary: {
          DEFAULT: '#B45309', // Warm Caramel
          hover: '#92400E',
          light: '#FDEBD0',
          dark: '#78350F',
        },
        espresso: {
          DEFAULT: '#291D17', // Deep Espresso Brown
          light: '#4A3B32',
          muted: '#786C64',
        },
        oat: {
          DEFAULT: '#FEF9F3', // Creamy Oat Background
          light: '#FFFDF9',
          card: '#FFFFFF',
          border: '#F3E8DC',
          darker: '#F5EBE1',
        },
        jaggery: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
          950: '#451A03',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Poppins', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(41, 29, 23, 0.05), 0 2px 6px -1px rgba(41, 29, 23, 0.03)',
        'elevated': '0 12px 30px -4px rgba(217, 119, 6, 0.12), 0 4px 12px -2px rgba(41, 29, 23, 0.06)',
        'glow': '0 0 25px -3px rgba(217, 119, 6, 0.35)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
}
