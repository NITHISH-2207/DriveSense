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
          DEFAULT: '#176B5B',
          dark: '#125247',
          soft: '#E8F5F1',
        },
        accent: {
          DEFAULT: '#E5A84B',
        },
        background: '#FAFCFB',
        surface: '#FFFFFF',
        text: {
          primary: '#1F2927',
          secondary: '#66736F',
        },
        border: {
          DEFAULT: '#DCE7E3',
        },
        status: {
          success: '#3C9A70',
          warning: '#D99A32',
          critical: '#D86666',
        }
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'cta': '11px',
      },
    },
  },
  plugins: [],
}
