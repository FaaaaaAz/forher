import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

const APP_COLOR = '#150c12';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: 'generateSW',
      // El registro lo hace src/pwa/registerServiceWorker.js para controlar la recarga única.
      injectRegister: false,
      filename: 'sw.js',
      manifestFilename: 'manifest.webmanifest',
      includeAssets: ['icon-180.png'],
      manifest: {
        id: '/',
        name: 'Fabian & Grace — Nuestra historia',
        short_name: 'Nosotros',
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
      workbox: {
        cacheId: 'nosotros-v1',
        // Solo JS/CSS con hash (cache-first); los íconos los agrega el plugin. Sin HTML, fotos ni música.
        globPatterns: ['assets/*.{js,css}'],
        navigateFallback: null,
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        inlineWorkboxRuntime: true,
        // Las llamadas a /api y a Supabase no coinciden con ninguna ruta: van siempre a la red.
        runtimeCaching: [
          {
            urlPattern: ({ request, url }) => request.mode === 'navigate' && url.origin === self.location.origin && !url.pathname.startsWith('/api/'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'nosotros-pages-v1',
              expiration: { maxEntries: 5 },
              cacheableResponse: { statuses: [200] },
            },
          },
        ],
      },
    }),
  ],
});
