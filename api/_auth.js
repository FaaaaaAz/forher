import { createHmac, timingSafeEqual } from 'node:crypto';

// El guion bajo evita que Vercel publique este archivo como una ruta de la API.
const DEFAULT_STORY_CODE = '161228';

function safeEqual(given, expected) {
  if (typeof given !== 'string' || typeof expected !== 'string' || !expected) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function storyCode() {
  return process.env.STORY_CODE || DEFAULT_STORY_CODE;
}

export function isStoryCode(value) {
  return safeEqual(value, storyCode());
}

// Token de sesión derivado de los secretos: cambiar MEMORY_ADMIN_CODE o STORY_CODE cierra todas las sesiones.
export function storyToken() {
  const secret = process.env.MEMORY_ADMIN_CODE;
  if (!secret || secret.length < 12) return null;
  return createHmac('sha256', secret).update(`story:${storyCode()}`).digest('base64url');
}

// Acepta el token que entrega /api/unlock o, como respaldo, el código largo de administración.
export function hasAccess(headers = {}) {
  const token = storyToken();
  if (!token) return false;
  return safeEqual(headers['x-story-token'], token) || safeEqual(headers['x-memory-code'], process.env.MEMORY_ADMIN_CODE);
}
