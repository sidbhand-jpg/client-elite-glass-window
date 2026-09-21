import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const output = path.join(root, 'public', 'optimized');
await fs.mkdir(output, { recursive: true });
const projectOutput = path.join(root, 'public', 'projects-optimized');
await fs.mkdir(projectOutput, { recursive: true });

const sources = [
  ['window-redmond', 'public/projects/window_redmond_main.jpg'],
  ['shower-bellevue', 'public/projects/project_1.jpg'],
  ['front-door-bothell', 'public/projects/frontdoor_main.jpg'],
  ['railing-medina', 'public/projects/stair_medina_main.jpg'],
  ['mirror-kirkland', 'public/projects/mirror_kirkland_main.jpg'],
  ['storefront-bothell', 'public/projects/storefront.jpg'],
  ['glass-replacement', 'public/projects/window_redmond_before.jpg'],
  ['custom-glass', 'public/projects/mirror_kirkland_after.jpg'],
];

for (const [name, source] of sources) {
  for (const width of [640, 960]) {
    await sharp(path.join(root, source))
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 76, effort: 6 })
      .toFile(path.join(output, `${name}-${width}.webp`));
  }
}

const projectFiles = (await fs.readdir(path.join(root, 'public', 'projects')))
  .filter(file => /\.(jpe?g|png)$/i.test(file));
for (const file of projectFiles) {
  await sharp(path.join(root, 'public', 'projects', file))
    .rotate()
    .resize({ width: 1400, withoutEnlargement: true })
    .webp({ quality: 74, effort: 6 })
    .toFile(path.join(projectOutput, `${path.parse(file).name}.webp`));
}

const brandFiles = ['milgard-logo-new-2023.png', 'plygem-notag.png', 'windows3.jpg', 'stile.png', 'sierrapacificwindows.jpg', 'unikoo.jpg', 'macodo.jpg', 'cool.jpg', 'teza.jpg'];
for (const file of brandFiles) {
  await sharp(path.join(root, 'public', file))
    .rotate()
    .resize({ width: 252, withoutEnlargement: true })
    .webp({ quality: 80, effort: 6, alphaQuality: 90 })
    .toFile(path.join(output, `brand-${path.parse(file).name}.webp`));
}

await sharp(path.join(root, 'public/projects/window_redmond_main.jpg'))
  .rotate()
  .resize({ width: 1440, withoutEnlargement: true })
  .webp({ quality: 78, effort: 6 })
  .toFile(path.join(output, 'window-redmond-1440.webp'));

const favicon = sharp(path.join(root, 'public/favicon.png')).rotate();
await favicon.clone().resize(32, 32).png({ compressionLevel: 9 }).toFile(path.join(root, 'favicon-32x32.png'));
await favicon.clone().resize(180, 180).png({ compressionLevel: 9 }).toFile(path.join(root, 'apple-touch-icon.png'));

const socialBase = path.join(root, 'public/social/elite-glass-og-base.png');
const logo = await sharp(path.join(root, 'logo.svg')).resize({ width: 360 }).png().toBuffer();
const overlay = Buffer.from(`
  <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="shade" x1="0" x2="1"><stop offset="0" stop-color="#111827" stop-opacity="0.96"/><stop offset="0.48" stop-color="#111827" stop-opacity="0.72"/><stop offset="0.78" stop-color="#111827" stop-opacity="0.12"/><stop offset="1" stop-color="#111827" stop-opacity="0"/></linearGradient></defs>
    <rect width="1200" height="630" fill="url(#shade)"/>
    <rect x="52" y="48" width="405" height="116" rx="18" fill="#ffffff" fill-opacity="0.96"/>
    <text x="58" y="245" fill="#ffffff" font-family="Segoe UI, Arial, sans-serif" font-size="58" font-weight="700">Custom Glass,</text>
    <text x="58" y="310" fill="#ffffff" font-family="Segoe UI, Arial, sans-serif" font-size="58" font-weight="700">Windows &amp; Doors</text>
    <text x="60" y="366" fill="#dbeafe" font-family="Segoe UI, Arial, sans-serif" font-size="28" font-weight="600">Redmond &amp; Greater Seattle</text>
    <rect x="58" y="418" width="330" height="58" rx="29" fill="#0b5fa5"/>
    <text x="223" y="456" text-anchor="middle" fill="#ffffff" font-family="Segoe UI, Arial, sans-serif" font-size="24" font-weight="700">Free Project Consultation</text>
  </svg>`);

await sharp(socialBase)
  .resize(1200, 630, { fit: 'cover', position: 'centre' })
  .composite([
    { input: overlay, top: 0, left: 0 },
    { input: logo, top: 59, left: 75 },
  ])
  .jpeg({ quality: 82, progressive: true, mozjpeg: true })
  .toFile(path.join(root, 'public/social/elite-glass-og.jpg'));

console.log(`Optimized ${projectFiles.length} project images, ${brandFiles.length} brand marks, responsive service images, favicons, and social preview.`);
