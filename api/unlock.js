import { isStoryCode, storyToken } from './_auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido.' });
  res.setHeader?.('Cache-Control', 'no-store');
  const token = storyToken();
  if (!token) return res.status(503).json({ error: 'Falta configurar MEMORY_ADMIN_CODE en Vercel.' });
  if (!isStoryCode(req.body?.code)) {
    // Una pequeña espera hace más lento probar claves al azar.
    await new Promise((resolve) => setTimeout(resolve, 700));
    return res.status(401).json({ error: 'Esa no es nuestra clave. Inténtalo otra vez ♡' });
  }
  return res.status(200).json({ token });
}
