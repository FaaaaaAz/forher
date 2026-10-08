import { MEMORY_CODE_KEY, STORY_REMEMBER_KEY, STORY_TOKEN_KEY } from '../data/storageKeys.js';

export const SESSION_EXPIRED_EVENT = 'story-session-expired';

function read(storage, key) {
  try { return window[storage].getItem(key); } catch { return null; }
}

function remove(storage, key) {
  try { window[storage].removeItem(key); } catch { /* Sin almacenamiento no hay nada que borrar. */ }
}

export function getStoryToken() {
  return read('localStorage', STORY_TOKEN_KEY) || read('sessionStorage', STORY_TOKEN_KEY) || '';
}

// Solo se entra directo a la historia si el dispositivo se recordó y ya tiene el token del servidor.
export function hasRememberedSession() {
  return read('localStorage', STORY_REMEMBER_KEY) === 'yes' && Boolean(read('localStorage', STORY_TOKEN_KEY));
}

export function saveStorySession(token, remember) {
  try {
    if (remember) {
      window.localStorage.setItem(STORY_TOKEN_KEY, token);
      window.localStorage.setItem(STORY_REMEMBER_KEY, 'yes');
    } else {
      window.sessionStorage.setItem(STORY_TOKEN_KEY, token);
      window.localStorage.removeItem(STORY_REMEMBER_KEY);
    }
  } catch { /* La historia sigue abierta mientras la pestaña viva. */ }
}

export function clearStorySession() {
  remove('localStorage', STORY_TOKEN_KEY);
  remove('sessionStorage', STORY_TOKEN_KEY);
  remove('localStorage', STORY_REMEMBER_KEY);
  remove('localStorage', MEMORY_CODE_KEY);
}

export async function requestStoryToken(code) {
  let response;
  try {
    response = await fetch('/api/unlock', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ code }) });
  } catch {
    throw new Error('Necesitas internet para abrir nuestra historia la primera vez.');
  }
  // `vite dev` no ejecuta las funciones de /api: en local se abre sin token (las subidas no funcionarán).
  if (import.meta.env.DEV && response.status === 404) return 'dev-local';
  const result = await response.json().catch(() => ({}));
  if (response.status === 401) {
    const error = new Error(result.error || 'Esa no es nuestra clave. Inténtalo otra vez ♡');
    error.wrongCode = true;
    throw error;
  }
  if (!response.ok || !result.token) throw new Error(result.error || 'No se pudo abrir nuestra historia. Inténtalo otra vez.');
  return result.token;
}

// POST autenticado a nuestras APIs; si la sesión ya no vale, vuelve a la pantalla de la clave.
export async function storyPost(url, body, fallbackError) {
  let response;
  try {
    response = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json', 'x-story-token': getStoryToken() }, body: JSON.stringify(body) });
  } catch {
    throw new Error('No hay conexión a internet. Inténtalo cuando vuelvas a tener señal.');
  }
  const result = await response.json().catch(() => ({}));
  if (response.status === 401) window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
  if (!response.ok) throw new Error(result.error || fallbackError);
  return result;
}
