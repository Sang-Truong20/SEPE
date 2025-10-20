/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#01bd30',
        secondary: '#00994D',
        tertiary: '#66CC99',
        dark: {
          primary: '#0a0f1a',
          secondary: '#111827',
          tertiary: '#1a2332',
          accent: '#1e293b',
        },
        light: {
          primary: '#E7FAE8',
          secondary: '#C5E6C6',
          tertiary: '#A3D2A4',
        },
        text: {
          primary: '#ffffff',
          secondary: '#9ca3af',
          muted: 'rgb(156 163 175)',
          accent: '#01bd30',
        },
        muted: {
          foreground: 'rgb(156 163 175)',
        },
        background: '#0a0f1a',
        foreground: '#ffffff',
        card: {
          background: 'rgba(17, 24, 39, 0.6)',
          border: 'rgba(255, 255, 255, 0.08)',
        },
        border: 'rgba(255, 255, 255, 0.08)',
      },
    },
  },
  plugins: [],
};
