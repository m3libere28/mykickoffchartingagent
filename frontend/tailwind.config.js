export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f4f7f5',
          100: '#e3ebe5',
          200: '#c7d6cc',
          300: '#9bb8a4',
          400: '#739a7e',
          500: '#527c5e', // Sage green base
          600: '#3e6249',
          700: '#334f3c',
          800: '#2b3f31',
          900: '#243428',
        },
        accent: {
          50: '#fdf8f7',
          100: '#faeeeb',
          200: '#f3dad4',
          300: '#e5beb5',
          400: '#d1988b',
          500: '#bb7464', // Soft Blush / Rose
          600: '#a3594b',
          700: '#88483c',
          800: '#713e35',
          900: '#5e362f',
        },
        surface: {
          50: '#fffcfb', // Cream background
          100: '#f7f3f0',
          200: '#ebe3de',
          300: '#dcd1c9',
          400: '#c5b6ac',
          500: '#b09e93',
          600: '#9c887d',
          700: '#826f65',
          800: '#6d5d54',
          900: '#5a4d46', // Deep mocha for text
          950: '#302824',
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['Outfit', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
