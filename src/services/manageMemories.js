import * as tus from 'tus-js-client';
import { supabaseUrl } from './supabase.js';

export const MEMORY_CODE_KEY = 'fabian-grace-memory-code';

export async function memoryRequest(code, body) {
  const response = await fetch('/api/memories', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-memory-code': code },
    body: JSON.stringify(body),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || 'No se pudo conectar con la galería.');
  return result;
}

export async function uploadMemoryFile(code, file, onProgress) {
  const contentType = file.type || ({ jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', mp4: 'video/mp4', webm: 'video/webm', mov: 'video/quicktime' }[file.name.split('.').pop().toLowerCase()]);
  const { path, token } = await memoryRequest(code, { action: 'upload-url', contentType });
  const endpoint = `${supabaseUrl.replace('.supabase.co', '.storage.supabase.co')}/storage/v1/upload/resumable`;

  await new Promise((resolve, reject) => {
    const upload = new tus.Upload(file, {
      endpoint,
      retryDelays: [0, 3000, 5000, 10000],
      chunkSize: 6 * 1024 * 1024,
      uploadDataDuringCreation: true,
      removeFingerprintOnSuccess: true,
      headers: { 'x-signature': token },
      metadata: { bucketName: 'our-memories', objectName: path, contentType, cacheControl: '3600' },
      onError: reject,
      onProgress: (sent, total) => onProgress(Math.round((sent / total) * 100)),
      onSuccess: resolve,
    });
    upload.start();
  });
  return path;
}
