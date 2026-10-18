/* Egyptian Cement v12 · motion layer: Lenis smooth scroll + GSAP ScrollTrigger.
   Vendored: gsap 3.15.0, ScrollTrigger 3.15.0, lenis 1.3.27 (assets/js/vendor). */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!window.gsap || !window.ScrollTrigger || !window.Lenis || reduce) return;
  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.style.scrollBehavior = 'auto';

  // ---- Lenis smooth scroll, driven by GSAP's ticker so ScrollTrigger stays in sync
  const lenis = new Lenis({
    duration: 1.1,
    easing: t => 1 - Math.pow(1 - t, 4),
    smoothWheel: true,
    prevent: n => !!(n.closest && n.closest('.v3d, dialog, #fly, .scar .strip, .ggrid, iframe, #hdr .menu, [data-lenis-prevent]'))
  });
  window.ecLenis = lenis;
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  // in-page anchors glide with Lenis (header height offset)
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || a.hasAttribute('data-dlg') || a.hasAttribute('data-toast')) return;
    const id = a.getAttribute('href'); if (id.length < 2) return;
    const el = document.querySelector(id); if (!el) return;
    e.preventDefault(); lenis.scrollTo(el, { offset: -76, duration: 1.3 });
  });
  // pause smooth scroll while dialogs / 3D viewer are open
  const mo = new MutationObserver(() => {
    const open = document.querySelector('dialog[open]') || document.documentElement.classList.contains('v3lock');
    open ? lenis.stop() : lenis.start();
  });
  mo.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['open'] });
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

  // ---- scroll-linked depth on the big photo sections (transform only)
  const par = (sel, from, to) => document.querySelectorAll(sel).forEach(img => {
    gsap.fromTo(img, { yPercent: from }, { yPercent: to, ease: 'none',
      scrollTrigger: { trigger: img.closest('section') || img, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  par('#partners .pis-bg', -8, 8);

  // project tiles: gentle stagger as the wall enters
  const tiles = gsap.utils.toArray('#pisWall .pj');
  const run = els => ({ onStart: () => els.forEach(e => e.classList.add('gs-run')), onComplete: () => { els.forEach(e => e.classList.remove('gs-run')); gsap.set(els, { clearProps: 'transform,opacity' }); } });
  if (tiles.length) gsap.from(tiles, { y: 26, opacity: 0, duration: .8, ease: 'power3.out', stagger: .06, ...run(tiles),
    scrollTrigger: { trigger: '#pisWall', start: 'top 82%', once: true } });

  // certificates: seal pops in
  const seals = gsap.utils.toArray('#certList .cert');
  if (seals.length) gsap.from(seals, { y: 18, opacity: 0, duration: .7, ease: 'power3.out', stagger: .08, ...run(seals),
    scrollTrigger: { trigger: '#certList', start: 'top 85%', once: true } });

  addEventListener('load', () => ScrollTrigger.refresh());
})();
