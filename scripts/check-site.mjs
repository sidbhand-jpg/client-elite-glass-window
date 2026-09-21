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
const canonicalOrigin = config.siteUrl.replace(/\/$/, '');
assert.equal(config.leadCaptureMode, 'chat_only');
assert.equal(config.services.length, 8);
assert.equal(config.serviceAreas.length, 37);
assert.equal(Object.keys(config.citySeo).length, 37);
assert.ok(!('webhookUrl' in config), 'A webhook URL must never be shipped in browser config.');
assert.equal(config.seo.home.primaryIntent, 'glass company in Redmond');
for (const service of config.services) {
  for (const field of ['primaryIntent', 'title', 'description', 'featuredImage', 'updatedAt', 'decisionGuide', 'process']) assert.ok(service[field], `${service.slug}: missing ${field}`);
}
for (const area of config.serviceAreas) {
  const profile = config.citySeo[area.slug];
  for (const field of ['primaryIntent', 'title', 'description', 'intro', 'estimateReady', 'updatedAt']) assert.ok(profile[field], `${area.slug}: missing ${field}`);
  assert.equal(profile.serviceSlugs.length, 3, `${area.slug}: must prioritize three services`);
  assert.equal(profile.faqs.length, 4, `${area.slug}: must have four local FAQs`);
}

const sitemap = await read('sitemap.xml');
const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
assert.equal(sitemapUrls.length, 52);
assert.equal(new Set(sitemapUrls).size, 52);
assert.ok(!sitemap.includes('/404.html'));
assert.ok(!sitemapUrls.some(url => url.endsWith('.html')), 'Canonical sitemap URLs must match Cloudflare Pages extensionless responses.');
assert.equal((sitemap.match(/<lastmod>/g) || []).length, 52);
assert.equal((sitemap.match(/<image:image>/g) || []).length, 52);
assert.ok(!sitemap.includes(new Date().toISOString().slice(0, 10)) || config.seo.updatedAt === new Date().toISOString().slice(0, 10), 'Sitemap dates must come from content metadata, not build time.');

const generated = [
  'index.html', 'about.html', 'installation-process.html', 'contact.html', 'our-work.html', 'privacy-policy.html', 'terms.html', '404.html',
  ...config.services.map(service => `services/${service.slug}.html`),
  ...config.serviceAreas.map(area => `cities/${area.slug}.html`),
];
assert.equal(generated.length, 53);

const titles = new Set();
const descriptions = new Set();
const canonicals = new Set();
const stripExecutable = html => html.replace(/<script\b[\s\S]*?<\/script>/gi, '').replace(/<style\b[\s\S]*?<\/style>/gi, '');

for (const relative of generated) {
  const html = await read(relative);
  const visibleHtml = stripExecutable(html);
  assert.match(html, /<title>[^<]+<\/title>/, `${relative}: missing title`);
  assert.match(html, /<meta name="description" content="[^"]+"/, `${relative}: missing description`);
  assert.ok(html.includes(`<link rel="canonical" href="${canonicalOrigin}/`), `${relative}: missing canonical`);
  assert.match(html, /property="og:image"/, `${relative}: missing social image`);
  assert.match(html, /name="twitter:card" content="summary_large_image"/, `${relative}: missing Twitter metadata`);
  assert.ok(!/%%[A-Z_]+%%/.test(html), `${relative}: unresolved generator token`);
  if (relative !== '404.html') {
    const title = html.match(/<title>([^<]+)<\/title>/)[1];
    const description = html.match(/<meta name="description" content="([^"]+)"/)[1];
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)[1];
    const expectedPath = relative === 'index.html' ? '/' : `/${relative.replace(/\.html$/, '')}`;
    assert.equal(canonical, `${canonicalOrigin}${expectedPath}`, `${relative}: canonical must match its 200 route`);
    assert.ok(!titles.has(title), `${relative}: duplicate title ${title}`);
    assert.ok(!descriptions.has(description), `${relative}: duplicate description`);
    assert.ok(!canonicals.has(canonical), `${relative}: duplicate canonical`);
    titles.add(title); descriptions.add(description); canonicals.add(canonical);
    assert.equal((visibleHtml.match(/<h1\b/gi) || []).length, 1, `${relative}: must contain one visible H1 in raw HTML`);
    assert.match(visibleHtml, /<main(?:\s|>)/, `${relative}: missing main landmark`);
    assert.match(visibleHtml, /id="static-navigation"/, `${relative}: missing crawlable initial navigation`);
    assert.ok(!/href="\/(?:about|installation-process|contact|our-work|privacy-policy|terms|services\/[^"#?]+|cities\/[^"#?]+)\.html/.test(visibleHtml), `${relative}: internal links must use canonical extensionless routes`);
    const jsonLdBlocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];
    assert.equal(jsonLdBlocks.length, 1, `${relative}: expected one generated JSON-LD graph`);
    const graph = JSON.parse(jsonLdBlocks[0][1]);
    assert.ok(Array.isArray(graph['@graph']), `${relative}: JSON-LD must use @graph`);
    assert.ok(graph['@graph'].some(node => node['@type'] === 'WebPage' || ['AboutPage','ContactPage','CollectionPage'].includes(node['@type'])), `${relative}: missing page schema`);
  }
  for (const image of html.matchAll(/<img\b[^>]*>/gi)) {
    assert.match(image[0], /\balt="[^"]*"/, `${relative}: image missing alt text`);
  }
  for (const image of visibleHtml.matchAll(/<img\b[^>]*\bsrc="([^"]*)"[^>]*>/gi)) {
    const src = image[1];
    if (!src || /^(https?:|data:)/i.test(src)) continue;
    const localPath = src.startsWith('/') ? path.join(root, src.slice(1)) : path.resolve(path.dirname(path.join(root, relative)), src);
    await fs.access(localPath).catch(() => assert.fail(`${relative}: missing image ${src}`));
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
  assert.match(stripExecutable(html), new RegExp(config.citySeo[area.slug].intro.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').slice(0, 60)));
  assert.equal((stripExecutable(html).match(/class="city-service-pill"/g) || []).length, 3, `${area.slug}: raw HTML must contain three priority service links`);
  for (const faq of config.citySeo[area.slug].faqs) assert.ok(stripExecutable(html).includes(faq.q.replaceAll('&', '&amp;')), `${area.slug}: missing visible FAQ`);
}
assert.equal(new Set(config.serviceAreas.map(area => config.citySeo[area.slug].intro)).size, 37, 'City introductions must be distinct.');
assert.equal(new Set(config.serviceAreas.map(area => JSON.stringify(config.citySeo[area.slug].faqs.map(faq => faq.q)))).size, 37, 'City FAQ sets must be distinct.');
for (const slug of ['redmond','bellevue','kirkland','sammamish','issaquah','bothell','seattle','renton','lynnwood']) {
  assert.ok(config.citySeo[slug].projectRefs.length + config.citySeo[slug].supportingProjectRefs.length > 0, `${slug}: missing verified project references`);
  assert.match(await read(`cities/${slug}.html`), /city-project-proof/, `${slug}: missing visible project proof`);
}

for (const service of config.services) {
  const html = await read(`services/${service.slug}.html`);
  assert.match(html, /"@type":"Service"/);
  assert.match(html, /BreadcrumbList/);
  assert.match(html, /FAQPage/);
  assert.ok(service.faqs.length >= 4, `${service.slug}: needs at least four useful FAQs`);
  assert.ok(stripExecutable(html).includes('How to choose the right scope'), `${service.slug}: missing static decision guide`);
  assert.ok(stripExecutable(html).includes('What happens next'), `${service.slug}: missing static process`);
}

const robots = await read('robots.txt');
for (const agent of ['*', 'Googlebot', 'Bingbot', 'OAI-SearchBot']) assert.match(robots, new RegExp(`User-agent: ${agent === '*' ? '\\*' : agent}\\nAllow: /`));
assert.ok(robots.includes(`Sitemap: ${canonicalOrigin}/sitemap.xml`));
const redirects = await read('_redirects');
for (const legacy of ['/elite/about-us/', '/elite/contact/', '/elite/installation-process/', '/elite/product/windows/', '/elite/projects/window-replacement/']) assert.ok(redirects.includes(legacy), `Missing redirect for ${legacy}`);
for (const project of loadConst(await read('PROJECTS.js'), 'PROJECTS')) assert.ok(redirects.includes(`#${project.id}`), `Missing legacy redirect to #${project.id}`);

const headers = await read('_headers');
assert.match(headers, /https:\/\/:project\.pages\.dev\/\*[\s\S]+X-Robots-Tag: noindex, nofollow/);
assert.match(headers, /https:\/\/:version\.:project\.pages\.dev\/\*[\s\S]+X-Robots-Tag: noindex, nofollow/);

const components = await read('components.js');
assert.match(components, /if \(isChatOnlyMode\(\)\)[\s\S]+inline-estimate-cta[\s\S]+Get Free Estimate/);
assert.match(components, /googleBusiness:[\s\S]+Google Business Profile/);
assert.match(components, /form\.elements\.sms_consent\.checked/);
assert.match(components, /data-lead-cta/);
assert.ok(!components.includes('mode: \'no-cors\''));
assert.ok(!components.includes('CONFIG.webhookUrl'));
assert.ok(!/href="\/[^"]+\.html/.test(components), 'Enhanced navigation must link directly to canonical routes.');

const homepage = await read('index.html');
assert.ok(!homepage.includes('hero-lead-form'), 'Homepage hero must not contain an inline form.');
assert.ok(!homepage.includes('hero-cta-secondary'), 'Homepage hero must contain only estimate and phone CTAs.');
assert.match(homepage, /id="hero-cta-primary"[^>]*data-lead-cta/);
assert.match(homepage, /id="hero-cta-call"/);
assert.match(homepage, /href="\/favicon\.svg\?v=20260921-brand"/, 'Homepage must use the cache-busted brand favicon.');
for (const id of ['recent-work-gallery', 'recent-work-grid', 'recent-work-dots', 'recent-work-prev', 'recent-work-next']) {
  assert.ok(homepage.includes(`id="${id}"`), `Homepage project gallery is missing ${id}.`);
}
assert.ok((homepage.match(/class="portfolio-img-btn portfolio-card"/g) || []).length >= 6, 'Homepage must statically render project cards.');
assert.match(homepage, /gallery\.classList\.add\('is-enhanced'\)/, 'Homepage gallery must opt into the carousel only after controls are available.');
const favicon = await read('favicon.svg');
assert.match(favicon, /Elite Glass &amp; Windows/);
assert.match(favicon, /#306C9E/);
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
  source_url: `${canonicalOrigin}/contact.html`, page_path: '/contact.html', utm_source: 'test',
};
const makeRequest = (body = validPayload, options = {}) => new Request(options.url || `${canonicalOrigin}/api/chat-lead`, {
  method: options.method || 'POST',
  headers: { Origin: options.origin || canonicalOrigin, 'Content-Type': options.contentType || 'application/json' },
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

console.log(`Validated ${generated.length} pages, ${sitemapUrls.length} sitemap URLs, unique metadata, static content, schema graphs, crawler rules, redirects, and fail-closed lead paths.`);
