// ============================================================
// SHARED COMPONENTS — Header, Footer, LeadForm, ChatWidget
// Included on every page via <script src="../components.js">
// ============================================================

// Microsoft Clarity loads only when a real project ID is configured.
if (CONFIG.clarityProjectId) {
  (function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
  })(window, document, "clarity", "script", CONFIG.clarityProjectId);
}

// ── ATTRIBUTION CAPTURE (Meta CAPI) ───────────────────────────
// Captures UTM params, fbclid, fbp/fbc cookies, and a per-pageview
// lead_event_id for Meta Pixel / CAPI deduplication. Runs on every
// page load and persists data via sessionStorage (current session)
// and localStorage (first-touch, kept across visits).
const HouzflowAttribution = (function () {
  function getUrlParam(name) {
    return new URLSearchParams(window.location.search).get(name) || '';
  }

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return '';
  }

  function generateEventId() {
    return 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  function capture() {
    const fbclid = getUrlParam('fbclid');
    const data = {
      utm_source: getUrlParam('utm_source'),
      utm_medium: getUrlParam('utm_medium'),
      utm_campaign: getUrlParam('utm_campaign'),
      utm_content: getUrlParam('utm_content'),
      utm_term: getUrlParam('utm_term'),
      ad_id: getUrlParam('ad_id'),
      adset_id: getUrlParam('adset_id'),
      campaign_id: getUrlParam('campaign_id'),
      fbclid: fbclid,
      fbp: getCookie('_fbp'),
      fbc: getCookie('_fbc') || (fbclid ? `fb.1.${Date.now()}.${fbclid}` : ''),
      source_url: window.location.href,
      user_agent: navigator.userAgent,
      lead_event_id: generateEventId(),
    };

    sessionStorage.setItem('houzflow_attribution', JSON.stringify(data));

    if (!localStorage.getItem('houzflow_first_touch')) {
      localStorage.setItem('houzflow_first_touch', JSON.stringify({
        source: data.utm_source,
        campaign: data.utm_campaign,
        ad_id: data.ad_id,
        timestamp: Date.now(),
      }));
    }

    return data;
  }

  function get() {
    const stored = sessionStorage.getItem('houzflow_attribution');
    return stored ? JSON.parse(stored) : capture();
  }

  // Capture on every page load so fbc/fbclid/UTMs reflect the
  // landing page a visitor arrived on.
  const current = capture();

  return { get, capture, current };
})();


// ── Apply CSS design tokens from CONFIG ──────────────────────
function applyColorTokens() {
  document.documentElement.style.setProperty('--color-primary', CONFIG.colors.primary);
  document.documentElement.style.setProperty('--color-secondary', CONFIG.colors.secondary);
}

// ── Utility: render star icons ───────────────────────────────
function renderStars(count = 5) {
  return Array.from({ length: count }).map(() =>
    `<svg class="star-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
    </svg>`
  ).join('');
}

// ── Logo SVG ─────────────────────────────────────────────────
function logoHTML() {
  return `<a href="/" class="logo-link" aria-label="${CONFIG.businessName} home">
    <img src="/logo.svg" alt="${CONFIG.businessName}" class="brand-logo-img" />
  </a>`;
}

// ── HEADER ───────────────────────────────────────────────────
function renderHeader() {
  const servicesDropdown = CONFIG.services.map(s => `
    <a href="/services/${s.slug}.html" class="dropdown-item">
      <div class="dropdown-item-title">${s.name}</div>
      <div class="dropdown-item-desc">${s.desc}</div>
    </a>`).join('');

  const areaByName = new Map(CONFIG.serviceAreas.map(area => [area.name, area]));
  const serviceRegions = CONFIG.serviceRegions || [{ name: 'All Service Areas', cities: CONFIG.serviceAreas.map(area => area.name) }];
  const areasDropdown = serviceRegions.map(region => `
    <div class="nav-area-region">
      <div class="nav-area-region-title">${region.name}</div>
      <div class="nav-area-region-links">
        ${region.cities.map(name => areaByName.get(name)).filter(Boolean).map(area =>
          `<a href="/cities/${area.slug}.html" class="area-pill">${area.name}</a>`).join('')}
      </div>
    </div>`).join('');

  const mobileServiceLinks = CONFIG.services.map(s => `
    <a href="/services/${s.slug}.html" class="mobile-sub-link">${s.name}</a>`).join('');

  const mobileAreaLinks = serviceRegions.map(region => `
    <div class="mobile-area-region">
      <div class="mobile-area-region-title">${region.name}</div>
      <div class="mobile-area-pills">
        ${region.cities.map(name => areaByName.get(name)).filter(Boolean).map(area =>
          `<a href="/cities/${area.slug}.html" class="mobile-area-pill">${area.name}</a>`).join('')}
      </div>
    </div>`).join('');

  const html = `
  <header class="site-header" id="site-header">
    <div class="container-wide header-inner">
      ${logoHTML()}

      <!-- Desktop nav -->
      <nav class="desktop-nav">
        <!-- Services dropdown -->
        <div class="nav-dropdown-wrap" id="services-dropdown-wrap">
          <button class="nav-btn" id="services-btn">
            Services
            <svg class="chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div class="dropdown-panel services-panel" id="services-panel">
            <div class="services-grid">${servicesDropdown}</div>
          </div>
        </div>

        <!-- Areas dropdown -->
        <div class="nav-dropdown-wrap" id="areas-dropdown-wrap">
          <button class="nav-btn" id="areas-btn">
            Service Areas
            <svg class="chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div class="dropdown-panel areas-panel" id="areas-panel">
            <div class="areas-regions">${areasDropdown}</div>
          </div>
        </div>

        <a href="/our-work.html" class="nav-link">Our Work</a>
        <a href="/about.html" class="nav-link">About</a>
        <a href="/contact.html" class="nav-link">Contact</a>
      </nav>

      <!-- Desktop CTA -->
      <div class="header-cta">
        <a href="tel:${CONFIG.phoneRaw}" class="btn-phone">
          <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.09 12a19.79 19.79 0 01-3-8.63A2 2 0 012.11 1.18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.27a16 16 0 006.29 6.29l1.45-1.45a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 15.36z"/></svg>
          ${CONFIG.phone}
        </a>
        <a href="/contact.html" class="btn-primary-sm">Free Quote</a>
      </div>

      <!-- Mobile hamburger -->
      <button class="hamburger" id="hamburger" aria-label="Toggle menu">
        <svg id="icon-menu" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon-md"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        <svg id="icon-x" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon-md" style="display:none"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>

    <!-- Mobile drawer -->
    <div class="mobile-drawer" id="mobile-drawer" style="display:none">
      <div class="container-wide mobile-nav-inner">
        <!-- Services accordion -->
        <button class="mobile-acc-btn" id="mobile-services-btn">
          Services
          <svg class="chevron-icon" id="mobile-services-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="mobile-acc-panel" id="mobile-services-panel" style="display:none">
          ${mobileServiceLinks}
        </div>

        <!-- Areas accordion -->
        <button class="mobile-acc-btn border-top" id="mobile-areas-btn">
          Service Areas
          <svg class="chevron-icon" id="mobile-areas-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="mobile-acc-panel" id="mobile-areas-panel" style="display:none">
          <div class="mobile-area-regions">${mobileAreaLinks}</div>
        </div>

        <a href="/our-work.html" class="mobile-nav-link border-top">Our Work</a>
        <a href="/about.html" class="mobile-nav-link border-top">About</a>
        <a href="/contact.html" class="mobile-nav-link border-top">Contact</a>

        <div class="mobile-cta-row">
          <a href="tel:${CONFIG.phoneRaw}" class="btn-phone w-full justify-center">
            <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.09 12a19.79 19.79 0 01-3-8.63A2 2 0 012.11 1.18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.27a16 16 0 006.29 6.29l1.45-1.45a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 15.36z"/></svg>
            ${CONFIG.phone}
          </a>
          <a href="/contact.html" class="btn-primary w-full text-center">Get Free Quote</a>
        </div>
      </div>
    </div>
  </header>`;

  document.body.insertAdjacentHTML('afterbegin', html);
  initHeader();
}

function initHeader() {
  const header = document.getElementById('site-header');
  const hamburger = document.getElementById('hamburger');
  const drawer = document.getElementById('mobile-drawer');
  const iconMenu = document.getElementById('icon-menu');
  const iconX = document.getElementById('icon-x');

  // Scroll behavior
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
  // Run once on load
  if (window.scrollY > 30) header.classList.add('scrolled');

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    const isOpen = drawer.style.display !== 'none';
    drawer.style.display = isOpen ? 'none' : 'block';
    iconMenu.style.display = isOpen ? 'block' : 'none';
    iconX.style.display = isOpen ? 'none' : 'block';
  });

  // Desktop dropdowns - hover
  ['services', 'areas'].forEach(key => {
    const wrap = document.getElementById(`${key}-dropdown-wrap`);
    const panel = document.getElementById(`${key}-panel`);
    if (!wrap || !panel) return;
    wrap.addEventListener('mouseenter', () => panel.style.display = 'block');
    wrap.addEventListener('mouseleave', () => panel.style.display = 'none');
  });

  // Mobile accordions
  ['services', 'areas'].forEach(key => {
    const btn = document.getElementById(`mobile-${key}-btn`);
    const panel = document.getElementById(`mobile-${key}-panel`);
    const chevron = document.getElementById(`mobile-${key}-chevron`);
    if (!btn || !panel) return;
    btn.addEventListener('click', () => {
      const isOpen = panel.style.display !== 'none';
      panel.style.display = isOpen ? 'none' : 'block';
      chevron.style.transform = isOpen ? '' : 'rotate(180deg)';
    });
  });

  // Close drawer on nav link click
  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      drawer.style.display = 'none';
      iconMenu.style.display = 'block';
      iconX.style.display = 'none';
    });
  });
}

// ── FOOTER ───────────────────────────────────────────────────
function renderFooter() {
  const serviceLinks = CONFIG.services.map(s =>
    `<li><a href="/services/${s.slug}.html">${s.name}</a></li>`).join('');

  const footerAreaByName = new Map(CONFIG.serviceAreas.map(area => [area.name, area]));
  const footerRegions = CONFIG.serviceRegions || [{ name: 'All Service Areas', cities: CONFIG.serviceAreas.map(area => area.name) }];
  const areaLinks = footerRegions.map(region => `
    <div class="footer-region-group">
      <div class="footer-region-title">${region.name}</div>
      <div class="footer-region-links">
        ${region.cities.map(name => footerAreaByName.get(name)).filter(Boolean).map(area =>
          `<a href="/cities/${area.slug}.html">${area.name}</a>`).join('<span aria-hidden="true">&bull;</span>')}
      </div>
    </div>`).join('');

  // Social icons — only render if URL is set
  const SOCIAL_ICONS = {
    facebook:  { label: 'Facebook',  svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>' },
    instagram: { label: 'Instagram', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>' },
    youtube:   { label: 'YouTube',   svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z"/><polygon fill="#fff" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>' },
    tiktok:    { label: 'TikTok',    svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.77a4.85 4.85 0 01-1.01-.08z"/></svg>' },
    linkedin:  { label: 'LinkedIn',  svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>' },
    yelp:      { label: 'Yelp',      svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.271 9.604l-3.847-1.41c-.547-.201-.868-.156-1.083.073-.268.286-.179.732.025 1.207l1.44 3.35c.181.42.463.656.779.656.217 0 .438-.093.635-.277l2.432-2.298c.387-.366.375-.866.022-1.014l-.403-.287zm-1.97 4.977l-1.49 3.688c-.198.488-.13.893.178 1.099.234.156.514.107.828-.075l3.49-2.014c.415-.24.578-.592.423-.935l-.018-.04-1.626-2.128c-.307-.4-.784-.377-1.071-.142l-.714.547zm5.05-7.49l-2.978-2.626c-.404-.357-.793-.37-1.039-.108-.264.283-.217.7-.016 1.141l1.524 3.334c.195.427.486.638.81.595.204-.027.4-.155.569-.374l1.427-1.518c.309-.33.053-.756-.297-.444zm2.97 4.43c-.128-.493-.47-.719-.944-.625l-3.856.697c-.454.082-.667.361-.603.745.03.178.132.35.293.5l2.68 2.47c.353.325.746.308.99.036.186-.206.2-.508.073-.834l-.633-3z"/></svg>' },
    houzz:     { label: 'Houzz',     svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 22V8l9-6 9 6v14h-6v-7H9v7z"/></svg>' },
    nextdoor:  { label: 'Nextdoor',  svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.5 13.5h-2.25v-4.5h-4.5v4.5H7.5v-9l4.5-2.25 4.5 2.25v9z"/></svg>' },
  };
  const social = CONFIG.social || {};
  const socialHTML = Object.entries(SOCIAL_ICONS)
    .filter(([key]) => social[key] && social[key].trim())
    .map(([key, meta]) => `<a href="${social[key]}" target="_blank" rel="noopener noreferrer" class="footer-social-icon" aria-label="${meta.label}">${meta.svg}</a>`)
    .join('');
  const socialRow = socialHTML ? `<div class="footer-social-row">${socialHTML}</div>` : '';

  const html = `
  <!-- FOOTER -->
  <footer class="site-footer">
    <div class="container-wide footer-grid">

      <!-- Brand column -->
      <div class="footer-brand">
        <div class="footer-biz-name">${CONFIG.businessName}</div>
        <p class="footer-tagline">${CONFIG.tagline}</p>
        <div class="footer-contact-list">
          <a href="tel:${CONFIG.phoneRaw}" class="footer-contact-item">
            <svg class="footer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.09 12a19.79 19.79 0 01-3-8.63A2 2 0 012.11 1.18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.27a16 16 0 006.29 6.29l1.45-1.45a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 15.36z"/></svg>
            ${CONFIG.phone}
          </a>
          <a href="mailto:${CONFIG.email}" class="footer-contact-item">
            <svg class="footer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            ${CONFIG.email}
          </a>
          <div class="footer-contact-item">
            <svg class="footer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            ${CONFIG.address}
          </div>
        </div>
        ${socialRow}
      </div>

      <!-- Services column -->
      <div class="footer-col">
        <div class="footer-col-title">Services</div>
        <ul class="footer-links">${serviceLinks}</ul>
      </div>

      <!-- Service Areas column -->
      <div class="footer-col">
        <div class="footer-col-title">Service Areas</div>
        <div class="footer-area-regions">${areaLinks}</div>
        <div class="footer-license">
          <div>License #${CONFIG.licenseNumber}</div>
          <div>Licensed &amp; Insured in ${CONFIG.state}</div>
        </div>
      </div>

      <!-- Company column -->
      <div class="footer-col">
        <div class="footer-col-title">Company</div>
        <ul class="footer-links">
          <li><a href="/about.html">About Us</a></li>
          <li><a href="/our-work.html">Our Work</a></li>
          <li><a href="/contact.html">Contact</a></li>
          <li><a href="/privacy-policy.html">Privacy Policy</a></li>
          <li><a href="/terms.html">Terms &amp; Conditions</a></li>
        </ul>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="footer-bottom">
      <div class="container-wide footer-bottom-inner">
        <div>&copy; <span id="footer-year"></span> ${CONFIG.businessName}. All rights reserved.</div>
        <div>${CONFIG.niche || 'Glass, Windows & Doors'} &middot; ${CONFIG.state}.</div>
      </div>
      <div class="container-wide" style="padding-block: 0.5rem 1rem; text-align: center; font-size: 0.7rem; color: rgba(255,255,255,0.4);">
        Website Design &amp; Marketing by <a href="https://houzflow.com" target="_blank" rel="noopener" style="color: rgba(255,255,255,0.55); text-decoration: none;">HouzFlow</a>
      </div>
    </div>
  </footer>`;

  document.body.insertAdjacentHTML('beforeend', html);
  document.getElementById('footer-year').textContent = new Date().getFullYear();
}

// ── CHAT WIDGET ───────────────────────────────────────────────
function renderChatWidget() {
  const html = `
  <!-- CHAT WIDGET -->
  <div class="chat-widget" id="chat-widget">
    <div class="chat-panel" id="chat-panel" style="display:none">
      <div class="chat-header">
        <div>
          <div class="chat-header-title">Chat with Us</div>
          <div class="chat-header-sub">Tell us about your project</div>
        </div>
        <button class="chat-close" id="chat-close-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon-md"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="chat-body" id="chat-body">
        <form id="chat-form" class="chat-form">
          <p class="chat-intro">Hi! Tell us about your project and we'll get right back to you.</p>
          <input required name="name" placeholder="Your Name" class="form-input" />
          <input required name="phone" type="tel" placeholder="Phone Number" class="form-input" />
          <textarea required name="message" rows="3" placeholder="How can we help?" class="form-textarea"></textarea>
          <div id="chat-error" class="form-error" style="display:none">Something went wrong. Please call us instead.</div>
          <button type="submit" class="btn-primary w-full" id="chat-submit-btn">Send Message</button>
        </form>
      </div>
    </div>
    <button class="chat-fab" id="chat-fab" aria-label="Open chat">
      <svg id="chat-icon-msg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon-lg"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
      <svg id="chat-icon-x" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon-lg" style="display:none"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
  </div>`;

  document.body.insertAdjacentHTML('beforeend', html);
  initChatWidget();
}

function initChatWidget() {
  const fab = document.getElementById('chat-fab');
  const panel = document.getElementById('chat-panel');
  const closeBtn = document.getElementById('chat-close-btn');
  const iconMsg = document.getElementById('chat-icon-msg');
  const iconX = document.getElementById('chat-icon-x');
  const form = document.getElementById('chat-form');
  const submitBtn = document.getElementById('chat-submit-btn');
  const chatBody = document.getElementById('chat-body');
  const chatError = document.getElementById('chat-error');

  // Bounce animation on load
  setTimeout(() => {
    fab.classList.add('chat-bounce');
    setTimeout(() => fab.classList.remove('chat-bounce'), 1100);
  }, 2000);

  // Check if already submitted
  if (localStorage.getItem('gcr_chat_submitted') === '1') {
    form.innerHTML = '<p class="text-center text-muted" style="padding:1rem">We already have your message. We\'ll be in touch shortly!</p>';
  }

  function togglePanel() {
    const isOpen = panel.style.display !== 'none';
    panel.style.display = isOpen ? 'none' : 'block';
    iconMsg.style.display = isOpen ? 'block' : 'none';
    iconX.style.display = isOpen ? 'none' : 'block';
  }

  fab.addEventListener('click', togglePanel);
  closeBtn.addEventListener('click', () => {
    panel.style.display = 'none';
    iconMsg.style.display = 'block';
    iconX.style.display = 'none';
  });

  // Close on outside click
  document.addEventListener('mousedown', (e) => {
    const widget = document.getElementById('chat-widget');
    if (!widget.contains(e.target)) {
      panel.style.display = 'none';
      iconMsg.style.display = 'block';
      iconX.style.display = 'none';
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      panel.style.display = 'none';
      iconMsg.style.display = 'block';
      iconX.style.display = 'none';
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!CONFIG.webhookUrl) {
      chatError.innerHTML = `Online requests are not connected yet. Please call <a href="tel:${CONFIG.phoneRaw}">${CONFIG.phone}</a> or email <a href="mailto:${CONFIG.email}">${CONFIG.email}</a>.`;
      chatError.style.display = 'block';
      return;
    }
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    chatError.style.display = 'none';
    const data = Object.fromEntries(new FormData(form).entries());
    const attribution = HouzflowAttribution.get();
    try {
      await fetch(CONFIG.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'no-cors',
        body: JSON.stringify({ source: 'chat', ...data, ...attribution }),
      });
      if (typeof fbq !== 'undefined' && CONFIG.metaPixelId) {
        fbq('track', 'Lead', {}, { eventID: attribution.lead_event_id });
      }
      localStorage.setItem('gcr_chat_submitted', '1');
      chatBody.innerHTML = `
        <div class="chat-thanks">
          <div class="chat-thanks-emoji">🎉</div>
          <div class="chat-thanks-title">Thanks — we'll be in touch shortly.</div>
        </div>`;
      setTimeout(() => {
        panel.style.display = 'none';
        iconMsg.style.display = 'block';
        iconX.style.display = 'none';
      }, 3000);
    } catch {
      chatError.style.display = 'block';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    }
  });
}

// ── LEAD FORM BUILDER ─────────────────────────────────────────
// Hidden fields carrying Meta CAPI attribution data, injected into
// every lead form. Populated at submit time from HouzflowAttribution.
function attributionHiddenFieldsHTML() {
  return `
      <input type="hidden" name="utm_source" />
      <input type="hidden" name="utm_medium" />
      <input type="hidden" name="utm_campaign" />
      <input type="hidden" name="utm_content" />
      <input type="hidden" name="utm_term" />
      <input type="hidden" name="ad_id" />
      <input type="hidden" name="adset_id" />
      <input type="hidden" name="campaign_id" />
      <input type="hidden" name="fbclid" />
      <input type="hidden" name="fbp" />
      <input type="hidden" name="fbc" />
      <input type="hidden" name="source_url" />
      <input type="hidden" name="user_agent" />
      <input type="hidden" name="lead_event_id" />`;
}

// opts: { variant, defaultService, showMessage, showEmail, showCity }
function buildLeadForm(containerId, opts = {}) {
  const {
    variant = 'card',
    defaultService = '',
    showMessage = true,
    showEmail = false,
    showCity = false,
  } = opts;

  const serviceOptions = CONFIG.services.map(s =>
    `<option value="${s.slug}" ${s.slug === defaultService ? 'selected' : ''}>${s.name}</option>`
  ).join('');

  const cityOptions = CONFIG.serviceAreas.map(a =>
    `<option value="${a.slug}">${a.name}</option>`
  ).join('');

  const wrapClass = variant === 'card'
    ? 'lead-form-card'
    : 'lead-form-full';

  const html = `
  <div class="${wrapClass}" id="lead-form-wrap-${containerId}">
    <div class="lead-form-header">
      <div class="lead-form-title">Get a Free Quote</div>
      <div class="lead-form-sub">Tell us what you need and how to reach you.</div>
    </div>
    <div id="lead-form-success-${containerId}" class="lead-form-success" style="display:none">
      <div class="lead-form-success-icon">✅</div>
      <div class="lead-form-success-title">Quote request received!</div>
      <p class="lead-form-success-sub">A ${CONFIG.niche || 'service'} specialist will be in touch shortly.</p>
    </div>
    <form id="lead-form-${containerId}" class="lead-form-fields">
      <input required name="name" placeholder="Full Name" class="form-input" />
      <input required name="phone" type="tel" placeholder="Phone Number" class="form-input" />
      ${showEmail ? `<input required name="email" type="email" placeholder="Email Address" class="form-input" />` : ''}
      <select required name="service" class="form-select">
        <option value="" disabled ${!defaultService ? 'selected' : ''}>Type of Project</option>
        ${serviceOptions}
        <option value="other">Not Sure — Need Advice</option>
      </select>
      ${showCity ? `<select required name="city" class="form-select"><option value="" disabled selected>Your City</option>${cityOptions}</select>` : ''}
      <input name="project_details" placeholder="Project details (optional)" class="form-input" />
      ${showMessage ? `<textarea name="message" rows="3" placeholder="Tell us about your project (optional)" class="form-textarea"></textarea>` : ''}
      <!-- A2P SMS consent -->
      <label class="consent-label">
        <input type="checkbox" name="smsConsent" value="yes" class="consent-checkbox" />
        <span class="consent-text">
          I agree to receive SMS messages from ${CONFIG.businessName} about my quote and project.
          Message &amp; data rates may apply. Reply STOP to opt out. See our
          <a href="/privacy-policy.html" class="consent-link">Privacy Policy</a>.
        </span>
      </label>
      ${attributionHiddenFieldsHTML()}
      <div id="lead-form-error-${containerId}" class="form-error" style="display:none">Something went wrong. Please call us instead.</div>
      <button type="submit" class="btn-primary w-full" id="lead-submit-${containerId}">
        Get My Free Quote &rarr;
      </button>
      <p class="form-disclaimer">No pressure. Your information is handled according to our Privacy Policy.</p>
    </form>
  </div>`;

  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = html;
    initLeadForm(containerId);
  }
}

function initLeadForm(id) {
  const form = document.getElementById(`lead-form-${id}`);
  const success = document.getElementById(`lead-form-success-${id}`);
  const submitBtn = document.getElementById(`lead-submit-${id}`);
  const errorDiv = document.getElementById(`lead-form-error-${id}`);
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!CONFIG.webhookUrl) {
      errorDiv.innerHTML = `Online requests are not connected yet. Please call <a href="tel:${CONFIG.phoneRaw}">${CONFIG.phone}</a> or email <a href="mailto:${CONFIG.email}">${CONFIG.email}</a>.`;
      errorDiv.style.display = 'block';
      return;
    }
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    errorDiv.style.display = 'none';

    // Populate hidden attribution fields with the current session's data
    const attribution = HouzflowAttribution.get();
    Object.keys(attribution).forEach((key) => {
      const field = form.elements[key];
      if (field) field.value = attribution[key];
    });

    const data = Object.fromEntries(new FormData(form).entries());
    try {
      await fetch(CONFIG.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'no-cors',
        body: JSON.stringify({ source: 'lead-form', ...data }),
      });
      // Fire Meta Pixel Lead event, deduplicated against the server-side
      // CAPI Lead event via the shared lead_event_id.
      if (typeof fbq !== 'undefined' && CONFIG.metaPixelId) {
        fbq('track', 'Lead', {}, { eventID: attribution.lead_event_id });
      }
      await new Promise(r => setTimeout(r, 400));
      form.style.display = 'none';
      success.style.display = 'block';
    } catch {
      errorDiv.style.display = 'block';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Get My Free Quote →';
    }
  });
}

// ── FAQ ACCORDION ─────────────────────────────────────────────
function renderFAQs(containerId, faqs) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = `
    <div class="faq-list">
      ${faqs.map((f, i) => `
        <details class="faq-item" id="faq-${containerId}-${i}">
          <summary class="faq-summary">
            <span>${f.q}</span>
            <svg class="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </summary>
          <p class="faq-answer">${f.a}</p>
        </details>`).join('')}
    </div>`;
}

// ── SECTION HEADER ────────────────────────────────────────────
function sectionHeaderHTML({ eyebrow, title, subtitle, center = true, light = false }) {
  return `
  <div class="section-header ${center ? 'text-center' : ''}">
    ${eyebrow ? `<div class="section-eyebrow">${eyebrow}</div>` : ''}
    <h2 class="section-title ${light ? 'text-white' : 'text-navy'}">${title}</h2>
    ${subtitle ? `<p class="section-subtitle ${light ? 'text-white-80' : 'text-muted'}">${subtitle}</p>` : ''}
  </div>`;
}

// ── TRUST BAR ─────────────────────────────────────────────────
function renderTrustBar(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const items = [
    { svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="trust-icon"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 10h6M9 14h6"/></svg>`, label: "Redmond Showroom", sub: "See options in person" },
    { svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="trust-icon"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="9"/></svg>`, label: "Custom Measured", sub: "Specified for your space" },
    { svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="trust-icon"><path d="M4 20V10l8-6 8 6v10M8 20v-6h8v6"/></svg>`, label: "Residential", sub: "Windows, doors & glass" },
    { svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="trust-icon"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M8 20v-6h8v6"/></svg>`, label: "Commercial", sub: "Storefronts & interiors" },
  ];
  container.innerHTML = `
    <div class="trust-bar-inner">
      ${items.map(item => `
        <div class="trust-item">
          ${item.svg}
          <div>
            <div class="trust-label">${item.label}</div>
            <div class="trust-sub">${item.sub}</div>
          </div>
        </div>`).join('')}
    </div>`;
}

// ── CTA SECTION ───────────────────────────────────────────────
function ctaSectionHTML({ title, subtitle }) {
  return `
  <section class="cta-section">
    <div class="grid-overlay"></div>
    <div class="container-wide text-center cta-inner">
      <h2 class="cta-title">${title}</h2>
      ${subtitle ? `<p class="cta-subtitle">${subtitle}</p>` : ''}
      <div class="cta-btns">
        <a href="/contact.html" class="btn-primary btn-lg">Get My Free Quote</a>
        <a href="tel:${CONFIG.phoneRaw}" class="btn-outline btn-lg">
          <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.09 12a19.79 19.79 0 01-3-8.63A2 2 0 012.11 1.18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.27a16 16 0 006.29 6.29l1.45-1.45a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 15.36z"/></svg>
          Call ${CONFIG.phone}
        </a>
      </div>
    </div>
  </section>`;
}

// ── PROCESS STEPS ─────────────────────────────────────────────
function processStepsHTML(steps) {
  return `
  <div class="process-steps">
    <div class="process-connector"></div>
    ${steps.map((s, i) => `
      <div class="process-step">
        <div class="process-num">${i + 1}</div>
        <div class="process-step-title">${s.title}</div>
        <p class="process-step-desc">${s.desc}</p>
      </div>`).join('')}
  </div>`;
}

// ── MAP EMBED ─────────────────────────────────────────────────
function mapEmbedHTML(query) {
  // Use the explicit embed URL from CONFIG if provided, otherwise fall back to query-based embed
  const src = (CONFIG.googleMapsEmbedUrl && CONFIG.googleMapsEmbedUrl.trim())
    ? CONFIG.googleMapsEmbedUrl
    : `https://www.google.com/maps?q=${encodeURIComponent(query || CONFIG.city)}&output=embed`;
  return `
  <div class="map-wrap">
    <iframe
      title="Service area map"
      src="${src}"
      class="map-iframe"
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
      allowfullscreen
    ></iframe>
  </div>`;
}

// ── SERVICE CARD HTML ─────────────────────────────────────────
function serviceCardHTML(service) {
  return `
  <a href="/services/${service.slug}.html" class="service-card">
    <div class="service-card-img-wrap">
      <img src="${service.image}" alt="${service.name}" class="service-card-img" loading="lazy" />
      <div class="service-card-overlay"></div>
    </div>
    <div class="service-card-body">
      <div class="service-card-title">${service.name}</div>
      <p class="service-card-desc">${service.desc}</p>
      <div class="service-card-cta">
        Explore Service
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="arrow-icon"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </div>
    </div>
  </a>`;
}

// ── GRID OVERLAY (industrial dot/line background) ─────────────
function gridOverlayHTML() {
  return `<div class="grid-overlay"></div>`;
}

// ── SCROLL TO TOP on page load ────────────────────────────────
window.scrollTo(0, 0);

// ── INIT ALL ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  applyColorTokens();
  renderHeader();
  renderFooter();
  renderChatWidget();
});
