export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, '');
export const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const encodePath = (path) => path.split('/').map(encodeURIComponent).join('/');

export const memoryUrl = (path) => `${supabaseUrl}/storage/v1/object/public/our-memories/${encodePath(path)}`;

// Versión reducida que genera Supabase: las fotos del iPhone pesan 1-3 MB y la miniatura una fracción.
// `size` es el lado mayor. Con solo el ancho, Supabase recorta las fotos giradas del iPhone (EXIF)
// en una tira vertical; con un cuadro y `contain` la foto entra entera y bien orientada.
export const memoryImageUrl = (path, size) => (/\.(jpe?g|png|webp)$/i.test(path)
  ? `${supabaseUrl}/storage/v1/render/image/public/our-memories/${encodePath(path)}?width=${size}&height=${size}&resize=contain&quality=75`
  : memoryUrl(path));
