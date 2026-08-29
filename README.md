# Houzflow Epoxy Website — HTML/CSS/JS Template

A fully config-driven, multi-page website for epoxy and professional home services contractors. Zero dependencies, no build step required for deployment. One config file controls almost everything.

---

## File Structure

```
/
├── CONFIG.js               ← ✅ THE ONLY EVERGREEN FILE YOU EDIT PER CLIENT
├── PROJECTS.js             ← ✅ Project photos — updates monthly, written by the asset pipeline
├── components.js           ← Shared header, footer, chat widget, lead forms, Meta CAPI attribution
├── styles.css              ← All shared styles
├── index.html              ← Homepage
├── generate-pages.js       ← Build script (Node.js) — run once
│
├── pages/                  ← Source templates (used by generator)
│   ├── service.html        ← Service page template
│   ├── city.html           ← City/location page template
│   ├── about.html
│   ├── contact.html
│   ├── our-work.html
│   ├── privacy-policy.html
│   ├── terms.html
│   └── 404.html
│
├── services/               ← ✅ AUTO-GENERATED — one file per service
│   ├── epoxy-garage-projects.html
│   ├── professional-coatings.html
│   └── …
│
├── cities/                 ← ✅ AUTO-GENERATED — one file per service area
│   ├── your-city.html
│   ├── city-two.html
│   └── …
│
└── public/
    └── _headers            ← Cloudflare Pages cache & security headers
```

---

## Quick Start — New Client Setup

### 1. Edit CONFIG.js

Open `CONFIG.js` and update every field:

```js
businessName:   "ABC Epoxy Projects",
phone:          "(555) 123-4567",
phoneRaw:       "5551234567",       // digits only — must match phone
email:          "hello@abcepoxy.com",
city:           "Austin, TX",
state:          "Texas",
stateShort:     "TX",
address:        "123 Main St, Austin, TX 78701",
licenseNumber:  "TX-12345",

// Tracking — replace placeholders before going live
webhookUrl:     "https://hook.make.com/your-webhook-id",
metaPixelId:    "",                  // 16-digit Meta Pixel ID, leave "" to disable

colors: {
  primary:    "#2563EB",   // swap for client's brand colour
  secondary:  "#1C2333",
},

services:      [ /* add/remove/edit service objects */ ],
serviceAreas:  [ /* add/remove city objects */ ],
testimonials:  [ /* real client reviews */ ],
```

> **⚠️ Never go live with placeholder tracking IDs or an empty webhookUrl.**

### 2. Run the page generator

Requires Node.js (v16+). No npm install needed.

```bash
node generate-pages.js
```

This creates:
- `services/[slug].html` — one per service in CONFIG
- `cities/[city-slug].html` — one per service area in CONFIG (inside `cities/` folder)
- Copies canonical top-level pages (`about.html`, `contact.html`, etc.) with correct paths

### 3. Deploy to Cloudflare Pages

**Option A — GitHub sync (recommended)**

1. Push entire folder to a GitHub repo
2. Connect repo to Cloudflare Pages
3. Build command: *(leave blank — static site)*
4. Output directory: `/` (root)

**Option B — Direct upload**

1. Cloudflare dashboard → Pages → Create project → Direct upload
2. Drag the entire folder

The `public/_headers` file is picked up automatically by Cloudflare Pages for cache and security headers.

---

## Adding a New Service

1. Add a new object to `CONFIG.services[]`:

```js
{
  slug:      "concrete-grinding",
  name:      "Concrete Grinding",
  desc:      "One-line description for cards and meta.",
  image:     "https://…",
  longDesc:  "Full paragraph for the service page.",
  benefits:  ["Benefit one", "Benefit two", …],
  faqs:      [{ q: "Question?", a: "Answer." }, …],
}
```

2. Run `node generate-pages.js` — the new `services/concrete-grinding.html` is created automatically.

---

## Adding a New City

1. Add to `CONFIG.serviceAreas[]`:

```js
{ slug: "round-rock", name: "Round Rock", county: "Williamson" }
```

2. Run `node generate-pages.js` — `cities/round-rock.html` is created automatically.

---

## Branding — Swap Colors & Fonts

All colors are CSS custom properties driven by `CONFIG.colors`:

```js
colors: {
  primary:   "#2563EB",   // buttons, accents, CTAs
  secondary: "#1C2333",   // header, footer, dark sections
}
```

Fonts are loaded from Google Fonts in each HTML file's `<head>`. To change fonts, replace the font imports in each file or update the CSS variables in `styles.css`:

```css
--font-display: 'Your Heading Font', sans-serif;
--font-body:    'Your Body Font', sans-serif;
```

---

## Meta Pixel + Conversions API (Attribution Tracking)

This template ships with a built-in Meta Pixel + attribution capture system, fully wired into every lead form and the chat widget.

### Setup — one line

```js
// CONFIG.js
metaPixelId: "1234567890123456",   // your 16-digit Meta Pixel ID
```

That's it. No code edits, no per-page snippets. When `metaPixelId` is set:

- Every page loads the Meta Pixel base code from `<head>`, fires `PageView` on load, and injects the `<noscript>` fallback pixel.
- When `metaPixelId` is empty (`""`), all pixel code is skipped site-wide — safe to leave blank during build/staging.

### How attribution capture works

On every page load, `components.js` runs `HouzflowAttribution`, which captures:

- UTM parameters (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`)
- Meta click data (`fbclid`, `_fbp` cookie, `_fbc` cookie — or derives `fbc` from `fbclid` if the cookie isn't set yet)
- Ad identifiers (`ad_id`, `adset_id`, `campaign_id`) — populated when present in the URL
- `source_url` (landing page URL) and `user_agent`
- A unique `lead_event_id` per page load, used for Meta Pixel ↔ Conversions API event deduplication

This data is stored in `sessionStorage` (current session) and a first-touch snapshot in `localStorage` (persists across visits).

### How it reaches the lead form

Every form built with `buildLeadForm()` (home, contact, service, and city pages) automatically includes 14 hidden inputs carrying this attribution data. At submit time:

1. The hidden fields are populated from `HouzflowAttribution`
2. The full payload (visible fields + attribution fields) is POSTed to `CONFIG.webhookUrl`
3. `fbq('track', 'Lead', {}, { eventID: lead_event_id })` fires client-side, using the **same** `lead_event_id` sent in the webhook payload — this is what lets your server-side Conversions API call deduplicate against the browser Pixel event

The chat widget follows the same pattern.

### What you (or your automation) still need to do server-side

The website only **captures and forwards** attribution data — it does not call the Meta Conversions API directly. Your GHL/Make.com automation is responsible for:

- Hashing PII (`email`, `phone`, `name`) with SHA-256 before sending to Meta
- Calling `https://graph.facebook.com/v19.0/{pixel_id}/events` with the `lead_event_id` as `event_id` for deduplication
- Firing `Schedule` and `Purchase` events later in the funnel using the same attribution data (stored against the contact record)

See `META-CAPI-WEBSITE-SOP.md` for the full setup process and webhook payload reference.

---

## Webhook Payload Structure

Every form submission (lead form or chat widget) sends this payload to `CONFIG.webhookUrl`:

```json
{
  "source":        "lead-form",
  "name":          "John Smith",
  "phone":         "5551234567",
  "email":         "john@example.com",
  "service":       "epoxy-garage-projects",
  "city":          "your-city",
  "sqft":          "600",
  "message":       "Two-car garage, 600 sqft…",
  "smsConsent":    "yes",

  "utm_source":    "facebook",
  "utm_medium":    "paid",
  "utm_campaign":  "spring-promo",
  "utm_content":   "",
  "utm_term":      "",
  "ad_id":         "120210000000000",
  "adset_id":      "",
  "campaign_id":   "",
  "fbclid":        "IwAR...",
  "fbp":           "fb.1.1234567890.987654321",
  "fbc":           "fb.1.1234567890.IwAR...",
  "source_url":    "https://abcepoxy.com/?utm_source=facebook&fbclid=IwAR...",
  "user_agent":    "Mozilla/5.0 (...)",
  "lead_event_id": "evt_1718000000000_a1b2c3d4e"
}
```

Note: `"source"` is `"lead-form"` or `"chat"`. `email` is only present on the contact page form. `city` is only present on city-page forms.

---

## Pre-Launch Checklist

- [ ] All CONFIG fields filled in (no placeholder text)
- [ ] `webhookUrl` points to live Make.com / GHL webhook
- [ ] `metaPixelId` set (or intentionally left blank)
- [ ] Real phone number and email set
- [ ] Real reviews added to `testimonials[]`
- [ ] Real `reviewCount` and `yearsExperience` updated
- [ ] Real service area cities added to `serviceAreas[]`
- [ ] `node generate-pages.js` run — all service and city pages exist
- [ ] Site deployed to Cloudflare Pages
- [ ] Custom domain connected and SSL active
- [ ] 404 page verified at `/404.html`
- [ ] Test form submission fires correctly to webhook (check attribution fields are populated)
- [ ] Test Meta Pixel `Lead` event fires in Events Manager with matching `event_id`

---

## Per-Client Files

The core scalability rule is:

> **`index.html` and the template pages are never edited between clients.**
> **`CONFIG.js` changes per client (business info, services, testimonials, colors, etc).**
> **`PROJECTS.js` changes too — but far more often, since it's just project photos.**
> It's a separate file on purpose: a syntax error introduced while
> writing project-photo data (by hand, or by the asset pipeline's
> automated publish step) can never break the rest of the site.

This means:
- Deploying a new client takes minutes, not hours
- Bug fixes and improvements to `components.js` or `styles.css` apply to all clients by updating those shared files
- The generator script is idempotent — run it any time to regenerate pages from the current CONFIG (and PROJECTS, for `our-work.html`'s og:image)

---

*Built with the Houzflow CONFIG-driven architecture.*

---

*Website Design & Marketing by [HouzFlow](https://houzflow.com)*
