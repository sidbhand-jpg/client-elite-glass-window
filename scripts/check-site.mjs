import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';

const root = path.resolve(import.meta.dirname, '..');
const read = relative => fs.readFile(path.join(root, relative), 'utf8');

function loadConst(source, name) {
  const context = vm.createContext({ [name]: undefined });
  new vm.Script(source.replace(new RegExp(`^const ${name}`, 'm'), `globalThis.${name}`)).runInContext(context);
  return context[name];
}

const config = loadConst(await read('CONFIG.js'), 'CONFIG');
assert.equal(config.leadCaptureMode, 'chat_only');
assert.equal(config.services.length, 8);
assert.equal(config.serviceAreas.length, 37);
assert.equal(Object.keys(config.citySeo).length, 37);
assert.ok(!('webhookUrl' in config), 'A webhook URL must never be shipped in browser config.');

const sitemap = await read('sitemap.xml');
const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
assert.equal(sitemapUrls.length, 52);
assert.equal(new Set(sitemapUrls).size, 52);
assert.ok(!sitemap.includes('/404.html'));

const generated = [
  'index.html', 'about.html', 'installation-process.html', 'contact.html', 'our-work.html', 'privacy-policy.html', 'terms.html', '404.html',
  ...config.services.map(service => `services/${service.slug}.html`),
  ...config.serviceAreas.map(area => `cities/${area.slug}.html`),
];
assert.equal(generated.length, 53);

for (const relative of generated) {
  const html = await read(relative);
  assert.match(html, /<title>[^<]+<\/title>/, `${relative}: missing title`);
  assert.match(html, /<meta name="description" content="[^"]+"/, `${relative}: missing description`);
  assert.match(html, /<link rel="canonical" href="https:\/\/eliteglassandwindow\.com\//, `${relative}: missing canonical`);
  assert.match(html, /property="og:image"/, `${relative}: missing social image`);
  assert.match(html, /name="twitter:card" content="summary_large_image"/, `${relative}: missing Twitter metadata`);
  assert.ok(!/%%[A-Z_]+%%/.test(html), `${relative}: unresolved generator token`);
  for (const image of html.matchAll(/<img\b[^>]*>/gi)) {
    assert.match(image[0], /\balt="[^"]*"/, `${relative}: image missing alt text`);
  }
  for (const href of html.matchAll(/href="([^"]+)"/gi)) {
    const value = href[1];
    if (!value || value.includes('${') || /^(https?:|mailto:|tel:|#|javascript:)/i.test(value)) continue;
    const withoutQuery = value.split(/[?#]/)[0];
    if (!withoutQuery || !/\.(?:html|css|js|xml|webmanifest|svg|png|jpe?g|webp|avif)$/i.test(withoutQuery)) continue;
    const localPath = withoutQuery.startsWith('/')
      ? path.join(root, withoutQuery.slice(1))
      : path.resolve(path.dirname(path.join(root, relative)), withoutQuery);
    await fs.access(localPath).catch(() => assert.fail(`${relative}: broken local link ${value}`));
  }
}

const notFound = await read('404.html');
assert.match(notFound, /name="robots" content="noindex, follow"/);
assert.match(notFound, /data-lead-cta/);

for (const area of config.serviceAreas) {
  const html = await read(`cities/${area.slug}.html`);
  assert.match(html, /city-authority-link/);
  assert.match(html, /city-nearby-links/);
  assert.match(html, /BreadcrumbList/);
  assert.match(html, /FAQPage/);
}

for (const service of config.services) {
  const html = await read(`services/${service.slug}.html`);
  assert.match(html, /"@type":"Service"/);
  assert.match(html, /BreadcrumbList/);
  assert.match(html, /FAQPage/);
  assert.ok(service.faqs.length >= 4, `${service.slug}: needs at least four useful FAQs`);
}

const components = await read('components.js');
assert.match(components, /if \(isChatOnlyMode\(\)\)[\s\S]+inline-estimate-cta[\s\S]+Get Free Estimate/);
assert.match(components, /googleBusiness:[\s\S]+Google Business Profile/);
assert.match(components, /form\.elements\.sms_consent\.checked/);
assert.match(components, /data-lead-cta/);
assert.ok(!components.includes('mode: \'no-cors\''));
assert.ok(!components.includes('CONFIG.webhookUrl'));

const homepage = await read('index.html');
assert.ok(!homepage.includes('hero-lead-form'), 'Homepage hero must not contain an inline form.');
assert.ok(!homepage.includes('hero-cta-secondary'), 'Homepage hero must contain only estimate and phone CTAs.');
assert.match(homepage, /id="hero-cta-primary"[^>]*data-lead-cta/);
assert.match(homepage, /id="hero-cta-call"/);
for (const service of config.services) {
  assert.match(service.image, /^\/public\/service-luxury\/.+-960\.webp$/);
  await fs.access(path.join(root, service.image.slice(1)));
  await fs.access(path.join(root, service.image.slice(1).replace('-960.webp', '-640.webp')));
}
assert.equal(Object.values(config.social).filter(Boolean).length, 3);

const functionSource = await read('functions/api/chat-lead.js');
const moduleUrl = `data:text/javascript;base64,${Buffer.from(functionSource).toString('base64')}`;
const { onRequest } = await import(moduleUrl);
const uuid = '123e4567-e89b-42d3-a456-426614174000';
const validPayload = {
  source: 'website_chat', submission_id: uuid, full_name: 'Test Only', phone: '(425) 555-0100', email: '',
  postal_code: '98052', project_type: 'window-replacement', property_type: 'residential',
  project_summary: 'TEST ONLY project information.', timeline: 'researching', sms_consent: false,
  company_website: '', form_started_at: Date.now() - 3000, turnstile_token: 'test-token',
  source_url: 'https://eliteglassandwindow.com/contact.html', page_path: '/contact.html', utm_source: 'test',
};
const makeRequest = (body = validPayload, options = {}) => new Request(options.url || 'https://eliteglassandwindow.com/api/chat-lead', {
  method: options.method || 'POST',
  headers: { Origin: options.origin || 'https://eliteglassandwindow.com', 'Content-Type': options.contentType || 'application/json' },
  body: options.method === 'GET' ? undefined : JSON.stringify(body),
});

let response = await onRequest({ request: makeRequest(validPayload, { method: 'GET' }), env: {} });
assert.equal(response.status, 405);
response = await onRequest({ request: makeRequest(validPayload, { origin: 'https://example.com' }), env: {} });
assert.equal(response.status, 403);
response = await onRequest({ request: makeRequest({ ...validPayload, phone: '123' }), env: {} });
assert.equal(response.status, 422);
response = await onRequest({ request: makeRequest({ ...validPayload, project_summary: 'x'.repeat(21_000) }), env: {} });
assert.equal(response.status, 413);
response = await onRequest({ request: makeRequest({ ...validPayload, company_website: 'bot.example' }), env: {} });
assert.equal(response.status, 202);
response = await onRequest({ request: makeRequest(validPayload), env: {} });
assert.equal(response.status, 503, 'Lead capture must fail closed until explicitly enabled.');
response = await onRequest({ request: makeRequest(validPayload), env: { LEAD_CAPTURE_ENABLED: 'true' } });
assert.equal(response.status, 503, 'Enabled lead capture must still fail closed without Turnstile configuration.');

const originalFetch = globalThis.fetch;
const downstreamPayloads = [];
let turnstilePasses = false;
let downstreamStatus = 200;
globalThis.fetch = async (url, init) => {
  if (String(url).includes('siteverify')) return new Response(JSON.stringify({ success: turnstilePasses }), { status: 200 });
  downstreamPayloads.push(JSON.parse(init.body));
  return new Response('', { status: downstreamStatus });
};
try {
  response = await onRequest({
    request: makeRequest(validPayload),
    env: { LEAD_CAPTURE_ENABLED: 'true', TURNSTILE_SECRET_KEY: 'test-secret', MAKE_WEBSITE_CHAT_WEBHOOK_URL: 'https://example.invalid/make' },
  });
  assert.equal(response.status, 403);
  turnstilePasses = true;
  downstreamStatus = 500;
  response = await onRequest({
    request: makeRequest(validPayload),
    env: { LEAD_CAPTURE_ENABLED: 'true', TURNSTILE_SECRET_KEY: 'test-secret', MAKE_WEBSITE_CHAT_WEBHOOK_URL: 'https://example.invalid/make' },
  });
  assert.equal(response.status, 502);
  downstreamStatus = 200;
  response = await onRequest({
    request: makeRequest(validPayload),
    env: { LEAD_CAPTURE_ENABLED: 'true', TURNSTILE_SECRET_KEY: 'test-secret', MAKE_WEBSITE_CHAT_WEBHOOK_URL: 'https://example.invalid/make' },
  });
  assert.equal(response.status, 202);
  assert.equal(downstreamPayloads[1].external_id, uuid);
  assert.equal(downstreamPayloads[1].lead_event_id, uuid);
  assert.equal(downstreamPayloads[1].business, 'Elite Glass & Windows');
  assert.equal(downstreamPayloads[1].top_priority, validPayload.project_summary);
  assert.equal(downstreamPayloads[1].sms_consent, false);
  response = await onRequest({
    request: makeRequest({ ...validPayload, sms_consent: true }),
    env: { LEAD_CAPTURE_ENABLED: 'true', TURNSTILE_SECRET_KEY: 'test-secret', MAKE_WEBSITE_CHAT_WEBHOOK_URL: 'https://example.invalid/make' },
  });
  assert.equal(response.status, 202);
  assert.equal(downstreamPayloads[2].sms_consent, true);
  assert.equal(downstreamPayloads[1].external_id, downstreamPayloads[2].external_id, 'Retries must reuse the external id.');
} finally {
  globalThis.fetch = originalFetch;
}

console.log(`Validated ${generated.length} generated pages, ${sitemapUrls.length} sitemap URLs, both consent states, and API rejection paths.`);
