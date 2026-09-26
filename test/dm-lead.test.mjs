import assert from 'node:assert/strict';
import test from 'node:test';
import { onRequest } from '../functions/api/dm-lead.js';

const env = {
  TURNSTILE_SECRET_KEY: 'test-only',
  MAKE_DM_WEBHOOK_URL: 'https://example.test/make',
  MAKE_DM_WEBHOOK_KEY: 'test-only',
};
const payload = () => ({
  submission_id: '7e32954b-0f6b-474e-94e7-73856324cbf5',
  name: 'Jane Example',
  phone: '(425) 555-0123',
  project_type: 'Windows',
  company_website: '',
  turnstile_token: 'valid-test-token',
  form_started_at: Date.now() - 3_000,
});
const request = (body, origin = 'https://www.eliteglassandwindow.com') => new Request(`${origin}/api/dm-lead`, {
  method: 'POST',
  headers: { Origin: origin, 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

test('valid form reaches Make with only the requested lead fields', async () => {
  const originalFetch = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    return url.includes('siteverify')
      ? new Response(JSON.stringify({ success: true }), { status: 200 })
      : new Response('Accepted', { status: 200 });
  };
  try {
    const response = await onRequest({ request: request(payload()), env });
    assert.equal(response.status, 202);
    assert.equal(calls.length, 2);
    assert.equal(calls[1].url, env.MAKE_DM_WEBHOOK_URL);
    assert.equal(calls[1].options.headers['x-make-apikey'], env.MAKE_DM_WEBHOOK_KEY);
    const lead = JSON.parse(calls[1].options.body);
    assert.deepEqual(Object.keys(lead).sort(), ['lead_id', 'name', 'phone', 'project_type', 'source', 'submitted_at']);
    assert.equal(lead.phone, '+14255550123');
    assert.equal(lead.source, 'DM link form');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('missing origin and failed security challenge never reach Make', async () => {
  const originalFetch = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url) => {
    calls.push(url);
    return new Response(JSON.stringify({ success: false }), { status: 200 });
  };
  try {
    const noOrigin = new Request('https://www.eliteglassandwindow.com/api/dm-lead', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload()),
    });
    assert.equal((await onRequest({ request: noOrigin, env })).status, 403);
    assert.equal((await onRequest({ request: request(payload()), env })).status, 403);
    assert.equal(calls.length, 1);
    assert.match(calls[0], /siteverify/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
