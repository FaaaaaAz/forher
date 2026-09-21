import { localMemories } from '../data/localMemories.js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export async function getMemories() {
  if (!supabaseUrl || !publishableKey) return localMemories;

  const base = supabaseUrl.replace(/\/$/, '');
  const response = await fetch(
    `${base}/rest/v1/memories?select=id,image_path,alt,caption,sort_order&order=sort_order.asc`,
    { headers: { apikey: publishableKey } },
  );

  if (!response.ok) throw new Error('No se pudieron cargar los recuerdos.');

  const rows = await response.json();
  if (rows.length === 0) return localMemories;

  return rows.map((row) => ({
    id: row.id,
    imageUrl: `${base}/storage/v1/object/public/our-memories/${row.image_path.split('/').map(encodeURIComponent).join('/')}`,
    alt: row.alt,
    caption: row.caption ?? '',
  }));
}
