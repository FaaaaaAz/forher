export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, '');
export const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const encodePath = (path) => path.split('/').map(encodeURIComponent).join('/');

export const memoryUrl = (path) => `${supabaseUrl}/storage/v1/object/public/our-memories/${encodePath(path)}`;

// Versión reducida que genera Supabase: las fotos del iPhone pesan 1-3 MB y la miniatura una fracción.
export const memoryImageUrl = (path, width) => (/\.(jpe?g|png|webp)$/i.test(path)
  ? `${supabaseUrl}/storage/v1/render/image/public/our-memories/${encodePath(path)}?width=${width}&quality=75`
  : memoryUrl(path));
