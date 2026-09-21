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

function writeFile(outPath, content) {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, content, 'utf8');
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
    '@context': 'https://schema.org',
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
  ${schemas.map(schema => `<script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>`).join('\n  ')}
  <!-- GENERATED SEO END -->`.replace(/^ +$/gm, '');
  return html
    .replace(/\s*<!-- GENERATED SEO START -->[\s\S]*?<!-- GENERATED SEO END -->/g, '')
    .replace('</head>', `${block}\n</head>`);
}

function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
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
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  };
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
  const outPath = path.join(servicesDir, `${service.slug}.html`);
  let html = serviceTemplate;
  html = setMeta(
    html,
    `${service.name} in Greater Seattle | ${CONFIG.businessName}`,
    `${service.desc} Serving Redmond, Seattle, the Eastside, and nearby communities.`
  );
  html = html
    .replace('id="service-hero-img" src="" alt=""', `id="service-hero-img" src="${service.image}" srcset="${service.image.replace('-960.webp', '-640.webp')} 640w, ${service.image} 960w" sizes="100vw" alt="${escapeHtml(service.name)} project by ${escapeHtml(CONFIG.businessName)}" width="960" height="640" fetchpriority="high" decoding="async"`)
    .replace('<h1 class="service-hero-title" id="service-title"></h1>', `<h1 class="service-hero-title" id="service-title">${escapeHtml(service.name)}</h1>`)
    .replace('<p class="service-hero-desc" id="service-desc"></p>', `<p class="service-hero-desc" id="service-desc">${escapeHtml(service.desc)}</p>`)
    .replace('<p class="service-longdesc" id="service-longdesc"></p>', `<p class="service-longdesc" id="service-longdesc">${escapeHtml(service.longDesc)}</p>`)
    .replace('<div class="service-product-grid" id="service-products"></div>', `<div class="service-product-grid" id="service-products">${service.products.map(product => `<div class="service-product-item">${escapeHtml(product)}</div>`).join('')}</div>`)
    .replace('<div id="service-faq-container"></div>', `<div id="service-faq-container">${staticFaqHtml(service.faqs, service.slug)}</div>`);
  html = injectGeneratedSeo(html, `/services/${service.slug}.html`, [
    localBusinessSchema(),
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: service.name,
      description: service.longDesc,
      url: `${CONFIG.siteUrl}/services/${service.slug}.html`,
      provider: { '@id': `${CONFIG.siteUrl}/#business` },
      areaServed: CONFIG.serviceAreas.map(area => ({ '@type': 'City', name: `${area.name}, WA` })),
    },
    faqSchema(service.faqs),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: service.name, path: `/services/${service.slug}.html` },
    ]),
  ]);
  // Fix paths: services/ is depth 1 from root (same level as pages/)
  html = html
    .replace(/(src|href)="\.\.\/styles\.css"/g,    'href="../styles.css"')
    .replace(/(src|href)="\.\.\/CONFIG\.js"/g,     'src="../CONFIG.js"')
    .replace(/(src|href)="\.\.\/components\.js"/g, 'src="../components.js"');
  writeFile(outPath, html);
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
    .map(candidate => `<a href="/cities/${candidate.slug}.html">${escapeHtml(candidate.name)}, WA</a>`)
    .join('');
  const outPath = path.join(__dirname, 'cities', `${area.slug}.html`);
  let html = readTemplate('pages/city.html');
  html = setMeta(
    html,
    `Glass & Window Services in ${area.name}, WA | ${CONFIG.businessName}`,
    `Custom windows, shower doors, glass replacement, railings, mirrors, doors, and storefront glass for ${area.name}, WA. Free project consultations.`
  );
  const cityFaqs = [
    { q: `Does ${CONFIG.businessName} serve ${area.name}, WA?`, a: `Yes. ${area.name} is within the listed Greater Seattle service area. Availability depends on project type, address, and schedule.` },
    { q: `What glass services are available in ${area.name}?`, a: `Services include window and glass replacement, shower doors, entry and patio doors, railings, mirrors, storefront glass, and custom fabricated glass.` },
    { q: `Where is the showroom?`, a: `The showroom is at ${CONFIG.address}. Contact the team before visiting to confirm current hours.` },
    { q: `Where can I check permit requirements for a ${area.name} project?`, a: `Requirements depend on the property and scope. Check current guidance from ${profile.authority} before work that changes an opening, egress, a guard, structure, or the exterior envelope.` },
  ];
  html = html
    .replace('<div class="page-hero-eyebrow" id="city-eyebrow"></div>', `<div class="page-hero-eyebrow" id="city-eyebrow">${escapeHtml(CONFIG.businessName)} · ${escapeHtml(area.name)}, WA</div>`)
    .replace('<h1 class="city-headline" id="city-headline"></h1>', `<h1 class="city-headline" id="city-headline">Glass &amp; Window Services in <span style="color:var(--color-primary)">${escapeHtml(area.name)}</span></h1>`)
    .replace('<p class="city-sub" id="city-sub"></p>', `<p class="city-sub" id="city-sub">Custom-measured glass, windows, doors, showers, mirrors, railings, and commercial solutions for ${escapeHtml(area.name)} homes and businesses.</p>`)
    .replaceAll('%%CITY_NAME%%', escapeHtml(area.name))
    .replaceAll('%%CITY_REGION%%', escapeHtml(profile.region))
    .replaceAll('%%CITY_FOCUS%%', escapeHtml(profile.focus))
    .replaceAll('%%CITY_AUTHORITY%%', escapeHtml(profile.authority))
    .replaceAll('%%CITY_AUTHORITY_URL%%', profile.authorityUrl)
    .replaceAll('%%NEARBY_CITY_LINKS%%', nearbyLinks)
    .replace('<div id="city-faq-container"></div>', `<div id="city-faq-container">${staticFaqHtml(cityFaqs, area.slug)}</div>`);
  html = injectGeneratedSeo(html, `/cities/${area.slug}.html`, [
    localBusinessSchema(),
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: `Glass and window services in ${area.name}, WA`,
      url: `${CONFIG.siteUrl}/cities/${area.slug}.html`,
      provider: { '@id': `${CONFIG.siteUrl}/#business` },
      areaServed: { '@type': 'Place', name: `${area.name}, Washington` },
    },
    faqSchema(cityFaqs),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: area.name, path: `/cities/${area.slug}.html` },
    ]),
  ]);
  // City pages live at root — fix paths to point to root-level files
  html = html
    .replace(/(src|href)="\.\.\/styles\.css"/g,    'href="../styles.css"')
    .replace(/(src|href)="\.\.\/CONFIG\.js"/g,     'src="../CONFIG.js"')
    .replace(/(src|href)="\.\.\/components\.js"/g, 'src="../components.js"');
  // City pages live in cities/ — update links to pages/ and services/
  html = html.replace(/href="\/pages\//g, 'href="../pages/');
  html = html.replace(/href="\/services\//g, 'href="../services/');
  writeFile(outPath, html);
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
  'about.html': [`About ${CONFIG.businessName} | Redmond Glass Company`, `Learn about ${CONFIG.businessName}, a Redmond glass, window, and door company serving Greater Seattle.`],
  'installation-process.html': [`Installation Process | ${CONFIG.businessName}`, `See the ${CONFIG.businessName} process from on-site measurement and design through fabrication, installation, and final inspection.`],
  'contact.html': [`Contact ${CONFIG.businessName} | Free Glass Estimate`, `Contact ${CONFIG.businessName} in Redmond for window, shower door, glass replacement, railing, mirror, door, or storefront service.`],
  'our-work.html': [`Glass, Window & Door Projects | ${CONFIG.businessName}`, `Explore glass, window, shower door, railing, mirror, door, and commercial projects from ${CONFIG.businessName}.`],
  'privacy-policy.html': [`Privacy Policy | ${CONFIG.businessName}`, `Privacy policy for the ${CONFIG.businessName} website, forms, analytics, and advertising measurement.`],
  'terms.html': [`Website Terms | ${CONFIG.businessName}`, `Website terms for ${CONFIG.businessName}, including estimates, custom measurements, communications, and product information.`],
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
  }

  const pathname = `/${dest}`;
  const rootSchemas = dest === '404.html'
    ? []
    : [
        localBusinessSchema(),
        breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: rootMeta[dest][0].split('|')[0].trim(), path: pathname },
        ]),
      ];
  html = injectGeneratedSeo(html, pathname, rootSchemas);

  writeFile(destPath, html);
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
indexHtml = setMeta(
  indexHtml,
  `Glass Replacement & Window Company in Redmond, WA | ${CONFIG.businessName}`,
  `${CONFIG.businessName} provides windows, shower doors, custom glass, railings, mirrors, doors, and storefront glass throughout Greater Seattle.`
);
indexHtml = indexHtml
  .replace('<h1 class="hero-headline" id="hero-headline"></h1>', `<h1 class="hero-headline" id="hero-headline">${escapeHtml(CONFIG.hero.headline)}</h1>`)
  .replace('<p class="hero-sub" id="hero-sub"></p>', `<p class="hero-sub" id="hero-sub">${escapeHtml(CONFIG.hero.subheadline)}</p>`)
  .replace('<div id="faq-container"></div>', `<div id="faq-container">${staticFaqHtml(CONFIG.faqs, 'home')}</div>`)
  .replace(/<meta name="author" content="[^"]*"\s*\/>/, `<meta name="author" content="${escapeHtml(CONFIG.businessName)}" />`);
indexHtml = injectGeneratedSeo(indexHtml, '/', [localBusinessSchema(), faqSchema(CONFIG.faqs)]);
fs.writeFileSync(path.join(__dirname, 'index.html'), indexHtml, 'utf8');

const sitemapPaths = [
  '/', '/about.html', '/installation-process.html', '/contact.html', '/our-work.html', '/privacy-policy.html', '/terms.html',
  ...CONFIG.services.map(service => `/services/${service.slug}.html`),
  ...CONFIG.serviceAreas.map(area => `/cities/${area.slug}.html`),
];
const lastmod = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapPaths.map(pathname => `  <url><loc>${CONFIG.siteUrl}${pathname}</loc><lastmod>${lastmod}</lastmod></url>`).join('\n')}\n</urlset>\n`;
fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), sitemap, 'utf8');
fs.writeFileSync(path.join(__dirname, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${CONFIG.siteUrl}/sitemap.xml\n`, 'utf8');
