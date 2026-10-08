import { createClient } from '@supabase/supabase-js';
import { storyPost } from './session.js';
import { publishableKey, supabaseUrl } from './supabase.js';

export function memoryRequest(body) {
  return storyPost('/api/memories', body, 'No se pudo conectar con la galería.');
}

export async function uploadMemoryFile(file, onStage) {
  const extension = file.name.split('.').pop().toLowerCase();
  const contentType = file.type || ({ jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', mp4: 'video/mp4', webm: 'video/webm', mov: 'video/quicktime' }[extension]);
  if (!contentType) throw new Error('Este formato no es compatible. Usa JPG, PNG, WebP, MP4, WebM o MOV.');

  onStage('Preparando el archivo...');
  const { path, token } = await memoryRequest({ action: 'upload-url', contentType });
  onStage('Subiendo el archivo...');
  const supabase = createClient(supabaseUrl, publishableKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { error } = await supabase.storage.from('our-memories').uploadToSignedUrl(path, token, file, { contentType });
  if (error) throw new Error(`No se pudo subir el archivo: ${error.message}`);
  return path;
}
