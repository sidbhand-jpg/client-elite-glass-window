const fs = require("fs");
const path = require("path");
const CONFIG = require("./CONFIG.js");

const root = __dirname;
const out = (file, value) => {
  const full = path.join(root, file);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, value.trim() + "\n", "utf8");
};
const esc = (value = "") => String(value).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const slugify = value => value.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const absolute = value => `${CONFIG.siteUrl}${value}`;
const addressText = `${CONFIG.address.street}, ${CONFIG.address.city}, ${CONFIG.address.state} ${CONFIG.address.postalCode}`;
const allCities = [...new Set(CONFIG.serviceRegions.flatMap(region => region.cities))];

function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "HomeAndConstructionBusiness"],
    "@id": `${CONFIG.siteUrl}/#business`,
    name: CONFIG.businessName,
    legalName: CONFIG.legalName,
    url: CONFIG.siteUrl,
    logo: absolute("/assets/logo.svg"),
    image: absolute("/assets/showroom.jpg"),
    telephone: CONFIG.phoneRaw,
    email: CONFIG.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: CONFIG.address.street,
      addressLocality: CONFIG.address.city,
      addressRegion: CONFIG.address.state,
      postalCode: CONFIG.address.postalCode,
      addressCountry: CONFIG.address.country
    },
    geo: { "@type": "GeoCoordinates", latitude: CONFIG.geo.latitude, longitude: CONFIG.geo.longitude },
    areaServed: allCities.map(name => ({ "@type": "City", name: `${name}, Washington` })),
    knowsAbout: CONFIG.services.map(service => service.name),
    priceRange: "$$"
  };
}

function breadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem", position: index + 1, name: item.name, item: absolute(item.path)
    }))
  };
}

function faqSchema(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(item => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a }
    }))
  };
}

function head({ title, description, pathname, image = "/assets/indexbg.jpg", schemas = [], noindex = false }) {
  const canonical = absolute(pathname);
  return `
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="robots" content="${noindex ? "noindex,follow" : "index,follow,max-image-preview:large"}">
  <link rel="canonical" href="${canonical}">
  <link rel="icon" href="/assets/logo.svg" type="image/svg+xml">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${esc(CONFIG.businessName)}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${absolute(image)}">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/styles.css">
  ${[organizationSchema(), ...schemas].map(schema => `<script type="application/ld+json">${JSON.stringify(schema).replace(/</g, "\\u003c")}</script>`).join("\n  ")}`;
}

function header() {
  const links = CONFIG.services.map(service => `<a href="/services/${service.slug}.html">${esc(service.shortName)}</a>`).join("");
  return `<a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header">
    <div class="topbar"><div class="shell topbar-inner"><span>Redmond showroom · Serving Greater Seattle</span><a href="tel:${CONFIG.phoneRaw}">${CONFIG.phone}</a></div></div>
    <div class="shell nav-row">
      <a class="brand" href="/" aria-label="${esc(CONFIG.businessName)} home"><img src="/assets/logo.svg" alt="${esc(CONFIG.businessName)}"></a>
      <button class="menu-toggle" aria-expanded="false" aria-controls="site-nav">Menu</button>
      <nav id="site-nav" class="site-nav" aria-label="Primary navigation">
        <a href="/about.html">About</a>
        <div class="nav-group"><button type="button" aria-expanded="false">Products & Services</button><div class="nav-menu">${links}</div></div>
        <a href="/installation-process.html">Process</a>
        <a href="/service-areas.html">Service Areas</a>
        <a href="/contact.html" class="nav-cta">Free Estimate</a>
      </nav>
    </div>
  </header>`;
}

function footer() {
  const serviceLinks = CONFIG.services.map(service => `<li><a href="/services/${service.slug}.html">${esc(service.shortName)}</a></li>`).join("");
  return `<footer class="site-footer">
    <div class="shell footer-grid">
      <div><img class="footer-logo" src="/assets/logo.svg" alt="${esc(CONFIG.businessName)}"><p>Custom glass, windows, doors, showers, railings, mirrors, and commercial glazing from a local Redmond team.</p></div>
      <div><h2>Products & services</h2><ul>${serviceLinks}</ul></div>
      <div><h2>Visit or contact</h2><address>${esc(addressText)}</address><p><a href="tel:${CONFIG.phoneRaw}">${CONFIG.phone}</a><br><a href="mailto:${CONFIG.email}">${CONFIG.email}</a></p><p class="small">Contact us before visiting to confirm current showroom hours.</p></div>
    </div>
    <div class="shell footer-bottom"><span>© ${new Date().getFullYear()} ${esc(CONFIG.legalName)}</span><span><a href="/privacy-policy.html">Privacy</a> · <a href="/terms.html">Terms</a> · <a href="/sitemap.xml">Sitemap</a></span></div>
  </footer>`;
}

function page({ title, description, pathname, content, image, schemas, bodyClass = "" }) {
  return `<!doctype html><html lang="en"><head>${head({ title, description, pathname, image, schemas })}</head><body class="${bodyClass}">${header()}<main id="main">${content}</main>${footer()}<script src="/CONFIG.js"></script><script src="/site.js" defer></script></body></html>`;
}

function iconCheck() { return `<svg aria-hidden="true" viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"/></svg>`; }
function serviceCards(limit) {
  return CONFIG.services.slice(0, limit || CONFIG.services.length).map(service => `<article class="service-card"><a class="card-image" href="/services/${service.slug}.html"><img src="${service.image}" alt="${esc(service.name)}" loading="lazy" width="720" height="540"></a><div class="card-copy"><p class="eyebrow">Products & service</p><h3><a href="/services/${service.slug}.html">${esc(service.name)}</a></h3><p>${esc(service.summary)}</p><a class="text-link" href="/services/${service.slug}.html">Explore options <span aria-hidden="true">→</span></a></div></article>`).join("");
}
function faqMarkup(faqs) {
  return `<div class="faq-list">${faqs.map((item, index) => `<details${index === 0 ? " open" : ""}><summary>${esc(item.q)}</summary><p>${esc(item.a)}</p></details>`).join("")}</div>`;
}
function regionCards() {
  return CONFIG.serviceRegions.map(region => `<section class="region-card"><h2>${esc(region.name)}</h2><p class="city-line">${region.cities.map((city, index) => `${index ? '<span aria-hidden="true">•</span>' : ''}<a href="/locations/${slugify(city)}.html">${esc(city)}</a>`).join("")}</p></section>`).join("");
}
function leadForm(context = "General estimate") {
  return `<form class="lead-form" data-lead-form>
    <input type="hidden" name="page_context" value="${esc(context)}">
    <input type="hidden" name="lead_event_id" value="">
    <div class="field-row"><label>First and last name<input required name="name" autocomplete="name"></label><label>Phone number<input required name="phone" type="tel" autocomplete="tel"></label></div>
    <div class="field-row"><label>Email address<input required name="email" type="email" autocomplete="email"></label><label>Project ZIP code<input required name="postal_code" inputmode="numeric" autocomplete="postal-code"></label></div>
    <label>What can we help with?<select required name="service"><option value="">Choose a product or service</option>${CONFIG.services.map(service => `<option value="${service.slug}">${esc(service.name)}</option>`).join("")}</select></label>
    <label>Project details<textarea name="message" rows="4" placeholder="Tell us what you would like to replace, install, or design."></textarea></label>
    <label class="consent"><input required type="checkbox" name="consent" value="yes"> <span>I agree that Elite Glass & Window may contact me about this request by phone, email, or text. Consent is not a condition of purchase. Message and data rates may apply.</span></label>
    <button class="button button-primary" type="submit">Request my free estimate</button>
    <p class="form-status" aria-live="polite"></p>
  </form>`;
}

const homeDescription = "Elite Glass & Window provides window replacement, shower doors, glass replacement, railings, mirrors, doors and storefront glass from its Redmond showroom, serving Greater Seattle.";
const homeContent = `
  <section class="hero"><div class="hero-media"><img src="/assets/indexbg.jpg" alt="Custom glass shower enclosure and modern glass railing" width="1740" height="602"></div><div class="shell hero-inner"><div class="hero-copy"><p class="eyebrow light">Local glass company in Redmond, WA</p><h1>Glass replacement, windows & custom glass—done with precision.</h1><p>Visit our Redmond showroom or schedule an on-site consultation for residential and commercial glass across Greater Seattle.</p><div class="button-row"><a class="button button-primary" href="/contact.html">Get a free estimate</a><a class="button button-ghost" href="tel:${CONFIG.phoneRaw}">Call ${CONFIG.phone}</a></div><ul class="hero-points"><li>Custom measured</li><li>Residential + commercial</li><li>Local installation team</li></ul></div></div></section>
  <section class="trust-strip"><div class="shell trust-grid"><div><strong>Redmond showroom</strong><span>See materials and options in person</span></div><div><strong>One project team</strong><span>Consultation through final inspection</span></div><div><strong>Custom solutions</strong><span>Built around your space and priorities</span></div></div></section>
  <section class="section" id="services"><div class="shell"><div class="section-head split"><div><p class="eyebrow">Products & services</p><h2>Everything glass, window, and door.</h2></div><p>Compare product types, understand the installation scope, and get a recommendation based on the opening—not a one-size-fits-all pitch.</p></div><div class="service-grid">${serviceCards()}</div></div></section>
  <section class="section section-dark"><div class="shell story-grid"><div class="story-image"><img src="/assets/showroom.jpg" alt="Elite Glass & Window showroom in Redmond, Washington" loading="lazy" width="900" height="700"></div><div><p class="eyebrow light">Your local glass company</p><h2>See the options before you decide.</h2><p>Bring your ideas to our Redmond showroom to compare glass, hardware, windows, and door systems with guidance from people who work with these products every day.</p><p class="address-callout">${esc(addressText)}</p><div class="button-row"><a class="button button-primary" href="/contact.html">Plan your visit</a><a class="button button-ghost" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressText)}" rel="noopener" target="_blank">Get directions</a></div></div></div></section>
  <section class="section"><div class="shell"><div class="section-head centered"><p class="eyebrow">How it works</p><h2>A clear process for custom work.</h2><p>Accurate measurements and approved specifications come before fabrication.</p></div><ol class="process-grid">${CONFIG.process.map((step, index) => `<li><span>${String(index + 1).padStart(2, "0")}</span><h3>${esc(step.name)}</h3><p>${esc(step.detail)}</p></li>`).join("")}</ol><p class="center"><a class="text-link" href="/installation-process.html">See the complete installation process →</a></p></div></section>
  <section class="section section-blue"><div class="shell"><div class="section-head split inverse"><div><p class="eyebrow light">Brands and systems</p><h2>Options for different homes, budgets, and designs.</h2></div><p>Product availability varies by project. We currently work across window, shower-door, and architectural-door lines from trusted manufacturers.</p></div><div class="brand-list">${CONFIG.brands.map(brand => `<span>${esc(brand)}</span>`).join("")}</div></div></section>
  <section class="section"><div class="shell faq-layout"><div><p class="eyebrow">Quick answers</p><h2>Frequently asked questions</h2><p>Clear answers help you choose the right next step. Final specifications always follow field measurement and product review.</p></div>${faqMarkup(CONFIG.generalFaqs)}</div></section>
  <section class="section section-soft"><div class="shell contact-grid"><div><p class="eyebrow">Start your project</p><h2>Tell us what you need.</h2><p>Share your location, a few details, and any photos or measurements you already have. We’ll help you determine the right consultation and measurement path.</p><div class="contact-lines"><a href="tel:${CONFIG.phoneRaw}">${CONFIG.phone}</a><a href="mailto:${CONFIG.email}">${CONFIG.email}</a></div></div>${leadForm("Homepage estimate")}</div></section>`;

out("index.html", page({ title: "Glass Replacement & Window Company in Redmond, WA | Elite Glass & Window", description: homeDescription, pathname: "/", content: homeContent, schemas: [faqSchema(CONFIG.generalFaqs)] }));

for (const service of CONFIG.services) {
  const pathname = `/services/${service.slug}.html`;
  const title = `${service.name} in Redmond & Greater Seattle | Elite Glass & Window`;
  const description = `${service.summary} Visit our Redmond showroom or request a free estimate across Greater Seattle.`;
  const serviceSchema = {
    "@context": "https://schema.org", "@type": "Service", name: service.name,
    description: service.summary, url: absolute(pathname), image: absolute(service.image),
    provider: { "@id": `${CONFIG.siteUrl}/#business` }, areaServed: allCities.map(name => ({ "@type": "City", name: `${name}, WA` })),
    hasOfferCatalog: { "@type": "OfferCatalog", name: `${service.name} options`, itemListElement: service.options.map(option => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: option.name, description: option.detail } })) }
  };
  const content = `<section class="page-hero"><img src="${service.image}" alt="${esc(service.name)} in the Greater Seattle area" width="1600" height="900"><div class="page-hero-shade"></div><div class="shell page-hero-copy"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>›</span><span>Products & Services</span><span>›</span><span>${esc(service.shortName)}</span></nav><p class="eyebrow light">Redmond · Greater Seattle</p><h1>${esc(service.name)}</h1><p>${esc(service.summary)}</p><div class="button-row"><a class="button button-primary" href="#estimate">Request a free estimate</a><a class="button button-ghost" href="tel:${CONFIG.phoneRaw}">${CONFIG.phone}</a></div></div></section>
    <section class="section"><div class="shell article-grid"><article><p class="lead">${esc(service.intro)}</p><h2>${esc(service.shortName)} options</h2><div class="option-grid">${service.options.map(option => `<section><h3>${esc(option.name)}</h3><p>${esc(option.detail)}</p></section>`).join("")}</div><h2>What the service can include</h2><ul class="check-list">${service.benefits.map(item => `<li>${iconCheck()}<span>${esc(item)}</span></li>`).join("")}</ul></article><aside class="aside-card"><p class="eyebrow">Visit the showroom</p><h2>Compare options in Redmond.</h2><p>See available products, glass, and finishes before final specification.</p><address>${esc(addressText)}</address><a class="text-link" href="/contact.html">Contact the showroom →</a></aside></div></section>
    <section class="section section-soft"><div class="shell faq-layout"><div><p class="eyebrow">Answers before you begin</p><h2>${esc(service.shortName)} FAQ</h2></div>${faqMarkup(service.faqs)}</div></section>
    <section class="section" id="estimate"><div class="shell contact-grid"><div><p class="eyebrow">Free estimate</p><h2>Discuss your ${esc(service.shortName.toLowerCase())} project.</h2><p>Send the address, approximate size, photos, and goals. We’ll follow up about product selection and measurement.</p></div>${leadForm(service.name)}</div></section>`;
  out(`services/${service.slug}.html`, page({ title, description, pathname, image: service.image, content, schemas: [serviceSchema, faqSchema(service.faqs), breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Products & Services", path: "/#services" }, { name: service.name, path: pathname }])] }));
}

const aboutContent = `<section class="simple-hero"><div class="shell narrow"><p class="eyebrow light">About Elite Glass & Window</p><h1>Built on experience. Focused on quality.</h1><p>A local Redmond team helping homeowners and businesses make custom glass projects clearer from the first conversation.</p></div></section><section class="section"><div class="shell story-grid light-story"><div><p class="eyebrow">Our approach</p><h2>Custom work should feel organized, not uncertain.</h2><p class="lead">Elite Glass & Window was founded to make custom glass solutions easier, more transparent, and more beautiful for homes and businesses in the Seattle area.</p><p>From frameless shower enclosures and energy-efficient windows to architectural railings and commercial glass, the work starts by understanding the opening, the environment, and what the finished space needs to do.</p><div class="value-grid"><div><h3>Local guidance</h3><p>Visit the Redmond showroom and talk through materials, configurations, and next steps.</p></div><div><h3>Custom solutions</h3><p>Measurements and specifications are tailored to the actual space.</p></div><div><h3>Professional installation</h3><p>The project stays coordinated from field measurement through final inspection.</p></div><div><h3>Residential + commercial</h3><p>One team supports homes, offices, retail, restaurants, and managed properties.</p></div></div></div><img src="/assets/showroom.jpg" alt="Elite Glass & Window Redmond showroom" width="900" height="700"></div></section><section class="section section-soft"><div class="shell"><div class="section-head centered"><p class="eyebrow">Proudly serving Greater Seattle</p><h2>Four regional service areas.</h2><p>Select your community for local products, service details, and answers.</p></div><div class="region-grid">${regionCards()}</div></div></section><section class="section section-dark"><div class="shell section-head centered inverse"><p class="eyebrow light">Start in Redmond</p><h2>Rooted locally. Working across the region.</h2><p>Contact the team to confirm availability for your address and project type.</p><a class="button button-primary" href="/contact.html">Request a free estimate</a></div></section>`;
out("about.html", page({ title: "About Elite Glass & Window | Redmond, WA Glass Company", description: "Meet Elite Glass & Window, a Redmond-based custom glass, window, door and commercial glazing company serving Greater Seattle.", pathname: "/about.html", content: aboutContent, schemas: [breadcrumbSchema([{ name: "Home", path: "/" }, { name: "About", path: "/about.html" }])] }));

const processContent = `<section class="simple-hero"><div class="shell narrow"><p class="eyebrow light">Installation process</p><h1>A simple process. Exceptional results.</h1><p>From first ideas to final inspection, each stage keeps the scope, specifications, and expectations clear.</p></div></section><section class="section"><div class="shell process-long">${CONFIG.process.map((step, index) => `<section><span>${String(index + 1).padStart(2, "0")}</span><div><p class="eyebrow">Step ${index + 1}</p><h2>${esc(step.name)}</h2><p>${esc(step.detail)}</p></div></section>`).join("")}</div></section><section class="section section-soft"><div class="shell faq-layout"><div><p class="eyebrow">Before fabrication</p><h2>Why final measurements matter</h2><p>Custom glass cannot be resized after tempering. Finished surfaces, hardware clearances, and verified dimensions are part of getting the fit right.</p></div>${faqMarkup(CONFIG.generalFaqs.slice(0, 5))}</div></section><section class="section section-blue"><div class="shell section-head centered inverse"><p class="eyebrow light">Ready to begin?</p><h2>Start with a conversation.</h2><p>Share the project details and we’ll help you determine whether to visit the showroom or schedule an on-site consultation.</p><a class="button button-light" href="/contact.html">Request a free estimate</a></div></section>`;
out("installation-process.html", page({ title: "Glass & Window Installation Process | Elite Glass & Window", description: "Learn how Elite Glass & Window handles consultation, measurement, specification, fabrication, installation and final inspection in Greater Seattle.", pathname: "/installation-process.html", content: processContent, schemas: [breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Installation Process", path: "/installation-process.html" }]), faqSchema(CONFIG.generalFaqs.slice(0, 5))] }));

const areasContent = `<section class="simple-hero"><div class="shell narrow"><p class="eyebrow light">Service areas</p><h1>Local glass service across Greater Seattle.</h1><p>Based in Redmond and serving homes and businesses across the Eastside, Seattle, Snohomish County, South King County, and nearby communities.</p></div></section><section class="section"><div class="shell"><div class="section-head centered"><p class="eyebrow">Proudly serving Greater Seattle</p><h2>Find your service area.</h2><p>Choose a community to explore local glass, window, door, and installation services.</p></div><div class="region-grid">${regionCards()}</div></div></section><section class="section section-soft"><div class="shell contact-grid"><div><p class="eyebrow">Not sure if you’re in range?</p><h2>Ask about your address.</h2><p>Service availability depends on project type, location, and schedule. Send your ZIP code and scope for a direct answer.</p></div>${leadForm("Service area inquiry")}</div></section>`;
out("service-areas.html", page({ title: "Glass & Window Service Areas | Greater Seattle & Eastside", description: "Elite Glass & Window serves Redmond, Bellevue, Seattle, the Eastside, Snohomish County, South King County and nearby Greater Seattle communities.", pathname: "/service-areas.html", content: areasContent, schemas: [breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Service Areas", path: "/service-areas.html" }])] }));

for (const city of allCities) {
  const citySlug = slugify(city);
  const region = CONFIG.serviceRegions.find(item => item.cities.includes(city));
  const pathname = `/locations/${citySlug}.html`;
  const cityFaqs = [
    { q: `Does Elite Glass & Window serve ${city}, WA?`, a: `Yes. ${city} is within the company’s listed ${region.name} service area. Availability depends on the project type, address, and current schedule.` },
    { q: `What glass services are available in ${city}?`, a: `Services include window and glass replacement, custom shower doors, entry and patio doors, glass railings, mirrors, storefront glass, and custom fabricated glass.` },
    { q: `Can I visit the showroom before a ${city} project?`, a: `Yes. The showroom is at ${addressText}. Contact the team before visiting to confirm current hours and whether samples for your product category are available.` }
  ];
  const content = `<section class="simple-hero local-hero"><div class="shell narrow"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>›</span><a href="/service-areas.html">Service Areas</a><span>›</span><span>${esc(city)}</span></nav><p class="eyebrow light">${esc(region.name)}</p><h1>Glass, window & shower door services in ${esc(city)}, WA</h1><p>Custom measured and professionally installed by a Redmond-based team serving residential and commercial projects in ${esc(city)}.</p><div class="button-row"><a class="button button-primary" href="/contact.html">Get a free estimate</a><a class="button button-ghost" href="tel:${CONFIG.phoneRaw}">${CONFIG.phone}</a></div></div></section><section class="section"><div class="shell"><div class="section-head split"><div><p class="eyebrow">Products & services</p><h2>What we install in ${esc(city)}.</h2></div><p>Project availability and product lead times vary. Start with the address, photos, approximate dimensions, and the result you want.</p></div><div class="service-grid compact">${serviceCards()}</div></div></section><section class="section section-soft"><div class="shell faq-layout"><div><p class="eyebrow">Local answers</p><h2>${esc(city)} glass service FAQ</h2></div>${faqMarkup(cityFaqs)}</div></section>`;
  out(`locations/${citySlug}.html`, page({ title: `Glass & Window Company in ${city}, WA | Elite Glass & Window`, description: `Window replacement, glass replacement, shower doors, mirrors, railings, doors and commercial glass in ${city}, WA. Request a free estimate.`, pathname, content, schemas: [faqSchema(cityFaqs), breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Service Areas", path: "/service-areas.html" }, { name: city, path: pathname }])] }));
}

const contactContent = `<section class="simple-hero"><div class="shell narrow"><p class="eyebrow light">Free estimate</p><h1>Tell us about your glass project.</h1><p>Share your address, project type, and a few details. The team will follow up about showroom options, measurement, and next steps.</p></div></section><section class="section"><div class="shell contact-grid"><div><p class="eyebrow">Contact the Redmond showroom</p><h2>Talk with a glass specialist.</h2><div class="contact-panel"><h3>Call</h3><a href="tel:${CONFIG.phoneRaw}">${CONFIG.phone}</a><h3>Email</h3><a href="mailto:${CONFIG.email}">${CONFIG.email}</a><h3>Showroom</h3><address>${esc(addressText)}</address><p>Contact us before visiting to confirm current showroom hours.</p><a class="text-link" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressText)}" target="_blank" rel="noopener">Open in Google Maps →</a></div></div>${leadForm("Contact page")}</div></section>`;
out("contact.html", page({ title: "Contact Elite Glass & Window | Free Estimate in Greater Seattle", description: "Contact Elite Glass & Window in Redmond, WA for a free window, shower door, glass replacement, railing, mirror, door or storefront estimate.", pathname: "/contact.html", content: contactContent, schemas: [breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact.html" }])] }));

function legalPage(kind) {
  const privacy = kind === "privacy";
  const title = privacy ? "Privacy Policy" : "Website Terms";
  const paragraphs = privacy ? `
    <h2>Information we collect</h2><p>When you submit a form, we may collect your name, phone number, email address, ZIP code, project details, and consent choice. We may also collect technical and attribution data such as IP address, browser information, page URL, referrer, UTM parameters, and Meta click identifiers.</p>
    <h2>How information is used</h2><p>We use submitted information to respond to your request, prepare estimates, coordinate service, measure website performance, prevent abuse, and—when configured—measure advertising conversions through Microsoft Clarity and Meta Pixel/Conversions API.</p>
    <h2>Analytics and advertising</h2><p>If enabled, Microsoft Clarity may record anonymized interaction and diagnostic information. Meta technologies may receive browser events and server-side conversion events. Browser and server events use a shared event identifier to avoid duplicate conversion counts.</p>
    <h2>Sharing and retention</h2><p>Information may be processed by website hosting, communications, CRM, analytics, and advertising providers used to operate the business. We do not state that data is sold. Records are retained only as needed for operations, legal obligations, and legitimate business purposes.</p>
    <h2>Your choices</h2><p>You may use browser privacy controls, block optional scripts, or contact us to ask about personal information associated with your inquiry. Text-message consent is not a condition of purchase.</p>` : `
    <h2>Website information</h2><p>This website provides general information about products and services. Product availability, lead times, pricing, warranty coverage, and installation scope are confirmed only in a written proposal or agreement.</p>
    <h2>Estimates and measurements</h2><p>Online or phone discussions are preliminary. Custom products require verified measurements and approved specifications. Site conditions may change the recommended scope or price.</p>
    <h2>Product and project images</h2><p>Images illustrate product categories and past or representative applications. Colors, finishes, hardware, and glass appearance can vary by screen, lighting, supplier, and final selection.</p>
    <h2>SMS and communications</h2><p>If you consent to texts, message frequency varies and message/data rates may apply. Reply STOP to opt out and HELP for help. Consent is not a condition of purchase.</p>
    <h2>Limitation</h2><p>Use of this website is at your own risk. Nothing on a web page replaces a signed project agreement, manufacturer documentation, code review, engineering, or professional site assessment where required.</p>`;
  const pathname = privacy ? "/privacy-policy.html" : "/terms.html";
  return page({ title: `${title} | ${CONFIG.businessName}`, description: `${title} for the Elite Glass & Window website.`, pathname, content: `<section class="simple-hero short"><div class="shell narrow"><h1>${title}</h1><p>Last updated August 29, 2026</p></div></section><section class="section"><article class="shell prose">${paragraphs}<h2>Contact</h2><p>${esc(CONFIG.businessName)}<br>${esc(addressText)}<br><a href="mailto:${CONFIG.email}">${CONFIG.email}</a><br><a href="tel:${CONFIG.phoneRaw}">${CONFIG.phone}</a></p></article></section>` });
}
out("privacy-policy.html", legalPage("privacy"));
out("terms.html", legalPage("terms"));

out("404.html", `<!doctype html><html lang="en"><head>${head({ title: `Page Not Found | ${CONFIG.businessName}`, description: "The requested page could not be found.", pathname: "/404.html", noindex: true })}</head><body>${header()}<main id="main"><section class="simple-hero"><div class="shell narrow"><p class="eyebrow light">404</p><h1>That page is not here.</h1><p>Explore our products and services or contact the Redmond showroom.</p><div class="button-row"><a class="button button-primary" href="/">Return home</a><a class="button button-ghost" href="/contact.html">Contact us</a></div></div></section></main>${footer()}<script src="/CONFIG.js"></script><script src="/site.js" defer></script></body></html>`);

const sitemapPaths = ["/", "/about.html", "/installation-process.html", "/service-areas.html", "/contact.html", "/privacy-policy.html", "/terms.html", ...CONFIG.services.map(service => `/services/${service.slug}.html`), ...allCities.map(city => `/locations/${slugify(city)}.html`)];
const lastmod = "2026-08-29";
out("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapPaths.map(item => `  <url><loc>${absolute(item)}</loc><lastmod>${lastmod}</lastmod></url>`).join("\n")}\n</urlset>`);
out("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${CONFIG.siteUrl}/sitemap.xml`);
out("_redirects", `/elite/about-us/ /about.html 301\n/elite/installation-process/ /installation-process.html 301\n/elite/contact-us/ /contact.html 301\n/elite/product/ /#services 301\n/elite/product/windows/ /services/window-replacement.html 301\n/elite/product/shower-doors/ /services/shower-doors.html 301\n/elite/product/doors/ /services/entry-patio-doors.html 301\n/elite/product/railings/ /services/glass-railings.html 301\n/elite/product/mirrors/ /services/custom-mirrors.html 301\n/elite/product/glass-replacement/ /services/glass-replacement.html 301\n/elite/product/other-glass-products/ /services/custom-glass-products.html 301\n/elite/projects/storefront-glass-replacement-in-bothell--wa/ /services/storefront-glass.html 301\n/elite/projects/frameless-shower-door-installation/ /services/shower-doors.html 301\n/elite/projects/front-door-replacement/ /services/entry-patio-doors.html 301\n/elite/projects/staircase-glass-railing-replacement/ /services/glass-railings.html 301\n/elite/projects/window-replacement/ /services/window-replacement.html 301\n/elite/projects/custom-wall-mirror-installation/ /services/custom-mirrors.html 301\n/elite/projects/sliding-patio-door-installation/ /services/entry-patio-doors.html 301\n/cities/:slug /locations/:slug 301\n/pages/* / 301\n/services/consultation-estimates.html /contact.html 301\n/our-work.html / 301`);

console.log(`Generated ${CONFIG.services.length} service pages, ${allCities.length} location pages, sitemap.xml, robots.txt, and core pages.`);
