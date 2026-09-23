import { createClient } from '@supabase/supabase-js';
import { timingSafeEqual, randomUUID } from 'node:crypto';

const bucket = 'our-memories';
const dataPath = 'plans/plans.json';
const imageTypes = new Map([['image/jpeg', 'jpg'], ['image/png', 'png'], ['image/webp', 'webp']]);
const defaults = [
  { id: 'cinema-harvest', type: 'cine', title: 'Una cita en el cine', detail: 'Amanecer en la cosecha', note: 'Nuestra próxima película juntos, con palomitas y tiempo para nosotros.', image_path: 'Amanecer-en-la-cosecha.webp', status: 'pending', created_at: '2026-09-21T00:00:00.000Z' },
  { id: 'burger-week', type: 'comida', title: 'Una cita para comer', detail: 'Burger Week', note: 'Ir a probar hamburguesas y elegir nuestra favorita.', image_path: 'burgerWeek.png', status: 'pending', created_at: '2026-09-21T00:00:01.000Z' },
];

function client() {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Falta configurar Supabase en Vercel.');
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

function hasAccess(value) {
  const expected = process.env.MEMORY_ADMIN_CODE;
  if (!expected || expected.length < 12 || typeof value !== 'string') return false;
  const given = Buffer.from(value);
  const secret = Buffer.from(expected);
  return given.length === secret.length && timingSafeEqual(given, secret);
}

async function readPlans(supabase) {
  const { data, error } = await supabase.storage.from(bucket).download(dataPath);
  if (error) return defaults;
  try {
    const plans = JSON.parse(await data.text());
    return Array.isArray(plans) ? plans : defaults;
  } catch { return defaults; }
}

async function writePlans(supabase, plans) {
  const body = new Blob([JSON.stringify(plans)], { type: 'application/json' });
  const { error } = await supabase.storage.from(bucket).upload(dataPath, body, { contentType: 'application/json', cacheControl: '0', upsert: true });
  if (error) throw error;
}

function text(value, max = 160) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido.' });
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.VITE_SUPABASE_URL) return res.status(503).json({ error: 'Falta configurar Supabase en Vercel.' });
  if (req.method === 'POST' && !hasAccess(req.headers['x-memory-code'])) return res.status(401).json({ error: 'Código incorrecto.' });

  try {
    const supabase = client();
    if (req.method === 'GET') {
      res.setHeader?.('Cache-Control', 'no-store');
      return res.status(200).json({ plans: await readPlans(supabase) });
    }

    const { action } = req.body ?? {};
    if (action === 'image-upload-url') {
      const extension = imageTypes.get(req.body.contentType);
      if (!extension) return res.status(400).json({ error: 'La imagen debe ser JPG, PNG o WebP.' });
      const path = `plans/images/${randomUUID()}.${extension}`;
      const { data, error } = await supabase.storage.from(bucket).createSignedUploadUrl(path);
      if (error) throw error;
      return res.status(200).json({ path, token: data.token });
    }

    const plans = await readPlans(supabase);
    if (action === 'create') {
      const title = text(req.body.title, 100);
      if (!title) return res.status(400).json({ error: 'Escribe un título para la cita.' });
      plans.push({ id: randomUUID(), type: text(req.body.type, 30) || 'plan', title, detail: text(req.body.detail, 120), note: text(req.body.note, 400), image_path: text(req.body.image_path, 240) || null, status: 'pending', created_at: new Date().toISOString() });
    } else if (action === 'update') {
      const plan = plans.find((item) => item.id === req.body.id);
      if (!plan) return res.status(404).json({ error: 'No se encontró la cita.' });
      const title = text(req.body.title, 100);
      if (!title) return res.status(400).json({ error: 'Escribe un título para la cita.' });
      Object.assign(plan, { type: text(req.body.type, 30) || 'plan', title, detail: text(req.body.detail, 120), note: text(req.body.note, 400), image_path: text(req.body.image_path, 240) || plan.image_path || null });
    } else if (action === 'complete') {
      const plan = plans.find((item) => item.id === req.body.id);
      if (!plan) return res.status(404).json({ error: 'No se encontró la cita.' });
      plan.status = 'completed';
      plan.completed_at = new Date().toISOString();
    } else {
      return res.status(400).json({ error: 'Acción no válida.' });
    }
    await writePlans(supabase, plans);
    return res.status(200).json({ ok: true, plans });
  } catch (error) {
    console.error('Plans API error:', error);
    return res.status(500).json({ error: `No se pudo guardar la cita: ${String(error?.message || 'error desconocido').slice(0, 180)}` });
  }
}
