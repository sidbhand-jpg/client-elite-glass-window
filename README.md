# Elite Glass & Window website

Static, generated website for `eliteglassandwindow.com`. The source of truth is `CONFIG.js`; `generate-pages.js` produces the homepage, service pages, location pages, legal pages, redirects, `robots.txt`, and `sitemap.xml`.

## Generate

```powershell
node generate-pages.js
```

No package installation is required.

## Tracking activation

Tracking is intentionally disabled until production credentials and endpoints are supplied. Set these values in `CONFIG.js`:

```js
tracking: {
  metaPixelId: "ACTUAL_PIXEL_ID",
  clarityProjectId: "ACTUAL_CLARITY_PROJECT_ID",
  leadEndpoint: "HTTPS_SERVER_SIDE_LEAD_ENDPOINT"
}
```

`site.js` then:

- loads Microsoft Clarity when `clarityProjectId` is present;
- loads Meta Pixel and records `PageView` when `metaPixelId` is present;
- captures UTM and Meta click attribution;
- sends lead data to the server-side endpoint;
- uses the same `event_id` for browser `Lead` and server-side CAPI deduplication.

The server-side endpoint is responsible for validation, spam controls, CRM delivery, hashing customer information, and sending the Conversions API event to Meta. Never put a Meta CAPI access token in client-side code.

When `leadEndpoint` is empty, forms give an honest call/email fallback and do not pretend the request was submitted.

## SEO/AEO structure

- unique titles, descriptions, canonical URLs, Open Graph metadata;
- visible FAQ content plus `FAQPage` structured data;
- `LocalBusiness`, `Service`, `OfferCatalog`, and breadcrumb structured data;
- product/service pages under `/services/`;
- location pages under `/locations/`;
- legacy URL redirects in `_redirects`;
- generated `sitemap.xml` and `robots.txt`.

After deployment, submit `https://eliteglassandwindow.com/sitemap.xml` in Google Search Console and Bing Webmaster Tools. Update the hard-coded sitemap `lastmod` date in `generate-pages.js` when making substantive content changes.
