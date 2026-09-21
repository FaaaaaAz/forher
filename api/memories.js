import { createClient } from '@supabase/supabase-js';
import { timingSafeEqual, randomUUID } from 'node:crypto';
import { bundledMemories } from '../src/data/bundledMemories.js';

const bucket = 'our-memories';
const allowedExtensions = new Map([
  ['image/jpeg', 'jpg'], ['image/png', 'png'], ['image/webp', 'webp'],
  ['video/mp4', 'mp4'], ['video/webm', 'webm'], ['video/quicktime', 'mov'],
]);

function hasAccess(value) {
  const expected = process.env.MEMORY_ADMIN_CODE;
  if (!expected || expected.length < 12 || typeof value !== 'string') return false;
  const given = Buffer.from(value);
  const secret = Buffer.from(expected);
  return given.length === secret.length && timingSafeEqual(given, secret);
}

function client() {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Falta configurar Supabase en Vercel.');
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

function cleanCaption(value) {
  if (typeof value !== 'string') throw new Error('Escribe una descripción válida.');
  return value.trim().slice(0, 500);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido.' });
  if (!process.env.MEMORY_ADMIN_CODE || !process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.VITE_SUPABASE_URL) {
    return res.status(503).json({ error: 'Falta activar la administración de recuerdos en Vercel.' });
  }
  if (!hasAccess(req.headers['x-memory-code'])) return res.status(401).json({ error: 'Código incorrecto.' });

  try {
    const { action } = req.body ?? {};
    const supabase = client();

    if (action === 'verify') {
      const { error } = await supabase.from('memories').select('id').limit(1);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    if (action === 'upload-url') {
      const extension = allowedExtensions.get(req.body?.contentType);
      if (!extension) return res.status(400).json({ error: 'Formato de archivo no compatible.' });
      const path = `uploads/${randomUUID()}.${extension}`;
      const { data, error } = await supabase.storage.from(bucket).createSignedUploadUrl(path);
      if (error) throw error;
      return res.status(200).json({ path, token: data.token });
    }

    if (action === 'create') {
      const { path } = req.body;
      if (typeof path !== 'string' || !/^uploads\/[a-f0-9-]+\.(jpg|png|webp|mp4|webm|mov)$/.test(path)) {
        return res.status(400).json({ error: 'Archivo no válido.' });
      }
      const caption = cleanCaption(req.body.caption);
      const { data: last, error: orderError } = await supabase.from('memories').select('sort_order').order('sort_order', { ascending: false }).limit(1);
      if (orderError) throw orderError;
      const { error } = await supabase.from('memories').insert({
        image_path: path,
        alt: caption || 'Recuerdo de Fabian y Grace',
        caption,
        sort_order: Math.max(last?.[0]?.sort_order ?? 0, 33) + 1,
        is_published: true,
      });
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    if (action === 'update') {
      const { path } = req.body;
      if (typeof path !== 'string' || path.length > 240) return res.status(400).json({ error: 'Recuerdo no válido.' });
      const caption = cleanCaption(req.body.caption);
      const { data: existing, error: findError } = await supabase.from('memories').select('id').eq('image_path', path).maybeSingle();
      if (findError) throw findError;
      if (existing) {
        const { error } = await supabase.from('memories').update({ caption, alt: caption || 'Recuerdo de Fabian y Grace' }).eq('id', existing.id);
        if (error) throw error;
      } else {
        const index = bundledMemories.findIndex((memory) => memory.image_path === path);
        if (index === -1) return res.status(404).json({ error: 'No se encontró el recuerdo.' });
        const { error } = await supabase.from('memories').insert({
          image_path: path, alt: caption || 'Recuerdo de Fabian y Grace', caption,
          sort_order: index + 1, is_published: true,
        });
        if (error) throw error;
      }
      return res.status(200).json({ ok: true });
    }

    return res.status(400).json({ error: 'Acción no válida.' });
  } catch (error) {
    console.error('Memory API error:', error);
    return res.status(500).json({ error: `No se pudo guardar el recuerdo: ${String(error?.message || 'error desconocido').slice(0, 180)}` });
  }
}
