import { createClient } from '@supabase/supabase-js';
import { publishableKey, supabaseUrl } from './supabase.js';

export async function getPlans() {
  const response = await fetch('/api/plans', { cache: 'no-store' });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || !Array.isArray(result.plans)) throw new Error(result.error || 'No se pudieron cargar las citas.');
  return result.plans;
}

export async function planRequest(code, body) {
  const response = await fetch('/api/plans', { method: 'POST', headers: { 'content-type': 'application/json', 'x-memory-code': code }, body: JSON.stringify(body) });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || 'No se pudo guardar la cita.');
  return result;
}

export async function uploadPlanImage(code, file, onStage) {
  if (!file) return null;
  if (file.size > 15 * 1024 * 1024) throw new Error('La imagen debe pesar menos de 15 MB.');
  const extension = file.name.split('.').pop().toLowerCase();
  const contentType = file.type || ({ jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp' }[extension]);
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(contentType)) throw new Error('Usa una imagen JPG, PNG o WebP.');
  onStage('Preparando la imagen...');
  const { path, token } = await planRequest(code, { action: 'image-upload-url', contentType });
  onStage('Subiendo la imagen...');
  const supabase = createClient(supabaseUrl, publishableKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { error } = await supabase.storage.from('our-memories').uploadToSignedUrl(path, token, file, { contentType });
  if (error) throw new Error(`No se pudo subir la imagen: ${error.message}`);
  return path;
}
