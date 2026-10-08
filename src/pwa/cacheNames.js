// Nombres de caché compartidos entre el service worker y la app. Cambia CACHE_VERSION para empezar de cero.
export const CACHE_VERSION = 'v2';

export const CACHE_NAMES = {
  pages: `us-pages-${CACHE_VERSION}`,
  data: `us-data-${CACHE_VERSION}`,
  photos: `us-photos-${CACHE_VERSION}`,
  music: `us-music-${CACHE_VERSION}`,
};
