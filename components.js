// ============================================================
// SHARED COMPONENTS — Header, Footer, LeadForm, ChatWidget
// Included on every page via <script src="../components.js">
// ============================================================

// Load Clarity after the visitor interacts so analytics does not delay the
// initial render or create third-party storage during a no-interaction visit.
if (CONFIG.clarityProjectId) {
  const loadClarity = () => {
    if (window.clarity) return;
    (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", CONFIG.clarityProjectId);
  };
  addEventListener('pointerdown', loadClarity, { once: true, passive: true });
  addEventListener('keydown', loadClarity, { once: true, passive: true });
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
      page_path: window.location.pathname,
      referrer_url: document.referrer || '',
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

function isChatOnlyMode() {
  return CONFIG.leadCaptureMode !== 'all_forms';
}

function getSubmissionId() {
  const key = 'elite_glass_submission_id';
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `00000000-0000-4000-8000-${Date.now().toString(16).padStart(12, '0').slice(-12)}`;
    sessionStorage.setItem(key, id);
  }
  return id;
}

function consentDisclosureHTML(idPrefix) {
  return `
    <label class="consent-label" for="${idPrefix}-sms-consent">
      <input type="checkbox" id="${idPrefix}-sms-consent" name="sms_consent" value="true" class="consent-checkbox" />
      <span class="consent-text">
        By checking this box, I agree to receive project-related SMS messages from ${CONFIG.businessName}.
        Message frequency varies. Message and data rates may apply. Reply STOP to opt out or HELP for help.
        Consent is not a condition of purchase. See our
        <a href="/privacy-policy.html" class="consent-link">Privacy Policy</a> and
        <a href="/terms.html" class="consent-link">Terms &amp; Conditions</a>.
      </span>
    </label>`;
}

async function postLead(payload) {
  const response = await fetch(CONFIG.leadCapture.endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify(payload),
  });
  let result = {};
  try { result = await response.json(); } catch { /* generic error below */ }
  if (!response.ok || !result.ok) {
    const error = new Error(result.message || 'Unable to submit your request.');
    error.code = result.code || 'submission_failed';
    error.fields = result.fields || {};
    throw error;
  }
  return result;
}


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
        <a href="/contact.html" class="nav-link" data-lead-cta data-original-href="/contact.html">Contact</a>
      </nav>

      <!-- Desktop CTA -->
      <div class="header-cta">
        <a href="tel:${CONFIG.phoneRaw}" class="btn-phone" data-lead-cta data-original-href="tel:${CONFIG.phoneRaw}">
          <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.09 12a19.79 19.79 0 01-3-8.63A2 2 0 012.11 1.18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.27a16 16 0 006.29 6.29l1.45-1.45a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 15.36z"/></svg>
          ${CONFIG.phone}
        </a>
        <a href="/contact.html" class="btn-primary-sm" data-lead-cta data-original-href="/contact.html">Free Quote</a>
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
        <a href="/contact.html" class="mobile-nav-link border-top" data-lead-cta data-original-href="/contact.html">Contact</a>

        <div class="mobile-cta-row">
          <a href="tel:${CONFIG.phoneRaw}" class="btn-phone w-full justify-center" data-lead-cta data-original-href="tel:${CONFIG.phoneRaw}">
            <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.09 12a19.79 19.79 0 01-3-8.63A2 2 0 012.11 1.18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.27a16 16 0 006.29 6.29l1.45-1.45a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 15.36z"/></svg>
            ${CONFIG.phone}
          </a>
          <a href="/contact.html" class="btn-primary w-full text-center" data-lead-cta data-original-href="/contact.html">Get Free Quote</a>
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
    googleBusiness: { label: 'Google Business Profile', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1116 0z"/><circle cx="12" cy="10" r="2.5"/></svg>' },
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
          ${CONFIG.licenseNumber ? `<div>License #${CONFIG.licenseNumber}</div>` : ''}
          <div>Licensed &amp; Insured in ${CONFIG.state}</div>
        </div>
      </div>

      <!-- Company column -->
      <div class="footer-col">
        <div class="footer-col-title">Company</div>
        <ul class="footer-links">
          <li><a href="/about.html">About Us</a></li>
          <li><a href="/our-work.html">Our Work</a></li>
          <li><a href="/contact.html" data-lead-cta data-original-href="/contact.html">Contact</a></li>
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
      <div class="container-wide footer-attribution">
        Website Design &amp; Marketing by <a href="https://houzflow.com" target="_blank" rel="noopener">HouzFlow</a>
      </div>
    </div>
  </footer>`;

  document.body.insertAdjacentHTML('beforeend', html);
  document.getElementById('footer-year').textContent = new Date().getFullYear();
}

// ── LEAD FORM BUILDER ─────────────────────────────────────────
// Hidden fields carrying Meta CAPI attribution data, injected into
// every lead form. Populated at submit time from HouzflowAttribution.
// Accessible, multi-step chat used as the only active form while A2P is pending.
function renderProjectChat() {
  const serviceOptions = CONFIG.services.map(service => `<option value="${service.slug}">${service.name}</option>`).join('');
  const turnstile = CONFIG.leadCapture.turnstileSiteKey ? `<div class="cf-turnstile" data-sitekey="${CONFIG.leadCapture.turnstileSiteKey}" data-theme="light"></div>` : '';
  document.body.insertAdjacentHTML('beforeend', `
    <div class="chat-widget" id="chat-widget">
      <div class="chat-panel" id="chat-panel" role="dialog" aria-modal="true" aria-labelledby="chat-dialog-title" aria-describedby="chat-dialog-description" hidden>
        <div class="chat-header">
          <div><div class="chat-header-title" id="chat-dialog-title">Tell Us About Your Project</div><div class="chat-header-sub">Free project consultation</div></div>
          <button class="chat-close" id="chat-close-btn" type="button" aria-label="Close project chat"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon-md"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
        </div>
        <div class="chat-body" id="chat-body">
          <form id="chat-form" class="chat-form" novalidate>
            <p class="chat-intro" id="chat-dialog-description">Share a few details so the right glass specialist can follow up.</p>
            <div class="chat-progress" aria-label="Form progress"><span id="chat-progress-text">Step 1 of 3</span><div class="chat-progress-track" aria-hidden="true"><span id="chat-progress-bar"></span></div></div>
            <fieldset class="chat-step" data-chat-step="0">
              <legend>How can we reach you?</legend>
              <label class="form-label" for="chat-full-name">Full name <span aria-hidden="true">*</span></label><input required id="chat-full-name" name="full_name" autocomplete="name" maxlength="100" class="form-input" />
              <label class="form-label" for="chat-phone">Phone number <span aria-hidden="true">*</span></label><input required id="chat-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" maxlength="30" class="form-input" aria-describedby="chat-phone-help" /><small id="chat-phone-help" class="form-help">Use a US phone number, including area code.</small>
              <label class="form-label" for="chat-email">Email address <span class="form-optional">optional</span></label><input id="chat-email" name="email" type="email" autocomplete="email" maxlength="254" class="form-input" />
            </fieldset>
            <fieldset class="chat-step" data-chat-step="1" hidden>
              <legend>What are you planning?</legend>
              <label class="form-label" for="chat-postal-code">Project ZIP code <span aria-hidden="true">*</span></label><input required id="chat-postal-code" name="postal_code" autocomplete="postal-code" inputmode="numeric" pattern="[0-9]{5}(-[0-9]{4})?" maxlength="10" class="form-input" />
              <label class="form-label" for="chat-project-type">Project type <span aria-hidden="true">*</span></label><select required id="chat-project-type" name="project_type" class="form-select"><option value="">Choose a project</option>${serviceOptions}<option value="other">Not sure yet</option></select>
              <label class="form-label" for="chat-property-type">Property type <span aria-hidden="true">*</span></label><select required id="chat-property-type" name="property_type" class="form-select"><option value="">Choose a property type</option><option value="residential">Residential</option><option value="commercial">Commercial</option><option value="other">Other / not sure</option></select>
              <label class="form-label" for="chat-timeline">Timeline <span aria-hidden="true">*</span></label><select required id="chat-timeline" name="timeline" class="form-select"><option value="">Choose a timeline</option><option value="as-soon-as-practical">As soon as practical</option><option value="one-to-three-months">1–3 months</option><option value="three-plus-months">3+ months</option><option value="researching">Researching options</option></select>
            </fieldset>
            <fieldset class="chat-step" data-chat-step="2" hidden>
              <legend>Project details and contact consent</legend>
              <label class="form-label" for="chat-project-summary">Tell us about the project <span aria-hidden="true">*</span></label><textarea required id="chat-project-summary" name="project_summary" rows="4" minlength="10" maxlength="2000" class="form-textarea" placeholder="What needs to be repaired, replaced, or created?"></textarea>
              ${consentDisclosureHTML('chat')}
              <div class="form-honeypot" aria-hidden="true"><label for="chat-company-website">Company website</label><input id="chat-company-website" name="company_website" tabindex="-1" autocomplete="off" /></div>
              <input type="hidden" name="form_started_at" value="${Date.now()}" />${turnstile}
            </fieldset>
            <div id="chat-error" class="form-error" role="alert" aria-live="assertive" hidden></div><div id="chat-status" class="sr-only" role="status" aria-live="polite"></div>
            <div class="chat-actions"><button type="button" class="chat-back" id="chat-back-btn" hidden>Back</button><button type="button" class="btn-primary w-full" id="chat-next-btn">Continue</button><button type="submit" class="btn-primary w-full" id="chat-submit-btn" hidden>Send My Project Details</button></div>
          </form>
        </div>
      </div>
      <button class="chat-fab" id="chat-fab" type="button" aria-label="Open project chat" aria-haspopup="dialog" aria-controls="chat-panel" aria-expanded="false"><svg id="chat-icon-msg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon-lg"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg><svg id="chat-icon-x" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon-lg" hidden><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
    </div>`);
  initProjectChat();
}

function initProjectChat() {
  const fab = document.getElementById('chat-fab');
  const panel = document.getElementById('chat-panel');
  const closeBtn = document.getElementById('chat-close-btn');
  const iconMsg = document.getElementById('chat-icon-msg');
  const iconX = document.getElementById('chat-icon-x');
  const form = document.getElementById('chat-form');
  const submitBtn = document.getElementById('chat-submit-btn');
  const chatBody = document.getElementById('chat-body');
  const chatError = document.getElementById('chat-error');
  const status = document.getElementById('chat-status');
  const nextBtn = document.getElementById('chat-next-btn');
  const backBtn = document.getElementById('chat-back-btn');
  const steps = Array.from(form.querySelectorAll('[data-chat-step]'));
  const progressText = document.getElementById('chat-progress-text');
  const progressBar = document.getElementById('chat-progress-bar');
  let currentStep = 0;
  let returnFocus = fab;
  if (localStorage.getItem('elite_glass_chat_submitted') === '1') form.innerHTML = '<p class="text-center text-muted" style="padding:1rem">We already have your project details. A team member will follow up.</p>';
  function setStep(index) {
    if (!steps.length) return;
    currentStep = Math.max(0, Math.min(index, steps.length - 1));
    steps.forEach((step, stepIndex) => { step.hidden = stepIndex !== currentStep; });
    progressText.textContent = `Step ${currentStep + 1} of ${steps.length}`; progressBar.style.width = `${((currentStep + 1) / steps.length) * 100}%`;
    backBtn.hidden = currentStep === 0; nextBtn.hidden = currentStep === steps.length - 1; submitBtn.hidden = currentStep !== steps.length - 1;
    const firstField = steps[currentStep].querySelector('input:not([type="hidden"]), select, textarea'); if (!panel.hidden && firstField) firstField.focus();
  }
  function openPanel(trigger = document.activeElement) {
    returnFocus = trigger instanceof HTMLElement ? trigger : fab; panel.hidden = false; fab.setAttribute('aria-expanded', 'true'); iconMsg.hidden = true; iconX.hidden = false; document.body.classList.add('chat-open'); setStep(currentStep);
  }
  function closePanel() {
    panel.hidden = true; fab.setAttribute('aria-expanded', 'false'); iconMsg.hidden = false; iconX.hidden = true; document.body.classList.remove('chat-open'); if (returnFocus && document.contains(returnFocus)) returnFocus.focus();
  }
  window.openLeadChat = openPanel;
  fab.addEventListener('click', () => panel.hidden ? openPanel(fab) : closePanel()); closeBtn.addEventListener('click', closePanel);
  document.addEventListener('mousedown', event => { if (!panel.hidden && !document.getElementById('chat-widget').contains(event.target)) closePanel(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !panel.hidden) closePanel();
    if (event.key !== 'Tab' || panel.hidden) return;
    const focusable = Array.from(panel.querySelectorAll('button:not([hidden]), input:not([type="hidden"]), select, textarea, a[href]')).filter(element => !element.disabled && element.offsetParent !== null);
    if (!focusable.length) return; const first = focusable[0]; const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  nextBtn.addEventListener('click', () => {
    const invalid = Array.from(steps[currentStep].querySelectorAll('input, select, textarea')).find(field => field.type !== 'hidden' && !field.checkValidity());
    if (invalid) { invalid.reportValidity(); invalid.focus(); return; } setStep(currentStep + 1);
  });
  backBtn.addEventListener('click', () => setStep(currentStep - 1));
  form.addEventListener('submit', async event => {
    event.preventDefault(); if (!form.checkValidity()) { form.reportValidity(); return; }
    submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; chatError.hidden = true; status.textContent = 'Sending your project details.';
    const data = Object.fromEntries(new FormData(form).entries()); const attribution = HouzflowAttribution.get();
    try {
      await postLead({ source: 'website_chat', submission_id: getSubmissionId(), full_name: data.full_name, phone: data.phone, email: data.email || '', postal_code: data.postal_code, project_type: data.project_type, property_type: data.property_type, project_summary: data.project_summary, timeline: data.timeline, sms_consent: form.elements.sms_consent.checked, company_website: data.company_website || '', form_started_at: Number(data.form_started_at), turnstile_token: data['cf-turnstile-response'] || '', ...attribution });
      if (typeof fbq !== 'undefined' && CONFIG.metaPixelId) fbq('track', 'Lead', {}, { eventID: attribution.lead_event_id });
      localStorage.setItem('elite_glass_chat_submitted', '1'); sessionStorage.removeItem('elite_glass_submission_id');
      chatBody.innerHTML = '<div class="chat-thanks"><svg class="chat-thanks-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg><div class="chat-thanks-title">Thanks — your project details were received.</div><p class="chat-intro">A team member will review the information and follow up.</p></div>';
      setTimeout(closePanel, 4500);
    } catch {
      chatError.innerHTML = `We could not send this request. Please try again or call <a href="tel:${CONFIG.phoneRaw}">${CONFIG.phone}</a>.`; chatError.hidden = false; status.textContent = 'Your request was not sent.'; submitBtn.disabled = false; submitBtn.textContent = 'Send My Project Details';
    }
  });
  setStep(0);
  if (CONFIG.leadCapture.turnstileSiteKey) { const script = document.createElement('script'); script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'; script.async = true; script.defer = true; script.dataset.turnstileLoader = 'true'; document.head.appendChild(script); }
  setTimeout(() => { fab.classList.add('chat-bounce'); setTimeout(() => fab.classList.remove('chat-bounce'), 1100); }, 2000);
}

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
  const container = document.getElementById(containerId);
  if (!container) return;

  if (isChatOnlyMode()) {
    container.innerHTML = `
      <div class="inline-estimate-cta">
        <a href="/contact.html" class="btn-primary btn-lg" data-lead-cta data-original-href="/contact.html">Get Free Estimate</a>
      </div>`;
    return;
  }

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
    <form id="lead-form-${containerId}" class="lead-form-fields" novalidate>
      <label class="sr-only" for="${containerId}-name">Full name</label><input required id="${containerId}-name" name="name" autocomplete="name" maxlength="100" placeholder="Full Name" class="form-input" />
      <label class="sr-only" for="${containerId}-phone">Phone number</label><input required id="${containerId}-phone" name="phone" type="tel" autocomplete="tel" maxlength="30" placeholder="Phone Number" class="form-input" />
      ${showEmail ? `<label class="sr-only" for="${containerId}-email">Email address</label><input id="${containerId}-email" name="email" type="email" autocomplete="email" maxlength="254" placeholder="Email Address (optional)" class="form-input" />` : ''}
      <label class="sr-only" for="${containerId}-service">Type of project</label><select required id="${containerId}-service" name="service" class="form-select">
        <option value="" disabled ${!defaultService ? 'selected' : ''}>Type of Project</option>
        ${serviceOptions}
        <option value="other">Not Sure — Need Advice</option>
      </select>
      <label class="sr-only" for="${containerId}-postal-code">Project ZIP code</label><input required id="${containerId}-postal-code" name="postal_code" autocomplete="postal-code" inputmode="numeric" pattern="[0-9]{5}(-[0-9]{4})?" maxlength="10" placeholder="Project ZIP Code" class="form-input" />
      ${showCity ? `<label class="sr-only" for="${containerId}-city">Service area</label><select id="${containerId}-city" name="city" class="form-select"><option value="" selected>Service Area (optional)</option>${cityOptions}</select>` : ''}
      <label class="sr-only" for="${containerId}-property-type">Property type</label><select required id="${containerId}-property-type" name="property_type" class="form-select"><option value="">Property Type</option><option value="residential">Residential</option><option value="commercial">Commercial</option><option value="other">Other / not sure</option></select>
      <input name="project_details" placeholder="Project details (optional)" class="form-input" />
      ${showMessage ? `<textarea name="message" rows="3" placeholder="Tell us about your project (optional)" class="form-textarea"></textarea>` : ''}
      ${consentDisclosureHTML(containerId)}
      ${attributionHiddenFieldsHTML()}
      <div id="lead-form-error-${containerId}" class="form-error" style="display:none">Something went wrong. Please call us instead.</div>
      <button type="submit" class="btn-primary w-full" id="lead-submit-${containerId}">
        Get My Free Quote &rarr;
      </button>
      <p class="form-disclaimer">No pressure. Your information is handled according to our Privacy Policy.</p>
    </form>
  </div>`;

  container.innerHTML = html;
  initLeadForm(containerId);
}

function initLeadForm(id) {
  const form = document.getElementById(`lead-form-${id}`);
  const success = document.getElementById(`lead-form-success-${id}`);
  const submitBtn = document.getElementById(`lead-submit-${id}`);
  const errorDiv = document.getElementById(`lead-form-error-${id}`);
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
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
      await postLead({
        source: 'website_form',
        submission_id: getSubmissionId(),
        full_name: data.name,
        phone: data.phone,
        email: data.email || '',
        postal_code: data.postal_code,
        project_type: data.service,
        property_type: data.property_type,
        project_summary: data.message || data.project_details || 'Website quote request',
        timeline: 'not-provided',
        sms_consent: form.elements.sms_consent.checked,
        form_started_at: Date.now() - 3000,
        ...attribution,
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
        <a href="/contact.html" class="btn-primary btn-lg" data-lead-cta data-original-href="/contact.html">Get My Free Quote</a>
        <a href="tel:${CONFIG.phoneRaw}" class="btn-outline btn-lg" data-lead-cta data-original-href="tel:${CONFIG.phoneRaw}">
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
  const mapQuery = query || `${CONFIG.businessName} ${CONFIG.address}`;
  const href = CONFIG.googleMapsSearchUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;
  return `
  <div class="map-link-card">
    <div>
      <strong>Serving Greater Seattle from our Redmond showroom</strong>
      <p>Confirm availability for your address and project type.</p>
    </div>
    <a class="btn-outline" href="${href}" target="_blank" rel="noopener noreferrer">Open service area in Google Maps</a>
  </div>`;
}

// ── SERVICE CARD HTML ─────────────────────────────────────────
function serviceCardHTML(service) {
  const image640 = service.image.replace('-960.webp', '-640.webp');
  return `
  <a href="/services/${service.slug}.html" class="service-card">
    <div class="service-card-img-wrap">
      <img src="${service.image}" srcset="${image640} 640w, ${service.image} 960w" sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw" width="960" height="640" alt="${service.name} project by ${CONFIG.businessName}" class="service-card-img" loading="lazy" decoding="async" />
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

function initLeadCaptureMode() {
  document.documentElement.dataset.leadCaptureMode = CONFIG.leadCaptureMode;
  document.addEventListener('click', event => {
    const trigger = event.target.closest('[data-lead-cta]');
    if (!trigger || !isChatOnlyMode()) return;
    event.preventDefault();
    const drawer = document.getElementById('mobile-drawer');
    if (drawer) drawer.style.display = 'none';
    window.openLeadChat?.(trigger);
  });
}

// ── INIT ALL ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  applyColorTokens();
  renderHeader();
  renderFooter();
  renderProjectChat();
  initLeadCaptureMode();
});
