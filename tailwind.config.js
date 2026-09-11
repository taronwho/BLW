/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F8F8F5',
        ink: '#16211D',
        muted: '#67716D',
        accent: '#1F6F5C',
        safe: '#2F7D4F',
        caution: '#9A6510',
        risk: '#A32318',
        surface: '#FFFFFF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      spacing: {
        'safe-b': 'env(safe-area-inset-bottom)',
      },
      minHeight: {
        touch: '44px',
      },
      minWidth: {
        touch: '44px',
      },
    },
  },
  plugins: [],
};
