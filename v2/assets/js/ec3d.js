/* EC 3D (v13) — quality section only:
   a cast-cement round floor engraved with the 42.5N grade, with the two main
   products (OPC and SR5) circulating around it as the official bag mockups.
   Tap a bag to open its product sheet (ECP.open). three.js r159 classic build. */
(function () {
  const T = window.THREE; if (!T) return;
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function makeRenderer(canvas) {
    const r = new T.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    r.setPixelRatio(Math.min(devicePixelRatio, 2)); r.toneMapping = T.ACESFilmicToneMapping; r.toneMappingExposure = 1.0;
    r.outputColorSpace = T.SRGBColorSpace; return r;
  }

  // ---- cast-concrete texture with the engraved grade (colour + bump from the same drawing)
  function concrete(size) {
    const c = document.createElement('canvas'); c.width = c.height = size; const g = c.getContext('2d');
    const b = document.createElement('canvas'); b.width = b.height = size; const h = b.getContext('2d');
    const rnd = (a, z) => a + Math.random() * (z - a);
    // base tone + large soft variation
    g.fillStyle = '#b9b6ae'; g.fillRect(0, 0, size, size); h.fillStyle = '#808080'; h.fillRect(0, 0, size, size);
    for (let i = 0; i < 70; i++) {
      const x = rnd(0, size), y = rnd(0, size), r = rnd(60, 260), l = rnd(-14, 14);
      const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(${l > 0 ? 255 : 40},${l > 0 ? 255 : 40},${l > 0 ? 250 : 36},${Math.abs(l) / 100})`); gr.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2);
    }
    // fine grain + aggregate + pores
    const id = g.getImageData(0, 0, size, size), hd = h.getImageData(0, 0, size, size);
    for (let i = 0; i < id.data.length; i += 4) { const n = (Math.random() - .5) * 26; id.data[i] += n; id.data[i + 1] += n; id.data[i + 2] += n * .95; hd.data[i] = hd.data[i + 1] = hd.data[i + 2] = 128 + n * 1.4; }
    g.putImageData(id, 0, 0); h.putImageData(hd, 0, 0);
    for (let i = 0; i < size * 1.6; i++) {
      const x = rnd(0, size), y = rnd(0, size), r = rnd(.6, 2.6), dark = Math.random() < .55;
      g.fillStyle = dark ? `rgba(70,68,62,${rnd(.25, .6)})` : `rgba(235,232,224,${rnd(.2, .5)})`; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
      h.fillStyle = dark ? 'rgba(40,40,40,.7)' : 'rgba(200,200,200,.5)'; h.beginPath(); h.arc(x, y, r, 0, 7); h.fill();
    }
    // hairline cracks
    g.strokeStyle = 'rgba(80,78,72,.18)'; h.strokeStyle = 'rgba(60,60,60,.6)'; g.lineWidth = h.lineWidth = 1;
    for (let k = 0; k < 7; k++) { let x = rnd(0, size), y = rnd(0, size); g.beginPath(); h.beginPath(); g.moveTo(x, y); h.moveTo(x, y);
      for (let s = 0; s < 14; s++) { x += rnd(-22, 22); y += rnd(-22, 22); g.lineTo(x, y); h.lineTo(x, y); } g.stroke(); h.stroke(); }
    // polished ring + engraved grade
    const C = size / 2;
    const engrave = (draw) => {
      // shadow edge, highlight edge, then the recessed face (colour); bump: deep groove
      g.save(); g.translate(2.5, 3); g.fillStyle = 'rgba(40,38,34,.55)'; g.strokeStyle = 'rgba(40,38,34,.55)'; draw(g); g.restore();
      g.save(); g.translate(-1.5, -2); g.fillStyle = 'rgba(255,255,250,.55)'; g.strokeStyle = 'rgba(255,255,250,.55)'; draw(g); g.restore();
      g.save(); g.fillStyle = '#8f8b82'; g.strokeStyle = '#8f8b82'; draw(g); g.restore();
      h.save(); h.fillStyle = '#1a1a1a'; h.strokeStyle = '#1a1a1a'; draw(h); h.restore();
    };
    const ring = (ctx, r, w) => { ctx.lineWidth = w; ctx.beginPath(); ctx.arc(C, C, r, 0, 7); ctx.stroke(); };
    engrave(ctx => ring(ctx, size * .455, size * .008));
    engrave(ctx => ring(ctx, size * .425, size * .0035));
    engrave(ctx => { ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'; ctx.font = `800 ${size * .23}px Manrope, "Arial Black", system-ui, sans-serif`; ctx.fillText('42.5', C - size * .045, C + size * .085); });
    engrave(ctx => { ctx.textAlign = 'center'; ctx.font = `800 ${size * .12}px Manrope, "Arial Black", system-ui, sans-serif`; ctx.fillText('N', C + size * .235, C + size * .005); });
    engrave(ctx => { ctx.textAlign = 'center'; ctx.font = `700 ${size * .045}px Manrope, system-ui, sans-serif`; ctx.fillText('ES 4756-1 · CEM I', C, C + size * .2); });
    return { map: c, bump: b };
  }

  function shadowBlob() {
    const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d');
    const r = g.createRadialGradient(64, 64, 4, 64, 64, 62); r.addColorStop(0, 'rgba(0,0,0,.5)'); r.addColorStop(.6, 'rgba(0,0,0,.18)'); r.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = r; g.fillRect(0, 0, 128, 128);
    const m = new T.Mesh(new T.PlaneGeometry(1, 1), new T.MeshBasicMaterial({ map: new T.CanvasTexture(c), transparent: true, depthWrite: false }));
    m.rotation.x = -Math.PI / 2; return m;
  }

  function orbit(host) {
    const cv = document.createElement('canvas'); cv.className = 'q3cv'; host.appendChild(cv);
    const r = makeRenderer(cv), sc = new T.Scene(), cam = new T.PerspectiveCamera(30, 1, .1, 60);
    if (window.RoomEnvironment) { const pm = new T.PMREMGenerator(r); sc.environment = pm.fromScene(new RoomEnvironment(), .04).texture; }
    const key = new T.DirectionalLight(0xfff4e6, 2.4); key.position.set(-2.4, 3.2, 2.2); sc.add(key);
    sc.add(new T.HemisphereLight(0xffffff, 0x6f6a60, .55));

    // floor
    const tx = concrete(1024);
    const map = new T.CanvasTexture(tx.map); map.colorSpace = T.SRGBColorSpace; map.anisotropy = 8;
    const bump = new T.CanvasTexture(tx.bump);
    const top = new T.Mesh(new T.CircleGeometry(1.32, 128), new T.MeshStandardMaterial({ map, bumpMap: bump, bumpScale: 2.2, roughness: .86, metalness: 0 }));
    top.rotation.x = -Math.PI / 2; top.position.y = .1; sc.add(top);
    const side = new T.Mesh(new T.CylinderGeometry(1.32, 1.36, .1, 128, 1, true), new T.MeshStandardMaterial({ color: 0x9d9990, roughness: .9 }));
    side.position.y = .05; sc.add(side);
    const lip = new T.Mesh(new T.TorusGeometry(1.32, .006, 8, 160), new T.MeshBasicMaterial({ color: 0x8cc63f, transparent: true, opacity: .8 }));
    lip.rotation.x = Math.PI / 2; lip.position.y = .101; sc.add(lip);

    // OPC + SR5 bag mockups (billboards)
    const loader = new T.TextureLoader();
    const B = ['bagc4', 'bagc5'].map(k => {
      const t = loader.load(`assets/products/${k}.webp`); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 8;
      const h = .78, w = h * .604;
      const m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ map: t, transparent: true, alphaTest: .02, depthWrite: true, toneMapped: false }));
      m.userData.k = k; m.userData.h = h; sc.add(m);
      const s = shadowBlob(); s.scale.set(w * 1.25, .34, 1); s.position.y = .102; sc.add(s); m.userData.sh = s;
      return m;
    });

    let th = .5, sp = RM ? 0 : .0045, v = 0, drag = false, lx = 0, vis = false, raf = 0;
    const ray = new T.Raycaster(), ptr = new T.Vector2();
    cv.addEventListener('pointerdown', e => { drag = true; lx = e.clientX; cv._dx = 0; cv.setPointerCapture(e.pointerId); });
    cv.addEventListener('pointermove', e => { if (!drag) return; const d = e.clientX - lx; lx = e.clientX; v = d * .006; th += d * .006; cv._dx += Math.abs(d); });
    cv.addEventListener('pointerup', e => { drag = false; if ((cv._dx || 0) < 6) { const b = cv.getBoundingClientRect(); ptr.set((e.clientX - b.left) / b.width * 2 - 1, -(e.clientY - b.top) / b.height * 2 + 1); ray.setFromCamera(ptr, cam); const hit = ray.intersectObjects(B)[0]; if (hit && window.ECP) ECP.open(hit.object.userData.k); } });
    cv.addEventListener('pointercancel', () => { drag = false; });
    new IntersectionObserver(es => { vis = es[0].isIntersecting; if (vis && !raf) raf = requestAnimationFrame(f); }, { threshold: .05 }).observe(host);
    const fit = () => { const w = cv.clientWidth, h = cv.clientHeight; if (!w || !h) return; r.setSize(w, h, false); cam.aspect = w / h; cam.position.set(0, 2.55, w / h < .9 ? 6.2 : 5.1); cam.lookAt(0, .28, 0); cam.updateProjectionMatrix(); };
    new ResizeObserver(fit).observe(cv);
    function f(t) {
      if (!vis) { raf = 0; return; } raf = requestAnimationFrame(f);
      if (!drag) { v *= .94; th += sp + v; }
      B.forEach((m, i) => {
        const a = th + i * Math.PI, R = 1.04, y = m.userData.h / 2 + .1 + Math.sin(t / 900 + i * 2) * .015;
        m.position.set(Math.sin(a) * R, y, Math.cos(a) * R);
        m.rotation.set(0, Math.atan2(cam.position.x - m.position.x, cam.position.z - m.position.z), 0);
        m.userData.sh.position.x = m.position.x; m.userData.sh.position.z = m.position.z;
      });
      lip.material.opacity = .55 + .25 * Math.sin(t / 700);
      r.render(sc, cam);
    }
    cv.style.cursor = 'grab';
  }

  window.EC3D = Object.assign(window.EC3D || {}, { orbit });
})();
