(function () {
  "use strict";

  const nav = document.getElementById("site-nav");
  const menuToggle = document.querySelector(".menu-toggle");
  const navGroup = document.querySelector(".nav-group");
  const navGroupButton = navGroup && navGroup.querySelector(":scope > button");

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(open));
    });
  }
  if (navGroupButton) {
    navGroupButton.addEventListener("click", () => {
      const open = navGroup.classList.toggle("open");
      navGroupButton.setAttribute("aria-expanded", String(open));
    });
  }

  const tracking = CONFIG.tracking || {};

  if (tracking.clarityProjectId) {
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", tracking.clarityProjectId);
  }

  if (tracking.metaPixelId) {
    (function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n;
      n.push = n; n.loaded = true; n.version = "2.0"; n.queue = [];
      t = b.createElement(e); t.async = true; t.src = v;
      s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    window.fbq("init", tracking.metaPixelId);
    window.fbq("track", "PageView");
  }

  function cookie(name) {
    const match = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/[.$?*|{}()[\]\\/+^]/g, "\\$&") + "=([^;]*)"));
    return match ? decodeURIComponent(match[1]) : "";
  }

  function eventId() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return "lead_" + Date.now() + "_" + Math.random().toString(36).slice(2);
  }

  const query = new URLSearchParams(location.search);
  const attributionKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "campaign_id", "adset_id", "ad_id"];
  const stored = JSON.parse(sessionStorage.getItem("elite_attribution") || "{}");
  attributionKeys.forEach(key => { if (query.get(key)) stored[key] = query.get(key); });
  if (!stored.landing_page) stored.landing_page = location.href;
  if (!stored.referrer) stored.referrer = document.referrer;
  sessionStorage.setItem("elite_attribution", JSON.stringify(stored));

  document.querySelectorAll("[data-lead-form]").forEach(form => {
    const idInput = form.querySelector('[name="lead_event_id"]');
    if (idInput) idInput.value = eventId();

    form.addEventListener("submit", async event => {
      event.preventDefault();
      const status = form.querySelector(".form-status");
      const button = form.querySelector('button[type="submit"]');
      if (!tracking.leadEndpoint) {
        status.className = "form-status error";
        status.innerHTML = `Online requests are not connected yet. Please call <a href="tel:${CONFIG.phoneRaw}">${CONFIG.phone}</a> or email <a href="mailto:${CONFIG.email}">${CONFIG.email}</a>.`;
        return;
      }

      button.disabled = true;
      status.className = "form-status";
      status.textContent = "Sending your request…";
      const data = Object.fromEntries(new FormData(form).entries());
      const leadEventId = data.lead_event_id || eventId();
      const payload = {
        event_name: "Lead",
        event_id: leadEventId,
        event_time: Math.floor(Date.now() / 1000),
        event_source_url: location.href,
        source: "website",
        user_agent: navigator.userAgent,
        fbp: cookie("_fbp"),
        fbc: cookie("_fbc") || (stored.fbclid ? `fb.1.${Date.now()}.${stored.fbclid}` : ""),
        ...stored,
        ...data
      };

      try {
        const response = await fetch(tracking.leadEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error(`Request failed with ${response.status}`);
        if (window.fbq && tracking.metaPixelId) window.fbq("track", "Lead", {}, { eventID: leadEventId });
        if (window.clarity && tracking.clarityProjectId) window.clarity("event", "lead_submitted");
        form.reset();
        if (idInput) idInput.value = eventId();
        status.className = "form-status success";
        status.textContent = "Thank you. Your request was sent and the team will follow up shortly.";
      } catch (error) {
        status.className = "form-status error";
        status.innerHTML = `We could not send this request. Please call <a href="tel:${CONFIG.phoneRaw}">${CONFIG.phone}</a> or email <a href="mailto:${CONFIG.email}">${CONFIG.email}</a>.`;
      } finally {
        button.disabled = false;
      }
    });
  });
})();
