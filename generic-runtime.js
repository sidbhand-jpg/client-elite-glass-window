/* Glass and window content layer for the shared Houzflow website template. */
(() => {
  const niche = CONFIG.niche || 'Home Services';
  const serviceNames = () => CONFIG.services.map(s => s.name).join(', ');
  const setHeader = (id, eyebrow, title, subtitle = '') => {
    const node = document.getElementById(id);
    if (node) node.innerHTML = sectionHeaderHTML({ eyebrow, title, subtitle });
  };

  document.addEventListener('DOMContentLoaded', () => setTimeout(() => {
    document.querySelectorAll('[data-generic-niche]').forEach(node => { node.textContent = niche; });

    if (document.getElementById('hero-headline')) {
      document.title = `Glass Replacement & Window Company in Redmond, WA | ${CONFIG.businessName}`;
      document.querySelector('meta[name="description"]').setAttribute('content', `${CONFIG.businessName} provides windows, shower doors, custom glass, railings, mirrors, doors, and storefront glass throughout Greater Seattle.`);
      const ogTitle = document.querySelector('meta[property="og:title"]');
      const ogDescription = document.querySelector('meta[property="og:description"]');
      if (ogTitle) ogTitle.setAttribute('content', `${CONFIG.businessName} | ${niche}`);
      if (ogDescription) ogDescription.setAttribute('content', `Professional ${niche.toLowerCase()} in ${CONFIG.city}.`);
      const heroImage = document.getElementById('hero-img');
      if (heroImage) heroImage.alt = `${niche} professional at work`;
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
      setHeader('diff-section-header', 'The standard we work to', 'Professional service, without the runaround.');
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
      document.title = `${niche} in ${area.name}, ${CONFIG.stateShort} | ${CONFIG.businessName}`;
      document.querySelector('meta[name="description"]').setAttribute('content', `${CONFIG.businessName} provides ${niche.toLowerCase()} services in ${area.name}, ${CONFIG.stateShort}. Request a free estimate today.`);
      document.getElementById('city-headline').innerHTML = `${niche} in <span style="color:var(--color-primary)">${area.name}</span>`;
      document.getElementById('city-sub').innerHTML = `Professional ${niche.toLowerCase()} for ${area.name} homeowners and businesses. Clear communication, dependable scheduling, and a team that respects your property.`;
      document.getElementById('city-why-grid').innerHTML = [
        `Redmond-based team serving ${area.name}`, 'Residential and commercial glass expertise', 'Clear estimates and practical recommendations', 'Custom measurement and product guidance', 'Professional installation and final walkthrough',
      ].map(item => `<div class="city-why-item"><span>${item}</span></div>`).join('');
      document.getElementById('city-map').innerHTML = mapEmbedHTML(`${area.name} ${CONFIG.stateShort} ${niche}`);
      const faqs = [
        { q: `Do you serve ${area.name}?`, a: `Yes. ${CONFIG.businessName} serves ${area.name} and the surrounding area.` },
        { q: `Which services are available?`, a: `We provide ${serviceNames()} and can recommend the right option for your project.` },
        { q: 'How do I get an estimate?', a: `Contact us to discuss your project and schedule a convenient estimate.` },
        { q: 'What should I expect?', a: 'You can expect a clear scope, professional communication, and a final walkthrough.' },
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
