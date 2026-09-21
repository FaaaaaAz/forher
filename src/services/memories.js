import { localMemories } from '../data/localMemories.js';
import { bundledMemories } from '../data/bundledMemories.js';
import { memoryUrl, publishableKey, supabaseUrl } from './supabase.js';

export async function getMemories() {
  if (!supabaseUrl || !publishableKey) return localMemories;
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/memories?select=id,image_path,alt,caption,sort_order&order=sort_order.asc`, { headers: { apikey: publishableKey } });
    if (!response.ok) throw new Error(`Supabase respondió ${response.status}`);
    const rows = await response.json();
    const byPath = new Map(rows.map((row) => [row.image_path, row]));
    const knownPhotos = bundledMemories.map((memory) => byPath.get(memory.image_path) ?? memory);
    const additions = rows.filter((row) => !bundledMemories.some((memory) => memory.image_path === row.image_path));
    return [...knownPhotos, ...additions].map((memory) => ({
      ...memory,
      dbId: memory.id === memory.image_path ? null : memory.id,
      mediaType: /\.(mp4|webm|mov)$/i.test(memory.image_path) ? 'video' : 'image',
      imageUrl: memoryUrl(memory.image_path),
    }));
  } catch (error) {
    console.warn('No se pudo consultar la tabla de recuerdos; se usarán las fotos del bucket.', error);
    return bundledMemories.map((memory) => ({ ...memory, dbId: null, mediaType: 'image', imageUrl: memoryUrl(memory.image_path) }));
  }
}
