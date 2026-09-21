/* Glass and window content layer for the shared Houzflow website template. */
(() => {
  const niche = CONFIG.niche || 'Home Services';
  const serviceNames = () => CONFIG.services.map(s => s.name).join(', ');
  const setHeader = (id, eyebrow, title, subtitle = '', light = false) => {
    const node = document.getElementById(id);
    if (node) node.innerHTML = sectionHeaderHTML({ eyebrow, title, subtitle, light });
  };

  document.addEventListener('DOMContentLoaded', () => setTimeout(() => {
    document.querySelectorAll('[data-generic-niche]').forEach(node => { node.textContent = niche; });

    if (document.getElementById('hero-headline')) {
      document.title = `Glass Replacement & Window Company in Redmond, WA | ${CONFIG.businessName}`;
      document.querySelector('meta[name="description"]').setAttribute('content', `${CONFIG.businessName} provides windows, shower doors, custom glass, railings, mirrors, doors, and storefront glass throughout Greater Seattle.`);
      const heroImage = document.getElementById('hero-img');
      if (heroImage) heroImage.alt = `Modern home featuring custom windows and glass doors`;
      document.querySelector('.hero-bullets').innerHTML = [
        'Clear communication from first call to final walkthrough',
        'Experienced local professionals who respect your property',
        'Straightforward estimates with no pressure',
      ].map(text => `<li class="hero-bullet"><svg class="bullet-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>${text}</li>`).join('');
      setHeader('why-section-header', 'Why choose us', `A better ${niche.toLowerCase()} experience.`, 'We combine helpful expertise, reliable scheduling, and workmanship you can feel confident about.');
      document.querySelector('.comparison-grid').innerHTML = `
        <div class="comparison-card comparison-bad"><div class="comparison-label"><span>✕</span> The frustrating way</div><ul class="comparison-points"><li><span class="dot dot-bad"></span>Vague timelines</li><li><span class="dot dot-bad"></span>Surprise changes</li><li><span class="dot dot-bad"></span>Poor communication</li><li><span class="dot dot-bad"></span>Rushed work</li></ul></div>
        <div class="comparison-card comparison-good"><div class="comparison-label"><span>✓</span> Our approach</div><ul class="comparison-points"><li><span class="dot dot-good"></span>Clear plan from the start</li><li><span class="dot dot-good"></span>Honest recommendations</li><li><span class="dot dot-good"></span>Responsive local team</li><li><span class="dot dot-good"></span>Careful final walkthrough</li></ul></div>`;
      setHeader('services-section-header', 'What we do', `${niche} services for your property.`, `Explore the services ${CONFIG.businessName} provides in ${CONFIG.city}.`);
      setHeader('diff-section-header', 'The standard we work to', 'Professional service, without the runaround.', '', true);
      const diff = document.querySelector('.diff-grid');
      if (diff) diff.innerHTML = [
        ['Clear communication', 'You always know what happens next and who to contact.'],
        ['Respect for your property', 'We arrive prepared, work carefully, and leave the site tidy.'],
        ['Dependable scheduling', 'We set realistic expectations and keep you informed.'],
        ['Work we stand behind', 'Your satisfaction matters from the estimate through the walkthrough.'],
      ].map(([title, desc]) => `<div class="diff-card"><div class="diff-title">${title}</div><p class="diff-desc">${desc}</p></div>`).join('');
      setHeader('areas-section-header', 'Where we work', `Proudly serving ${CONFIG.city} and nearby communities.`, 'Select a service area to learn more, or contact us to confirm availability.');
      setHeader('faq-section-header', 'Questions answered', `Common ${niche.toLowerCase()} questions.`);
    }

    const area = (() => {
      const slug = location.pathname.split('/').pop().replace('.html', '');
      return CONFIG.serviceAreas.find(item => item.slug === slug);
    })();
    if (area && document.getElementById('city-headline')) {
      const profile = CONFIG.citySeo[area.slug];
      document.title = `Glass & Window Services in ${area.name}, WA | ${CONFIG.businessName}`;
      document.querySelector('meta[name="description"]').setAttribute('content', `Custom windows, shower doors, glass replacement, railings, mirrors, doors, and storefront glass for ${area.name}, WA. Free project consultations.`);
      document.getElementById('city-headline').innerHTML = `Glass &amp; Window Services in <span style="color:var(--color-primary)">${area.name}</span>`;
      document.getElementById('city-sub').innerHTML = `Custom-measured glass, windows, doors, showers, mirrors, railings, and commercial solutions for ${area.name} homes and businesses.`;
      document.getElementById('city-why-grid').innerHTML = [
        `Redmond-based team serving ${area.name}`, 'Residential and commercial glass expertise', 'Clear estimates and practical recommendations', 'Custom measurement and product guidance', 'Professional installation and final walkthrough',
      ].map(item => `<div class="city-why-item"><span>${item}</span></div>`).join('');
      document.getElementById('city-map').innerHTML = mapEmbedHTML(`${area.name} ${CONFIG.stateShort} ${niche}`);
      const faqs = [
        { q: `Do you serve ${area.name}?`, a: `Yes. ${area.name} is within the listed Greater Seattle service area. Availability depends on the project type, address, and schedule.` },
        { q: `Which services are available in ${area.name}?`, a: `Services include ${serviceNames()} for residential and commercial properties.` },
        { q: `How do I request an estimate in ${area.name}?`, a: `Share the address, product or glass type, approximate dimensions, photos, and any timeline constraints. Final custom fabrication requires verified measurements.` },
        { q: 'Where is the showroom?', a: `The showroom is at ${CONFIG.address}. Contact the team before visiting to confirm current hours.` },
        { q: `Where can I check permit requirements for a ${area.name} project?`, a: `Requirements depend on the property and scope. Check current guidance from ${profile.authority} before work that changes an opening, egress, a guard, structure, or the exterior envelope.` },
      ];
      setHeader('city-faq-header', `${area.name} FAQ`, `${niche} questions from ${area.name} customers`);
      renderFAQs('city-faq-container', faqs);
      document.getElementById('city-cta').innerHTML = ctaSectionHTML({ title: `Ready to get started in ${area.name}?`, subtitle: `Request a clear, no-pressure estimate from ${CONFIG.businessName}.` });
    }

    if (document.getElementById('about-headline')) {
      document.title = `About ${CONFIG.businessName} | ${niche}`;
      document.querySelector('meta[name="description"]').setAttribute('content', `Learn about ${CONFIG.businessName}, a local ${niche.toLowerCase()} team serving ${CONFIG.city}.`);
      document.getElementById('about-headline').textContent = `A local team that puts your project first.`;
      const prose = document.querySelector('.about-prose');
      if (prose) prose.innerHTML = `<p>${CONFIG.businessName} was founded to make custom glass solutions easier and more transparent for homes and businesses throughout Greater Seattle.</p><p>From windows and doors to shower enclosures, railings, mirrors, storefronts, and specialty glass, each project begins with the space, the intended use, and the right product specification.</p><p>Visit our Redmond showroom to compare available options or schedule an on-site consultation when final field measurements are required.</p>`;
      const values = document.querySelector('.values-grid');
      if (values) values.innerHTML = [['Clear communication', 'We explain the plan and keep you informed.'], ['Respect for your property', 'We work carefully and leave your space tidy.'], ['Professional standards', 'We bring the experience and attention your project deserves.']].map(([title, desc]) => `<div class="value-card"><div class="value-title">${title}</div><p class="value-desc">${desc}</p></div>`).join('');
    }
  }, 0));
})();
