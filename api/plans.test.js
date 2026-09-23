import test from 'node:test';
import assert from 'node:assert/strict';
import handler from './plans.js';

function response() {
  return { statusCode: 200, headers: {}, status(code) { this.statusCode = code; return this; }, setHeader(key, value) { this.headers[key] = value; }, json(body) { this.body = body; return this; } };
}

function withEnv(run) {
  const previous = { code: process.env.MEMORY_ADMIN_CODE, key: process.env.SUPABASE_SERVICE_ROLE_KEY, url: process.env.VITE_SUPABASE_URL, fetch: globalThis.fetch };
  process.env.MEMORY_ADMIN_CODE = 'test-secret-long-enough'; process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key'; process.env.VITE_SUPABASE_URL = 'https://example.supabase.co';
  return Promise.resolve(run()).finally(() => {
    previous.code === undefined ? delete process.env.MEMORY_ADMIN_CODE : process.env.MEMORY_ADMIN_CODE = previous.code;
    previous.key === undefined ? delete process.env.SUPABASE_SERVICE_ROLE_KEY : process.env.SUPABASE_SERVICE_ROLE_KEY = previous.key;
    previous.url === undefined ? delete process.env.VITE_SUPABASE_URL : process.env.VITE_SUPABASE_URL = previous.url;
    globalThis.fetch = previous.fetch;
  });
}

test('la API de citas entrega las dos citas iniciales si aún no existe el archivo', () => withEnv(async () => {
  globalThis.fetch = async () => Response.json({ message: 'not found' }, { status: 404 });
  const res = response();
  await handler({ method: 'GET', headers: {} }, res);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.plans.length, 2);
  assert.ok(res.body.plans.every((plan) => plan.status === 'pending'));
  assert.equal(res.headers['Cache-Control'], 'no-store');
}));

test('la API de citas protege los cambios con el código largo', () => withEnv(async () => {
  const res = response();
  await handler({ method: 'POST', headers: { 'x-memory-code': 'incorrecto' }, body: { action: 'complete', id: 'burger-week' } }, res);
  assert.equal(res.statusCode, 401);
}));
