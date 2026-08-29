# Elite Glass & Window — Houzflow Website Template

This project keeps the original Houzflow config-driven HTML/CSS/JavaScript website structure. Client information from the previous Elite Glass & Window website has been adapted into the template rather than copying the previous site’s design.

## Generate the site

```powershell
node generate-pages.js
```

The generator creates:

- one page per product/service in `services/`;
- one page per local service area in `cities/`;
- canonical top-level pages from `pages/`;
- `sitemap.xml` and `robots.txt`;
- canonical tags and LocalBusiness, Service, and FAQ structured data.

`CONFIG.js` is the source of truth for business details, products, service areas, FAQs, and tracking configuration.

## Tracking activation

Meta Pixel/CAPI attribution and Microsoft Clarity are wired but disabled until real production values are added:

```js
webhookUrl: "HTTPS_SERVER_SIDE_LEAD_ENDPOINT",
metaPixelId: "ACTUAL_META_PIXEL_ID",
clarityProjectId: "ACTUAL_CLARITY_PROJECT_ID",
```

The website captures UTMs, Meta click identifiers, `_fbp`, `_fbc`, and a shared `lead_event_id`. The server-side endpoint must validate the request, send it to the CRM, hash customer information, and forward the corresponding Conversions API event to Meta. Never place a Meta CAPI access token in browser code.

When no webhook is configured, the existing forms retain the template’s honest call/email fallback rather than reporting a false successful submission.

## Content rules

- Keep the Houzflow template components and layouts as the visual system.
- Use the client’s previous website only as a source for verified business facts, services, products, and service areas.
- Do not invent reviews, project counts, years in business, response guarantees, warranties, licensing details, or project photography.
- Add verified project images to `PROJECTS.js` when the client supplies them.
