import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

const APP_COLOR = '#150c12';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // Service worker propio en src/sw.js: decide qué se guarda para usar la app sin internet.
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      // El registro lo hace src/pwa/registerServiceWorker.js para controlar la recarga única.
      injectRegister: false,
      manifestFilename: 'manifest.webmanifest',
      // Los íconos son pesados y no hacen falta sin conexión: no se guardan al instalar.
      includeManifestIcons: false,
      manifest: {
        id: '/',
        name: 'US · Fabian & Grace',
        short_name: 'US',
        description: 'Fabian y Grace: recuerdos y una historia que sigue creciendo.',
        lang: 'es',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: APP_COLOR,
        theme_color: APP_COLOR,
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      injectManifest: {
        // Solo JS/CSS con hash (cache-first). Sin HTML, fotos ni música: esos tienen su propia regla en src/sw.js.
        globPatterns: ['assets/*.{js,css}'],
      },
    }),
  ],
});
