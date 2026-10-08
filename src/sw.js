import { clientsClaim } from 'workbox-core';
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { RangeRequestsPlugin } from 'workbox-range-requests';
import { CACHE_NAMES } from './pwa/cacheNames.js';

// La versión nueva se activa sin esperar a que se cierre la app; el cliente recarga una sola vez.
self.addEventListener('install', () => self.skipWaiting());
clientsClaim();

// JS y CSS con hash en el nombre: cache-first (cada versión trae nombres nuevos).
cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

// Borra cachés de versiones anteriores (incluida la primera, "nosotros-...").
self.addEventListener('activate', (event) => {
  const current = new Set(Object.values(CACHE_NAMES));
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys
    .filter((key) => (key.startsWith('us-') || key.startsWith('nosotros-')) && !current.has(key))
    .map((key) => caches.delete(key)))));
});

const ok = () => new CacheableResponsePlugin({ statuses: [200] });

// Páginas: siempre la versión nueva si hay internet; la guardada solo sin conexión.
registerRoute(
  ({ request, url }) => request.mode === 'navigate' && url.origin === self.location.origin && !url.pathname.startsWith('/api/'),
  new NetworkFirst({ cacheName: CACHE_NAMES.pages, plugins: [ok(), new ExpirationPlugin({ maxEntries: 5 })] }),
);

// Lecturas de la API (álbum, citas, detalles): red primero; la última copia sirve sin internet.
// Los cambios (POST) nunca pasan por aquí: Workbox solo enruta GET por defecto.
registerRoute(
  ({ url }) => url.origin === self.location.origin && ['/api/memories', '/api/plans'].includes(url.pathname),
  new NetworkFirst({ cacheName: CACHE_NAMES.data, networkTimeoutSeconds: 8, plugins: [ok()], matchOptions: { ignoreVary: true } }),
);

// Fotos de Supabase (originales y miniaturas). Cada archivo subido tiene un nombre único, así que
// guardarlo no impide ver cambios: una foto nueva es siempre una dirección nueva. Los videos no se guardan.
const photoStrategy = new CacheFirst({
  cacheName: CACHE_NAMES.photos,
  plugins: [ok(), new ExpirationPlugin({ maxEntries: 600, maxAgeSeconds: 60 * 60 * 24 * 180, purgeOnQuotaError: true })],
});
registerRoute(
  ({ url }) => url.hostname.endsWith('.supabase.co')
    && /^\/storage\/v1\/(object|render\/image)\/public\/our-memories\//.test(url.pathname)
    && /\.(jpe?g|png|webp|gif)$/i.test(url.pathname),
  // Se pide en modo CORS para guardar una respuesta legible (Supabase permite cualquier origen).
  ({ event, url }) => photoStrategy.handle({ event, request: new Request(url.href, { mode: 'cors', credentials: 'omit' }) }),
);

// Música: la app guarda las canciones completas y aquí se sirven por partes, como pide el reproductor.
registerRoute(
  ({ url }) => url.origin === self.location.origin && url.pathname.endsWith('.mp3'),
  new CacheFirst({ cacheName: CACHE_NAMES.music, plugins: [ok(), new RangeRequestsPlugin()] }),
);
