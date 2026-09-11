import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// GitHub Pages běží na https://<nick>.github.io/BLW/ — název repozitáře je BLW,
// proto base '/BLW/'. Při přejmenování repozitáře uprav i tuhle hodnotu.
export default defineConfig({
  base: '/BLW/',
  plugins: [react()],
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
