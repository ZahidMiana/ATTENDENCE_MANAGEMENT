/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cyber': {
          dark: '#0a0a0f',
          darker: '#050508',
        },
        'void': '#1a1a2e',
        'neon': {
          cyan: '#00f5ff',
          purple: '#bf40bf',
          pink: '#ff006e',
          green: '#00ff88',
          yellow: '#ffcc00',
          red: '#ff0055',
        },
      },
      fontFamily: {
        'heading': ['Orbitron', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
        'mono': ['Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
