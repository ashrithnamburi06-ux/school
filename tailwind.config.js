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
          DEFAULT: '#14532D',
          dark: '#0F3D22',
          light: '#166534',
        },
        accent: {
          DEFAULT: '#22C55E',
          dark: '#16A34A',
          light: '#4ADE80',
        },
        background: '#F0FDF4',
        surface: '#F0FDF4',
        text: '#1F2937',
        // Journey Stage Colors
        stage1: {
          yellow: '#FEF9C3',
          green: '#DCFCE7',
          blue: '#E0F2FE',
        },
        stage2: {
          green: '#22C55E',
          white: '#FFFFFF',
        },
        stage3: {
          blue: '#1E3A8A',
          gold: '#F59E0B',
        },
        // CBSE Purple Theme
        cbse: {
          primary: '#5B21B6',
          dark: '#4C1D95',
          light: '#8B5CF6',
          bg: '#F5F3FF',
          border: '#E9D5FF',
        },
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.05)',
        'medium': '0 8px 30px rgba(0, 0, 0, 0.08)',
      },
      spacing: {
        '128': '32rem',
      },
    },
  },
  plugins: [],
}
