/* EC 3D (v13.1) — three.js r159 classic build
   - EC3D.stage(host)  : product-sheet stage, the official bag mockup as a real 3D bag,
                         centred and turned to a fixed 3/4 angle (drag to turn, it settles back)
   - EC3D.orbit(host)  : quality section, cast-cement floor engraved 42.5N with OPC + SR5 orbiting
   Bag artwork is cut from the official mockups (assets/products/tex/<key>_front|_side.jpg). */
(function () {
  const T = window.THREE; if (!T) return;
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const REST = -0.52;                    // resting yaw (front turned ~30°, i.e. 60° to the camera plane)

  // ---------- shared resources ----------
  const loader = new T.TextureLoader(), TEX = {};
  function tex(id) {
    if (TEX[id]) return TEX[id];
    const t = loader.load(`assets/products/tex/${id}.jpg`); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 8;
    return TEX[id] = t;
  }
  let GEO = null;
  function bagGeo() {
    if (GEO) return GEO;
    const W = .6, H = 1.08, D = .22, g = new T.BoxGeometry(W, H, D, 56, 96, 18), p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      let x = p.getX(i), y = p.getY(i), z = p.getZ(i); const nx = x / (W / 2), ny = y / (H / 2), nz = z / (D / 2);
      const ax = Math.abs(nx), ay = Math.abs(ny);
      const t = (1 - .42 * Math.pow(ax, 4)) * (1 - .86 * Math.pow(ay, 7));                    // pillow profile
      z = nz * (D / 2) * t + Math.sign(nz) * Math.pow(Math.abs(nz), 6) * .045 * (1 - nx * nx) * (1 - Math.pow(ay, 3));
      x *= 1 - .07 * Math.pow(ay, 10) - .05 * Math.pow(ax * ay, 6);                              // rounded shoulders
      y *= 1 + .012 * (1 - nx * nx) * (ny > 0 ? 1 : 1.4);
      p.setXYZ(i, x, y, z);
    }
    g.computeVertexNormals(); return GEO = g;
  }
  const MATS = {};
  function bagMats(k) {
    if (MATS[k]) return MATS[k];
    const base = { roughness: .86, metalness: 0, envMapIntensity: .7 };
    const front = new T.MeshStandardMaterial({ ...base, map: tex(k + '_front') });
    const side = new T.MeshStandardMaterial({ ...base, map: tex(k + '_side') });
    const kraft = new T.MeshStandardMaterial({ ...base, color: new T.Color('#b98c5e') });
    return MATS[k] = [side, side, kraft, kraft, front, front];                                 // +x,-x,+y,-y,+z,-z
  }
  const bag = k => { const m = new T.Mesh(bagGeo(), bagMats(k)); m.userData.k = k; return m; };
  function blob(op) {
    const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d');
    const r = g.createRadialGradient(64, 64, 4, 64, 64, 62); r.addColorStop(0, `rgba(0,0,0,${op})`); r.addColorStop(.6, `rgba(0,0,0,${op * .35})`); r.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = r; g.fillRect(0, 0, 128, 128);
    const m = new T.Mesh(new T.PlaneGeometry(1, 1), new T.MeshBasicMaterial({ map: new T.CanvasTexture(c), transparent: true, depthWrite: false }));
    m.rotation.x = -Math.PI / 2; return m;
  }
  function renderer(cv) {
    const r = new T.WebGLRenderer({ canvas: cv, antialias: true, alpha: true, powerPreference: 'high-performance' });
    r.setPixelRatio(Math.min(devicePixelRatio, 2)); r.toneMapping = T.ACESFilmicToneMapping; r.toneMappingExposure = 1.08;
    r.outputColorSpace = T.SRGBColorSpace; return r;
  }
  function lights(sc, r) {
    if (window.RoomEnvironment) { const pm = new T.PMREMGenerator(r); sc.environment = pm.fromScene(new RoomEnvironment(), .04).texture; pm.dispose(); }
    const key = new T.DirectionalLight(0xfff2de, 2.1); key.position.set(2.2, 3.4, 2.8); sc.add(key);
    const rim = new T.DirectionalLight(0xdfeeff, .9); rim.position.set(-2.6, 1.8, -2.2); sc.add(rim);
    sc.add(new T.HemisphereLight(0xffffff, 0x7a6a50, .55));
  }
  // if the GPU drops the context, fall back to the static picture instead of a black box
  function guard(cv, host, onLost) {
    cv.addEventListener('webglcontextlost', e => { e.preventDefault(); host.classList.add('gl-off'); onLost && onLost(); });
    cv.addEventListener('webglcontextrestored', () => host.classList.remove('gl-off'));
  }

  // ---------- product-sheet stage ----------
  function stage(host) {
    const cv = document.createElement('canvas'); cv.className = 'pscv'; host.prepend(cv);
    let r; try { r = renderer(cv); } catch (e) { cv.remove(); return null; }
    const sc = new T.Scene(), cam = new T.PerspectiveCamera(28, 1, .1, 40); lights(sc, r);
    const hold = new T.Group(); sc.add(hold);
    const sh = blob(.5); sh.scale.set(1.15, .5, 1); sh.position.y = .001; sc.add(sh);
    const ring = new T.Mesh(new T.RingGeometry(.6, .615, 96), new T.MeshBasicMaterial({ color: 0x8cc63f, transparent: true, opacity: .5 }));
    ring.rotation.x = -Math.PI / 2; ring.position.y = .002; sc.add(ring);
    const S = { cur: null, old: null, t0: 0, dir: 0, yaw: REST, vy: 0, pitch: 0, idle: 0, drag: false, on: false, raf: 0 };
    let lx = 0, ly = 0;
    cv.addEventListener('pointerdown', e => { S.drag = true; lx = e.clientX; ly = e.clientY; S.idle = 0; cv.setPointerCapture(e.pointerId); });
    cv.addEventListener('pointermove', e => { if (!S.drag) return; const dx = e.clientX - lx, dy = e.clientY - ly; lx = e.clientX; ly = e.clientY; S.vy = dx * .012; S.yaw += dx * .012; S.pitch = Math.max(-.3, Math.min(.4, S.pitch + dy * .004)); });
    const up = () => { S.drag = false; }; cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
    const fit = () => {
      const w = cv.clientWidth, h = cv.clientHeight; if (!w || !h) return; r.setSize(w, h, false); cam.aspect = w / h;
      // keep the whole bag in frame and centred whatever the stage shape
      const need = 1.62, fov = cam.fov * Math.PI / 180, dist = Math.max(need / 2 / Math.tan(fov / 2), need / 2 / Math.tan(fov / 2) / Math.min(1, cam.aspect * 1.35));
      S.dist = dist * 1.06; cam.updateProjectionMatrix();
    };
    new ResizeObserver(fit).observe(cv); guard(cv, host);
    function loop(t) {
      if (!S.on) { S.raf = 0; return; } S.raf = requestAnimationFrame(loop);
      const a = Math.min((t - S.t0) / 700, 1), e = 1 - Math.pow(1 - a, 3);
      if (S.old) { S.old.position.x = -S.dir * e * 1.4; S.old.scale.setScalar(1 - e * .25); if (a >= 1) { hold.remove(S.old); S.old = null; } }
      if (S.cur) {
        if (!S.drag) {
          S.idle++; S.vy *= .9; S.yaw += S.vy;
          if (S.idle > 100) { S.yaw += (REST - S.yaw) * .05; S.pitch *= .94; }               // settle back to the 3/4 pose
        }
        S.cur.position.set(S.dir * (1 - e) * 1.4, .56 + (RM ? 0 : Math.sin(t / 1100) * .008), 0);
        S.cur.scale.setScalar(.75 + .25 * e);
        S.cur.rotation.set(S.pitch * .5, S.yaw + (1 - e) * -.9 * (S.dir || 1), 0);
      }
      cam.position.set(0, .62 + S.pitch * .6, S.dist || 3.4); cam.lookAt(0, .55, 0);
      ring.material.opacity = .3 + .18 * Math.sin(t / 700);
      r.render(sc, cam);
    }
    return {
      show(k, dir) {
        if (S.cur) { if (S.old) hold.remove(S.old); S.old = dir ? S.cur : null; if (!dir) hold.remove(S.cur); }
        S.cur = bag(k); hold.add(S.cur); S.dir = dir || 0; S.t0 = performance.now(); S.yaw = REST; S.vy = 0; S.pitch = 0; S.idle = 0;
        // preload the neighbours' artwork
        if (window.ECP) { const o = ECP.order, i = o.indexOf(k); [o[(i + 1) % o.length], o[(i + o.length - 1) % o.length]].forEach(n => { tex(n + '_front'); tex(n + '_side'); }); }
      },
      start() { S.on = true; fit(); if (!S.raf) S.raf = requestAnimationFrame(loop); },
      stop() { S.on = false; }
    };
  }

  // ---------- quality orbit ----------
  function concrete(size) {
    const c = document.createElement('canvas'); c.width = c.height = size; const g = c.getContext('2d');
    const rnd = (a, z) => a + Math.random() * (z - a), C = size / 2;
    g.fillStyle = '#bdb9b0'; g.fillRect(0, 0, size, size);
    for (let i = 0; i < 60; i++) {
      const x = rnd(0, size), y = rnd(0, size), r = rnd(60, 260), l = rnd(-12, 12);
      const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, l > 0 ? `rgba(255,255,250,${l / 100})` : `rgba(40,40,36,${-l / 100})`); gr.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2);
    }
    const id = g.getImageData(0, 0, size, size), d = id.data;
    for (let i = 0; i < d.length; i += 4) { const n = (Math.random() - .5) * 22; d[i] = Math.max(0, Math.min(255, d[i] + n)); d[i + 1] = Math.max(0, Math.min(255, d[i + 1] + n)); d[i + 2] = Math.max(0, Math.min(255, d[i + 2] + n * .95)); }
    g.putImageData(id, 0, 0);
    for (let i = 0; i < size * 1.4; i++) { const dark = Math.random() < .55; g.fillStyle = dark ? `rgba(80,77,70,${rnd(.2, .5)})` : `rgba(240,237,230,${rnd(.2, .45)})`; g.beginPath(); g.arc(rnd(0, size), rnd(0, size), rnd(.6, 2.4), 0, 7); g.fill(); }
    // engraving: dark lower-right edge, light upper-left edge, recessed face — all baked into the colour map
    const engrave = draw => {
      g.save(); g.translate(3, 4); g.fillStyle = g.strokeStyle = 'rgba(45,42,36,.55)'; draw(); g.restore();
      g.save(); g.translate(-2, -2); g.fillStyle = g.strokeStyle = 'rgba(255,255,250,.6)'; draw(); g.restore();
      g.save(); g.fillStyle = g.strokeStyle = '#8e8a80'; draw(); g.restore();
    };
    const ring = (r, w) => () => { g.lineWidth = w; g.beginPath(); g.arc(C, C, r, 0, 7); g.stroke(); };
    engrave(ring(size * .455, size * .008)); engrave(ring(size * .425, size * .0035));
    engrave(() => { g.textAlign = 'center'; g.textBaseline = 'alphabetic'; g.font = `800 ${size * .23}px Manrope, "Arial Black", system-ui, sans-serif`; g.fillText('42.5', C - size * .045, C + size * .085); });
    engrave(() => { g.textAlign = 'center'; g.font = `800 ${size * .12}px Manrope, "Arial Black", system-ui, sans-serif`; g.fillText('N', C + size * .235, C + size * .005); });
    engrave(() => { g.textAlign = 'center'; g.font = `700 ${size * .045}px Manrope, system-ui, sans-serif`; g.fillText('ES 4756-1 · CEM I', C, C + size * .2); });
    return c;
  }
  function orbit(host) {
    if (host._ec3d) return; host._ec3d = 1;
    const cv = document.createElement('canvas'); cv.className = 'q3cv'; host.appendChild(cv);
    let r; try { r = renderer(cv); } catch (e) { host.classList.add('gl-off'); cv.remove(); return; }
    const sc = new T.Scene(), cam = new T.PerspectiveCamera(30, 1, .1, 60); lights(sc, r);
    let floorMap = null;
    const build = () => {                                     // (re)build the floor texture once fonts are ready
      const m = new T.CanvasTexture(concrete(1024)); m.colorSpace = T.SRGBColorSpace; m.anisotropy = 8;
      if (floorMap) floorMap.dispose(); floorMap = m; top.material.map = m; top.material.needsUpdate = true;
    };
    const top = new T.Mesh(new T.CircleGeometry(1.32, 128), new T.MeshStandardMaterial({ color: 0xffffff, roughness: .9, metalness: 0 }));
    top.rotation.x = -Math.PI / 2; top.position.y = .1; sc.add(top);
    const side = new T.Mesh(new T.CylinderGeometry(1.32, 1.36, .1, 128, 1, true), new T.MeshStandardMaterial({ color: 0x9d9990, roughness: .9 }));
    side.position.y = .05; sc.add(side);
    const lip = new T.Mesh(new T.TorusGeometry(1.32, .006, 8, 160), new T.MeshBasicMaterial({ color: 0x8cc63f, transparent: true, opacity: .8 }));
    lip.rotation.x = Math.PI / 2; lip.position.y = .101; sc.add(lip);
    build(); if (document.fonts && document.fonts.ready) document.fonts.ready.then(build);

    const B = ['bagc4', 'bagc5'].map(k => {
      const m = bag(k); m.scale.setScalar(.72); sc.add(m);
      const s = blob(.45); s.scale.set(.62, .3, 1); s.position.y = .102; sc.add(s); m.userData.sh = s; return m;
    });
    let th = .5, sp = RM ? 0 : .0045, v = 0, drag = false, lx = 0, vis = false, raf = 0;
    const ray = new T.Raycaster(), ptr = new T.Vector2();
    cv.addEventListener('pointerdown', e => { drag = true; lx = e.clientX; cv._dx = 0; cv.setPointerCapture(e.pointerId); });
    cv.addEventListener('pointermove', e => { if (!drag) return; const d = e.clientX - lx; lx = e.clientX; v = d * .006; th += d * .006; cv._dx += Math.abs(d); });
    cv.addEventListener('pointerup', e => { drag = false; if ((cv._dx || 0) < 6) { const b = cv.getBoundingClientRect(); ptr.set((e.clientX - b.left) / b.width * 2 - 1, -(e.clientY - b.top) / b.height * 2 + 1); ray.setFromCamera(ptr, cam); const hit = ray.intersectObjects(B)[0]; if (hit && window.ECP) ECP.open(hit.object.userData.k); } });
    cv.addEventListener('pointercancel', () => { drag = false; });
    guard(cv, host, () => { cancelAnimationFrame(raf); raf = 0; });
    new IntersectionObserver(es => { vis = es[0].isIntersecting; if (vis && !raf) raf = requestAnimationFrame(f); }, { threshold: .05 }).observe(host);
    const fit = () => { const w = cv.clientWidth, h = cv.clientHeight; if (!w || !h) return; r.setSize(w, h, false); cam.aspect = w / h; cam.position.set(0, 2.45, w / h < .9 ? 6.2 : 5.1); cam.lookAt(0, .3, 0); cam.updateProjectionMatrix(); };
    new ResizeObserver(fit).observe(cv);
    function f(t) {
      if (!vis) { raf = 0; return; } raf = requestAnimationFrame(f);
      if (!drag) { v *= .94; th += sp + v; }
      B.forEach((m, i) => {
        const a = th + i * Math.PI, R = 1.0;
        m.position.set(Math.sin(a) * R, .1 + .39 + Math.sin(t / 900 + i * 2) * .012, Math.cos(a) * R);
        // each bag faces the camera at the same 3/4 angle as in the product sheet
        m.rotation.set(0, Math.atan2(cam.position.x - m.position.x, cam.position.z - m.position.z) + REST, 0);
        m.userData.sh.position.x = m.position.x; m.userData.sh.position.z = m.position.z;
      });
      lip.material.opacity = .55 + .25 * Math.sin(t / 700);
      r.render(sc, cam);
    }
    cv.style.cursor = 'grab';
  }

  window.EC3D = Object.assign(window.EC3D || {}, { orbit, stage });
})();
