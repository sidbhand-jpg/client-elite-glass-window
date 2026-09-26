const PROJECT_TYPES = new Set(['Windows', 'Shower glass', 'Doors', 'Glass repair', 'Other']);
const NAME_PATTERN = /^[\p{L}\p{M} .'-]+$/u;
const MAX_BODY_BYTES = 4_000;
const ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function result(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

function normalizePhone(value) {
  const digits = String(value || '').replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  return '';
}

async function verifyTurnstile(secret, token, ip) {
  const form = new URLSearchParams({ secret, response: token });
  if (ip) form.set('remoteip', ip);
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form });
  return response.ok && (await response.json()).success === true;
}

export async function onRequest({ request, env }) {
  if (request.method !== 'POST') return result(405, { ok: false, message: 'Method not allowed.' });
  const origin = request.headers.get('Origin');
  if (!origin || origin !== new URL(request.url).origin) return result(403, { ok: false, message: 'Request origin was rejected.' });
  if (!(request.headers.get('Content-Type') || '').toLowerCase().startsWith('application/json')) return result(415, { ok: false, message: 'JSON is required.' });
  if (Number(request.headers.get('Content-Length') || 0) > MAX_BODY_BYTES) return result(413, { ok: false, message: 'Request is too large.' });

  let payload;
  try {
    const raw = await request.text();
    if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) return result(413, { ok: false, message: 'Request is too large.' });
    payload = JSON.parse(raw);
  } catch {
    return result(400, { ok: false, message: 'Invalid request.' });
  }
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return result(400, { ok: false, message: 'Invalid request.' });
  if (String(payload.company_website || '').trim()) return result(202, { ok: true });

  const startedAt = Number(payload.form_started_at);
  if (!Number.isFinite(startedAt) || Date.now() - startedAt < 1800 || Date.now() - startedAt > 86_400_000) {
    return result(400, { ok: false, message: 'Please refresh the page and try again.' });
  }
  const name = typeof payload.name === 'string' ? payload.name.trim() : '';
  const phone = normalizePhone(payload.phone);
  const projectType = payload.project_type;
  const submissionId = payload.submission_id;
  if (name.length < 2 || name.length > 100 || !NAME_PATTERN.test(name) || !/\p{L}/u.test(name) || !phone || !PROJECT_TYPES.has(projectType) || !ID_PATTERN.test(submissionId || '')) {
    return result(422, { ok: false, message: 'Check your name, phone number, and project type.' });
  }

  if (!env.TURNSTILE_SECRET_KEY || !env.MAKE_DM_WEBHOOK_URL || !env.MAKE_DM_WEBHOOK_KEY) {
    return result(503, { ok: false, message: 'Online requests are temporarily unavailable. Please call us instead.' });
  }
  if (!(await verifyTurnstile(env.TURNSTILE_SECRET_KEY, String(payload.turnstile_token || ''), request.headers.get('CF-Connecting-IP') || ''))) {
    return result(403, { ok: false, message: 'Please complete the security check and try again.' });
  }

  try {
    const response = await fetch(env.MAKE_DM_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-make-apikey': env.MAKE_DM_WEBHOOK_KEY },
      body: JSON.stringify({
        lead_id: submissionId,
        submitted_at: new Date().toISOString(),
        source: 'DM link form',
        name,
        phone,
        project_type: projectType,
      }),
      signal: AbortSignal.timeout(12_000),
    });
    if (!response.ok) return result(502, { ok: false, message: 'We could not send your request. Please try again.' });
    return result(202, { ok: true, submission_reference: submissionId });
  } catch {
    return result(502, { ok: false, message: 'We could not send your request. Please try again.' });
  }
}
