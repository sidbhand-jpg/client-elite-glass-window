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
  return (featured || projects[0]).img || null;
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
    `${service.name} in ${CONFIG.city} | ${CONFIG.businessName}`,
    service.longDesc.slice(0, 155)
  );
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
  const outPath = path.join(__dirname, 'cities', `${area.slug}.html`);
  let html = readTemplate('pages/city.html');
  html = setMeta(
    html,
    `${CONFIG.niche || 'Home Services'} in ${area.name}, ${CONFIG.stateShort} | ${CONFIG.businessName}`,
    `${CONFIG.businessName} provides ${(CONFIG.niche || 'home services').toLowerCase()} services in ${area.name}, ${CONFIG.stateShort}. Request a free estimate today.`
  );
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
  ['pages/contact.html',        'contact.html'],
  ['pages/our-work.html',       'our-work.html'],
  ['pages/privacy-policy.html', 'privacy-policy.html'],
  ['pages/terms.html',          'terms.html'],
  ['pages/404.html',            '404.html'],
];

pagesToRoot.forEach(([src, dest]) => {
  const srcPath  = path.join(__dirname, src);
  const destPath = path.join(__dirname, dest);
  if (!fs.existsSync(srcPath)) { console.warn(`  ⚠  ${src} not found, skipping`); return; }

  let html = fs.readFileSync(srcPath, 'utf8');
  // These pages are at root — update relative paths
  html = html
    .replace(/(src|href)="\.\.\/styles\.css"/g,    'href="styles.css"')
    .replace(/(src|href)="\.\.\/CONFIG\.js"/g,     'src="CONFIG.js"')
    .replace(/(src|href)="\.\.\/PROJECTS\.js"/g,   'src="PROJECTS.js"')
    .replace(/(src|href)="\.\.\/components\.js"/g, 'src="components.js"');

  // our-work.html: fill in og:image / twitter:image from the top
  // featured PROJECTS photo, so social shares show a real image.
  if (dest === 'our-work.html') {
    html = setOgImage(html, getLeadProjectImage(PROJECTS));
  }

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
