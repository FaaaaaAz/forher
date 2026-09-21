import { createClient } from '@supabase/supabase-js';
import { publishableKey, supabaseUrl } from './supabase.js';

export const MEMORY_CODE_KEY = 'fabian-grace-memory-code';

export async function memoryRequest(code, body) {
  const response = await fetch('/api/memories', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-memory-code': code },
    body: JSON.stringify(body),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || `No se pudo conectar con la galería (${response.status}).`);
  return result;
}

export async function uploadMemoryFile(code, file, onStage) {
  const extension = file.name.split('.').pop().toLowerCase();
  const contentType = file.type || ({ jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', mp4: 'video/mp4', webm: 'video/webm', mov: 'video/quicktime' }[extension]);
  if (!contentType) throw new Error('Este formato no es compatible. Usa JPG, PNG, WebP, MP4, WebM o MOV.');

  onStage('Preparando el archivo...');
  const { path, token } = await memoryRequest(code, { action: 'upload-url', contentType });
  onStage('Subiendo el archivo...');
  const supabase = createClient(supabaseUrl, publishableKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { error } = await supabase.storage.from('our-memories').uploadToSignedUrl(path, token, file, { contentType });
  if (error) throw new Error(`No se pudo subir el archivo: ${error.message}`);
  return path;
}
