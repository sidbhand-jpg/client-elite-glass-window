# Elite Glass & Windows — Houzflow Website

This project keeps the original Houzflow config-driven HTML/CSS/JavaScript website structure. Verified client information has been adapted into the Elite Glass & Windows site without copying the previous site’s design.

## Generate the site

```powershell
npm ci
npm run assets
npm run build
npm run check
```

The generator creates:

- one page per product/service in `services/`;
- one page per local service area in `cities/`;
- canonical top-level pages from `pages/`;
- `sitemap.xml` and `robots.txt`;
- canonical tags and LocalBusiness, Service, and FAQ structured data.

`CONFIG.js` is the source of truth for business details, products, service areas, FAQs, and tracking configuration.

## Lead capture and tracking

`CONFIG.js` controls the A2P staging switch:

```js
leadCaptureMode: "chat_only", // change to "all_forms" after A2P approval
leadCapture: { endpoint: "/api/chat-lead", turnstileSiteKey: "PUBLIC_SITE_KEY" },
```

In `chat_only`, each inline page form is replaced with a single **Get Free Estimate** button that opens the accessible project chat; the form markup is never inserted or initialized. In `all_forms`, the preserved forms and their original CTA destinations return while the chat stays available. The homepage hero always uses exactly two actions: **Get Free Estimate** (chat) and the phone number (direct call).

The browser posts only to the same-origin Pages Function at `/api/chat-lead`. Configure `TURNSTILE_SECRET_KEY` and `MAKE_WEBSITE_CHAT_WEBHOOK_URL` as Cloudflare Pages environment secrets. Never place Make, Supabase, Worker, Retell, or Meta CAPI credentials in `CONFIG.js`, HTML, client-side JavaScript, logs, or analytics.

The site captures page/referrer, UTMs, campaign identifiers, `_fbp`, `_fbc`, and a stable submission UUID. The Function validates and sanitizes the request, verifies Turnstile, and sends a flat payload to the private Make webhook. It fails closed when required server configuration is absent.

The widget uses a single screen with Name, optional Email, Phone, and Project Details. Clicking Submit records `contact_consent: true` under the displayed project-contact notice. The widget has no SMS checkbox and sends `sms_consent: false`; the separate optional SMS consent in the preserved full forms is unchanged. ZIP, project type, property type, and timeline are optional for widget requests and remain blank when not supplied.

Clarity receives `egw_widget_open` when the widget changes from closed to open, including opens from the floating button and estimate CTAs. It contains no form values. The website funnel can use Website visit → `egw_widget_open` → Submit form to show sessions that opened the widget and did not reach Clarity's submit event. The open event starts collecting after deployment and does not backfill earlier sessions.

## Content rules

- Keep the Houzflow template components and layouts as the visual system.
- Use the client’s previous website only as a source for verified business facts, services, products, and service areas.
- Do not invent reviews, project counts, years in business, response guarantees, warranties, licensing details, or project photography.
- Add verified project images to `PROJECTS.js` when the client supplies them.
