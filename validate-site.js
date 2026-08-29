const fs = require("fs");
const path = require("path");

const root = __dirname;
const htmlFiles = [];
for (const directory of [".", "services", "locations"]) {
  const full = path.join(root, directory);
  for (const name of fs.readdirSync(full)) {
    if (name.endsWith(".html")) htmlFiles.push(path.join(full, name));
  }
}

const errors = [];
const titles = new Map();
for (const file of htmlFiles) {
  const relative = path.relative(root, file).replace(/\\/g, "/");
  const html = fs.readFileSync(file, "utf8");
  const title = html.match(/<title>(.*?)<\/title>/i)?.[1];
  const description = html.match(/<meta name="description" content="([^"]+)"/i)?.[1];
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1];
  const h1Count = (html.match(/<h1\b/gi) || []).length;
  if (!title) errors.push(`${relative}: missing title`);
  if (!description) errors.push(`${relative}: missing meta description`);
  if (!canonical) errors.push(`${relative}: missing canonical`);
  if (h1Count !== 1) errors.push(`${relative}: expected one h1, found ${h1Count}`);
  if (title && relative !== "404.html") {
    if (titles.has(title)) errors.push(`${relative}: duplicate title also used by ${titles.get(title)}`);
    titles.set(title, relative);
  }

  for (const match of html.matchAll(/<(?:a|img|script|link)\b[^>]*(?:href|src)="([^"]+)"/gi)) {
    const url = match[1];
    if (!url.startsWith("/") || url.startsWith("//")) continue;
    const pathname = url.split(/[?#]/)[0];
    if (!pathname || pathname === "/") continue;
    const target = path.join(root, pathname.replace(/^\//, ""));
    if (!fs.existsSync(target)) errors.push(`${relative}: missing local target ${url}`);
  }

  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)) {
    try { JSON.parse(match[1]); } catch (error) { errors.push(`${relative}: invalid JSON-LD (${error.message})`); }
  }
}

const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
for (const match of sitemap.matchAll(/<loc>https:\/\/eliteglassandwindow\.com([^<]*)<\/loc>/g)) {
  const pathname = match[1];
  if (pathname === "/") continue;
  if (!fs.existsSync(path.join(root, pathname.replace(/^\//, "")))) errors.push(`sitemap.xml: missing page ${pathname}`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`Validated ${htmlFiles.length} HTML files, ${titles.size} unique titles, local links, sitemap targets, and JSON-LD.`);
