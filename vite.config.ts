import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { fileURLToPath, URL } from 'node:url';

// GitHub Pages běží na https://<nick>.github.io/BLW/ — název repozitáře je BLW,
// proto base '/BLW/'. Při přejmenování repozitáře uprav i tuhle hodnotu.
// Aplikace se jmenuje Drobek; „BLW" v cestě je zkratka metody, ne název.
export default defineConfig({
  base: '/BLW/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['.nojekyll', 'icons/apple-touch-icon.png'],
      manifest: {
        name: 'Drobek',
        short_name: 'Drobek',
        description:
          'Katalog surovin, recepty ve třech liniích a deník ochutnávek pro zavádění příkrmů metodou BLW.',
        lang: 'cs',
        dir: 'ltr',
        start_url: '/BLW/',
        scope: '/BLW/',
        display: 'standalone',
        // Android tím dovolí nainstalované aplikaci zachytit odkaz do své
        // domény místo prohlížeče — právě tak se otevírá pozvánka do
        // domácnosti. Vestavěný prohlížeč v Messengeru se tím obejít nedá,
        // ten systému odkaz nikdy nepředá; na sdílení přes SMS, Chrome nebo
        // naskenovaný QR to ale funguje.
        handle_links: 'preferred',
        launch_handler: { client_mode: 'navigate-existing' },
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
        // Firebase se z předběžné cache vyjímá.
        //
        // `src/storage/householdStore.ts` ho schválně stahuje až ve chvíli,
        // kdy se rodič připojuje k domácnosti — knihovna váží víc než celý
        // zbytek kódu a kdo sdílení nepoužívá, ji nepotřebuje. Jenže
        // `globPatterns` bere všechny `.js`, takže si ji service worker
        // stáhl do cache hned při prvním načtení a ta optimalizace
        // nefungovala: precache měl 3,5 MB.
        //
        // Offline režim tím netrpí. Kdo sdílení nepoužívá, nemá co
        // cachovat; kdo ho použije, má knihovnu v běžné cache od prvního
        // připojení — a připojení k domácnosti stejně potřebuje síť.
        globIgnores: ['**/firebase-vendor-*.js'],
        runtimeCaching: [
          {
            urlPattern: /\/assets\/firebase-vendor-.*\.js$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'firebase-sdk',
              expiration: { maxEntries: 4 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
        // Katalog roste a s ním i balík; výchozí strop 2 MiB ho od února 2026
        // přestal brát a build kvůli tomu padal. Offline režim je u téhle
        // aplikace celý smysl — rodič stojí u sporáku, ne u routeru — takže
        // se zvedá strop, ne že by se data z předběžné cache vyřadila.
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
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
    rollupOptions: {
      output: {
        /**
         * Firebase dostává stabilní jméno chunku, aby ho šlo vyjmout
         * z předběžné cache service workeru (viz `globIgnores` výš).
         * Bez pojmenování se jmenuje podle vstupního souboru knihovny
         * (`index.esm-*.js`) a na takový vzorek se spolehnout nedá.
         */
        manualChunks(id: string): string | undefined {
          if (/node_modules\/(@firebase|firebase)\//.test(id)) return 'firebase-vendor';
          return undefined;
        },
      },
    },
  },
});
