const CONFIG = {
  businessName: "Elite Glass & Windows",
  legalBusinessName: "Five Star Glass Solutions LLC",
  siteUrl: "https://eliteglassandwindow.com",
  niche: "Glass & Window",
  tagline: "Custom Glass, Windows & Doors for Greater Seattle",
  phone: "(425) 890-8233",
  phoneRaw: "+14258908233",
  email: "sales@eliteglassandwindow.com",
  city: "Redmond",
  state: "Washington",
  stateShort: "WA",
  address: "4028 148th Ave NE, Redmond, WA 98052",
  licenseNumber: "",
  colors: { primary: "#004080", secondary: "#1C2333" },
  social: {
    facebook: "https://www.facebook.com/UnikooShowerDoor",
    instagram: "https://www.instagram.com/eliteglass_and_windows/",
    googleBusiness: "https://share.google/CXdZnPYmdI78YSttm",
    youtube: "",
    yelp: "",
    nextdoor: "",
  },
  googleReviewsUrl: "https://search.google.com/local/writereview?placeid=ChIJg31wD_9tkFQRp-As1RijQDA",
  googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Elite+Glass+%26+Windows&query_place_id=ChIJg31wD_9tkFQRp-As1RijQDA",
  rating: "4.8",
  reviewCount: 42,
  yearsExperience: "",
  projectsCompleted: "",
  satisfactionRate: "",
  // A2P staging switch. Keep chat_only until carrier approval, then change
  // only this value to all_forms to restore the preserved page forms.
  leadCaptureMode: "chat_only",
  leadCapture: {
    endpoint: "/api/chat-lead",
    turnstileSiteKey: "0x4AAAAAAE7E54DBfycoeKkF",
  },
  metaPixelId: "",
  clarityProjectId: "yae0ijptel",
  maps: {
    mapEmbedUrl: "https://www.google.com/maps?q=4028%20148th%20Ave%20NE%2C%20Redmond%2C%20WA%2098052&output=embed",
    mapSearchQuery: "Elite Glass & Windows, 4028 148th Ave NE, Redmond, WA 98052",
    mapHeight: 420,
  },
  hero: {
    eyebrow: "Redmond Glass & Window Specialists",
    headline: "A Redmond Glass Company for Windows, Doors & Custom Glass",
    subheadline: "Tell us what is broken, foggy, hard to operate, or ready to change. Our in-house team helps narrow the options before final measurement and installation.",
    ctaPrimary: "Get Free Estimate",
    heroImage: "/public/optimized/window-redmond-1440.webp",
  },
  services: [
    {
      slug: "window-replacement",
      name: "Window Replacement & Installation",
      desc: "Upgrade your home with energy-efficient window replacement and new window installations.",
      longDesc: "Whether you're looking to replace old, inefficient windows or install new ones in a construction project, we offer a comprehensive selection of high-quality windows designed for durability, energy efficiency, and aesthetic appeal. Choose from various styles, including vinyl, wood, and aluminum.",
      products: ["Single-hung windows", "Double-hung windows", "Casement windows", "Sliding windows", "Picture windows", "Awning windows", "Custom window configurations"],
      benefits: ["Increased energy efficiency", "Reduced noise pollution", "Improved home comfort", "Modernized appearance", "Custom fit and finish"],
      faqs: [
        { q: "Should I replace the glass or the entire window?", a: "If the frame, sash, and hardware are sound, replacing a failed insulated glass unit may be enough. Full-window replacement is usually considered when frames are damaged, operation is poor, water is entering around the assembly, or a different style or performance level is needed." },
        { q: "Why is there fog between the panes?", a: "Fog or moisture between panes usually indicates that the insulated glass seal has failed. The opening and frame condition should be inspected before deciding between a replacement glass unit and a complete window." },
        { q: "Which performance details should I compare?", a: "Compare frame material, operating style, glass package, U-factor, solar heat-gain coefficient, air leakage, installation method, and the written manufacturer warranty for the exact product quoted." },
        { q: "How long does window replacement take?", a: "Timing depends on product availability, verified measurements, access, opening condition, permit requirements, and the number of windows. The written proposal should state the expected ordering and installation sequence." }
      ],
      image: "/public/service-luxury/window-replacement-960.webp",
    },
    {
      slug: "shower-doors",
      name: "Shower Doors",
      desc: "Custom frameless and sliding shower doors for a modern bathroom.",
      longDesc: "Choose frameless, semi-frameless, hinged, or sliding shower glass based on the finished opening, hardware clearances, door swing, and water-control details.",
      products: ["Frameless shower doors", "Sliding shower doors", "Hinged shower doors", "Clear tempered glass", "Frosted or textured glass", "Matte black, chrome, nickel, and brass hardware"],
      benefits: ["Modern aesthetic", "Custom design options", "Enhanced bathroom functionality", "Durable, high-quality glass", "Easy to clean"],
      faqs: [
        { q: "What types of shower doors do you offer?", a: "We specialize in frameless, semi-frameless, and sliding shower doors, available in various glass thicknesses and finishes." },
        { q: "Can you install a custom-sized shower door?", a: "Yes. The opening is measured after the surrounding surfaces are ready so the glass, hinges, panels, and clearances can be specified for the actual space." },
        { q: "What should be ready before measurement?", a: "Tile, curbs, walls, and other finished surfaces should normally be complete and stable before final measurement. The team can confirm project-specific readiness before visiting." },
        { q: "How do I reduce water escaping from a frameless enclosure?", a: "Door swing, curb slope, shower-head position, panel layout, gaps, seals, and sweeps all affect water control. Frameless systems are not aquariums, so layout decisions matter." }
      ],
      image: "/public/service-luxury/shower-doors-960.webp",
    },
    {
      slug: "entry-patio-doors",
      name: "Entry & Patio Doors",
      desc: "Replace an entry or patio door based on the opening, operation, glass, threshold, drainage, and hardware you need.",
      longDesc: "From elegant entry doors that make a statement to functional and beautiful patio doors that connect your indoor and outdoor spaces, we provide expert installation of a wide range of door styles and materials, including wood, fiberglass, and steel.",
      products: ["Fiberglass entry doors", "Steel entry doors", "Decorative-glass doors", "Sliding patio doors", "French patio doors", "Multi-panel and folding doors"],
      benefits: ["Entry, sliding, French, and multi-panel choices", "Glass and frame performance documented in writing", "Threshold, drainage, and lock details reviewed", "Frame condition assessed before ordering", "Measured installation scope"],
      faqs: [
        { q: "Can you help me choose the right entry or patio door?", a: "Yes. Selection should account for opening size, exposure, security, glass, operation, threshold, frame condition, exterior finish, and the written product specifications." },
        { q: "When is a full frame replacement appropriate?", a: "A full-frame approach may be appropriate when the frame is damaged, the opening needs correction, water intrusion is present, or the new system requires a different configuration. The existing opening must be assessed first." },
        { q: "What should I compare in patio doors?", a: "Compare operating style, frame material, glass package, sill and drainage details, locking hardware, screen options, accessibility needs, and manufacturer documentation." },
        { q: "Do door projects ever require permits?", a: "Requirements vary by jurisdiction and scope. Changes to structural openings, egress, or exterior-envelope details may require review, so confirm with the local permitting authority." }
      ],
      image: "/public/service-luxury/entry-patio-doors-960.webp",
    },
    {
      slug: "glass-railings",
      name: "Glass Railings",
      desc: "Modern and elegant glass railings for decks, balconies, and staircases.",
      longDesc: "Our glass railing systems provide a contemporary and unobstructed view for your deck, balcony, or interior stairs. Engineered for safety and durability, these railings add a touch of sophistication while maximizing natural light and openness.",
      products: ["Deck glass railings", "Balcony glass railings", "Interior stair railings", "Clear, tinted, or frosted glass", "Post, standoff, and base-shoe systems"],
      benefits: ["Clear sightlines", "Interior and exterior system choices", "Glass and mounting selected for the application", "Supporting conditions reviewed", "Care instructions for installed glass and hardware"],
      faqs: [
        { q: "What glass is used for railings?", a: "The glass type and makeup depend on the location, mounting system, guard design, and applicable code. Tempered or laminated safety-glass configurations may be specified by the project documents or design professional." },
        { q: "Does a glass railing need engineering or permits?", a: "It may. Guard height, loads, anchorage, edge conditions, and supporting structure can require permit or engineering review. Confirm the requirements for the property and scope before fabrication." },
        { q: "Which mounting systems are available?", a: "Common approaches include posts, standoffs, and base-shoe systems. The right option depends on the structure, waterproofing, desired sightlines, glass specification, and access." },
        { q: "How are glass railings maintained?", a: "Use a non-abrasive glass cleaner and inspect exposed hardware and seals periodically. Follow the hardware and glass-care instructions supplied for the installed system." }
      ],
      image: "/public/service-luxury/glass-railings-960.webp",
    },
    {
      slug: "custom-mirrors",
      name: "Custom Mirrors",
      desc: "Beautiful custom-cut mirrors for vanities, walls, gyms, and more.",
      longDesc: "Add light, space, and style to any room with our custom mirror services. We design, cut, and install mirrors for bathrooms, gyms, living areas, and commercial spaces, offering various edges, tints, and sizes to perfectly fit your vision.",
      products: ["Bathroom and vanity mirrors", "Full-wall mirrors", "Gym and studio mirrors", "Decorative mirrors", "Polished and beveled edge options"],
      benefits: ["Custom-fit to any space", "Enhances room brightness", "Creates illusion of space", "Variety of edge finishes", "Professional installation"],
      faqs: [
        { q: "Can you install a large mirror?", a: "Yes, we specialize in installing large wall mirrors for homes, gyms, and commercial applications, ensuring secure and precise placement." },
        { q: "What mirror edges are available?", a: "Common options include polished, beveled, and seamed edges. The exposed-edge condition, design, and handling requirements determine which finish is appropriate." },
        { q: "What details are needed for a custom mirror?", a: "Provide wall dimensions, intended location, edge preference, outlet or fixture cutouts, mounting expectations, and photos. Final fabrication follows verified measurements." },
        { q: "Can mirrors be installed on every wall?", a: "The wall condition, flatness, substrate, trim, outlets, access, and mirror size all affect the mounting plan. The installation surface should be reviewed before fabrication." }
      ],
      image: "/public/service-luxury/custom-mirrors-960.webp",
    },
    {
      slug: "storefront-glass",
      name: "Storefront Glass",
      desc: "Professional storefront glass installation and repair for businesses.",
      longDesc: "Storefront glass replacement and installation starts with the frame system, safety specification, opening condition, access, and business coordination needs.",
      products: ["Storefront glass replacement", "New storefront systems", "Commercial glass entrances", "Interior commercial glass", "Property-manager glass service"],
      benefits: ["Replacement panels and new storefront systems", "Commercial entrances and interior glass", "Safety markings and frame details reviewed", "Access and building coordination included in scope", "Clear written glass specification"],
      faqs: [
        { q: "Do you replace broken storefront glass?", a: "Yes. Contact the team with the address, approximate dimensions, photos if available, and whether the opening is secure. Timing depends on the glass specification and availability." },
        { q: "What information helps with a storefront request?", a: "Share the address, photos, approximate opening dimensions, frame condition, glass markings if visible, access limitations, and whether the opening is currently secure." },
        { q: "Which safety glass might be required?", a: "Tempered or laminated glass may be required depending on the door, opening, location, and applicable code. The replacement should match the documented safety and performance requirements." },
        { q: "Can you coordinate custom graphics or branding?", a: "The team can discuss glass and opening requirements alongside a separate graphics or signage plan. Final compatibility depends on the selected materials and installer specifications." }
      ],
      image: "/public/service-luxury/storefront-glass-960.webp",
    },
    {
      slug: "glass-replacement",
      name: "Glass Replacement",
      desc: "Expert glass replacement services for windows, doors, and more.",
      longDesc: "Whether it's a cracked window, a foggy insulated glass unit, or a broken door panel, our skilled technicians provide prompt and reliable glass replacement services. We match existing glass types and ensure a seamless, high-quality repair.",
      products: ["Single-pane replacement glass", "Insulated glass units (IGUs)", "Foggy double-pane replacement", "Tempered and laminated safety glass", "Low-E and specialty glass"],
      benefits: ["Restores clarity and integrity", "Prevents further damage", "Energy efficiency improvement", "Professional, timely service", "Cost-effective solution"],
      faqs: [
        { q: "Can you replace just one pane of glass in a double-pane window?", a: "Yes, in most cases, we can replace just the insulated glass unit (IGU) without needing to replace the entire window frame." },
        { q: "What types of glass can you replace?", a: "Options can include single-pane glass, insulated glass units, tempered glass, laminated glass, Low-E glass, and specialty products, subject to the opening and safety requirements." },
        { q: "Can replacement glass match the existing appearance?", a: "The team will review thickness, tint, coating, pattern, spacer, safety markings, and surrounding units. An exact visual match is not always possible when existing glass has aged or a product has changed." },
        { q: "What should I send with a glass-replacement request?", a: "Photos of the full opening and damage, approximate dimensions, address, glass markings, frame material, and access information help determine the next measurement step." }
      ],
      image: "/public/service-luxury/glass-replacement-960.webp",
    },
    {
      slug: "custom-glass-products",
      name: "Custom Glass Products",
      desc: "Custom skylight glass, cabinet inserts, tabletops, shelves, and specialty fabricated glass.",
      longDesc: "Beyond windows and shower enclosures, we provide custom glass for residential and commercial applications throughout Greater Seattle. Options include skylight glass, cabinet inserts, protective and standalone glass tabletops, custom shelving, safety glass, Low-E glass, and specialty sizes measured for the project.",
      products: ["Skylight glass", "Cabinet glass inserts", "Glass tabletops", "Custom glass shelving", "Tempered, Low-E, and specialty fabricated glass"],
      benefits: ["Custom sizes and edgework", "Cabinet and display glass", "Glass tabletops and shelving", "Tempered and specialty glass options", "Professional measurement and installation"],
      faqs: [
        { q: "Can you make a custom glass tabletop?", a: "Yes. We can help specify dimensions, thickness, edgework, corners, and safety-glass options for the furniture and intended use." },
        { q: "What glass is available for cabinets and shelves?", a: "Common choices include clear, frosted, textured, patterned, tempered, and specialty glass. Availability depends on size and application." },
        { q: "How is tabletop thickness selected?", a: "Thickness depends on whether the glass protects a supported surface or spans between supports, plus overall size, edge treatment, loading, and safety considerations." },
        { q: "What measurements are needed for shelves?", a: "Provide clear opening dimensions, desired depth, support locations, intended load, exposed edges, and any notches or cutouts. Final fabrication follows verified measurements." }
      ],
      image: "/public/service-luxury/custom-glass-products-960.webp",
    },
  ],
  serviceAreas: [
    { slug: "redmond", name: "Redmond", county: "" },
    { slug: "bellevue", name: "Bellevue", county: "" },
    { slug: "kirkland", name: "Kirkland", county: "" },
    { slug: "sammamish", name: "Sammamish", county: "" },
    { slug: "issaquah", name: "Issaquah", county: "" },
    { slug: "mercer-island", name: "Mercer Island", county: "" },
    { slug: "newcastle", name: "Newcastle", county: "" },
    { slug: "woodinville", name: "Woodinville", county: "" },
    { slug: "bothell", name: "Bothell", county: "" },
    { slug: "kenmore", name: "Kenmore", county: "" },
    { slug: "duvall", name: "Duvall", county: "" },
    { slug: "snoqualmie", name: "Snoqualmie", county: "" },
    { slug: "north-bend", name: "North Bend", county: "" },
    { slug: "shoreline", name: "Shoreline", county: "" },
    { slug: "edmonds", name: "Edmonds", county: "" },
    { slug: "lynnwood", name: "Lynnwood", county: "" },
    { slug: "mountlake-terrace", name: "Mountlake Terrace", county: "" },
    { slug: "mill-creek", name: "Mill Creek", county: "" },
    { slug: "everett", name: "Everett", county: "" },
    { slug: "mukilteo", name: "Mukilteo", county: "" },
    { slug: "renton", name: "Renton", county: "" },
    { slug: "kent", name: "Kent", county: "" },
    { slug: "auburn", name: "Auburn", county: "" },
    { slug: "tukwila", name: "Tukwila", county: "" },
    { slug: "federal-way", name: "Federal Way", county: "" },
    { slug: "burien", name: "Burien", county: "" },
    { slug: "seatac", name: "SeaTac", county: "" },
    { slug: "des-moines", name: "Des Moines", county: "" },
    { slug: "seattle", name: "Seattle", county: "" },
    { slug: "west-seattle", name: "West Seattle", county: "" },
    { slug: "ballard", name: "Ballard", county: "" },
    { slug: "queen-anne", name: "Queen Anne", county: "" },
    { slug: "capitol-hill", name: "Capitol Hill", county: "" },
    { slug: "magnolia", name: "Magnolia", county: "" },
    { slug: "green-lake", name: "Green Lake", county: "" },
    { slug: "university-district", name: "University District", county: "" },
    { slug: "bainbridge-island", name: "Bainbridge Island", county: "" }
  ],
  citySeo: {
    "redmond": { region: "Eastside", authority: "City of Redmond", authorityUrl: "https://www.redmond.gov/", focus: "Compare failed insulated-glass replacement with full-window replacement, and bring frame-condition photos before scheduling final measurements." },
    "bellevue": { region: "Eastside", authority: "City of Bellevue", authorityUrl: "https://bellevuewa.gov/", focus: "Plan shower enclosures and large glass panels around finished openings, access, hardware clearances, and verified site measurements." },
    "kirkland": { region: "Eastside", authority: "City of Kirkland", authorityUrl: "https://www.kirklandwa.gov/", focus: "For mirrors and shower glass, identify outlet cutouts, wall condition, door swing, and exposed-edge preferences before fabrication." },
    "sammamish": { region: "Eastside", authority: "City of Sammamish", authorityUrl: "https://www.sammamish.us/", focus: "Window, patio-door, and railing projects benefit from early review of opening condition, drainage, mounting, and any structural changes." },
    "issaquah": { region: "Eastside", authority: "City of Issaquah", authorityUrl: "https://www.issaquahwa.gov/", focus: "For window and exterior-door work, document water intrusion, surrounding trim, access, and the exact product performance being considered." },
    "mercer-island": { region: "Eastside", authority: "City of Mercer Island", authorityUrl: "https://www.mercerisland.gov/", focus: "Glass railing and large-panel projects should establish supporting structure, edge conditions, mounting details, and permit or engineering needs before fabrication." },
    "newcastle": { region: "Eastside", authority: "City of Newcastle", authorityUrl: "https://www.newcastlewa.gov/", focus: "Start window and door planning with full-opening photos, operation concerns, frame condition, and whether the configuration will change." },
    "woodinville": { region: "Eastside", authority: "City of Woodinville", authorityUrl: "https://www.ci.woodinville.wa.us/", focus: "Custom door, window, and glass requests are easier to evaluate with opening dimensions, material preferences, access notes, and project photos." },
    "bothell": { region: "Eastside and south Snohomish County", authority: "City of Bothell", authorityUrl: "https://www.bothellwa.gov/", focus: "For storefront and residential replacements, first identify the glass markings, frame system, opening security, and whether an exact visual match is required." },
    "kenmore": { region: "north King County", authority: "City of Kenmore", authorityUrl: "https://www.kenmorewa.gov/", focus: "Window and patio-door decisions should compare glass-only repair, full replacement, frame condition, drainage, and the written product specifications." },
    "duvall": { region: "Snoqualmie Valley", authority: "City of Duvall", authorityUrl: "https://www.duvallwa.gov/", focus: "For custom glass outside the immediate showroom area, send clear photos, approximate dimensions, access details, and timeline constraints before measurement." },
    "snoqualmie": { region: "Snoqualmie Valley", authority: "City of Snoqualmie", authorityUrl: "https://www.snoqualmiewa.gov/", focus: "Exterior openings should be reviewed for frame condition, drainage, glass performance, access, and any change that could trigger permit review." },
    "north-bend": { region: "Snoqualmie Valley", authority: "City of North Bend", authorityUrl: "https://northbendwa.gov/", focus: "Window and door projects should document exposure, opening condition, operation issues, product goals, and site access before a final scope is prepared." },
    "shoreline": { region: "north King County", authority: "City of Shoreline", authorityUrl: "https://www.shorelinewa.gov/", focus: "For older window openings and failed insulated glass, compare frame condition, glass-only replacement, full replacement, and any egress considerations." },
    "edmonds": { region: "south Snohomish County", authority: "City of Edmonds", authorityUrl: "https://www.edmondswa.gov/", focus: "Window and exterior-door planning should address exposure, glass performance, operation, frame condition, and how the new work meets surrounding finishes." },
    "lynnwood": { region: "south Snohomish County", authority: "City of Lynnwood", authorityUrl: "https://www.lynnwoodwa.gov/", focus: "Residential and commercial glass requests should include full-opening photos, approximate dimensions, safety markings, access, and urgency." },
    "mountlake-terrace": { region: "south Snohomish County", authority: "City of Mountlake Terrace", authorityUrl: "https://www.cityofmlt.com/", focus: "For replacement windows and doors, note operational problems, frame damage, water concerns, desired performance, and whether the opening will change." },
    "mill-creek": { region: "south Snohomish County", authority: "City of Mill Creek", authorityUrl: "https://www.cityofmillcreek.com/", focus: "Shower, window, and entry projects benefit from early product comparison followed by verified measurements after surrounding surfaces are ready." },
    "everett": { region: "Snohomish County", authority: "City of Everett", authorityUrl: "https://www.everettwa.gov/", focus: "For storefront and residential glass, identify the frame system, glass markings, opening security, access, and any safety-glass requirement." },
    "mukilteo": { region: "Snohomish County", authority: "City of Mukilteo", authorityUrl: "https://mukilteowa.gov/", focus: "Exterior window, door, and railing work should account for exposure, drainage, mounting, supporting conditions, and current local requirements." },
    "renton": { region: "south King County", authority: "City of Renton", authorityUrl: "https://www.rentonwa.gov/", focus: "For windows and glass replacement, bring photos of the full opening, glass markings, frame condition, and any operation or moisture problem." },
    "kent": { region: "south King County", authority: "City of Kent", authorityUrl: "https://www.kentwa.gov/", focus: "Residential and commercial requests can be scoped faster when the address, access, dimensions, frame system, and safety concerns are clear." },
    "auburn": { region: "south King County", authority: "City of Auburn", authorityUrl: "https://www.auburnwa.gov/", focus: "Before ordering glass or openings, verify measurements, edge and safety requirements, supporting surfaces, access, and applicable permit guidance." },
    "tukwila": { region: "south King County", authority: "City of Tukwila", authorityUrl: "https://www.tukwilawa.gov/", focus: "Storefront and commercial interior glass projects should document the framing system, glass type, access, business-hours constraints, and opening security." },
    "federal-way": { region: "south King County", authority: "City of Federal Way", authorityUrl: "https://www.federalwaywa.gov/", focus: "Window and patio-door decisions should compare existing-frame condition, glass performance, operation, drainage, and the scope of any opening change." },
    "burien": { region: "south King County", authority: "City of Burien", authorityUrl: "https://www.burienwa.gov/", focus: "For older windows, first determine whether the problem is isolated glass failure, sash or hardware operation, frame deterioration, or water entry." },
    "seatac": { region: "south King County", authority: "City of SeaTac", authorityUrl: "https://www.seatacwa.gov/", focus: "Window and door planning can include glass and frame performance, operation, noise goals, opening condition, and installation details." },
    "des-moines": { region: "south King County", authority: "City of Des Moines", authorityUrl: "https://www.desmoineswa.gov/", focus: "Exterior openings and railings should be reviewed for exposure, drainage, safety glass, attachment conditions, and jurisdiction requirements." },
    "seattle": { region: "Seattle", authority: "Seattle Department of Construction and Inspections", authorityUrl: "https://www.seattle.gov/sdci/permits", focus: "Seattle projects should distinguish in-kind repair from changes to openings, egress, guards, or the exterior envelope and confirm requirements with SDCI." },
    "west-seattle": { region: "Seattle", authority: "Seattle Department of Construction and Inspections", authorityUrl: "https://www.seattle.gov/sdci/permits", focus: "For West Seattle windows, doors, and railings, document exposure, water-management details, opening changes, and any guard or egress considerations." },
    "ballard": { region: "Seattle", authority: "Seattle Department of Construction and Inspections", authorityUrl: "https://www.seattle.gov/sdci/permits", focus: "For Ballard homes and storefronts, identify frame condition, safety markings, opening security, access, and whether the proposed work changes the opening." },
    "queen-anne": { region: "Seattle", authority: "Seattle Department of Construction and Inspections", authorityUrl: "https://www.seattle.gov/sdci/permits", focus: "Window and custom-glass work should account for opening condition, access, surrounding finishes, visual matching, and any applicable alteration review." },
    "capitol-hill": { region: "Seattle", authority: "Seattle Department of Construction and Inspections", authorityUrl: "https://www.seattle.gov/sdci/permits", focus: "For multifamily, storefront, and residential glass, clarify property access, building coordination, frame systems, safety glass, and opening changes." },
    "magnolia": { region: "Seattle", authority: "Seattle Department of Construction and Inspections", authorityUrl: "https://www.seattle.gov/sdci/permits", focus: "Exterior glass, window, and railing projects should document exposure, supporting conditions, drainage, attachment, and any guard or egress requirements." },
    "green-lake": { region: "Seattle", authority: "Seattle Department of Construction and Inspections", authorityUrl: "https://www.seattle.gov/sdci/permits", focus: "For existing windows, compare failed-glass replacement with full-window work by checking frames, operation, water entry, and performance goals." },
    "university-district": { region: "Seattle", authority: "Seattle Department of Construction and Inspections", authorityUrl: "https://www.seattle.gov/sdci/permits", focus: "Multifamily and commercial glass requests should identify site access, building contacts, framing, safety markings, dimensions, and scheduling constraints." },
    "bainbridge-island": { region: "Kitsap County", authority: "City of Bainbridge Island", authorityUrl: "https://www.bainbridgewa.gov/", focus: "For island projects, send detailed photos, approximate measurements, product goals, access notes, and timing constraints before arranging verified measurements." }
  },
  serviceRegions: [
    { name: "Eastside", cities: ["Redmond", "Bellevue", "Kirkland", "Sammamish", "Issaquah", "Mercer Island", "Newcastle", "Woodinville", "Bothell", "Kenmore", "Duvall", "Snoqualmie", "North Bend"] },
    { name: "North Seattle & Snohomish County", cities: ["Shoreline", "Edmonds", "Lynnwood", "Mountlake Terrace", "Mill Creek", "Everett", "Mukilteo"] },
    { name: "South Seattle & South King County", cities: ["Renton", "Kent", "Auburn", "Tukwila", "Federal Way", "Burien", "SeaTac", "Des Moines"] },
    { name: "Seattle & Surrounding Areas", cities: ["Seattle", "West Seattle", "Ballard", "Queen Anne", "Capitol Hill", "Magnolia", "Green Lake", "University District", "Mercer Island", "Bainbridge Island"] }
  ],
  testimonials: [
    {
      name: "Ting Cui",
      location: "Google review",
      service: "Custom Windows",
      stars: 5,
      text: "They did a fantastic job with our custom window order and installation. The team was professional, punctual, and left everything super clean. Highly recommend!",
    },
    {
      name: "Cherie Gu",
      location: "Google review",
      service: "Interior Glass",
      stars: 5,
      text: "The overall experience was amazing. Communication was very smooth, the installation was detail oriented, and we were very happy with the new glass.",
    },
    {
      name: "Pepper Jia Chen",
      location: "Google review",
      service: "Installation",
      stars: 5,
      text: "Very professional and knowledgeable team. The installation quality was excellent, with great attention to detail, and the project was completed on schedule.",
    },
    {
      name: "An Weimeng",
      location: "Google review",
      service: "Sliding Glass Door",
      stars: 5,
      text: "They promptly came to measure, provided a clear and reasonable quote, and the installation workers were very diligent and responsible.",
    },
    {
      name: "Charles Wang",
      location: "Google review",
      service: "Custom Glass",
      stars: 5,
      text: "This was my second time ordering here. The staff had a very accurate grasp of the custom sizing and clearly took their work seriously.",
    },
  ],
  processSteps: [
    { title: "Share the Problem", desc: "Send photos, the address, approximate dimensions, and what is not working or needs to change." },
    { title: "Compare the Right Options", desc: "The in-house team helps distinguish glass-only repair, full replacement, custom fabrication, and product choices." },
    { title: "Verify and Install", desc: "Final measurements and the approved written scope guide ordering, fabrication, and installation." },
    { title: "Review the Finished Work", desc: "The team completes a walkthrough, with owner involvement in job-site quality checks." },
  ],
  faqs: [
    { q: "What areas do you serve?", a: "We serve Redmond, the Eastside, Seattle, Snohomish County, South King County, and nearby Greater Seattle communities listed in our service areas." },
    { q: "Do you offer free estimates?", a: "Yes, we provide free, no-obligation estimates for all our glass and window services. Contact us to schedule an appointment." },
    { q: "How long does a typical installation take?", a: "Timing varies with verified measurements, product availability, access, site conditions, permits, and project scope. The written proposal will describe the expected ordering and installation sequence for the specific project." },
    { q: "What kind of warranty do you offer on your work?", a: "We stand by the quality of our workmanship and the products we install. Warranties vary by product and service; please ask for specific details during your consultation." },
    { q: "Do you handle both residential and commercial projects?", a: "Yes, Elite Glass & Windows works on residential and commercial glass and window projects, from home window replacements to storefront installations." },
    { q: "Where is your showroom?", a: "Our showroom is at 4028 148th Ave NE, Redmond, WA 98052. Please contact the team before visiting to confirm current showroom hours." },
    { q: "Can you help with custom glass projects?", a: "Absolutely! We specialize in custom glass solutions, including unique mirror designs, glass tabletops, and specialty glass installations. Bring us your vision!" },
    { q: "Do you work with contractors and designers?", a: "Yes. We work directly with homeowners and also coordinate with contractors, builders, architects, designers, and property managers." }
  ],
  portfolioProjects: [],
  legal: { privacyPolicyDate: "September 17, 2026", termsDate: "September 17, 2026" },
};

// Search, answer-engine, and static-rendering content. This is deliberately
// part of the public content model so generated HTML and browser enhancement
// read from the same verified source.
CONFIG.seo = {
  updatedAt: "2026-09-21",
  home: {
    primaryIntent: "glass company in Redmond",
    title: "Glass Company in Redmond, WA | Elite Glass & Windows",
    description: "Redmond glass company for replacement windows, glass replacement, shower doors, entry and patio doors, railings, mirrors, and storefront glass across Greater Seattle.",
    featuredImage: "/public/optimized/window-redmond-1440.webp",
    updatedAt: "2026-09-21",
  },
  pages: {
    about: { title: "About Elite Glass & Windows | Redmond Glass Company", description: "Meet the Redmond team that grew from solving a shower-door sourcing problem into a Greater Seattle glass, window, and door company.", primaryIntent: "about Elite Glass and Windows", featuredImage: "/public/optimized/window-redmond-1440.webp", updatedAt: "2026-09-21" },
    "installation-process": { title: "Glass & Window Installation Process | Elite Glass", description: "See how Elite Glass & Windows moves from project photos and product guidance to verified measurements, installation, and an owner-involved quality check.", primaryIntent: "glass and window installation process", featuredImage: "/public/service-luxury/window-replacement-960.webp", updatedAt: "2026-09-21" },
    contact: { title: "Contact Elite Glass & Windows | Free Estimate", description: "Start a free glass, window, shower-door, railing, mirror, door, or storefront estimate with Elite Glass & Windows in Redmond.", primaryIntent: "contact Elite Glass and Windows", featuredImage: "/public/social/elite-glass-og.jpg", updatedAt: "2026-09-21" },
    "our-work": { title: "Glass, Window & Door Projects | Elite Glass", description: "View verified Elite Glass & Windows projects in Redmond, Bellevue, Bothell, Kirkland, and nearby Greater Seattle communities.", primaryIntent: "Elite Glass and Windows projects", featuredImage: "/public/projects-optimized/window_redmond_main.webp", updatedAt: "2026-09-21" },
    "privacy-policy": { title: "Privacy Policy | Elite Glass & Windows", description: "Privacy policy for the Elite Glass & Windows website, chat requests, analytics, and advertising measurement.", primaryIntent: "Elite Glass and Windows privacy policy", featuredImage: "/public/social/elite-glass-og.jpg", updatedAt: "2026-09-17" },
    terms: { title: "Website Terms | Elite Glass & Windows", description: "Website terms for Elite Glass & Windows, including estimates, custom measurements, communications, and product information.", primaryIntent: "Elite Glass and Windows website terms", featuredImage: "/public/social/elite-glass-og.jpg", updatedAt: "2026-09-17" },
  },
};

CONFIG.story = {
  founded: "2020",
  origin: "Elite Glass & Windows began in 2020 after the owners had trouble finding the right shower door for their own renovation. That experience shaped a practical approach: explain the choices, measure the finished opening, and make the next step clear.",
  expansion: "The company expanded from shower enclosures into replacement windows, entry and patio doors, mirrors, railings, storefront glass, and specialty fabrication for homes and businesses across Greater Seattle.",
  proofPoints: [
    "Established window and door brands plus glass fabricated by Washington suppliers",
    "An in-house customer-service team that coordinates questions and next steps",
    "Repeat work from contractors and referrals from past customers",
    "Owner involvement in job-site quality checks",
  ],
};

const SERVICE_SEO = {
  "window-replacement": {
    primaryIntent: "replacement windows and new window installation",
    title: "Replacement Windows & Installation in Greater Seattle",
    description: "Compare replacement windows, new-window installation, and energy-efficient glass packages with verified measurements from Elite Glass & Windows.",
    desc: "Replacement windows and new-window installation based on the opening, frame condition, operating style, and performance you need.",
    longDesc: "Start by identifying what is actually failing: the insulated glass, sash or hardware, frame, installation, or the full opening. If the frame and operation are sound, glass-only replacement may solve a failed seal. When frames are damaged, difficult to operate, leaking, or no longer fit the project goals, full-window replacement may be the better path. We measure the opening and help compare frame materials, styles, Low-E glass packages, and installation details before a product is ordered.",
    decisionGuide: ["Choose glass-only replacement when the frame and sash remain sound but the sealed glass unit is foggy or cracked.", "Consider full replacement when the frame is damaged, operation is poor, water is entering, or the opening or performance needs to change.", "Compare the exact U-factor, solar heat-gain coefficient, glass package, frame, and installation method in the written proposal."],
  },
  "glass-replacement": {
    primaryIntent: "foggy window and insulated glass replacement",
    title: "Foggy & Cracked Glass Replacement in Greater Seattle",
    description: "Replace foggy insulated glass units, cracked window glass, door glass, and safety glass without replacing a sound frame when glass-only repair fits.",
    desc: "Glass-only replacement for foggy insulated units, cracked panes, door glass, and other openings when the existing frame can remain.",
    longDesc: "Fog between panes usually points to a failed insulated-glass seal, while cracks and impact damage may require a different safety-glass specification. We review the full opening, frame condition, glass markings, thickness, tint, coating, and access before recommending a replacement unit. When the sash and frame are still serviceable, replacing only the glass can preserve the existing window and avoid unnecessary full-frame work.",
    decisionGuide: ["Send a photo of the full opening and a close-up of the damage or fogging.", "Include visible glass markings, approximate dimensions, frame material, and access notes.", "Final glass size and safety specification follow an on-site measurement, not customer dimensions alone."],
  },
  "shower-doors": {
    primaryIntent: "custom frameless shower doors",
    title: "Custom Frameless Shower Doors in Greater Seattle",
    description: "Plan custom frameless, semi-frameless, hinged, and sliding shower enclosures measured for finished tile, curb, hardware, and water control.",
    desc: "Custom frameless, semi-frameless, hinged, and sliding shower enclosures measured after finished surfaces are ready.",
    longDesc: "A shower enclosure must fit the finished opening, hardware clearances, door swing, curb slope, and shower-head position. We help choose a frameless, semi-frameless, hinged, or sliding layout along with glass and hardware finishes. Final fabrication follows verified measurements after tile, curbs, and surrounding surfaces are complete and stable.",
    decisionGuide: ["Finish tile, curbs, walls, and fixed surfaces before final measurement.", "Plan door swing, nearby fixtures, curb slope, and shower-head direction together.", "Choose glass and hardware after confirming the layout, mounting points, and water-control expectations."],
  },
  "entry-patio-doors": {
    primaryIntent: "entry and patio door replacement",
    title: "Entry & Patio Door Replacement in Greater Seattle",
    description: "Compare front doors, sliding patio doors, French doors, and multi-panel replacements by opening condition, operation, glass, and installation scope.",
    desc: "Front-door, sliding-patio-door, French-door, and multi-panel replacement planned around the existing opening and daily use.",
    longDesc: "Door replacement starts with the opening, not a catalog. We review frame condition, threshold and drainage details, operation, security hardware, glass, exposure, and surrounding finishes before recommending an entry, sliding patio, French, or multi-panel system. The written scope should make clear whether the existing frame can remain or a full-frame replacement is needed.",
    decisionGuide: ["Document sticking, drafts, water entry, damaged frames, lock problems, and threshold conditions.", "Compare operation, accessibility, glass package, screens, hardware, and drainage details.", "Confirm whether the opening or exterior envelope changes before ordering."],
  },
  "glass-railings": {
    primaryIntent: "glass railing systems",
    title: "Glass Railings for Decks, Stairs & Balconies",
    description: "Plan interior and exterior glass railing systems for decks, balconies, and stairs with the mounting, glass, structure, and code review defined first.",
    desc: "Interior and exterior glass railing systems for stairs, decks, and balconies, planned around structure, mounting, and sightlines.",
    longDesc: "Glass railings depend on more than panel size. Guard height, loads, supporting structure, edge conditions, attachment, waterproofing, and the selected post, standoff, or base-shoe system all affect the design. We verify site conditions and coordinate the glass and hardware scope; permit or engineering review may also be required for the property.",
    decisionGuide: ["Identify the supporting structure and finished edge conditions before selecting hardware.", "Choose between post, standoff, and base-shoe systems based on sightlines and attachment needs.", "Confirm current guard, engineering, and permit requirements before fabrication."],
  },
  "custom-mirrors": {
    primaryIntent: "custom mirrors",
    title: "Custom Mirrors for Bathrooms, Gyms & Walls",
    description: "Custom bathroom, vanity, wall, gym, studio, and commercial mirrors measured for edges, cutouts, mounting, and the actual wall condition.",
    desc: "Custom mirrors for bathrooms, vanities, walls, gyms, studios, and commercial spaces, measured around fixtures and finishes.",
    longDesc: "A custom mirror is fabricated for the actual wall, exposed edges, outlets, fixtures, trim, and mounting plan. We measure the finished space and help select clear mirror, edge treatment, panel layout, and installation method for vanities, full walls, gyms, studios, and commercial interiors.",
    decisionGuide: ["Share wall photos and note outlets, sconces, trim, switches, and other cutouts.", "Choose polished, beveled, or concealed edges based on which sides remain visible.", "Review wall flatness, substrate, access, panel size, and mounting before fabrication."],
  },
  "storefront-glass": {
    primaryIntent: "commercial storefront glass replacement",
    title: "Commercial Storefront Glass Replacement",
    description: "Commercial storefront glass, entrances, replacement panels, and interior glass scoped from the frame system, safety markings, access, and opening condition.",
    desc: "Commercial storefront glass, entrances, replacement panels, and interior glass for businesses and property teams.",
    longDesc: "Storefront work begins by identifying the frame system, glass markings, opening size, safety requirements, access, and whether the opening is secure. We handle replacement panels, storefront systems, commercial entrances, and interior commercial glass, coordinating the written glass and installation scope with the business or property contact.",
    decisionGuide: ["Send the site address, full-opening photos, approximate dimensions, and visible glass markings.", "Explain whether the opening is secure and note access or building-coordination constraints.", "Replacement glass must match the documented safety and performance requirements for its location."],
  },
  "custom-glass-products": {
    primaryIntent: "custom glass fabrication",
    title: "Custom Glass Tabletops, Shelves & Inserts",
    description: "Custom glass for tabletops, shelves, cabinet inserts, skylights, and specialty applications, specified by size, support, edgework, cutouts, and safety needs.",
    desc: "Custom tabletops, shelves, cabinet inserts, skylight glass, and specialty fabrication specified for the way the glass will be supported and used.",
    longDesc: "Specialty glass needs more than length and width. We review the application, support points, expected load, thickness, glass type, edgework, corners, cutouts, and handling access before fabrication. Options include cabinet inserts, tabletop protectors and standalone tops, shelves, skylight glass, and other residential or commercial pieces.",
    decisionGuide: ["Provide a sketch, photos, approximate dimensions, and the glass application.", "Identify support locations, exposed edges, loads, corners, holes, notches, and cutouts.", "Final fabrication follows verified dimensions and the safety specification for the intended use."],
  },
};

for (const service of CONFIG.services) {
  Object.assign(service, SERVICE_SEO[service.slug], {
    featuredImage: service.image,
    updatedAt: "2026-09-21",
    process: [
      "Share photos, the address, approximate dimensions, and what is not working.",
      "Review practical options and receive a written scope for the selected product or glass.",
      "Complete final measurement before custom fabrication or ordering.",
      "Install the approved work and review the finished project.",
    ],
  });
}

const CITY_SERVICE_PRIORITIES = {
  redmond:["glass-replacement","window-replacement","entry-patio-doors"], bellevue:["shower-doors","glass-railings","window-replacement"], kirkland:["custom-mirrors","shower-doors","window-replacement"], sammamish:["entry-patio-doors","glass-railings","shower-doors"], issaquah:["window-replacement","entry-patio-doors","custom-mirrors"], "mercer-island":["glass-railings","custom-glass-products","window-replacement"], newcastle:["window-replacement","entry-patio-doors","shower-doors"], woodinville:["entry-patio-doors","window-replacement","custom-glass-products"], bothell:["storefront-glass","entry-patio-doors","glass-replacement"], kenmore:["glass-replacement","window-replacement","entry-patio-doors"], duvall:["custom-glass-products","window-replacement","custom-mirrors"], snoqualmie:["window-replacement","entry-patio-doors","glass-railings"], "north-bend":["window-replacement","entry-patio-doors","glass-railings"], shoreline:["glass-replacement","window-replacement","entry-patio-doors"], edmonds:["glass-replacement","window-replacement","entry-patio-doors"], lynnwood:["storefront-glass","glass-replacement","window-replacement"], "mountlake-terrace":["window-replacement","entry-patio-doors","glass-replacement"], "mill-creek":["shower-doors","entry-patio-doors","window-replacement"], everett:["storefront-glass","glass-replacement","window-replacement"], mukilteo:["window-replacement","entry-patio-doors","glass-railings"], renton:["glass-replacement","storefront-glass","window-replacement"], kent:["storefront-glass","glass-replacement","custom-glass-products"], auburn:["custom-glass-products","glass-replacement","storefront-glass"], tukwila:["storefront-glass","glass-replacement","custom-mirrors"], "federal-way":["window-replacement","entry-patio-doors","glass-replacement"], burien:["glass-replacement","window-replacement","entry-patio-doors"], seatac:["window-replacement","entry-patio-doors","glass-replacement"], "des-moines":["glass-railings","window-replacement","entry-patio-doors"], seattle:["glass-replacement","window-replacement","storefront-glass"], "west-seattle":["window-replacement","entry-patio-doors","glass-railings"], ballard:["storefront-glass","glass-replacement","window-replacement"], "queen-anne":["custom-mirrors","shower-doors","glass-railings"], "capitol-hill":["storefront-glass","glass-replacement","custom-mirrors"], magnolia:["glass-railings","window-replacement","entry-patio-doors"], "green-lake":["glass-replacement","window-replacement","shower-doors"], "university-district":["storefront-glass","glass-replacement","custom-mirrors"], "bainbridge-island":["custom-glass-products","window-replacement","entry-patio-doors"],
};

const CITY_PROJECT_REFS = {
  redmond:["window-replacement-redmond","sliding-patio-door-redmond"], bellevue:["frameless-shower-door-bellevue"], kirkland:["custom-wall-mirror-kirkland"], bothell:["storefront-glass-replacement-bothell","front-door-replacement-bothell"],
};

const CITY_SUPPORTING_PROJECT_REFS = {
  redmond:["Frameless Shower Door in Redmond, WA","Glass Railing Replacement in Redmond, WA","Gym Wall Mirror Installation in Redmond, WA"],
  bellevue:["Glass Railing Replacement in Bellevue, WA","Window Replacement in Bellevue, WA","Bathroom Mirror Installation in Bellevue, WA","Sliding Patio Door Installation in Bellevue, WA"],
  kirkland:["Corner Shower Enclosure in Kirkland, WA","Modern Front Door Replacement in Kirkland, WA","Staircase Glass Railing Replacement in Kirkland, WA","Milgard Windows Installation in Kirkland, WA","Multi-Slide Patio Door Installation in Kirkland, WA"],
  sammamish:["Sliding Shower Door in Sammamish, WA","Interior Glass Railing in Sammamish, WA","French Patio Door Installation in Sammamish, WA"],
  issaquah:["Whole-Home Window Replacement in Issaquah, WA","Framed Bathroom Mirror in Issaquah, WA","Patio Door Replacement in Issaquah, WA"],
  seattle:["Glass Replacement in Seattle, WA","Frameless Shower Door in Seattle, WA","Energy-Efficient Windows in Seattle, WA","Custom Mirror Wall in Seattle, WA"],
  renton:["Glass Replacement in Renton, WA"],
  lynnwood:["Glass Replacement in Lynnwood, WA"],
};

for (const area of CONFIG.serviceAreas) {
  const profile = CONFIG.citySeo[area.slug];
  const serviceSlugs = CITY_SERVICE_PRIORITIES[area.slug];
  const serviceNames = serviceSlugs.map(slug => CONFIG.services.find(service => service.slug === slug).name);
  profile.primaryIntent = profile.focus;
  profile.title = `${serviceNames[0]} in ${area.name}, WA | Elite Glass`;
  profile.description = `${serviceNames.join(", ")} for ${area.name} homes and businesses, with project guidance, verified measurements, and free estimates.`;
  profile.featuredImage = CONFIG.services.find(service => service.slug === serviceSlugs[0]).image;
  profile.updatedAt = "2026-09-21";
  profile.serviceSlugs = serviceSlugs;
  profile.projectRefs = CITY_PROJECT_REFS[area.slug] || [];
  profile.supportingProjectRefs = CITY_SUPPORTING_PROJECT_REFS[area.slug] || [];
  profile.intro = `${area.name} projects come with local planning details that should be clear before measurement. ${profile.focus} Our Redmond-based team helps customers narrow the scope before products are ordered or custom glass is fabricated.`;
  profile.estimateReady = `For a ${area.name} estimate, send the property address, photos of the full opening, approximate dimensions, the problem you want to solve, and any access or building-coordination notes. Final custom sizes require verified measurements.`;
  profile.faqs = [
    { q: `What should I send for a ${area.name} ${serviceNames[0].toLowerCase()} estimate?`, a: profile.estimateReady },
    { q: `Which three services are most relevant for ${area.name} projects?`, a: `This page prioritizes ${serviceNames.join(", ")}. Elite Glass & Windows can also discuss the other listed glass and door services when they fit the project.` },
    { q: `How should I plan measurements for custom work in ${area.name}?`, a: `${profile.focus} Customer measurements help with an initial conversation, but final fabrication follows verified site measurements.` },
    { q: `Where can I check current ${area.name} permit or project guidance?`, a: `Requirements depend on the property and scope. Check current guidance from ${profile.authority}, especially for changes to openings, egress, guards, structure, or the exterior envelope.` },
  ];
}
