/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f0f8',
          100: '#ebe1f1',
          200: '#d7c3e3',
          300: '#c3a5d5',
          400: '#9f69b8',
          500: '#3B1E54',
          600: '#351a4a',
          700: '#2f1640',
          800: '#291236',
          900: '#1a0b22',
        },
        accent: {
          50: '#fff9f0',
          100: '#fff3e0',
          200: '#ffe6c2',
          300: '#ffd9a3',
          400: '#ffcc84',
          500: '#FFB26F',
          600: '#ff9d47',
          700: '#ff8c1f',
          800: '#e67e00',
          900: '#cc6f00',
        },
        background: '#F9F9FB',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        xs: '0.25rem',
        sm: '0.375rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
      },
    },
  },
  plugins: [],
}
