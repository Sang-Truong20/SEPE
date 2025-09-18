/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#01bd30',
        secondary: '#00994D',
        tertiary: '#66CC99',
      },
    },
  },
  plugins: [],
};
