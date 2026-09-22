import { memoryUrl, publishableKey, supabaseUrl } from './supabase.js';

export async function getDetailPhotos() {
  const response = await fetch('/api/memories?view=details', { cache: 'no-store' });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.details) throw new Error(result.error || 'No se pudieron cargar las fotos de los detalles.');
  return result.details;
}

async function preparePhoto(file) {
  if (!file || (!file.type.startsWith('image/') && !/\.(heic|heif|jpe?g|png|webp)$/i.test(file.name))) throw new Error('Elige una imagen.');
  if (file.size > 50 * 1024 * 1024) throw new Error('La foto debe pesar menos de 50 MB.');
  if (['image/jpeg', 'image/png', 'image/webp'].includes(file.type) && file.size <= 15 * 1024 * 1024) return file;

  const objectUrl = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = objectUrl;
    await image.decode();
    const scale = Math.min(1, 2400 / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(image.naturalWidth * scale);
    canvas.height = Math.round(image.naturalHeight * scale);
    canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.88));
    if (!blob) throw new Error('No se pudo convertir la foto.');
    return new File([blob], 'detalle.jpg', { type: 'image/jpeg' });
  } catch {
    throw new Error('No se pudo preparar esta foto. Intenta elegir o exportar una versión JPG desde Fotos.');
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export async function uploadDetailPhoto(code, slot, file, onStage) {
  onStage('Preparando la foto...');
  const photo = await preparePhoto(file);
  const contentType = photo.type || ({ jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp' }[photo.name.split('.').pop().toLowerCase()]);
  const [{ memoryRequest }, { createClient }] = await Promise.all([import('./manageMemories.js'), import('@supabase/supabase-js')]);
  onStage('Preparando la subida...');
  const { path, token } = await memoryRequest(code, { action: 'detail-upload-url', slot, contentType });
  onStage('Subiendo la foto...');
  const supabase = createClient(supabaseUrl, publishableKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { error } = await supabase.storage.from('our-memories').uploadToSignedUrl(path, token, photo, { contentType });
  if (error) throw new Error(`No se pudo subir la foto: ${error.message}`);
  return { path, url: memoryUrl(path) };
}
