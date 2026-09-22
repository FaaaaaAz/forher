import test from 'node:test';
import assert from 'node:assert/strict';
import handler from './memories.js';

function response() {
  return {
    statusCode: 200,
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
  };
}

test('la API de recuerdos rechaza un código incorrecto', async () => {
  const previous = process.env.MEMORY_ADMIN_CODE;
  const previousKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const previousUrl = process.env.VITE_SUPABASE_URL;
  process.env.MEMORY_ADMIN_CODE = 'test-secret-long-enough';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';
  process.env.VITE_SUPABASE_URL = 'https://example.supabase.co';
  try {
    const res = response();
    await handler({ method: 'POST', headers: { 'x-memory-code': 'incorrecto' }, body: { action: 'verify' } }, res);
    assert.equal(res.statusCode, 401);
  } finally {
    if (previous === undefined) delete process.env.MEMORY_ADMIN_CODE;
    else process.env.MEMORY_ADMIN_CODE = previous;
    if (previousKey === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    else process.env.SUPABASE_SERVICE_ROLE_KEY = previousKey;
    if (previousUrl === undefined) delete process.env.VITE_SUPABASE_URL;
    else process.env.VITE_SUPABASE_URL = previousUrl;
  }
});

test('la API de recuerdos acepta el código correcto', async () => {
  const previous = process.env.MEMORY_ADMIN_CODE;
  const previousKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const previousUrl = process.env.VITE_SUPABASE_URL;
  const previousFetch = globalThis.fetch;
  process.env.MEMORY_ADMIN_CODE = 'test-secret-long-enough';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';
  process.env.VITE_SUPABASE_URL = 'https://example.supabase.co';
  globalThis.fetch = async () => new Response('[]', { status: 200, headers: { 'content-type': 'application/json' } });
  try {
    const res = response();
    await handler({ method: 'POST', headers: { 'x-memory-code': 'test-secret-long-enough' }, body: { action: 'verify' } }, res);
    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body, { ok: true });
  } finally {
    if (previous === undefined) delete process.env.MEMORY_ADMIN_CODE;
    else process.env.MEMORY_ADMIN_CODE = previous;
    if (previousKey === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    else process.env.SUPABASE_SERVICE_ROLE_KEY = previousKey;
    if (previousUrl === undefined) delete process.env.VITE_SUPABASE_URL;
    else process.env.VITE_SUPABASE_URL = previousUrl;
    globalThis.fetch = previousFetch;
  }
});

test('el borrado oculta una foto inicial y elimina su archivo', async () => {
  const previousCode = process.env.MEMORY_ADMIN_CODE;
  const previousKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const previousUrl = process.env.VITE_SUPABASE_URL;
  const previousFetch = globalThis.fetch;
  process.env.MEMORY_ADMIN_CODE = 'test-secret-long-enough';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';
  process.env.VITE_SUPABASE_URL = 'https://example.supabase.co';
  const path = '5013046490745736540.jpg';
  const calls = [];
  globalThis.fetch = async (url, options = {}) => {
    calls.push({ url: String(url), method: options.method || 'GET', body: options.body });
    if (String(url).includes('/rest/v1/memories') && (options.method || 'GET') === 'GET') {
      if (String(url).includes('image_path=eq.')) return Response.json(null);
      return Response.json([{ id: 'record-1', image_path: path, alt: 'Recuerdo eliminado', caption: '', sort_order: 1, is_published: false }]);
    }
    if (String(url).includes('/rest/v1/memories') && options.method === 'POST') return new Response('', { status: 201 });
    if (String(url).includes('/storage/v1/object/') && options.method === 'DELETE') return Response.json([]);
    throw new Error(`Solicitud inesperada: ${options.method || 'GET'} ${url}`);
  };
  try {
    const deleted = response();
    await handler({ method: 'POST', headers: { 'x-memory-code': 'test-secret-long-enough' }, body: { action: 'delete', path } }, deleted);
    assert.equal(deleted.statusCode, 200);
    assert.ok(calls.some((call) => call.method === 'POST' && call.body?.includes('"is_published":false')));
    assert.ok(calls.some((call) => call.method === 'DELETE' && call.body?.includes(path)));

    const listed = response();
    await handler({ method: 'GET', headers: {} }, listed);
    assert.equal(listed.statusCode, 200);
    assert.deepEqual(listed.body, { memories: [], hiddenBundledPaths: [path] });
  } finally {
    if (previousCode === undefined) delete process.env.MEMORY_ADMIN_CODE;
    else process.env.MEMORY_ADMIN_CODE = previousCode;
    if (previousKey === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    else process.env.SUPABASE_SERVICE_ROLE_KEY = previousKey;
    if (previousUrl === undefined) delete process.env.VITE_SUPABASE_URL;
    else process.env.VITE_SUPABASE_URL = previousUrl;
    globalThis.fetch = previousFetch;
  }
});
