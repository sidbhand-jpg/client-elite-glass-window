// ============================================================
// PROJECTS.js — Project photo gallery data
// ============================================================
// Separate from CONFIG.js on purpose: this file updates far more
// often (new completed jobs) than the rest of the site config, and
// is written automatically by the Houzflow asset pipeline's publish
// step once that's live. Keeping it isolated means a malformed write
// here can never break the rest of the site (header, services, etc).
//
// Format is a plain global array — intentionally NOT nested in an
// object — so the publish step can write this whole file with simple
// string templating (assign the JSON-stringified array to a single
// top-level array variable). No AST-aware JS writer or bundler
// required on the Worker side.
//
// Field notes:
//   alt          — descriptive alt text (from the pipeline's alt_text
//                  field). Never reuse `title` here — title is a project
//                  label, alt should describe what's actually in the photo.
//   width/height — explicit intrinsic dimensions (post-Photon-resize),
//                  prevents layout shift (CLS) while the image loads.
//   featured     — true = eligible to show in the home page "Recent Work"
//                  section (capped at 8–9 there). Lets curation/approval
//                  decide what's a homepage-worthy shot vs. just-the-gallery.
//   publishedAt  — optional, supports freshness sorting later.
// ============================================================

const PROJECTS = [
  {
    title: "3-Car Garage — Full Broadcast System",
    category: "Garage Project",
    img: "https://images.unsplash.com/photo-1558618047-f4e60cef8b3e?w=800&q=80",
    alt: "Three-car garage project finished with a full epoxy broadcast flake system",
    width: 800,
    height: 800,
    featured: true,
    publishedAt: "2026-06-08",
  },
  {
    title: "Restaurant — Metallic Epoxy Feature Project",
    category: "Metallic Epoxy",
    img: "https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=800&q=80",
    alt: "Restaurant project finished with a swirled metallic epoxy feature coating",
    width: 800,
    height: 800,
    featured: true,
    publishedAt: "2026-05-30",
  },
  {
    title: "40,000 sqft Warehouse — Industrial Polyurea",
    category: "Commercial",
    img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    alt: "Large industrial warehouse project coated with a durable polyurea system",
    width: 800,
    height: 800,
    featured: true,
    publishedAt: "2026-05-20",
  },
  {
    title: "Pool Deck — Cool-Deck Professional",
    category: "Pool Deck",
    img: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=800&q=80",
    alt: "Outdoor pool deck resurfaced with a cool-touch professional coating",
    width: 800,
    height: 800,
    featured: true,
    publishedAt: "2026-05-11",
  },
  {
    title: "Basement — Moisture-Mitigating System",
    category: "Basement",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    alt: "Basement concrete project finished with a moisture-mitigating service standard",
    width: 800,
    height: 800,
    featured: true,
    publishedAt: "2026-05-02",
  },
  {
    title: "Auto Dealership — Showroom Professional",
    category: "Commercial",
    img: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80",
    alt: "Auto dealership showroom project finished with a glossy professional coating",
    width: 800,
    height: 800,
    featured: true,
    publishedAt: "2026-04-24",
  },
  {
    title: "Home Gym — Anti-Slip Epoxy",
    category: "Garage Project",
    img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
    alt: "Home gym project finished with an anti-slip textured epoxy coating",
    width: 800,
    height: 800,
    featured: true,
    publishedAt: "2026-04-15",
  },
  {
    title: "Food Processing Facility — Coved Base System",
    category: "Commercial",
    img: "https://images.unsplash.com/photo-1565793979666-63b15ea9aaca?w=800&q=80",
    alt: "Food processing facility project finished with a coved base service standard for sanitation compliance",
    width: 800,
    height: 800,
    featured: true,
    publishedAt: "2026-04-06",
  },
];
