/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        shopco: {
          black: '#000000',
          light: '#F2F0F1',
          card: '#F0EEED',
          border: 'rgba(0, 0, 0, 0.1)',
          red: '#FF3333',
          yellow: '#FFC633',
          green: '#01AB31'
        }
      },
      fontFamily: {
        heading: ['Syne', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif']
      }
    },
  },
  plugins: [],
}
