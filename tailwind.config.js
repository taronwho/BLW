/** @type {import('tailwindcss').Config} */

/**
 * Barvy nejsou zapsané tady, ale jako proměnné v src/index.css — jinak by
 * nešlo překlopit celou aplikaci do tmavého motivu jedním atributem na <html>.
 * Zápis `rgb(var(--c-x) / <alpha-value>)` zachovává i průhlednost (`bg-safe/10`).
 */
const token = (name) => `rgb(var(--c-${name}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: token('paper'),
        ink: token('ink'),
        muted: token('muted'),
        accent: token('accent'),
        safe: token('safe'),
        caution: token('caution'),
        risk: token('risk'),
        surface: token('surface'),
        /* Jemné plochy a linky pro modernější, méně „ohraničený" vzhled. */
        line: token('line'),
        'accent-soft': token('accent-soft'),
        'accent-deep': token('accent-deep'),
        'risk-soft': token('risk-soft'),
        'caution-soft': token('caution-soft'),
        'safe-soft': token('safe-soft'),
        /* Písmo na plné accent/safe ploše a zástin pod okénky. */
        'on-accent': token('on-accent'),
        scrim: token('scrim'),
      },
      boxShadow: {
        soft: 'var(--shadow-soft)',
        lift: 'var(--shadow-lift)',
      },
      backgroundImage: {
        'accent-sheen': 'linear-gradient(135deg, var(--sheen-1) 0%, var(--sheen-2) 60%, var(--sheen-3) 100%)',
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
      /*
       * Odškrtnutí dne. Tlačítko se z obrysu přelije do plné zelené a
       * teprve pak plán postoupí dál — rodič tak vidí, že se klepnutí
       * povedlo, místo aby mu obrazovka beze slova přeskočila jinam.
       * Zkrácení pro `prefers-reduced-motion` řeší src/index.css.
       */
      keyframes: {
        odskrtnuto: {
          '0%': { transform: 'scale(0.4)', opacity: '0' },
          '60%': { transform: 'scale(1.18)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        vyskoceni: {
          '0%': { transform: 'translateY(12px) scale(0.98)', opacity: '0' },
          '100%': { transform: 'translateY(0) scale(1)', opacity: '1' },
        },
      },
      animation: {
        odskrtnuto: 'odskrtnuto 340ms ease-out',
        vyskoceni: 'vyskoceni 180ms ease-out',
      },
    },
  },
  plugins: [],
};
