import { CACHE_NAMES } from './cacheNames.js';

function canPrepareOffline() {
  return import.meta.env.PROD && 'caches' in window && navigator.onLine && Boolean(navigator.serviceWorker?.controller)
    && !navigator.connection?.saveData;
}

function whenIdle(task, delay) {
  window.setTimeout(() => ('requestIdleCallback' in window ? window.requestIdleCallback(task) : task()), delay);
}

// Descarga en segundo plano las miniaturas para poder verlas sin internet. El service worker
// las guarda; las que ya están guardadas no vuelven a descargarse.
export function prepareImagesOffline(urls) {
  if (!canPrepareOffline() || !urls.length) return;
  whenIdle(async () => {
    const cache = await caches.open(CACHE_NAMES.photos);
    for (const url of urls) {
      if (!navigator.onLine) return;
      if (await cache.match(url)) continue;
      await fetch(url, { mode: 'cors', credentials: 'omit' }).catch(() => {});
    }
  }, 4000);
}

// Guarda las canciones completas una sola vez para escucharlas sin internet.
export function prepareMusicOffline(urls) {
  if (!canPrepareOffline()) return;
  whenIdle(async () => {
    const cache = await caches.open(CACHE_NAMES.music);
    for (const url of urls) {
      if (!(await cache.match(url))) await cache.add(url).catch(() => {});
    }
  }, 10000);
}
