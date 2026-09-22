import { localMemories } from '../data/localMemories.js';
import { bundledMemories } from '../data/bundledMemories.js';
import { memoryUrl, publishableKey, supabaseUrl } from './supabase.js';

export async function getMemories() {
  if (!supabaseUrl || !publishableKey) return localMemories;
  try {
    const response = await fetch('/api/memories', { cache: 'no-store' });
    if (!response.ok) throw new Error(`La galería respondió ${response.status}`);
    const { memories: rows, hiddenBundledPaths } = await response.json();
    if (!Array.isArray(rows) || !Array.isArray(hiddenBundledPaths)) throw new Error('Respuesta de galería no válida');
    const byPath = new Map(rows.map((row) => [row.image_path, row]));
    const hidden = new Set(hiddenBundledPaths);
    const knownPhotos = bundledMemories.filter((memory) => !hidden.has(memory.image_path)).map((memory) => byPath.get(memory.image_path) ?? memory);
    const additions = rows.filter((row) => !bundledMemories.some((memory) => memory.image_path === row.image_path));
    return [...knownPhotos, ...additions].map((memory) => ({
      ...memory,
      dbId: memory.id === memory.image_path ? null : memory.id,
      mediaType: /\.(mp4|webm|mov)$/i.test(memory.image_path) ? 'video' : 'image',
      imageUrl: memoryUrl(memory.image_path),
    }));
  } catch (error) {
    console.warn('No se pudo consultar la galería; se mostrarán solo los recuerdos publicados.', error);
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/memories?select=id,image_path,alt,caption,sort_order&order=sort_order.asc`, { headers: { apikey: publishableKey } });
      if (!response.ok) throw new Error(`Supabase respondió ${response.status}`);
      const rows = await response.json();
      const checks = await Promise.allSettled(bundledMemories.map((memory) => fetch(memoryUrl(memory.image_path), { method: 'HEAD' })));
      const available = bundledMemories.filter((_, index) => checks[index].status === 'fulfilled' && checks[index].value.ok);
      const byPath = new Map(rows.map((memory) => [memory.image_path, memory]));
      const knownPhotos = available.map((memory) => byPath.get(memory.image_path) ?? memory);
      const additions = rows.filter((memory) => !bundledMemories.some((known) => known.image_path === memory.image_path));
      return [...knownPhotos, ...additions].map((memory) => ({ ...memory, dbId: memory.id === memory.image_path ? null : memory.id, mediaType: /\.(mp4|webm|mov)$/i.test(memory.image_path) ? 'video' : 'image', imageUrl: memoryUrl(memory.image_path) }));
    } catch (fallbackError) {
      console.warn('Tampoco se pudieron cargar los recuerdos publicados.', fallbackError);
      return [];
    }
  }
}
