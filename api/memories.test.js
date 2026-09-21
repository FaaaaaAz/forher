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
  process.env.MEMORY_ADMIN_CODE = 'test-secret-long-enough';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';
  process.env.VITE_SUPABASE_URL = 'https://example.supabase.co';
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
  }
});
