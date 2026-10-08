import test from 'node:test';
import assert from 'node:assert/strict';
import unlock from './unlock.js';
import plans from './plans.js';

function response() {
  return { statusCode: 200, headers: {}, status(code) { this.statusCode = code; return this; }, setHeader(key, value) { this.headers[key] = value; }, json(body) { this.body = body; return this; } };
}

function withEnv(run) {
  const previous = { code: process.env.MEMORY_ADMIN_CODE, story: process.env.STORY_CODE, key: process.env.SUPABASE_SERVICE_ROLE_KEY, url: process.env.VITE_SUPABASE_URL, fetch: globalThis.fetch };
  process.env.MEMORY_ADMIN_CODE = 'test-secret-long-enough'; delete process.env.STORY_CODE;
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key'; process.env.VITE_SUPABASE_URL = 'https://example.supabase.co';
  return Promise.resolve(run()).finally(() => {
    previous.code === undefined ? delete process.env.MEMORY_ADMIN_CODE : process.env.MEMORY_ADMIN_CODE = previous.code;
    previous.story === undefined ? delete process.env.STORY_CODE : process.env.STORY_CODE = previous.story;
    previous.key === undefined ? delete process.env.SUPABASE_SERVICE_ROLE_KEY : process.env.SUPABASE_SERVICE_ROLE_KEY = previous.key;
    previous.url === undefined ? delete process.env.VITE_SUPABASE_URL : process.env.VITE_SUPABASE_URL = previous.url;
    globalThis.fetch = previous.fetch;
  });
}

test('la clave de seis dígitos entrega un token que permite guardar cambios', () => withEnv(async () => {
  const unlocked = response();
  await unlock({ method: 'POST', headers: {}, body: { code: '161228' } }, unlocked);
  assert.equal(unlocked.statusCode, 200);
  assert.equal(typeof unlocked.body.token, 'string');
  assert.equal(unlocked.headers['Cache-Control'], 'no-store');

  globalThis.fetch = async (url, options = {}) => {
    if (String(url).includes('/object/upload/sign/')) return Response.json({ url: '/object/upload/sign/our-memories/plans/images/new.jpg?token=test-token' });
    throw new Error(`Solicitud inesperada: ${options.method || 'GET'} ${url}`);
  };
  const saved = response();
  await plans({ method: 'POST', headers: { 'x-story-token': unlocked.body.token }, body: { action: 'image-upload-url', contentType: 'image/jpeg' } }, saved);
  assert.equal(saved.statusCode, 200);
}));

test('una clave incorrecta no entrega token y un token falso no permite cambios', () => withEnv(async () => {
  const wrong = response();
  await unlock({ method: 'POST', headers: {}, body: { code: '000000' } }, wrong);
  assert.equal(wrong.statusCode, 401);
  assert.equal(wrong.body.token, undefined);

  const forged = response();
  await plans({ method: 'POST', headers: { 'x-story-token': 'inventado' }, body: { action: 'complete', id: 'burger-week' } }, forged);
  assert.equal(forged.statusCode, 401);
}));
