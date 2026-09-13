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
        // Ztmaveno na poměr 4,5:1 proti měkkým podkladům — štítky rizika dušení
        // musí být čitelné (docs/SPEC.md kap. 6, WCAG AA).
        safe: '#2C754A',
        caution: '#8F5D0E',
        risk: '#A32318',
        surface: '#FFFFFF',
        /* Jemné plochy a linky pro modernější, méně „ohraničený" vzhled. */
        line: '#E4E7E5',
        'accent-soft': '#E8F2EE',
        'accent-deep': '#14513F',
        'risk-soft': '#FCECEA',
        'caution-soft': '#FBF2E3',
        'safe-soft': '#E9F4ED',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(22, 33, 29, 0.05), 0 1px 8px rgba(22, 33, 29, 0.04)',
        lift: '0 2px 6px rgba(22, 33, 29, 0.07), 0 12px 28px rgba(22, 33, 29, 0.07)',
      },
      backgroundImage: {
        'accent-sheen': 'linear-gradient(135deg, #1F6F5C 0%, #2C8C6F 60%, #3AA183 100%)',
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
