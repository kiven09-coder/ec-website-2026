/* Egyptian Cement · products (v13.1)
   Official 2D bag mockups + descriptions from "EC Products.pdf".
   ECP.open(key) opens the product sheet; ECP.data holds the copy (AR/EN). */
(function () {
  const AR = () => document.documentElement.lang !== 'en';
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const OPC_D_AR = 'يستخدم في جميع أعمال البناء التي تتطلب ضغوطاً عالية للكسر المبكر (مثل الحاجة إلى فك الشدات في وقت مبكر)، مثل الجسور والأنفاق والأرضيات الصناعية والخرسانة سابقة الصب.';
  const OPC_D_EN = 'Used in all construction work that needs high early compressive strength (for example, when formwork has to be struck early), such as bridges, tunnels, industrial floors and precast concrete.';
  const OPC_F_AR = ['مناسب لجميع أشكال البناء.', 'أعلى جودة في السوق.', 'تناسق عالي في الأداء.', 'متوفر بكميات كبيرة (سائب) وفي أكياس.'];
  const OPC_F_EN = ['Suitable for every type of construction.', 'The highest quality on the market.', 'Consistent, high performance.', 'Available in bulk and in bags.'];
  const SPEC_OPC = [['المقاومة بعد يومين', 'Strength at 2 days', '≥ 10 MPa'], ['المقاومة بعد 28 يوماً', 'Strength at 28 days', '42.5 – 62.5 MPa'], ['بداية الشك', 'Initial setting time', '≥ 60 min'], ['الثبات (تمدد)', 'Soundness (expansion)', '≤ 10 mm'], ['SO₃', 'SO₃', '≤ 3.5 %'], ['الكلوريدات', 'Chloride', '≤ 0.10 %']];
  const SPEC_SR = [['المقاومة بعد يومين', 'Strength at 2 days', '≥ 10 MPa'], ['المقاومة بعد 28 يوماً', 'Strength at 28 days', '42.5 – 62.5 MPa'], ['بداية الشك', 'Initial setting time', '≥ 60 min'], ['C₃A في الكلنكر', 'C₃A in clinker', '≤ 5 %'], ['SO₃', 'SO₃', '≤ 3.0 %'], ['الكلوريدات', 'Chloride', '≤ 0.10 %']];

  const P = {
    bagc4: { ar: 'أسمنت المصريين', en: 'Egyptian Cement', tag: 'OPC', type: 'CEM I 42.5N', col: '#2f3f9a',
      kAr: 'أسمنت بورتلاندي عادي', kEn: 'Ordinary Portland Cement',
      dAr: OPC_D_AR, dEn: OPC_D_EN, fAr: [], fEn: [], spec: SPEC_OPC },
    bagc5: { ar: 'أسمنت المصريين', en: 'Egyptian Cement', tag: 'SR5', type: 'CEM I 42.5N-SR5', col: '#1f7a3a',
      kAr: 'أسمنت مقاوم لأملاح الكبريتات', kEn: 'Sulphate-Resisting Cement',
      dAr: 'يُستخدم في جميع أنواع الهياكل الخرسانية مثل الأساسات المسلحة وخزانات الصرف الصحي وأساسات الجسور والأكوام بأنواعها ومحطات معالجة مياه الصرف الصحي والصرف الزراعي والصناعي، وجميع أعمال البناء والتشييد المعرضة للتأثير المباشر لأملاح الكبريتات. كما يُستخدم في الصناعات المكملة للبناء مثل صناعة أنابيب الصرف وتبطين الأنابيب الخرسانية والحديدية.',
      dEn: 'Used in every type of concrete structure, such as reinforced foundations, sewage tanks, bridge foundations, piles of all kinds, sewage, agricultural and industrial drainage treatment plants, and all construction directly exposed to sulphate salts. It is also used in industries that support construction, such as drainage-pipe manufacturing and the lining of concrete and steel pipes.',
      fAr: ['متانة أعلى.', 'سيطرة على تشقق الخرسانة.', 'جودة أعلى في السوق.', 'متوفر بكميات كبيرة (سائب) وفي أكياس.'],
      fEn: ['Higher durability.', 'Control of concrete cracking.', 'Higher quality on the market.', 'Available in bulk and in bags.'], spec: SPEC_SR },
    bagc3: { ar: 'نسر الصعيد', en: 'Nisr Al-Seid', tag: 'OPC', type: 'CEM I 42.5N', col: '#1d1d1d',
      kAr: 'أسمنت بورتلاندي عادي', kEn: 'Ordinary Portland Cement',
      dAr: OPC_D_AR, dEn: OPC_D_EN, fAr: [], fEn: [], spec: SPEC_OPC },
    bagc1: { ar: 'السوهاجي', en: 'Al-Sohagy', tag: 'OPC', type: 'CEM I 42.5N', col: '#1d1d1d',
      kAr: 'أسمنت بورتلاندي عادي', kEn: 'Ordinary Portland Cement',
      dAr: OPC_D_AR.replace('سابقة الصب', 'مسبقة الصب'), dEn: OPC_D_EN, fAr: OPC_F_AR, fEn: OPC_F_EN, spec: SPEC_OPC },
    bagc6: { ar: 'نسر المصريين', en: 'Nisr Al-Masryeen', tag: 'OPC', type: 'CEM I 42.5N', col: '#1d1d1d', exp: true,
      kAr: 'أسمنت بورتلاندي عادي · جودة تصدير', kEn: 'Ordinary Portland Cement · Export quality',
      dAr: OPC_D_AR.replace('سابقة الصب', 'مسبقة الصب'), dEn: OPC_D_EN, fAr: OPC_F_AR, fEn: OPC_F_EN, spec: SPEC_OPC }
  };
  const ORDER = ['bagc4', 'bagc5', 'bagc3', 'bagc1', 'bagc6'];
  const img = k => `assets/products/${k}.webp`;

  const V = {};
  function build() {
    const el = document.createElement('div');
    el.className = 'v3d psheet'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-labelledby', 'psName');
    el.innerHTML = `<div class="v3bg psbg"></div><div class="v3in psin">
      <div class="v3stage psstage"><div class="psfloor"></div><img class="psimg" alt=""><span class="psexp" hidden><span class="ar">جودة تصدير</span><span class="en">Export quality</span></span>
        <div class="v3nav psnav"><button class="v3p psp" aria-label="Previous">‹</button><div class="v3dots psdots"></div><button class="v3n psn" aria-label="Next">›</button></div></div>
      <aside class="v3info psinfo"><span class="v3tag pstag"></span><h3 id="psName" class="v3name psname"></h3><p class="pskind"></p>
        <div class="v3grade psgrade" dir="ltr"><b>42.5</b><em>N</em><small></small></div>
        <h4><span class="ar">الاستخدام</span><span class="en">Use</span></h4><p class="psdesc"></p>
        <div class="psfeat"><h4><span class="ar">المميزات</span><span class="en">Advantages</span></h4><ul></ul></div>
        <h4><span class="ar">متطلبات المواصفة (ES 4756-1 / EN 197-1)</span><span class="en">Standard requirements (ES 4756-1 / EN 197-1)</span></h4><div class="v3spec psspec"></div>
        <div class="v3pk pspk"><div><b>50 kg</b><span class="ar">أكياس</span><span class="en">Bags</span></div><div><b>Jumbo</b><span class="ar">أكياس جامبو</span><span class="en">Jumbo bags</span></div><div><b>Bulk</b><span class="ar">سائب</span><span class="en">Bulk</span></div></div>
        <div class="v3act psact"><a class="btn btn-p" href="#products" data-psclose><span class="ar">الأسعار والطلب</span><span class="en">Prices &amp; order</span></a></div>
      </aside><button class="v3x psx" aria-label="Close">✕</button></div>`;
    document.body.appendChild(el); V.el = el; V.img = el.querySelector('.psimg'); V.dots = el.querySelector('.psdots');
    ORDER.forEach(k => { const b = document.createElement('button'); b.setAttribute('aria-label', P[k].en); b.onclick = () => show(k, ORDER.indexOf(k) > V.idx ? 1 : -1); V.dots.appendChild(b); });
    el.querySelector('.psx').onclick = close; el.querySelector('.psbg').onclick = close; el.querySelector('[data-psclose]').onclick = close;
    el.querySelector('.psp').onclick = () => step(-1); el.querySelector('.psn').onclick = () => step(1);
    addEventListener('keydown', e => { if (!el.classList.contains('on')) return; if (e.key === 'Escape') close(); if (e.key === 'ArrowRight') step(AR() ? -1 : 1); if (e.key === 'ArrowLeft') step(AR() ? 1 : -1); });
    // swipe on touch
    let sx = null; const st = el.querySelector('.psstage');
    st.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
    st.addEventListener('touchend', e => { if (sx == null) return; const dx = e.changedTouches[0].clientX - sx; sx = null; if (Math.abs(dx) > 50) step((dx < 0) === AR() ? -1 : 1); });
  }
  function fill(k) {
    const d = P[k], ar = AR(), e = V.el;
    e.querySelector('.pstag').textContent = d.tag; e.querySelector('.psname').textContent = ar ? d.ar : d.en;
    e.querySelector('.pskind').textContent = ar ? d.kAr : d.kEn;
    e.querySelector('.psgrade small').textContent = d.type; e.querySelector('.psdesc').textContent = ar ? d.dAr : d.dEn;
    const f = ar ? d.fAr : d.fEn; e.querySelector('.psfeat').hidden = !f.length;
    e.querySelector('.psfeat ul').innerHTML = f.map(x => `<li>${x}</li>`).join('');
    e.querySelector('.psspec').innerHTML = d.spec.map(s => `<div><span>${ar ? s[0] : s[1]}</span><b dir="ltr">${s[2]}</b></div>`).join('');
    e.querySelector('.psexp').hidden = !d.exp;
    e.style.setProperty('--bc', d.col); V.img.alt = `${d.en} ${d.tag}`;
    [...V.dots.children].forEach((b, i) => b.classList.toggle('on', ORDER[i] === k));
  }
  function show(k, dir) {
    V.idx = ORDER.indexOf(k); V.key = k; fill(k);
    const info = V.el.querySelector('.psinfo'); info.classList.remove('sw'); void info.offsetWidth; info.classList.add('sw');
    if (!V.st3 && window.EC3D && EC3D.stage) { V.st3 = EC3D.stage(V.el.querySelector('.psstage')); if (V.st3) V.el.classList.add('ps3d'); }
    if (V.st3) { V.st3.show(k, dir); V.st3.start(); V.img.src = img(k); return; }
    V.img.classList.remove('in'); V.img.style.setProperty('--dx', (dir || 0) * 40 + 'px'); void V.img.offsetWidth;
    V.img.src = img(k); V.img.classList.add('in');
  }
  function step(d) { show(ORDER[(V.idx + d + ORDER.length) % ORDER.length], d); }
  function open(k) {
    if (!P[k]) return; if (!V.el) build();
    V.el.classList.add('on'); document.documentElement.classList.add('v3lock'); show(k, 0);
    setTimeout(() => V.el.querySelector('.psx').focus(), 50);
  }
  function close() { if (V.st3) V.st3.stop(); V.el.classList.remove('on'); document.documentElement.classList.remove('v3lock'); }
  // re-render text on language switch
  new MutationObserver(() => { if (V.el && V.el.classList.contains('on')) fill(V.key); }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

  window.ECP = { open, data: P, order: ORDER, img };
  // keep old entry points working
  window.EC3D = window.EC3D || {}; window.EC3D.viewer = { open };
})();
