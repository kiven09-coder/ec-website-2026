/* EC 3D — professional WebGL cement bags (three.js r159 classic build)
   - EC3D.viewer.open(key)  : full-screen 360° viewer + product brief
   - EC3D.orbit(el)         : quality section, three bags orbiting the 42.5 seal
*/
(function(){
const T=window.THREE; if(!T||!window.EC3D_TEX) return;
const AR=()=>document.documentElement.lang!=='en';
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- product data (from egyptian-cement.com product pages + EN 197-1 / ES 4756-1 class requirements) ---------- */
const OPC_USES_AR=['الجسور والكباري','الأنفاق','الأرضيات الصناعية','الخرسانة سابقة الصب','الأساسات والخرسانة المسلحة'];
const OPC_USES_EN=['Bridges','Tunnels','Industrial floors','Precast concrete','Foundations & reinforced concrete'];
const OPC_ADV_AR=['مناسب لجميع أشكال البناء','جودة عالية ثابتة من دفعة لأخرى','تناسق عالي الأداء','متوفر سائب وفي أكياس 50 كجم وجامبو'];
const OPC_ADV_EN=['Suitable for every type of construction','High, consistent quality batch after batch','Consistent high performance','Available in bulk, 50 kg bags and jumbo bags'];
const SPEC_OPC=[['المقاومة بعد يومين','Strength at 2 days','≥ 10 MPa'],['المقاومة بعد 28 يوماً','Strength at 28 days','42.5 – 62.5 MPa'],['بداية الشك','Initial setting time','≥ 60 min'],['الثبات (تمدد)','Soundness (expansion)','≤ 10 mm'],['SO₃','SO₃','≤ 3.5 %'],['الكلوريدات','Chloride','≤ 0.10 %']];
const SPEC_SR=[['المقاومة بعد يومين','Strength at 2 days','≥ 10 MPa'],['المقاومة بعد 28 يوماً','Strength at 28 days','42.5 – 62.5 MPa'],['بداية الشك','Initial setting time','≥ 60 min'],['C₃A في الكلنكر','C₃A in clinker','≤ 5 %'],['SO₃','SO₃','≤ 3.0 %'],['الكلوريدات','Chloride','≤ 0.10 %']];
const P={
 bagc4:{ar:'أسمنت المصريين',en:'Egyptian Cement',tag:'OPC',type:'CEM I 42.5N',col:'#2f3f9a',
   dAr:'أسمنت بورتلاندي عادي عالي المقاومة المبكرة — العلامة الرئيسية للشركة، للأساسات والخرسانة المسلحة وكل أعمال البناء التي تحتاج فكّاً مبكراً للشدات.',
   dEn:'High early-strength Ordinary Portland Cement — the company flagship, for foundations, reinforced concrete and any work that needs early formwork striking.',uAr:OPC_USES_AR,uEn:OPC_USES_EN,aAr:OPC_ADV_AR,aEn:OPC_ADV_EN,spec:SPEC_OPC},
 bagc5:{ar:'أسمنت المصريين المقاوم',en:'Egyptian Cement SRC',tag:'SRC',type:'CEM I 42.5N-SR5',col:'#1f7a3a',
   dAr:'أسمنت مقاوم لأملاح الكبريتات لكل المنشآت الخرسانية المعرّضة للكبريتات — تحمّل أعلى وتحكّم في تشرّخ الخرسانة.',
   dEn:'Sulphate-resisting cement for every concrete structure exposed to sulphate salts — higher durability and better crack control.',
   uAr:['الأساسات المسلحة','خزانات ومحطات الصرف الصحي','أساسات وركائز الكباري والخوازيق','الصرف الزراعي والصناعي','مواسير الصرف وتبطين المواسير الخرسانية والحديدية'],
   uEn:['Reinforced foundations','Sewage tanks & treatment plants','Bridge foundations, piers & piles','Agricultural & industrial drainage','Drainage pipes; lining of concrete & steel pipes'],
   aAr:['متانة وعمر أطول للمنشأ','تحكّم في تشرّخ الخرسانة','مقاومة عالية لأملاح الكبريتات','متوفر سائب وفي أكياس'],aEn:['Longer service life','Crack control','High sulphate resistance','Available in bulk and bags'],spec:SPEC_SR},
 bagc3:{ar:'نسر الصعيد',en:'Nesr El Saied',tag:'OPC',type:'CEM I 42.5N',col:'#1d1d1d',
   dAr:'أسمنت بورتلاندي عادي بعلامة «نسر الصعيد» — قوة مبكرة عالية لكل أعمال البناء في الصعيد.',dEn:'Ordinary Portland Cement under the “Nesr El Saied” brand — high early strength for every build in Upper Egypt.',uAr:OPC_USES_AR,uEn:OPC_USES_EN,aAr:OPC_ADV_AR,aEn:OPC_ADV_EN,spec:SPEC_OPC},
 bagc2:{ar:'الأسيوطي',en:'El Assiouty',tag:'OPC',type:'CEM I 42.5N',col:'#1d1d1d',
   dAr:'أسمنت بورتلاندي عادي بعلامة «الأسيوطي» — أداء ثابت عالي الجودة لكل أعمال الإنشاء.',dEn:'Ordinary Portland Cement under the “El Assiouty” brand — consistent, high-quality performance for all construction.',uAr:OPC_USES_AR,uEn:OPC_USES_EN,aAr:OPC_ADV_AR,aEn:OPC_ADV_EN,spec:SPEC_OPC},
 bagc1:{ar:'السوهاجي',en:'El Sohagy',tag:'OPC',type:'CEM I 42.5N',col:'#1d1d1d',
   dAr:'أسمنت بورتلاندي عادي بعلامة «السوهاجي» — من مصنع جهينة إلى كل موقع بناء.',dEn:'Ordinary Portland Cement under the “El Sohagy” brand — from the Gehina plant to every site.',uAr:OPC_USES_AR,uEn:OPC_USES_EN,aAr:OPC_ADV_AR,aEn:OPC_ADV_EN,spec:SPEC_OPC},
 bagc6:{ar:'نسر المصريين',en:'Nesr El Masryeen',tag:'OPC',type:'CEM I 42.5N',col:'#1d1d1d',
   dAr:'أسمنت بورتلاندي عادي «نسر المصريين» — للأساسات والخرسانة المسلحة، وعلامتنا للأسواق الخارجية.',dEn:'Ordinary Portland Cement “Nesr El Masryeen” — for foundations and reinforced concrete, and our brand for export markets.',uAr:OPC_USES_AR,uEn:OPC_USES_EN,aAr:OPC_ADV_AR,aEn:OPC_ADV_EN,spec:SPEC_OPC}
};
const ORDER=['bagc4','bagc5','bagc3','bagc2','bagc1','bagc6'];
window.EC3D_PRODUCTS=P;

/* ---------- shared resources ---------- */
const texCache={};
function tex(id){ if(texCache[id]) return texCache[id]; const im=new Image(); const t=new T.Texture(im); im.onload=()=>{t.needsUpdate=true}; im.src=window.EC3D_TEX[id]; t.colorSpace=T.SRGBColorSpace; t.anisotropy=8; return texCache[id]=t; }
let paper=null;
function paperTex(){ if(paper) return paper; const c=document.createElement('canvas');c.width=c.height=256;const g=c.getContext('2d');const d=g.createImageData(256,256);
  for(let i=0;i<d.data.length;i+=4){const v=128+(Math.random()-.5)*60;d.data[i]=d.data[i+1]=d.data[i+2]=v;d.data[i+3]=255}
  g.putImageData(d,0,0); g.globalAlpha=.08; for(let k=0;k<120;k++){g.strokeStyle=Math.random()<.5?'#000':'#fff';g.beginPath();const x=Math.random()*256,y=Math.random()*256;g.moveTo(x,y);g.lineTo(x+(Math.random()-.5)*60,y+(Math.random()-.5)*6);g.stroke()}
  paper=new T.CanvasTexture(c); paper.wrapS=paper.wrapT=T.RepeatWrapping; paper.repeat.set(3,5); return paper; }
let GEO=null;
function bagGeo(){ if(GEO) return GEO;
  const W=.6,H=1.08,D=.22; const g=new T.BoxGeometry(W,H,D,56,96,18); const p=g.attributes.position;
  for(let i=0;i<p.count;i++){ let x=p.getX(i),y=p.getY(i),z=p.getZ(i); const nx=x/(W/2),ny=y/(H/2),nz=z/(D/2);
    const ax=Math.abs(nx),ay=Math.abs(ny);
    // pillow thickness profile: full in the middle, pinched to a seam at the ends
    let t=(1-.42*Math.pow(ax,4))*(1-.86*Math.pow(ay,7));
    // filled bag bulges: front/back push out in the centre
    z=nz*(D/2)*t + Math.sign(nz)*Math.pow(Math.abs(nz),6)*.045*(1-nx*nx)*(1-Math.pow(ay,3));
    // shoulders: round the silhouette at the 4 corners
    const sh=1-.07*Math.pow(ay,10)-.05*Math.pow(ax*ay,6); x*=sh;
    // ends are slightly convex (filled) and the bottom sags a touch
    y*= 1+.012*(1-nx*nx)*(ny>0?1:1.4);
    // subtle paper wrinkles on faces
    const w=Math.sin(nx*9.1+ny*3.3)*Math.sin(ny*13.7-nx*2.1)*.0016+Math.sin(ny*31+nx*5)*.0007;
    z+=Math.sign(nz)*Math.pow(Math.abs(nz),8)*w;
    p.setXYZ(i,x,y,z); }
  g.computeVertexNormals(); return GEO=g; }
const MATS={};
function bagMats(key){ if(MATS[key]) return MATS[key];
  const pt=paperTex(); const base={roughness:.84,metalness:0,bumpMap:pt,bumpScale:.6,envMapIntensity:.8};
  const front=new T.MeshStandardMaterial({...base,map:tex(key+'_front')});
  const side=new T.MeshStandardMaterial({...base,map:tex(key+'_side')});
  const kraft=new T.MeshStandardMaterial({...base,color:new T.Color('#c9a27a')});
  // box groups: +x,-x,+y,-y,+z,-z
  return MATS[key]=[side,side,kraft,kraft,front,front]; }
function bag(key){ const m=new T.Mesh(bagGeo(),bagMats(key)); m.castShadow=true; m.receiveShadow=false; return m; }
function shadowBlob(){ const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d');const r=g.createRadialGradient(64,64,4,64,64,62);r.addColorStop(0,'rgba(0,0,0,.55)');r.addColorStop(.55,'rgba(0,0,0,.22)');r.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=r;g.fillRect(0,0,128,128);
  const m=new T.Mesh(new T.PlaneGeometry(1,1),new T.MeshBasicMaterial({map:new T.CanvasTexture(c),transparent:true,depthWrite:false})); m.rotation.x=-Math.PI/2; return m; }
function makeRenderer(canvas,alpha){ const r=new T.WebGLRenderer({canvas,antialias:true,alpha:!!alpha,powerPreference:'high-performance'});
  r.setPixelRatio(Math.min(devicePixelRatio,2)); r.toneMapping=T.ACESFilmicToneMapping; r.toneMappingExposure=1.05; r.outputColorSpace=T.SRGBColorSpace;
  r.shadowMap.enabled=true; r.shadowMap.type=T.PCFSoftShadowMap; return r; }
function studio(scene,renderer,envInt){ const pm=new T.PMREMGenerator(renderer); scene.environment=pm.fromScene(new RoomEnvironment(),.04).texture; scene.environmentIntensity=envInt||.75;
  const key=new T.DirectionalLight(0xfff2de,2.2); key.position.set(2.2,3.4,2.6); key.castShadow=true; key.shadow.mapSize.set(1024,1024); key.shadow.radius=6; key.shadow.camera.near=.5; key.shadow.camera.far=12; const s=key.shadow.camera; s.left=s.bottom=-2; s.right=s.top=2; scene.add(key);
  const rim=new T.DirectionalLight(0xcfe6ff,1.1); rim.position.set(-2.5,1.6,-2.4); scene.add(rim);
  const fill=new T.HemisphereLight(0xffffff,0x6b5a40,.35); scene.add(fill);
  const floor=new T.Mesh(new T.PlaneGeometry(12,12),new T.ShadowMaterial({opacity:.28})); floor.rotation.x=-Math.PI/2; floor.receiveShadow=true; scene.add(floor); return {key,floor}; }

/* ---------- 360° viewer (modal) ---------- */
const V={};
function buildViewer(){
  const el=document.createElement('div'); el.className='v3d'; el.setAttribute('role','dialog'); el.setAttribute('aria-modal','true');
  el.innerHTML=`<div class="v3bg"></div><div class="v3in"><div class="v3stage"><canvas></canvas><div class="v3hint"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12a8 8 0 0 1 14-5"/><path d="M18 3v4h-4"/><path d="M20 12a8 8 0 0 1-14 5"/><path d="M6 21v-4h4"/></svg><span class="ar">اسحب للدوران 360°</span><span class="en">Drag to rotate 360°</span></div>
  <div class="v3nav"><button class="v3p" aria-label="Previous">‹</button><div class="v3dots"></div><button class="v3n" aria-label="Next">›</button></div></div>
  <aside class="v3info"><span class="v3tag"></span><h3 class="v3name"></h3><div class="v3grade" dir="ltr"><b>42.5</b><em>N</em><small></small></div><p class="v3d1"></p>
  <h4><span class="ar">الاستخدامات</span><span class="en">Applications</span></h4><ul class="v3uses"></ul>
  <h4><span class="ar">المميزات</span><span class="en">Advantages</span></h4><ul class="v3adv"></ul>
  <h4><span class="ar">متطلبات المواصفة (ES 4756-1 / EN 197-1)</span><span class="en">Standard requirements (ES 4756-1 / EN 197-1)</span></h4><div class="v3spec"></div>
  <div class="v3pk"><div><b>50 kg</b><span class="ar">أكياس</span><span class="en">Bags</span></div><div><b>Jumbo</b><span class="ar">أكياس جامبو</span><span class="en">Jumbo bags</span></div><div><b>Bulk</b><span class="ar">سائب</span><span class="en">Bulk</span></div></div>
  <div class="v3act"><a class="btn btn-p" href="#products" data-v3close><span class="ar">الأسعار والطلب</span><span class="en">Prices & order</span></a></div></aside>
  <button class="v3x" aria-label="Close">✕</button></div>`;
  document.body.appendChild(el); V.el=el; V.cv=el.querySelector('canvas');
  V.dots=el.querySelector('.v3dots'); ORDER.forEach((k,i)=>{const b=document.createElement('button');b.setAttribute('aria-label',P[k].en);b.onclick=()=>show(k,i>V.idx?1:-1);V.dots.appendChild(b)});
  el.querySelector('.v3x').onclick=close; el.querySelector('.v3bg').onclick=close; el.querySelector('[data-v3close]').onclick=close;
  el.querySelector('.v3p').onclick=()=>step(-1); el.querySelector('.v3n').onclick=()=>step(1);
  addEventListener('keydown',e=>{if(!el.classList.contains('on'))return;if(e.key==='Escape')close();if(e.key==='ArrowRight')step(AR()?-1:1);if(e.key==='ArrowLeft')step(AR()?1:-1)});
  const r=V.r=makeRenderer(V.cv,true); const sc=V.sc=new T.Scene(); const cam=V.cam=new T.PerspectiveCamera(30,1,.1,50); cam.position.set(0,.55,3.3); cam.lookAt(0,.5,0);
  studio(sc,r,.8); V.holder=new T.Group(); sc.add(V.holder);
  const ring=new T.Mesh(new T.RingGeometry(.62,.64,96),new T.MeshBasicMaterial({color:0x8cc63f,transparent:true,opacity:.55})); ring.rotation.x=-Math.PI/2; ring.position.y=.002; sc.add(ring); V.ring=ring;
  // interaction
  let drag=false,lx=0,ly=0; V.yaw=0;V.vy=0;V.pitch=.0;V.zoom=1;V.idle=0;
  const down=e=>{drag=true;lx=e.clientX;ly=e.clientY;V.idle=0;V.cv.setPointerCapture(e.pointerId)};
  const move=e=>{if(!drag)return;const dx=e.clientX-lx,dy=e.clientY-ly;lx=e.clientX;ly=e.clientY;V.vy=dx*.012;V.yaw+=dx*.012;V.pitch=Math.max(-.35,Math.min(.45,V.pitch+dy*.005))};
  const up=()=>{drag=false};
  V.cv.addEventListener('pointerdown',down);V.cv.addEventListener('pointermove',move);V.cv.addEventListener('pointerup',up);V.cv.addEventListener('pointercancel',up);
  V.cv.addEventListener('wheel',e=>{e.preventDefault();V.zoom=Math.max(.75,Math.min(1.35,V.zoom*(e.deltaY>0?.94:1.06)))},{passive:false});
  V.drag=()=>drag;
  const ro=new ResizeObserver(()=>{const w=V.cv.clientWidth,h=V.cv.clientHeight;if(!w||!h)return;r.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix()});ro.observe(V.cv);
}
function fill(k){ const d=P[k],ar=AR(),e=V.el; e.querySelector('.v3tag').textContent=d.tag; e.querySelector('.v3name').textContent=ar?d.ar:d.en;
  e.querySelector('.v3grade small').textContent=d.type; e.querySelector('.v3d1').textContent=ar?d.dAr:d.dEn;
  e.querySelector('.v3uses').innerHTML=(ar?d.uAr:d.uEn).map(x=>`<li>${x}</li>`).join(''); e.querySelector('.v3adv').innerHTML=(ar?d.aAr:d.aEn).map(x=>`<li>${x}</li>`).join('');
  e.querySelector('.v3spec').innerHTML=d.spec.map(s=>`<div><span>${ar?s[0]:s[1]}</span><b dir="ltr">${s[2]}</b></div>`).join('');
  e.style.setProperty('--bc',d.col); [...V.dots.children].forEach((b,i)=>b.classList.toggle('on',ORDER[i]===k)); }
function show(k,dir){ V.idx=ORDER.indexOf(k); fill(k); const info=V.el.querySelector('.v3info'); info.classList.remove('sw'); void info.offsetWidth; info.classList.add('sw');
  const old=V.cur; const nb=bag(k); nb.position.y=.56; V.holder.add(nb); V.cur=nb; V.t0=performance.now(); V.dir=dir||0; V.old=old; V.yaw=-.5*(dir||1); V.vy=.0; V.idle=0; }
function step(d){ const i=(V.idx+d+ORDER.length)%ORDER.length; show(ORDER[i],d); }
function loop(t){ if(!V.el.classList.contains('on')){V.raf=0;return} V.raf=requestAnimationFrame(loop);
  const a=Math.min((t-V.t0)/900,1), e=1-Math.pow(1-a,3);
  if(V.old){ V.old.position.x=-V.dir*e*1.6; V.old.material&&0; V.old.scale.setScalar(1-e*.3); if(a>=1){V.holder.remove(V.old);V.old=null} }
  if(V.cur){ V.cur.position.x=V.dir*(1-e)*1.6; const s=.7+.3*e; V.cur.scale.setScalar(s); V.cur.position.y=.56+Math.sin(t/900)*.012;
    if(!V.drag()){ V.idle+=1; V.vy*=.94; const auto=RM?0:(V.idle>90?.006:0); V.yaw+=V.vy+auto; }
    V.cur.rotation.y=V.yaw+(1-e)*-1.2*(V.dir||1); V.cur.rotation.x=V.pitch*.6; V.cur.rotation.z=Math.sin(t/1700)*.015; }
  V.cam.position.set(0,.55+V.pitch*.8,3.3/V.zoom); V.cam.lookAt(0,.52,0); V.ring.material.opacity=.35+.2*Math.sin(t/600);
  V.r.render(V.sc,V.cam); }
function open(k){ if(!V.el) buildViewer(); V.el.classList.add('on'); document.documentElement.classList.add('v3lock'); V.old&&V.holder.remove(V.old); V.old=null; V.cur&&V.holder.remove(V.cur); V.cur=null; show(k,0); if(!V.raf) V.raf=requestAnimationFrame(loop); }
function close(){ V.el.classList.remove('on'); document.documentElement.classList.remove('v3lock'); }

/* ---------- quality orbit ---------- */
function orbit(host){
  const cv=document.createElement('canvas'); cv.className='q3cv'; host.appendChild(cv);
  const r=makeRenderer(cv,true), sc=new T.Scene(), cam=new T.PerspectiveCamera(32,1,.1,60); studio(sc,r,.85);
  // pedestal disc with 42.5N seal
  const c=document.createElement('canvas'); c.width=c.height=1024; const g=c.getContext('2d');
  const rg=g.createRadialGradient(512,512,40,512,512,512); rg.addColorStop(0,'#ffffff'); rg.addColorStop(.62,'#f1ece0'); rg.addColorStop(1,'#d9d0bc'); g.fillStyle=rg; g.beginPath(); g.arc(512,512,510,0,7); g.fill();
  g.strokeStyle='#8cc63f'; g.lineWidth=10; g.beginPath(); g.arc(512,512,430,0,7); g.stroke(); g.lineWidth=3; g.setLineDash([14,14]); g.beginPath(); g.arc(512,512,470,0,7); g.stroke(); g.setLineDash([]);
  g.fillStyle='#1a211d'; g.textAlign='center'; g.font='800 230px Manrope, system-ui, sans-serif'; g.fillText('42.5',490,560); g.fillStyle='#8cc63f'; g.font='800 120px Manrope, system-ui'; g.fillText('N',742,470);
  g.fillStyle='#7a6a48'; g.font='700 56px Manrope, system-ui'; g.fillText('ES 4756-1 · CEM I',512,680);
  const ctex=new T.CanvasTexture(c);ctex.center.set(.5,.5);ctex.rotation=-Math.PI/2;
  const disc=new T.Mesh(new T.CylinderGeometry(1.3,1.35,.08,96),[new T.MeshStandardMaterial({color:0xe9e2d2,roughness:.6}),new T.MeshStandardMaterial({map:ctex,roughness:.55,metalness:.05}),new T.MeshStandardMaterial({color:0xd6ccb6})]);
  disc.material[1].map.colorSpace=T.SRGBColorSpace; disc.position.y=.04; disc.receiveShadow=true; sc.add(disc);
  const glow=new T.Mesh(new T.TorusGeometry(1.32,.012,12,160),new T.MeshBasicMaterial({color:0x8cc63f})); glow.rotation.x=Math.PI/2; glow.position.y=.085; sc.add(glow);
  const ks=['bagc4','bagc5','bagc3'], B=ks.map(k=>{const m=bag(k);m.scale.setScalar(.7);m.userData.k=k;sc.add(m);return m});
  let th=0,sp=RM?0:.0042,tg=sp,yawV=0,drag=false,lx=0,mx=0,my=0,vis=false;
  const ray=new T.Raycaster(),ptr=new T.Vector2();
  cv.addEventListener('pointerdown',e=>{drag=true;lx=e.clientX;cv.setPointerCapture(e.pointerId);cv._dx=0});
  cv.addEventListener('pointermove',e=>{const b=cv.getBoundingClientRect();mx=(e.clientX-b.left)/b.width-.5;my=(e.clientY-b.top)/b.height-.5;if(drag){const d=e.clientX-lx;lx=e.clientX;yawV=d*.006;th+=d*.006;cv._dx+=Math.abs(d)}});
  cv.addEventListener('pointerup',e=>{drag=false;if((cv._dx||0)<6){const b=cv.getBoundingClientRect();ptr.set((e.clientX-b.left)/b.width*2-1,-(e.clientY-b.top)/b.height*2+1);ray.setFromCamera(ptr,cam);const h=ray.intersectObjects(B)[0];if(h)EC3D.viewer.open(h.object.userData.k)}});
  cv.addEventListener('pointerleave',()=>{mx=my=0});
  new IntersectionObserver(es=>{vis=es[0].isIntersecting;if(vis&&!raf)raf=requestAnimationFrame(f)},{threshold:.05}).observe(host);
  const ro=new ResizeObserver(()=>{const w=cv.clientWidth,h=cv.clientHeight;if(!w||!h)return;r.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix()});ro.observe(cv);
  let raf=0;
  function f(t){ if(!vis){raf=0;return} raf=requestAnimationFrame(f);
    if(!drag){yawV*=.95;th+=sp+yawV}
    B.forEach((m,i)=>{const a=th+i*Math.PI*2/3; const R=1.0; m.position.set(Math.sin(a)*R,.5+.03*Math.sin(t/700+i*2),Math.cos(a)*R); m.rotation.y=a+Math.PI*.0+Math.sin(t/1500+i)*.15; m.rotation.z=Math.sin(t/1100+i)*.03});
    glow.material.color.setHSL(.24,.55,.45+.1*Math.sin(t/500));
    cam.position.set(mx*.9,1.75-my*.5,3.9); cam.lookAt(0,.38,0); r.render(sc,cam); }
  cv.style.cursor='grab';
}

/* ---------- public ---------- */
window.EC3D={viewer:{open,close},orbit,P,ORDER};
})();
