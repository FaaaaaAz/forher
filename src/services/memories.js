import { localMemories } from '../data/localMemories.js';
import { bundledMemories } from '../data/bundledMemories.js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export async function getMemories() {
  if (!supabaseUrl || !publishableKey) return localMemories;

  const base = supabaseUrl.replace(/\/$/, '');
  const fromStorage = (memory) => ({
    ...memory,
    imageUrl: `${base}/storage/v1/object/public/our-memories/${memory.image_path.split('/').map(encodeURIComponent).join('/')}`,
  });

  try {
    const response = await fetch(
      `${base}/rest/v1/memories?select=id,image_path,alt,caption,sort_order&order=sort_order.asc`,
      { headers: { apikey: publishableKey } },
    );
    if (!response.ok) throw new Error(`Supabase respondió ${response.status}`);
    const rows = await response.json();
    // The public bucket can contain photos before the optional metadata table is seeded.
    return (rows.length ? rows : bundledMemories).map(fromStorage);
  } catch (error) {
    console.warn('No se pudo consultar la tabla de recuerdos; se usarán las fotos del bucket.', error);
    return bundledMemories.map(fromStorage);
  }
}
