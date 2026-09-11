import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { fileURLToPath, URL } from 'node:url';

// GitHub Pages běží na https://<nick>.github.io/BLW/ — název repozitáře je BLW,
// proto base '/BLW/'. Při přejmenování repozitáře uprav i tuhle hodnotu.
export default defineConfig({
  base: '/BLW/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['.nojekyll', 'icons/apple-touch-icon.png'],
      manifest: {
        name: 'BLW — příkrmy pro celou rodinu',
        short_name: 'BLW',
        description:
          'Katalog surovin, recepty ve třech liniích a deník ochutnávek pro zavádění příkrmů metodou BLW.',
        lang: 'cs',
        dir: 'ltr',
        start_url: '/BLW/',
        scope: '/BLW/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#F8F8F5',
        theme_color: '#1F6F5C',
        categories: ['food', 'health', 'lifestyle'],
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'icons/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // Data jsou statická a jdou cachovat natvrdo — aplikace pak funguje
        // i po vypnutí sítě (akceptační kritérium 9).
        globPatterns: ['**/*.{js,css,html,woff,woff2,png,svg,webmanifest}'],
        navigateFallback: '/BLW/index.html',
        cleanupOutdatedCaches: true,
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
