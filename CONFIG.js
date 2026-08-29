const CONFIG = {
  businessName: "Elite Glass & Window",
  legalName: "Elite Glass & Windows",
  siteUrl: "https://eliteglassandwindow.com",
  phone: "(425) 890-8233",
  phoneRaw: "+14258908233",
  email: "sales@eliteglassandwindow.com",
  address: { street: "4028 148th Ave NE", city: "Redmond", state: "WA", postalCode: "98052", country: "US" },
  geo: { latitude: 47.6468, longitude: -122.1431 },
  primaryArea: "Greater Seattle",
  hours: [],
  colors: { primary: "#1957c9", dark: "#071b35", accent: "#63b8ff" },
  tracking: { metaPixelId: "", clarityProjectId: "", leadEndpoint: "" },
  brands: ["Milgard", "Ply Gem", "Marvin", "Stile", "Sierra Pacific", "Unikoo", "Macodo", "CODEL", "TEZA"],
  services: [
    {
      slug: "window-replacement",
      name: "Window Replacement & Installation",
      shortName: "Windows",
      image: "/assets/index_cp_1.jpg",
      summary: "Energy-efficient replacement and new-construction windows measured and installed for homes and businesses.",
      intro: "Elite Glass & Window supplies and installs durable window systems for full-home replacements, individual openings, remodels, new construction, and commercial spaces across Greater Seattle. We help you compare frame materials, operating styles, glass packages, finishes, and manufacturer options before precise measurement and professional installation.",
      options: [
        { name: "Single-hung windows", detail: "A fixed upper sash with a vertically operating lower sash for a familiar, cost-conscious design." },
        { name: "Double-hung windows", detail: "Two operating sashes for flexible ventilation and easier access for cleaning." },
        { name: "Casement windows", detail: "Side-hinged windows that crank outward for generous airflow and a tight weather seal." },
        { name: "Sliding windows", detail: "Horizontal operation suited to wide openings and rooms where an outward-opening sash is impractical." },
        { name: "Picture windows", detail: "Fixed glass designed for clear views, daylight, and strong thermal performance." },
        { name: "Awning windows", detail: "Top-hinged windows that can provide ventilation during light rain." },
        { name: "Custom window configurations", detail: "Matched combinations, specialty sizes, and design guidance for renovation or new construction." }
      ],
      benefits: ["Improved comfort and energy performance", "Reduced drafts and outside noise", "Updated curb appeal", "Precise on-site measurements", "Options from trusted window manufacturers"],
      faqs: [
        { q: "Which window brands do you install?", a: "Elite Glass & Window works with established manufacturers including Milgard, Ply Gem, Marvin, Stile, and Sierra Pacific. Availability depends on the opening, material, style, performance requirements, and project timeline." },
        { q: "Do I need to replace the whole window if the glass is foggy?", a: "Not always. If the frame is sound, the insulated glass unit may be replaceable on its own. The team will inspect the frame, seal failure, and glass specifications before recommending glass-only or full-window replacement." },
        { q: "How long does window installation take?", a: "Timing depends on product lead time, the number of openings, access, and any repair work discovered during installation. Your written proposal should identify the expected installation scope and schedule." }
      ]
    },
    {
      slug: "shower-doors",
      name: "Custom Shower Doors",
      shortName: "Shower Doors",
      image: "/assets/index_cp_2.jpg",
      summary: "Custom frameless, sliding, and hinged shower enclosures built for your bathroom layout.",
      intro: "Custom shower doors are measured for the exact opening so the enclosure fits the room rather than forcing the room to fit a prefabricated unit. Elite Glass & Window works with homeowners, contractors, and designers on remodels and new bathrooms, pairing tempered safety glass with hardware and finishes selected for the space.",
      options: [
        { name: "Frameless shower doors", detail: "Thick tempered glass and minimal hardware for an open, contemporary appearance." },
        { name: "Sliding shower doors", detail: "Space-efficient panels that glide along a track without requiring swing clearance." },
        { name: "Hinged shower doors", detail: "A swing-door configuration for openings with suitable clearance." },
        { name: "Clear glass", detail: "A bright, open look that showcases tile and stonework." },
        { name: "Frosted or textured glass", detail: "Additional privacy with light-transmitting decorative options." },
        { name: "Hardware finishes", detail: "Popular selections include matte black, chrome, brushed nickel, and brushed brass or gold." }
      ],
      benefits: ["Measured for a precise fit", "Tempered safety glass", "Frameless and space-saving layouts", "Coordinated hardware finishes", "Design support for remodels and new construction"],
      faqs: [
        { q: "Are custom shower doors made to the exact opening?", a: "Yes. On-site measurement is used to account for opening dimensions, walls, curb or tub conditions, and hardware placement before fabrication." },
        { q: "What shower glass options are available?", a: "Common choices include clear, frosted, patterned, and textured tempered glass. Final availability depends on thickness, enclosure design, and supplier inventory." },
        { q: "When should a shower enclosure be measured?", a: "Final measurement is normally completed after tile and other finished surfaces are installed so the fabricated glass matches the completed opening." }
      ]
    },
    {
      slug: "entry-patio-doors",
      name: "Entry, Patio & Folding Doors",
      shortName: "Doors",
      image: "/assets/index_cp_5.jpg",
      summary: "Entry, sliding patio, French, multi-panel, and folding door systems installed for security, light, and indoor-outdoor living.",
      intro: "A new exterior door can improve security, weather performance, natural light, and curb appeal. Elite Glass & Window installs entry and patio systems throughout the Seattle area and helps clients evaluate fiberglass, steel, aluminum, glass, sliding, French, and large-opening configurations. Product partners include CODEL and TEZA.",
      options: [
        { name: "Front entry doors", detail: "Fiberglass, steel, contemporary, traditional panel, and decorative-glass options." },
        { name: "Sliding patio doors", detail: "Smooth, space-efficient access with broad outdoor views." },
        { name: "French patio doors", detail: "A hinged, paired-door configuration with a classic architectural character." },
        { name: "Multi-panel doors", detail: "Wide glazed systems for larger openings and more daylight." },
        { name: "Bi-fold and folding doors", detail: "Architectural systems that open a wall to connect indoor and outdoor living areas." }
      ],
      benefits: ["Improved security and weather sealing", "More natural light", "Modern and traditional design options", "Energy-efficient glass packages", "Professional removal and installation"],
      faqs: [
        { q: "What kinds of exterior doors do you install?", a: "The available catalog includes fiberglass and steel entry doors, decorative-glass doors, sliding and French patio doors, multi-panel systems, and contemporary aluminum folding doors." },
        { q: "Can you replace a patio door with a larger opening?", a: "Potentially. Enlarging an opening can involve structural design, permitting, and coordination with other trades. An on-site consultation is needed before defining that scope." },
        { q: "Do you install interior doors?", a: "The primary focus is exterior entry, patio, and architectural glass door systems. Contact the showroom with the exact interior-door scope to confirm availability." }
      ]
    },
    {
      slug: "glass-railings",
      name: "Glass Railings",
      shortName: "Railings",
      image: "/assets/index_cp_3.jpg",
      summary: "Tempered-glass railing systems for decks, balconies, staircases, and interior spaces.",
      intro: "Glass railings preserve sightlines and daylight while providing a clean architectural edge. Elite Glass & Window designs and installs interior and exterior railing systems for homes, multi-unit properties, and commercial projects using tempered safety glass and durable mounting hardware selected for the application.",
      options: [
        { name: "Deck railings", detail: "Outdoor guard systems designed to maintain views from decks and patios." },
        { name: "Balcony railings", detail: "Open sightlines with safety glass and application-appropriate hardware." },
        { name: "Stair railings", detail: "Contemporary glass guards for interior staircases and landings." },
        { name: "Clear, tinted, or frosted glass", detail: "Visibility and privacy choices tailored to the location." },
        { name: "Post, standoff, or base-shoe systems", detail: "Hardware approaches selected according to design and structural requirements." }
      ],
      benefits: ["Unobstructed views", "Tempered safety glass", "Indoor and outdoor applications", "Custom hardware finishes", "A low-visual-weight architectural design"],
      faqs: [
        { q: "Is glass railing safe?", a: "Glass railing systems use safety glass and mounting hardware engineered for guard applications. The final design must be matched to site conditions and applicable building requirements." },
        { q: "Can glass railings be used outside?", a: "Yes. Deck and balcony systems are available, with glass, fasteners, and hardware selected for exterior exposure and the project conditions." },
        { q: "Can the railing glass be frosted or tinted?", a: "Clear, tinted, and privacy-oriented glass may be available. The team can confirm choices during design and specification." }
      ]
    },
    {
      slug: "custom-mirrors",
      name: "Custom Mirrors",
      shortName: "Mirrors",
      image: "/assets/index_cp_4.jpg",
      summary: "Made-to-measure mirrors for vanities, walls, gyms, studios, living spaces, and commercial interiors.",
      intro: "Custom mirrors can increase reflected light, create visual depth, and finish a room without relying on stock sizes. Elite Glass & Window measures, fabricates, and installs mirrors for bathrooms, home gyms, studios, entryways, living areas, and commercial interiors throughout Greater Seattle.",
      options: [
        { name: "Bathroom and vanity mirrors", detail: "Sized for single vanities, double vanities, niches, and full walls." },
        { name: "Wall mirrors", detail: "Large panels for entryways, hallways, living rooms, and feature walls." },
        { name: "Gym and studio mirrors", detail: "Panel layouts for home gyms, fitness studios, dance rooms, and yoga spaces." },
        { name: "Decorative mirrors", detail: "Custom shapes and finishing choices for interior focal points." },
        { name: "Edge and mounting options", detail: "Polished or beveled edges and mounting approaches selected for the wall and design." }
      ],
      benefits: ["Made to the required dimensions", "Clear, high-quality mirror glass", "Professional handling and mounting", "Polished and beveled edge options", "Residential and commercial applications"],
      faqs: [
        { q: "Can you install a full-wall gym mirror?", a: "Yes. Large mirror panels can be planned for home gyms and commercial studios, including seams, outlet or fixture conditions, and safe mounting." },
        { q: "Do custom mirrors have to be rectangular?", a: "No. Shape, size, edge finish, and mounting options can be discussed during the estimate, subject to fabrication limits and safe installation." },
        { q: "Can a mirror be installed over an existing vanity?", a: "Usually. The wall condition, backsplash, fixtures, outlets, and clearances are checked during measurement." }
      ]
    },
    {
      slug: "glass-replacement",
      name: "Glass Replacement & Foggy Window Repair",
      shortName: "Glass Replacement",
      image: "/assets/glass-replace-bg.jpg",
      summary: "Broken, cracked, foggy, and failed glass replaced in existing residential and commercial frames whenever practical.",
      intro: "When a frame remains serviceable, replacing only the damaged or failed glass can restore clarity, safety, and insulation without the cost and waste of replacing the entire window. Elite Glass & Window replaces single-pane glass, insulated glass units, tempered glass, safety glass, Low-E glass, and custom sizes across Greater Seattle.",
      options: [
        { name: "Residential glass replacement", detail: "Broken, cracked, scratched, or foggy glass in windows and doors." },
        { name: "Commercial glass replacement", detail: "Replacement for offices, restaurants, retail locations, and managed properties." },
        { name: "Foggy insulated glass units", detail: "Failed double-pane units replaced while retaining a suitable existing frame." },
        { name: "Safety and specialty glass", detail: "Tempered, laminated, Low-E, and custom glass specified for the application." },
        { name: "Urgent damage assessment", detail: "Call to discuss broken glass and the safest next step; response timing depends on location, glass type, and availability." }
      ],
      benefits: ["Keep a serviceable existing frame", "Restore clarity and insulation", "Lower material waste than full replacement", "Custom glass matching", "Residential, commercial, and property-management support"],
      faqs: [
        { q: "Can you replace just the glass without replacing the window?", a: "Often, yes. If the sash and frame are in usable condition, the glass or insulated glass unit can frequently be replaced by itself." },
        { q: "Can a foggy double-pane window be repaired?", a: "Fog between panes usually indicates a failed insulated-glass seal. Replacing the sealed glass unit restores clarity and insulation while retaining a suitable frame." },
        { q: "Do you replace tempered and safety glass?", a: "Yes. Tempered, laminated, Low-E, and other specialty glass can be ordered to match the required dimensions and application." }
      ]
    },
    {
      slug: "storefront-glass",
      name: "Storefront & Commercial Glass",
      shortName: "Storefront Glass",
      image: "/assets/index_cp_6.jpg",
      summary: "Storefront, office, restaurant, and commercial glass installation and replacement with minimal disruption.",
      intro: "Elite Glass & Window supports retail, office, restaurant, multi-unit, and managed commercial properties with storefront glass, entry systems, interior glass, replacement glazing, and custom commercial solutions. The team coordinates measurements, specifications, fabrication, and installation around site access and business needs.",
      options: [
        { name: "Storefront glass replacement", detail: "Damaged or failed storefront panes measured and replaced to suit the existing system." },
        { name: "New storefront systems", detail: "Glazed entrances and display fronts for retail, office, and hospitality spaces." },
        { name: "Commercial doors and entrances", detail: "Glass and aluminum entrance solutions matched to the project." },
        { name: "Interior commercial glass", detail: "Glass partitions, mirrors, shelves, and display applications." },
        { name: "Property-manager support", detail: "Clear documentation and scheduling for occupied or managed sites." }
      ],
      benefits: ["Residential and commercial capability", "Custom measurement and fabrication", "Planning around business access", "Safety and performance glass options", "One team from quote through installation"],
      faqs: [
        { q: "Do you replace broken storefront glass?", a: "Yes. Call with the location, approximate dimensions, photos if available, and whether the opening is secure. Glass type and fabrication needs determine timing." },
        { q: "Do you work with property managers and contractors?", a: "Yes. Elite Glass & Window works with owners, property managers, contractors, builders, architects, and designers on residential and commercial scopes." },
        { q: "Can you match an existing storefront system?", a: "The team can inspect the existing framing, glass thickness, tint, safety requirements, and hardware to determine the closest appropriate replacement." }
      ]
    },
    {
      slug: "custom-glass-products",
      name: "Custom Glass Products",
      shortName: "Custom Glass",
      image: "/assets/index_cp_6.jpg",
      summary: "Skylights, cabinet glass, tabletops, shelving, and made-to-measure glass for residential and commercial spaces.",
      intro: "Beyond windows and shower enclosures, Elite Glass & Window fabricates and installs custom glass for functional and decorative applications. Bring measurements, photos, or drawings to the Redmond showroom, or schedule an on-site consultation for projects that require field measurement.",
      options: [
        { name: "Skylight glass", detail: "Replacement and project-specific glazing for skylight openings, including assessment of glass and surrounding conditions." },
        { name: "Cabinet glass", detail: "Clear, frosted, textured, and decorative inserts for kitchens, built-ins, and displays." },
        { name: "Glass tabletops", detail: "Custom protective or standalone tops with dimensions and edgework selected for the furniture." },
        { name: "Glass shelving", detail: "Made-to-measure shelves for kitchens, bathrooms, displays, offices, and retail interiors." },
        { name: "Specialty fabricated glass", detail: "Custom sizes, safety glass, Low-E glass, and other project-specific solutions." }
      ],
      benefits: ["Custom sizes and edgework", "Residential and commercial uses", "Clear, tinted, frosted, and textured choices", "Tempered and safety-glass options", "Professional measurement and installation"],
      faqs: [
        { q: "Can you make a glass tabletop to a template?", a: "Yes. Depending on the shape, the team can work from verified dimensions or a physical template and advise on thickness, edgework, corners, and safety glass." },
        { q: "What glass is available for cabinets?", a: "Common choices include clear, frosted, textured, patterned, and specialty glass. Bring a door or accurate opening details to discuss fit and availability." },
        { q: "Do you install glass shelves?", a: "Yes. Shelf dimensions, thickness, supports, loads, and wall conditions are considered before fabrication and installation." }
      ]
    }
  ],
  serviceRegions: [
    { name: "Eastside", cities: ["Redmond", "Bellevue", "Kirkland", "Sammamish", "Issaquah", "Mercer Island", "Newcastle", "Woodinville", "Bothell", "Kenmore", "Duvall", "Snoqualmie", "North Bend"] },
    { name: "North Seattle & Snohomish County", cities: ["Shoreline", "Edmonds", "Lynnwood", "Mountlake Terrace", "Mill Creek", "Everett", "Mukilteo"] },
    { name: "South Seattle & South King County", cities: ["Renton", "Kent", "Auburn", "Tukwila", "Federal Way", "Burien", "SeaTac", "Des Moines"] },
    { name: "Seattle & Surrounding Areas", cities: ["Seattle", "West Seattle", "Ballard", "Queen Anne", "Capitol Hill", "Magnolia", "Green Lake", "University District", "Mercer Island", "Bainbridge Island"] }
  ],
  process: [
    { name: "Initial consultation", detail: "Tell us what you want to replace, install, or design. Photos and rough measurements can help start the conversation." },
    { name: "On-site measurement", detail: "A technician verifies openings, surfaces, access, and the conditions that affect fit and installation." },
    { name: "Design and specification", detail: "We confirm glass, product, configuration, finish, performance options, and installation scope." },
    { name: "Professional fabrication", detail: "Approved custom products are ordered or fabricated to the final specifications." },
    { name: "Expert installation", detail: "The team protects the work area, removes applicable existing materials, and installs the new product." },
    { name: "Final inspection and support", detail: "We review operation, appearance, care guidance, and any product-specific warranty information with you." }
  ],
  generalFaqs: [
    { q: "Do you provide free estimates?", a: "Yes. Contact Elite Glass & Window to discuss the project and schedule a no-obligation consultation or measurement when needed." },
    { q: "Where is your showroom?", a: "The showroom is at 4028 148th Ave NE, Redmond, WA 98052. Contact the team before visiting to confirm current showroom hours." },
    { q: "What areas do you serve?", a: "The team serves Redmond, the Eastside, Seattle, North Seattle and Snohomish County, South King County, and nearby Greater Seattle communities." },
    { q: "Do you handle residential and commercial glass?", a: "Yes. Services include residential windows, doors, showers, mirrors, and railings as well as storefronts, commercial replacement glass, and custom interior glass." },
    { q: "Can you replace only the glass in a window?", a: "Often, yes. If the existing frame is serviceable, replacing a failed insulated glass unit or broken pane can be more efficient than replacing the whole window." },
    { q: "Do you work with contractors and designers?", a: "Yes. Elite Glass & Window works directly with homeowners and also coordinates with contractors, builders, architects, designers, and property managers." },
    { q: "How do I prepare for an estimate?", a: "Share the project address, product or glass type, approximate dimensions, photos, and any timeline constraints. Final custom fabrication still requires verified measurements." }
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = CONFIG;
