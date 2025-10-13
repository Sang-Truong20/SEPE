/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#01bd30',
        secondary: '#00994D',
        tertiary: '#66CC99',
        dark: {
          primary: '#0A1F1C',
          secondary: '#1A2928',
          tertiary: '#203937',
          accent: '#2A4A47',
        },
        light: {
          primary: '#E7FAE8',
          secondary: '#C5E6C6',
          tertiary: '#A3D2A4',
        },
        text: {
          primary: '#E7FAE8',
          secondary: '#A3D2A4',
          muted: '#6B7280',
          accent: '#01bd30',
        },
      },
    },
  },
  plugins: [],
};
