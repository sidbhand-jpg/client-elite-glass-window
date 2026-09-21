const MAX_BODY_BYTES = 20_000;
const ALLOWED_SOURCES = new Set(['website_chat', 'website_form']);
const ALLOWED_PROPERTY_TYPES = new Set(['residential', 'commercial', 'other']);
const ALLOWED_TIMELINES = new Set(['as-soon-as-practical', 'one-to-three-months', 'three-plus-months', 'researching', 'not-provided']);

function securityHeaders(request) {
  return {
    'Cache-Control': 'no-store',
    'Content-Type': 'application/json; charset=utf-8',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Vary': 'Origin',
    'Access-Control-Allow-Origin': new URL(request.url).origin,
  };
}

function json(request, status, body) {
  return new Response(JSON.stringify(body), { status, headers: securityHeaders(request) });
}

function text(value, maxLength) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function normalizePhone(value) {
  const digits = String(value || '').replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  return '';
}

function validate(payload) {
  const fields = {};
  const fullName = text(payload.full_name, 100);
  const phone = normalizePhone(payload.phone);
  const email = text(payload.email, 254).toLowerCase();
  const postalCode = text(payload.postal_code, 10);
  const projectType = text(payload.project_type, 80);
  const propertyType = text(payload.property_type, 32);
  const projectSummary = text(payload.project_summary, 2000);
  const timeline = text(payload.timeline, 40);
  const submissionId = text(payload.submission_id, 36);

  if (fullName.length < 2) fields.full_name = 'Enter your full name.';
  if (!phone) fields.phone = 'Enter a valid US phone number.';
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fields.email = 'Enter a valid email address.';
  if (!/^\d{5}(?:-\d{4})?$/.test(postalCode)) fields.postal_code = 'Enter a valid ZIP code.';
  if (!projectType) fields.project_type = 'Choose a project type.';
  if (!ALLOWED_PROPERTY_TYPES.has(propertyType)) fields.property_type = 'Choose a property type.';
  if (projectSummary.length < 10) fields.project_summary = 'Provide at least 10 characters about the project.';
  if (!ALLOWED_TIMELINES.has(timeline)) fields.timeline = 'Choose a timeline.';
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(submissionId)) fields.submission_id = 'Invalid submission reference.';

  return {
    fields,
    value: { fullName, phone, email, postalCode, projectType, propertyType, projectSummary, timeline, submissionId },
  };
}

async function verifyTurnstile(secret, token, remoteIp) {
  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp) body.set('remoteip', remoteIp);
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
  if (!response.ok) return false;
  const result = await response.json();
  return result.success === true;
}

export async function onRequest(context) {
  const { request, env } = context;
  const headers = securityHeaders(request);
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  if (request.method !== 'POST') return json(request, 405, { ok: false, code: 'method_not_allowed', message: 'Method not allowed.' });

  const requestUrl = new URL(request.url);
  const origin = request.headers.get('Origin');
  if (!origin || origin !== requestUrl.origin) return json(request, 403, { ok: false, code: 'origin_rejected', message: 'Request origin was rejected.' });
  if (!(request.headers.get('Content-Type') || '').toLowerCase().startsWith('application/json')) return json(request, 415, { ok: false, code: 'invalid_content_type', message: 'JSON is required.' });
  const contentLength = Number(request.headers.get('Content-Length') || 0);
  if (contentLength > MAX_BODY_BYTES) return json(request, 413, { ok: false, code: 'request_too_large', message: 'Request is too large.' });

  let payload;
  try {
    const raw = await request.text();
    if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) return json(request, 413, { ok: false, code: 'request_too_large', message: 'Request is too large.' });
    payload = JSON.parse(raw);
  } catch {
    return json(request, 400, { ok: false, code: 'invalid_json', message: 'Invalid request.' });
  }
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return json(request, 400, { ok: false, code: 'invalid_json', message: 'Invalid request.' });

  if (text(payload.company_website, 200)) return json(request, 202, { ok: true, submission_reference: text(payload.submission_id, 36) || 'accepted' });
  const startedAt = Number(payload.form_started_at || 0);
  if (!Number.isFinite(startedAt) || Date.now() - startedAt < 1800 || Date.now() - startedAt > 86_400_000) return json(request, 400, { ok: false, code: 'invalid_timing', message: 'Please refresh the page and try again.' });

  const source = text(payload.source, 32);
  if (!ALLOWED_SOURCES.has(source)) return json(request, 400, { ok: false, code: 'invalid_source', message: 'Invalid request.' });
  const validation = validate(payload);
  if (Object.keys(validation.fields).length) return json(request, 422, { ok: false, code: 'validation_failed', message: 'Check the highlighted information.', fields: validation.fields });

  if (env.LEAD_CAPTURE_ENABLED !== 'true') return json(request, 503, { ok: false, code: 'lead_capture_disabled', message: 'Online requests are temporarily unavailable.' });
  if (!env.TURNSTILE_SECRET_KEY) return json(request, 503, { ok: false, code: 'turnstile_not_configured', message: 'Online requests are temporarily unavailable.' });
  if (env.TURNSTILE_SECRET_KEY) {
    const verified = await verifyTurnstile(env.TURNSTILE_SECRET_KEY, text(payload.turnstile_token, 2048), request.headers.get('CF-Connecting-IP') || '');
    if (!verified) return json(request, 403, { ok: false, code: 'turnstile_failed', message: 'Please complete the security check and try again.' });
  }
  if (!env.MAKE_WEBSITE_CHAT_WEBHOOK_URL) return json(request, 503, { ok: false, code: 'lead_service_not_configured', message: 'Online requests are temporarily unavailable.' });

  const clean = validation.value;
  const outbound = {
    external_id: clean.submissionId,
    lead_event_id: clean.submissionId,
    business: 'Elite Glass & Windows',
    lead_source: source,
    funnel_variant: 'website_chat_v1',
    submitted_at: new Date().toISOString(),
    name: clean.fullName,
    phone: clean.phone,
    email: clean.email,
    zip: clean.postalCode,
    project_type: clean.projectType,
    property_type: clean.propertyType,
    project_summary: clean.projectSummary,
    top_priority: clean.projectSummary,
    timeline: clean.timeline,
    sms_consent: payload.sms_consent === true,
    source_url: text(payload.source_url, 1000),
    page_path: text(payload.page_path, 300),
    referrer_url: text(payload.referrer_url, 1000),
    utm_source: text(payload.utm_source, 200),
    utm_medium: text(payload.utm_medium, 200),
    utm_campaign: text(payload.utm_campaign, 200),
    utm_content: text(payload.utm_content, 200),
    utm_term: text(payload.utm_term, 200),
    campaign_id: text(payload.campaign_id, 200),
    adset_id: text(payload.adset_id, 200),
    ad_id: text(payload.ad_id, 200),
    fbclid: text(payload.fbclid, 500),
    fbp: text(payload.fbp, 500),
    fbc: text(payload.fbc, 500),
    sample_record: false,
  };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12_000);
    const downstream = await fetch(env.MAKE_WEBSITE_CHAT_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'User-Agent': 'elite-glass-pages-function/1.0' },
      body: JSON.stringify(outbound),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!downstream.ok) return json(request, 502, { ok: false, code: 'lead_service_unavailable', message: 'We could not send your request. Please try again.' });
    return json(request, 202, { ok: true, submission_reference: clean.submissionId });
  } catch {
    return json(request, 502, { ok: false, code: 'lead_service_unavailable', message: 'We could not send your request. Please try again.' });
  }
}
