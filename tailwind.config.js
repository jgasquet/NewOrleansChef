/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        burgundy: {
          DEFAULT: '#6B1B2B',
          deep: '#4A1219',
        },
        gold: {
          DEFAULT: '#C9A227',
          light: '#E8D48B',
        },
        cream: {
          DEFAULT: '#F5F0E6',
          dark: '#E8DFD0',
        },
        forest: {
          DEFAULT: '#2D4A3E',
          dark: '#1E332B',
        },
        brown: {
          DEFAULT: '#3D2914',
          dark: '#33261C',
        },
        black: '#1A1614',
        white: '#FFFEF9',
        blue: {
          DEFAULT: '#1A3A4A',
          dark: '#122933',
        },
        tan: {
          DEFAULT: '#6B5B35',
          dark: '#4A3F25',
        },
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        crimson: ['"Crimson Pro"', 'Georgia', 'serif'],
        bebas: ['"Bebas Neue"', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
