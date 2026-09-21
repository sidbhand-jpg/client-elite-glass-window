#!/usr/bin/env node
// ============================================================
// BUILD SCRIPT — generate-pages.js
// Reads CONFIG.js and generates one HTML file per service
// and one HTML file per service area.
//
// Usage:  node generate-pages.js
// ============================================================

const fs   = require('fs');
const path = require('path');
const vm   = require('vm');

// ── Load CONFIG ──────────────────────────────────────────────
const configSrc = fs.readFileSync(path.join(__dirname, 'CONFIG.js'), 'utf8');
const globalObj = { CONFIG: undefined };
// ^-anchored + multiline: only matches a `const CONFIG` that starts a
// line, so a literal mention inside a comment can never be matched
// instead of the real top-level declaration.
const configScript = new vm.Script(configSrc.replace(/^const CONFIG/m, 'globalThis.CONFIG'));
const vmCtx = vm.createContext(globalObj);
configScript.runInContext(vmCtx);
const CONFIG = globalObj.CONFIG;

// ── Load PROJECTS (optional — gallery photos, written by the asset
//    pipeline's publish step; falls back to an empty array if missing
//    so a fresh/un-photographed client site still builds) ──────────
let PROJECTS = [];
const projectsPath = path.join(__dirname, 'PROJECTS.js');
if (fs.existsSync(projectsPath)) {
  const projectsSrc = fs.readFileSync(projectsPath, 'utf8');
  const projGlobalObj = { PROJECTS: undefined };
  const projScript = new vm.Script(projectsSrc.replace(/^const PROJECTS/m, 'globalThis.PROJECTS'));
  const projCtx = vm.createContext(projGlobalObj);
  projScript.runInContext(projCtx);
  PROJECTS = projGlobalObj.PROJECTS || [];
}

// ── Helpers ───────────────────────────────────────────────────
function readTemplate(relPath) {
  return fs.readFileSync(path.join(__dirname, relPath), 'utf8');
}

function moveInlineStylesToHead(html) {
  const styleBlocks = html.match(/<style(?:\s[^>]*)?>[\s\S]*?<\/style>/g) || [];
  if (!styleBlocks.length) return html;
  const withoutStyles = html.replace(/\s*<style(?:\s[^>]*)?>[\s\S]*?<\/style>\s*/g, '\n');
  return withoutStyles.replace('</head>', `${styleBlocks.join('\n')}\n</head>`);
}

function writeFile(outPath, content) {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, moveInlineStylesToHead(content), 'utf8');
  console.log('  ✓  ' + path.relative(__dirname, outPath));
}

// ── Patch <title> and <meta name="description"> ──────────────
function setMeta(html, title, description) {
  return html
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(
      /<meta name="description"[^>]*>/,
      `<meta name="description" content="${description.replace(/"/g, '&quot;')}" />`
    );
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function breadcrumbSchema(items) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${CONFIG.siteUrl}${item.path}`,
    })),
  };
}

function staticFaqHtml(faqs, prefix) {
  return `<div class="faq-list">${faqs.map((faq, index) => `<details class="faq-item" id="faq-${prefix}-${index}"><summary class="faq-summary"><span>${escapeHtml(faq.q)}</span><svg class="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></summary><p class="faq-answer">${escapeHtml(faq.a)}</p></details>`).join('')}</div>`;
}

function staticStarsHtml(count = 5) {
  return Array.from({ length: count }, () => '<svg class="star-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>').join('');
}

function injectGeneratedSeo(html, pathname, schemas = []) {
  const title = (html.match(/<title>(.*?)<\/title>/) || [,''])[1];
  const description = ((html.match(/<meta name="description" content="([^"]*)"/) || [,''])[1]);
  const socialImage = `${CONFIG.siteUrl}/public/social/elite-glass-og.jpg`;
  html = html
    .replace(/\s*<link rel="canonical"[^>]*>/g, '')
    .replace(/\s*<meta (?:property|name)="(?:og:[^"]+|twitter:[^"]+)"[^>]*>/g, '')
    .replace(/\s*<link rel="preconnect" href="https:\/\/fonts\.(?:googleapis|gstatic)\.com"[^>]*>/g, '')
    .replace(/\s*<link href="https:\/\/fonts\.googleapis\.com[^>]*>/g, '')
    .replace(/\s*<link rel="icon"[^>]*>/g, '')
    .replace(/\s*<link rel="apple-touch-icon"[^>]*>/g, '')
    .replace(/\s*<link rel="manifest"[^>]*>/g, '');
  if (pathname === '/') html = html.replace(/\s*<link rel="preload" as="image"[^>]*>/g, '');
  const graph = schemas.map(schema => {
    const node = { ...schema };
    delete node['@context'];
    return node;
  });
  const block = `<!-- GENERATED SEO START -->
  <link rel="canonical" href="${CONFIG.siteUrl}${pathname}" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  <link rel="manifest" href="/site.webmanifest" />
  ${pathname === '/' ? '<link rel="preload" as="image" href="/public/optimized/window-redmond-960.webp" imagesrcset="/public/optimized/window-redmond-960.webp 960w, /public/optimized/window-redmond-1440.webp 1440w" imagesizes="100vw" fetchpriority="high" />' : ''}
  ${pathname === '/404.html' ? '<meta name="robots" content="noindex, follow" />' : ''}
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="${escapeHtml(CONFIG.businessName)}" />
  <meta property="og:url" content="${CONFIG.siteUrl}${pathname}" />
  <meta property="og:image" content="${socialImage}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="${escapeHtml(CONFIG.businessName)} custom glass, windows, and doors in Greater Seattle" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${socialImage}" />
  ${graph.length ? `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')}</script>` : ''}
  <!-- GENERATED SEO END -->`.replace(/^ +$/gm, '');
  return html
    .replace(/\s*<!-- GENERATED SEO START -->[\s\S]*?<!-- GENERATED SEO END -->/g, '')
    .replace('</head>', `${block}\n</head>`);
}

function localBusinessSchema() {
  return {
    '@type': ['LocalBusiness', 'HomeAndConstructionBusiness'],
    '@id': `${CONFIG.siteUrl}/#business`,
    name: CONFIG.businessName,
    legalName: CONFIG.legalBusinessName,
    url: CONFIG.siteUrl,
    logo: `${CONFIG.siteUrl}/logo.svg`,
    image: `${CONFIG.siteUrl}/public/social/elite-glass-og.jpg`,
    telephone: CONFIG.phoneRaw,
    email: CONFIG.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '4028 148th Ave NE',
      addressLocality: 'Redmond',
      addressRegion: 'WA',
      postalCode: '98052',
      addressCountry: 'US',
    },
    areaServed: CONFIG.serviceAreas.map(area => ({ '@type': ['ballard','capitol-hill','green-lake','magnolia','queen-anne','university-district','west-seattle'].includes(area.slug) ? 'Place' : 'City', name: `${area.name}, Washington` })),
  };
}

function faqSchema(faqs) {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  };
}

function websiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': `${CONFIG.siteUrl}/#website`,
    url: `${CONFIG.siteUrl}/`,
    name: CONFIG.businessName,
    publisher: { '@id': `${CONFIG.siteUrl}/#business` },
  };
}

function webPageSchema(pathname, title, description, type = 'WebPage', image) {
  return {
    '@type': type,
    '@id': `${CONFIG.siteUrl}${pathname}#webpage`,
    url: `${CONFIG.siteUrl}${pathname}`,
    name: title,
    description,
    isPartOf: { '@id': `${CONFIG.siteUrl}/#website` },
    about: { '@id': `${CONFIG.siteUrl}/#business` },
    primaryImageOfPage: image ? { '@type': 'ImageObject', contentUrl: `${CONFIG.siteUrl}${image}` } : undefined,
  };
}

function sectionHeader(eyebrow, title, subtitle = '', id = '') {
  return `<div${id ? ` id="${id}"` : ''} class="section-header text-center"><div class="section-eyebrow">${escapeHtml(eyebrow)}</div><h2 class="section-title text-navy">${escapeHtml(title)}</h2>${subtitle ? `<p class="section-subtitle">${escapeHtml(subtitle)}</p>` : ''}</div>`;
}

function injectStaticNavigation(html) {
  html = html.replace(/\s*<nav id="static-navigation"[\s\S]*?<\/nav>/, '');
  const links = [
    ['/', 'Home'],
    ...CONFIG.services.map(service => [`/services/${service.slug}`, service.name]),
    ['/our-work', 'Our Work'],
    ['/installation-process', 'Installation Process'],
    ['/about', 'About'],
    ['/contact', 'Get Free Estimate'],
  ];
  const navigation = `<nav id="static-navigation" class="static-navigation" aria-label="Primary navigation">${links.map(([href, label]) => `<a href="${href}">${escapeHtml(label)}</a>`).join('')}</nav>`;
  return html.replace('<body>', `<body>\n${navigation}`);
}

function canonicalizeInternalLinks(html) {
  return html.replace(/href="\/(about|installation-process|contact|our-work|privacy-policy|terms)\.html([#?][^"]*)?"/g, 'href="/$1$2"')
    .replace(/href="\/(services|cities)\/([^"?#]+)\.html([#?][^"]*)?"/g, 'href="/$1/$2$3"');
}

function projectCard(project, index) {
  const imageButton = (image, caption, loading = 'lazy') => `<button type="button" class="project-image-button project-cover" data-img="${escapeHtml(image.img)}" data-caption="${escapeHtml(caption)}" aria-label="Open image: ${escapeHtml(caption)}"><img src="${escapeHtml(image.img)}" alt="${escapeHtml(image.alt)}" width="${image.width}" height="${image.height}" loading="${loading}" decoding="async" /><span class="project-image-label">${escapeHtml(caption)}</span></button>`;
  return `<article class="project-case-study" id="${escapeHtml(project.id)}" data-category="${escapeHtml(project.category)}"><div class="project-summary-grid">${imageButton(project, `${project.title} - project overview`, index < 2 ? 'eager' : 'lazy')}<div class="project-intro"><span class="portfolio-cat-badge">${escapeHtml(project.category)}</span><h2>${escapeHtml(project.title)}</h2><p class="project-tagline">${escapeHtml(project.tagline)}</p><div class="project-meta" aria-label="Project information"><span>${escapeHtml(project.location)}</span><span>${escapeHtml(project.completed)}</span></div><p class="project-summary">${escapeHtml(project.summary)}</p></div><details class="project-disclosure"><summary>View full case study and all photos</summary><div class="project-expanded"><section class="project-overview"><p class="project-section-label">Project overview</p><p>${escapeHtml(project.overview)}</p></section><section><p class="project-section-label">Before, during, and after</p><div class="project-process-grid">${project.process.map(image => imageButton(image, image.stage)).join('')}</div></section><div class="project-info-grid"><section class="project-info-card"><h3>${escapeHtml(project.benefitHeading)}</h3><ul class="project-checklist">${project.benefits.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul></section><section class="project-info-card"><h3>Product details</h3><dl class="project-detail-list">${project.details.map(detail => `<div><dt>${escapeHtml(detail.label)}</dt><dd>${escapeHtml(detail.value)}</dd></div>`).join('')}</dl></section><section class="project-info-card"><h3>Project features</h3><ul class="project-checklist">${project.features.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul></section></div></div></details></div></article>`;
}

// ── Patch og:image / twitter:image content="" placeholders ───
// Used for our-work.html: fills in the top featured PROJECTS image so
// social shares of the gallery page show a real photo, not a blank card.
function setOgImage(html, imageUrl) {
  if (!imageUrl) return html; // no PROJECTS yet — leave placeholders empty
  const safeUrl = imageUrl.replace(/"/g, '&quot;');
  return html
    .replace(/<meta property="og:image" content="[^"]*"/, `<meta property="og:image" content="${safeUrl}"`)
    .replace(/<meta name="twitter:image" content="[^"]*"/, `<meta name="twitter:image" content="${safeUrl}"`);
}

// ── Pick the lead image for og:image: first featured PROJECTS entry,
//    falling back to the first entry overall, or null if PROJECTS is empty.
function getLeadProjectImage(projects) {
  if (!projects || !projects.length) return null;
  const featured = projects.find(p => p.featured);
  const image = (featured || projects[0]).img || null;
  if (!image || /^https?:\/\//.test(image)) return image;
  return `${CONFIG.siteUrl}${image.startsWith('/') ? '' : '/'}${image}`;
}

// ── Fix relative paths based on output directory depth ───────
function fixPaths(html, depth) {
  // depth=0 → root (index.html), depth=1 → pages/, depth=2 → services/
  const prefix = '../'.repeat(depth);
  return html
    .replace(/(src|href)="(styles\.css|CONFIG\.js|components\.js)"/g,
      (_, attr, file) => `${attr}="${prefix}${file}"`)
    .replace(/(src|href)="\.\.\/styles\.css"/g,   `$1="${prefix}styles.css"`)
    .replace(/(src|href)="\.\.\/CONFIG\.js"/g,    `$1="${prefix}CONFIG.js"`)
    .replace(/(src|href)="\.\.\/components\.js"/g,`$1="${prefix}components.js"`);
}

// ── 1. Generate one file per SERVICE ─────────────────────────
console.log('\n📄 Generating service pages…');
const serviceTemplate = readTemplate('pages/service.html');
const servicesDir = path.join(__dirname, 'services');

CONFIG.services.forEach(service => {
  const pathname = `/services/${service.slug}`;
  const outPath = path.join(servicesDir, `${service.slug}.html`);
  let html = serviceTemplate;
  html = setMeta(
    html,
    service.title,
    service.description
  );
  const others = CONFIG.services.filter(candidate => candidate.slug !== service.slug).slice(0, 5);
  html = html
    .replace('id="service-hero-img" src="" alt=""', `id="service-hero-img" src="${service.image}" srcset="${service.image.replace('-960.webp', '-640.webp')} 640w, ${service.image} 960w" sizes="100vw" alt="${escapeHtml(service.name)} project by ${escapeHtml(CONFIG.businessName)}" width="960" height="640" fetchpriority="high" decoding="async"`)
    .replace('<h1 class="service-hero-title" id="service-title"></h1>', `<h1 class="service-hero-title" id="service-title">${escapeHtml(service.name)}</h1>`)
    .replace('<p class="service-hero-desc" id="service-desc"></p>', `<p class="service-hero-desc" id="service-desc">${escapeHtml(service.desc)}</p>`)
    .replace('<p class="service-longdesc" id="service-longdesc"></p>', `<p class="service-longdesc" id="service-longdesc">${escapeHtml(service.longDesc)}</p>`)
    .replace('<div class="service-product-grid" id="service-products"></div>', `<div class="service-product-grid" id="service-products">${service.products.map(product => `<div class="service-product-item">${escapeHtml(product)}</div>`).join('')}</div>`)
    .replace('<ul class="service-benefits" id="service-benefits"></ul>', `<ul class="service-benefits" id="service-benefits">${service.benefits.map(item => `<li class="service-benefit-item"><span aria-hidden="true">&#10003;</span><span>${escapeHtml(item)}</span></li>`).join('')}</ul>`)
    .replace('<div class="other-services-list" id="other-services-list"></div>', `<div class="other-services-list" id="other-services-list">${others.map(item => `<a href="/services/${item.slug}" class="other-service-link">${escapeHtml(item.name)}</a>`).join('')}</div>`)
    .replace('<!-- SERVICE DECISION GUIDE -->', `<section class="service-decision-guide" aria-labelledby="decision-${service.slug}"><h2 id="decision-${service.slug}" class="service-benefits-title">How to choose the right scope</h2><ul class="service-benefits">${service.decisionGuide.map(item => `<li class="service-benefit-item"><span aria-hidden="true">&#10003;</span><span>${escapeHtml(item)}</span></li>`).join('')}</ul></section><section aria-labelledby="process-${service.slug}"><h2 id="process-${service.slug}" class="service-benefits-title">What happens next</h2><ol class="service-process-list">${service.process.map((item, index) => `<li><strong>${index + 1}.</strong> ${escapeHtml(item)}</li>`).join('')}</ol></section>`)
    .replace('<div id="service-map-header"></div>', sectionHeader('Visit us in Redmond', 'Compare options at our showroom', `Planning a ${service.name.toLowerCase()} project? Contact the team before visiting to confirm current showroom hours and relevant samples.`, 'service-map-header'))
    .replace('<div id="service-faq-header"></div>', sectionHeader('FAQ', `${service.name} common questions`, '', 'service-faq-header'))
    .replace('<div id="service-faq-container"></div>', `<div id="service-faq-container">${staticFaqHtml(service.faqs, service.slug)}</div>`);
  html = injectGeneratedSeo(html, pathname, [
    localBusinessSchema(),
    websiteSchema(),
    webPageSchema(pathname, service.title, service.description, 'WebPage', service.featuredImage),
    {
      '@type': 'Service',
      '@id': `${CONFIG.siteUrl}${pathname}#service`,
      name: service.name,
      description: service.longDesc,
      url: `${CONFIG.siteUrl}/services/${service.slug}`,
      provider: { '@id': `${CONFIG.siteUrl}/#business` },
      areaServed: CONFIG.serviceAreas.map(area => ({ '@type': 'City', name: `${area.name}, WA` })),
    },
    faqSchema(service.faqs),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: service.name, path: `/services/${service.slug}` },
    ]),
  ]);
  // Fix paths: services/ is depth 1 from root (same level as pages/)
  html = html
    .replace(/(src|href)="\.\.\/styles\.css"/g,    'href="../styles.css"')
    .replace(/(src|href)="\.\.\/CONFIG\.js"/g,     'src="../CONFIG.js"')
    .replace(/(src|href)="\.\.\/components\.js"/g, 'src="../components.js"');
  writeFile(outPath, canonicalizeInternalLinks(injectStaticNavigation(html)));
});

// ── 2. Generate one file per CITY ─────────────────────────────
console.log('\n🗺  Generating city pages…');

CONFIG.serviceAreas.forEach(area => {
  const profile = CONFIG.citySeo[area.slug];
  const sameRegion = CONFIG.serviceAreas.filter(candidate =>
    candidate.slug !== area.slug && CONFIG.citySeo[candidate.slug].region === profile.region
  );
  const nearbyAreas = [...sameRegion, ...CONFIG.serviceAreas.filter(candidate => candidate.slug !== area.slug)]
    .filter((candidate, index, list) => list.findIndex(item => item.slug === candidate.slug) === index)
    .slice(0, 4);
  const nearbyLinks = nearbyAreas
    .map(candidate => `<a href="/cities/${candidate.slug}">${escapeHtml(candidate.name)}, WA</a>`)
    .join('');
  const outPath = path.join(__dirname, 'cities', `${area.slug}.html`);
  const pathname = `/cities/${area.slug}`;
  const prioritizedServices = profile.serviceSlugs.map(slug => CONFIG.services.find(service => service.slug === slug));
  const referencedProjects = profile.projectRefs.map(id => PROJECTS.find(project => project.id === id)).filter(Boolean);
  const supportingProjects = PROJECTS.flatMap(project => (project.related || [])
    .filter(image => profile.supportingProjectRefs.includes(image.title))
    .map(image => ({ ...image, parentId: project.id })));
  let html = readTemplate('pages/city.html');
  html = setMeta(
    html,
    profile.title,
    profile.description
  );
  const cityFaqs = profile.faqs;
  html = html
    .replace('<div class="page-hero-eyebrow" id="city-eyebrow"></div>', `<div class="page-hero-eyebrow" id="city-eyebrow">${escapeHtml(CONFIG.businessName)} · ${escapeHtml(area.name)}, WA</div>`)
    .replace('<h1 class="city-headline" id="city-headline"></h1>', `<h1 class="city-headline" id="city-headline">Glass &amp; Window Services in <span style="color:var(--color-primary)">${escapeHtml(area.name)}</span></h1>`)
    .replace('<p class="city-sub" id="city-sub"></p>', `<p class="city-sub" id="city-sub">${escapeHtml(profile.intro)}</p>`)
    .replace('<div class="city-service-pills" id="city-service-pills"></div>', `<div class="city-service-pills" id="city-service-pills">${prioritizedServices.map(service => `<a href="/services/${service.slug}" class="city-service-pill">${escapeHtml(service.name)}</a>`).join('')}</div>`)
    .replace('<div id="city-why-header"></div>', sectionHeader(area.name, `Plan the right scope before ordering`, profile.estimateReady, 'city-why-header'))
    .replace('<div class="city-why-grid" id="city-why-grid"></div>', `<div class="city-why-grid" id="city-why-grid">${CONFIG.story.proofPoints.map(item => `<div class="city-why-item"><span aria-hidden="true">&#10003;</span><span>${escapeHtml(item)}</span></div>`).join('')}</div>`)
    .replace('<!-- CITY SERVICE PRIORITIES -->', `<section class="section-y bg-white"><div class="container-wide"><div class="section-eyebrow">Priority services</div><h2 class="section-title text-navy">Three common project paths in ${escapeHtml(area.name)}</h2><div class="city-priority-grid">${prioritizedServices.map(service => `<article class="city-priority-card"><img src="${service.image}" alt="${escapeHtml(service.name)} option for ${escapeHtml(area.name)} customers" width="960" height="640" loading="lazy" decoding="async"><div><h3>${escapeHtml(service.name)}</h3><p>${escapeHtml(service.desc)}</p><a href="/services/${service.slug}">Compare ${escapeHtml(service.name)} options</a></div></article>`).join('')}</div></div></section>`)
    .replace('<!-- CITY PROJECT PROOF -->', (referencedProjects.length || supportingProjects.length) ? `<section class="section-y bg-slate-50"><div class="container-wide"><div class="section-eyebrow">Verified project work</div><h2 class="section-title text-navy">Documented work in ${escapeHtml(area.name)}</h2><div class="city-project-proof">${referencedProjects.map(project => `<article><img src="${project.img}" alt="${escapeHtml(project.alt)}" width="${project.width}" height="${project.height}" loading="lazy" decoding="async"><h3>${escapeHtml(project.title)}</h3><p>${escapeHtml(project.summary)}</p><a href="/our-work#${project.id}">View project details</a></article>`).join('')}${supportingProjects.map(project => `<article><img src="${project.img}" alt="${escapeHtml(project.alt)}" width="${project.width}" height="${project.height}" loading="lazy" decoding="async"><h3>${escapeHtml(project.title)}</h3><p>Verified project photograph from ${escapeHtml(area.name)}, Washington.</p><a href="/our-work#${project.parentId}">View the related case study</a></article>`).join('')}</div></div></section>` : '')
    .replaceAll('%%CITY_NAME%%', escapeHtml(area.name))
    .replaceAll('%%CITY_REGION%%', escapeHtml(profile.region))
    .replaceAll('%%CITY_FOCUS%%', escapeHtml(profile.focus))
    .replaceAll('%%CITY_INTRO%%', escapeHtml(profile.intro))
    .replaceAll('%%ESTIMATE_READY%%', escapeHtml(profile.estimateReady))
    .replaceAll('%%CITY_AUTHORITY%%', escapeHtml(profile.authority))
    .replaceAll('%%CITY_AUTHORITY_URL%%', profile.authorityUrl)
    .replaceAll('%%NEARBY_CITY_LINKS%%', nearbyLinks)
    .replace('<div id="city-map-header"></div>', sectionHeader('Service area', `On-site measurement in ${area.name}`, 'Contact us to confirm the address and project type before scheduling.', 'city-map-header'))
    .replace('<div id="city-faq-header"></div>', sectionHeader(`${area.name} FAQ`, `Questions to answer before your estimate`, '', 'city-faq-header'))
    .replace('<div id="city-faq-container"></div>', `<div id="city-faq-container">${staticFaqHtml(cityFaqs, area.slug)}</div>`);
  html = injectGeneratedSeo(html, pathname, [
    localBusinessSchema(),
    websiteSchema(),
    webPageSchema(pathname, profile.title, profile.description, 'WebPage', profile.featuredImage),
    {
      '@type': 'Service',
      '@id': `${CONFIG.siteUrl}${pathname}#service`,
      name: `Glass and window services in ${area.name}, WA`,
      url: `${CONFIG.siteUrl}/cities/${area.slug}`,
      provider: { '@id': `${CONFIG.siteUrl}/#business` },
      areaServed: { '@type': 'Place', name: `${area.name}, Washington` },
    },
    faqSchema(cityFaqs),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: area.name, path: `/cities/${area.slug}` },
    ]),
  ]);
  // City pages live at root — fix paths to point to root-level files
  html = html
    .replace(/(src|href)="\.\.\/styles\.css"/g,    'href="../styles.css"')
    .replace(/(src|href)="\.\.\/CONFIG\.js"/g,     'src="../CONFIG.js"')
    .replace(/(src|href)="\.\.\/components\.js"/g, 'src="../components.js"');
  // City pages live in cities/ — update links to pages/ and services/
  writeFile(outPath, canonicalizeInternalLinks(injectStaticNavigation(html)));
});

// ── 3. Symlink convenience pages at root ──────────────────────
// pages/contact.html → already in pages/
// The index.html at root already exists.
// We just copy the pages/* to their canonical URL paths.
console.log('\n📋 Copying canonical top-level pages…');
const pagesToRoot = [
  ['pages/about.html',          'about.html'],
  ['pages/installation-process.html', 'installation-process.html'],
  ['pages/contact.html',        'contact.html'],
  ['pages/our-work.html',       'our-work.html'],
  ['pages/privacy-policy.html', 'privacy-policy.html'],
  ['pages/terms.html',          'terms.html'],
  ['pages/404.html',            '404.html'],
];
const rootMeta = {
  'about.html': [CONFIG.seo.pages.about.title, CONFIG.seo.pages.about.description],
  'installation-process.html': [CONFIG.seo.pages['installation-process'].title, CONFIG.seo.pages['installation-process'].description],
  'contact.html': [CONFIG.seo.pages.contact.title, CONFIG.seo.pages.contact.description],
  'our-work.html': [CONFIG.seo.pages['our-work'].title, CONFIG.seo.pages['our-work'].description],
  'privacy-policy.html': [CONFIG.seo.pages['privacy-policy'].title, CONFIG.seo.pages['privacy-policy'].description],
  'terms.html': [CONFIG.seo.pages.terms.title, CONFIG.seo.pages.terms.description],
  '404.html': [`Page Not Found | ${CONFIG.businessName}`, `The requested ${CONFIG.businessName} page could not be found.`],
};

pagesToRoot.forEach(([src, dest]) => {
  const srcPath  = path.join(__dirname, src);
  const destPath = path.join(__dirname, dest);
  if (!fs.existsSync(srcPath)) { console.warn(`  ⚠  ${src} not found, skipping`); return; }

  let html = fs.readFileSync(srcPath, 'utf8');
  html = setMeta(html, rootMeta[dest][0], rootMeta[dest][1]);
  // These pages are at root — update relative paths
  html = html
    .replace(/(src|href)="\.\.\/styles\.css(\?[^\"]*)?"/g, (_, attr, suffix = '') => `${attr}="styles.css${suffix}"`)
    .replace(/(src|href)="\.\.\/CONFIG\.js"/g,     'src="CONFIG.js"')
    .replace(/(src|href)="\.\.\/PROJECTS\.js"/g,   'src="PROJECTS.js"')
    .replace(/(src|href)="\.\.\/components\.js(\?[^\"]*)?"/g, (_, attr, suffix = '') => `${attr}="components.js${suffix}"`);

  // our-work.html: fill in og:image / twitter:image from the top
  // featured PROJECTS photo, so social shares show a real image.
  if (dest === 'our-work.html') {
    html = setOgImage(html, getLeadProjectImage(PROJECTS));
    html = html.replace('<div class="project-list" id="portfolio-grid"></div>', `<div class="project-list" id="portfolio-grid">${PROJECTS.map(projectCard).join('')}</div>`);
  }

  const pathname = dest === '404.html' ? '/404.html' : `/${dest.replace('.html', '')}`;
  const pageKey = dest.replace('.html', '');
  const pageSeo = CONFIG.seo.pages[pageKey];
  const pageType = dest === 'about.html' ? 'AboutPage' : dest === 'contact.html' ? 'ContactPage' : dest === 'our-work.html' ? 'CollectionPage' : 'WebPage';
  const rootSchemas = dest === '404.html'
    ? []
    : [
        localBusinessSchema(),
        websiteSchema(),
        webPageSchema(pathname, rootMeta[dest][0], rootMeta[dest][1], pageType, pageSeo.featuredImage),
        breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: rootMeta[dest][0].split('|')[0].trim(), path: pathname },
        ]),
        ...(dest === 'our-work.html' ? [{
          '@type': 'ItemList',
          itemListElement: PROJECTS.map((project, index) => ({ '@type': 'ListItem', position: index + 1, url: `${CONFIG.siteUrl}/our-work#${project.id}`, name: project.title, image: `${CONFIG.siteUrl}${project.img}` })),
        }] : []),
      ];
  html = injectGeneratedSeo(html, pathname, rootSchemas);

  writeFile(destPath, canonicalizeInternalLinks(injectStaticNavigation(html)));
});

// ── Summary ───────────────────────────────────────────────────
const total = CONFIG.services.length + CONFIG.serviceAreas.length + pagesToRoot.length;
console.log(`\n✅  Build complete — ${total} pages generated.\n`);
console.log('── File structure ──');
console.log('  index.html            ← homepage');
CONFIG.services.forEach(s => console.log(`  services/${s.slug}.html`));
CONFIG.serviceAreas.forEach(a => console.log(`  cities/${a.slug}.html`));
pagesToRoot.forEach(([, d]) => console.log(`  ${d}`));
console.log('');

// Refresh homepage SEO without changing its template structure.
let indexHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
// Normalize previously generated homepage regions so repeated builds always
// reflect the current content model instead of preserving stale HTML.
indexHtml = indexHtml
  .replace('<div class="section-header text-center"><div class="section-eyebrow">Why Elite</div>', '<div id="why-section-header" class="section-header text-center"><div class="section-eyebrow">Why Elite</div>')
  .replace('<div class="section-header text-center"><div class="section-eyebrow">Services</div>', '<div id="services-section-header" class="section-header text-center"><div class="section-eyebrow">Services</div>')
  .replace('<div class="section-header text-center"><div class="section-eyebrow">Our work</div>', '<div id="recent-work-header" class="section-header text-center"><div class="section-eyebrow">Our work</div>')
  .replace('<div class="section-header text-center"><div class="section-eyebrow">How it works</div>', '<div id="process-section-header" class="section-header text-center"><div class="section-eyebrow">How it works</div>')
  .replace('<div class="section-header text-center"><div class="section-eyebrow">Service areas</div>', '<div id="areas-section-header" class="section-header text-center"><div class="section-eyebrow">Service areas</div>')
  .replace('<div class="section-header text-center"><div class="section-eyebrow">FAQ</div>', '<div id="faq-section-header" class="section-header text-center"><div class="section-eyebrow">FAQ</div>')
  .replace(/<div class="services-grid-home" id="services-grid">[\s\S]*?<\/div>\s*(?=<\/div>\s*<\/section>)/, '<div class="services-grid-home" id="services-grid"></div>')
  .replace(/<div class="portfolio-grid" id="recent-work-grid">[\s\S]*?<\/div>\s*(?=<\/div>\s*<\/div>\s*<div class="recent-work-cta-row">)/, '<div class="portfolio-grid" id="recent-work-grid"></div>')
  .replace(/<ol id="process-steps-container"[^>]*>[\s\S]*?<\/ol>/, '<div id="process-steps-container"></div>')
  .replace(/<div id="process-steps-container"><!-- GENERATED PROCESS START -->[\s\S]*?<!-- GENERATED PROCESS END --><\/div>/, '<div id="process-steps-container"></div>')
  .replace(/<div class="areas-chips" id="areas-chips">[\s\S]*?<\/div>\s*(?=<\/div>\s*<\/div>\s*<\/div>\s*<\/section>)/, '<div class="areas-chips" id="areas-chips"></div>')
  .replace(/<div id="faq-container">[\s\S]*?<\/div>\s*(?=<\/div>\s*<\/section>)/, '<div id="faq-container"></div>');
indexHtml = setMeta(
  indexHtml,
  CONFIG.seo.home.title,
  CONFIG.seo.home.description
);
indexHtml = indexHtml
  .replace(/<div class="stars" id="hero-stars">[\s\S]*?<\/div>/, `<div class="stars" id="hero-stars" aria-hidden="true">${staticStarsHtml(5)}</div>`)
  .replace(/<span id="hero-proof-text">[\s\S]*?<\/span>/, `<span id="hero-proof-text">${escapeHtml(CONFIG.rating)} stars &middot; ${escapeHtml(CONFIG.reviewCount)} verified reviews</span>`)
  .replace(/(<a[^>]*id="hero-cta-primary"[^>]*>)[\s\S]*?(<\/a>)/, `$1${escapeHtml(CONFIG.hero.ctaPrimary)}$2`)
  .replace(/<span id="hero-cta-phone-text">[\s\S]*?<\/span>/, `<span id="hero-cta-phone-text">${escapeHtml(CONFIG.phone)}</span>`)
  .replace('<h1 class="hero-headline" id="hero-headline"></h1>', `<h1 class="hero-headline" id="hero-headline">${escapeHtml(CONFIG.hero.headline)}</h1>`)
  .replace('<p class="hero-sub" id="hero-sub"></p>', `<p class="hero-sub" id="hero-sub">${escapeHtml(CONFIG.hero.subheadline)}</p>`)
  .replace('<div id="why-section-header"></div>', sectionHeader('Why Elite', 'Clear choices, verified measurements, and accountable follow-through', 'Founded after the owners faced the same shower-door sourcing problem customers face, the team focuses on practical guidance before custom products are ordered.', 'why-section-header'))
  .replace('<div id="services-section-header"></div>', sectionHeader('Services', 'Glass, windows, and doors for the problem in front of you', 'Start with the symptom or project goal. Each service page explains choices, measurement readiness, and the next step.', 'services-section-header'))
  .replace('<div class="services-grid-home" id="services-grid"></div>', `<div class="services-grid-home" id="services-grid">${CONFIG.services.map(service => `<article class="service-card"><img src="${service.image}" alt="${escapeHtml(service.name)} example" width="960" height="640" loading="lazy" decoding="async"><div class="service-card-body"><h3>${escapeHtml(service.name)}</h3><p>${escapeHtml(service.desc)}</p><a href="/services/${service.slug}">Explore ${escapeHtml(service.name)}</a></div></article>`).join('')}</div>`)
  .replace('<div id="recent-work-header"></div>', sectionHeader('Our work', 'Verified Greater Seattle projects', 'Review documented project details and photography before planning your own scope.', 'recent-work-header'))
  .replace('<div class="portfolio-grid" id="recent-work-grid"></div>', `<div class="portfolio-grid" id="recent-work-grid">${PROJECTS.slice(0, 6).map(project => `<article class="portfolio-item"><a href="/our-work#${project.id}"><img src="${project.img}" alt="${escapeHtml(project.alt)}" width="${project.width}" height="${project.height}" loading="lazy" decoding="async"><h3>${escapeHtml(project.title)}</h3></a></article>`).join('')}</div>`)
  .replace('<div id="process-section-header"></div>', sectionHeader('How it works', 'From the first photos to the final walkthrough', 'Custom work follows a measured sequence so the approved product fits the opening and the written scope.', 'process-section-header'))
  .replace('<div id="process-steps-container"></div>', `<div id="process-steps-container"><!-- GENERATED PROCESS START --><ol class="process-steps">${CONFIG.processSteps.map((step, index) => `<li><strong>${index + 1}. ${escapeHtml(step.title)}</strong><p>${escapeHtml(step.desc)}</p></li>`).join('')}</ol><!-- GENERATED PROCESS END --></div>`)
  .replace('<div id="areas-section-header"></div>', sectionHeader('Service areas', 'Serving Redmond and Greater Seattle', 'Use a city page for local planning notes, priority services, project proof where documented, and current authority links.', 'areas-section-header'))
  .replace('<div class="areas-chips" id="areas-chips"></div>', `<div class="areas-chips" id="areas-chips">${CONFIG.serviceAreas.map(area => `<a class="area-chip" href="/cities/${area.slug}">${escapeHtml(area.name)}, WA</a>`).join('')}</div>`)
  .replace('<div id="faq-section-header"></div>', sectionHeader('FAQ', 'Questions customers ask before an estimate', '', 'faq-section-header'))
  .replace('<div id="faq-container"></div>', `<div id="faq-container">${staticFaqHtml(CONFIG.faqs, 'home')}</div>`)
  .replace(/<meta name="author" content="[^"]*"\s*\/>/, `<meta name="author" content="${escapeHtml(CONFIG.businessName)}" />`);
indexHtml = injectGeneratedSeo(indexHtml, '/', [localBusinessSchema(), websiteSchema(), webPageSchema('/', CONFIG.seo.home.title, CONFIG.seo.home.description, 'WebPage', CONFIG.seo.home.featuredImage), faqSchema(CONFIG.faqs)]);
indexHtml = injectStaticNavigation(indexHtml);
indexHtml = canonicalizeInternalLinks(indexHtml);
indexHtml = moveInlineStylesToHead(indexHtml);
fs.writeFileSync(path.join(__dirname, 'index.html'), indexHtml, 'utf8');

const sitemapPaths = [
  '/', '/about', '/installation-process', '/contact', '/our-work', '/privacy-policy', '/terms',
  ...CONFIG.services.map(service => `/services/${service.slug}`),
  ...CONFIG.serviceAreas.map(area => `/cities/${area.slug}`),
];
function sitemapMeta(pathname) {
  if (pathname === '/') return CONFIG.seo.home;
  const serviceMatch = pathname.match(/^\/services\/([^/]+)$/);
  if (serviceMatch) return CONFIG.services.find(service => service.slug === serviceMatch[1]);
  const cityMatch = pathname.match(/^\/cities\/([^/]+)$/);
  if (cityMatch) return CONFIG.citySeo[cityMatch[1]];
  return CONFIG.seo.pages[pathname.slice(1)];
}
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${sitemapPaths.map(pathname => {
  const meta = sitemapMeta(pathname);
  return `  <url><loc>${CONFIG.siteUrl}${pathname}</loc><lastmod>${meta.updatedAt}</lastmod><image:image><image:loc>${CONFIG.siteUrl}${meta.featuredImage}</image:loc></image:image></url>`;
}).join('\n')}\n</urlset>\n`;
fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), sitemap, 'utf8');
fs.writeFileSync(path.join(__dirname, 'robots.txt'), `User-agent: *\nAllow: /\n\nUser-agent: Googlebot\nAllow: /\n\nUser-agent: Bingbot\nAllow: /\n\nUser-agent: OAI-SearchBot\nAllow: /\n\nSitemap: ${CONFIG.siteUrl}/sitemap.xml\n`, 'utf8');
