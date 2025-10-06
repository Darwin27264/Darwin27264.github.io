// Theme toggle with animated transition + correct icon inversion
(function () {
  const root = document.documentElement;
  const btn  = document.getElementById('themeToggle');
  const key  = 'darwin-theme';
  const saved = localStorage.getItem(key);
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = saved ? saved : (systemDark ? 'dark' : 'light');
  root.setAttribute('data-theme', initial);
  if (btn) btn.setAttribute('aria-pressed', initial === 'dark');

  const withTransition = (fn) => {
    root.classList.add('theming');
    fn();
    setTimeout(()=> root.classList.remove('theming'), 450);
  };

  const darkMeta  = document.querySelector('meta[name="theme-color"][media*="dark"]');
  const lightMeta = document.querySelector('meta[name="theme-color"][media*="light"]');
  const updateMeta = () => {
    const c = getComputedStyle(root).getPropertyValue('--bg').trim();
    (root.getAttribute('data-theme') === 'dark' ? darkMeta : lightMeta)?.setAttribute('content', c);
  };
  updateMeta();

  if (btn) {
    btn.addEventListener('click', () => {
      withTransition(() => {
        const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        localStorage.setItem(key, next);
        btn.setAttribute('aria-pressed', next === 'dark');
        updateMeta();
      });
    });
  }
})();

// Progress hairline + "scroll-active" flag
(function(){
  const bar = document.getElementById('progress');
  const root = document.documentElement;
  if (!bar) return;
  let timer;

  const updateBar = () => {
    const h = document.documentElement;
    const denom = (h.scrollHeight - h.clientHeight);
    const scrolled = (h.scrollTop) / (denom || 1);
    bar.style.width = (scrolled * 100).toFixed(2) + '%';
  };

  const onScroll = () => {
    updateBar();
    root.classList.add('scroll-active');
    clearTimeout(timer);
    timer = setTimeout(()=> root.classList.remove('scroll-active'), 220);
  };

  updateBar();
  document.addEventListener('scroll', onScroll, {passive:true});
})();

// Section reveal
(function () {
  const els = [...document.querySelectorAll('[data-reveal]')];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!('IntersectionObserver' in window) || reduce) { els.forEach(el => el.classList.add('is-in')); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { rootMargin: '-10% 0px -10% 0px', threshold: 0.01 });
  els.forEach((el) => io.observe(el));
})();

// Timeline cards fade-in
(function(){
  const cards = document.querySelectorAll('.t-card');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!('IntersectionObserver' in window) || reduce) { cards.forEach(c=>c.classList.add('in')); return; }
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, {rootMargin:'-15% 0px -10% 0px', threshold: 0.05});
  cards.forEach(c=>io.observe(c));
})();

// Two-line name letters entrance
(function(){
  const root = document.querySelector('.letters');
  if (!root) return;
  root.querySelectorAll('.line').forEach((line, li) => {
    const raw = line.getAttribute('data-letters') || line.textContent.trim();
    line.textContent = '';
    const frag = document.createDocumentFragment();
    [...raw].forEach((ch, i) => {
      const span = document.createElement('span');
      span.className = 'char';
      span.textContent = ch;
      span.style.transitionDelay = (li*120 + i*35) + 'ms';
      frag.appendChild(span);
    });
    line.appendChild(frag);
  });
  requestAnimationFrame(() => root.querySelectorAll('.char').forEach(s => s.classList.add('in')));
})();

/* ===== Smooth anchors ===== */
(function(){
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', e=>{
      const id = a.getAttribute('href');
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      const smooth = document.getElementById('smooth');
      const hasSmooth = document.body.classList.contains('has-smooth');
      const current = hasSmooth ? Math.abs(parseFloat((/translate3d\(0px,\s*(-?\d+(\.\d+)?)px/).exec(smooth.style.transform)?.[1] || 0)) : window.scrollY;
      const y = el.getBoundingClientRect().top + (hasSmooth ? current : 0);
      window.scrollTo({behavior:'smooth', top: y});
      history.pushState(null, '', id);
    });
  });
})();

// Scrollspy (desktop highlight; mobile title handled separately below)
(function(){
  const nav = document.getElementById('vnav');
  if (!nav) return;
  const links = [...nav.querySelectorAll('.vnav-item')];
  const map = new Map(links.map(l => [l.dataset.target, l]));
  const sections = links.map(l => document.getElementById(l.dataset.target)).filter(Boolean);
  const hero = document.getElementById('home');

  function clearActive(){ links.forEach(x=>x.classList.remove('active')); }

  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if (e.target === hero){
        if (e.isIntersecting) { clearActive(); }
        return;
      }
      const id = e.target.id;
      const link = map.get(id);
      if (!link) return;
      if (e.isIntersecting) { clearActive(); link.classList.add('active'); }
    });
  }, {rootMargin: '-45% 0px -50% 0px', threshold: 0.01});

  sections.forEach(s=>io.observe(s));
  if (hero) io.observe(hero);
})();

/* =========================================================================
   MOBILE TOP BAR
   Robust title manager (prevents "stuck" overlays) + dropdown sizing
   ========================================================================= */
(function(){
  const aside = document.querySelector('.vnav');
  if (!aside) return;

  const labelHost = document.getElementById('menuLabel');
  const btn       = aside.querySelector('.menu-toggle');
  const drop      = aside.querySelector('.vnav-drop');

  function setDropHeight(){
    if (!drop) return;
    const h = Math.max(0, drop.scrollHeight + 2);
    aside.style.setProperty('--drop-h', h + 'px');
  }
  setDropHeight();
  if (drop){
    const ro = new ResizeObserver(setDropHeight);
    ro.observe(drop);
    window.addEventListener('resize', setDropHeight, {passive:true});
  }

  if (btn){
    btn.addEventListener('click', ()=>{
      const open = !aside.classList.contains('open');
      aside.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      setDropHeight();
    });
  }

  // Title animator — overlap-safe
  function createLabelAnimator(host){
    let cur = '';
    let token = 0;
    let lastSwapAt = 0;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function pruneExits(){
      host.querySelectorAll('.label.exit').forEach(n=>{ try{ n.remove(); }catch(_){ } });
    }

    const set = (text, immediate=false) => {
      if (!host || !text) return;
      if (text === cur && host.querySelector('.label')) return;
      cur = text;
      token++;

      pruneExits();

      const now = (performance && performance.now) ? performance.now() : Date.now();
      const tooFast = (now - lastSwapAt) < 160;
      const instant = immediate || reduce || tooFast;

      host.querySelectorAll('.label').forEach((n, i) => { if (i > 1) n.remove(); });

      if (instant){
        host.querySelectorAll('.label').forEach(n=>{ try{ n.remove(); }catch(_){} });
        const next = document.createElement('span');
        next.className = 'label enter in';
        next.textContent = text;
        next.style.transition = 'none';
        host.appendChild(next);
        requestAnimationFrame(()=>{ next.style.transition = ''; });
        lastSwapAt = now;
        return;
      }

      const old = host.querySelector('.label.enter.in') || host.querySelector('.label');
      const next = document.createElement('span');
      next.className = 'label enter';
      next.textContent = text;
      host.appendChild(next);

      void next.offsetHeight;
      next.classList.add('in');

      if (old && old !== next){
        const my = token;
        old.classList.add('exit');
        requestAnimationFrame(()=> old.classList.add('out'));
        const done = () => { if (my === token) old.remove(); };
        old.addEventListener('transitionend', done, {once:true});
        old.addEventListener('animationend',  done, {once:true});
        setTimeout(()=>{ if (document.contains(old)) try{ old.remove(); }catch(_){ } }, 600);
      }

      queueMicrotask(()=>{
        const labels = host.querySelectorAll('.label');
        if (labels.length > 2){
          labels.forEach((n, i) => { if (i < labels.length - 2) n.remove(); });
        }
      });

      lastSwapAt = now;
    };

    return { set };
  }

  const animator = createLabelAnimator(labelHost);

  // Section list
  const sections = [
    { id:'work',     title:'EXPERIENCE' },
    { id:'projects', title:'PROJECTS' },
    { id:'about',    title:'ABOUT' },
    { id:'stack',    title:'STACK' },
    { id:'contact',  title:'CONTACT' },
  ];
  const GREETING = 'HEY THERE!';
  animator.set(GREETING, true);

  function getBarHeight(){
    const head = aside.querySelector('.menu-toggle');
    return head ? head.getBoundingClientRect().height : 60;
  }

  // ---- Transform-proof measurement helpers (fixes hero→experience nudge)
  function currentSmoothOffset(){
    const hasSmooth = document.body.classList.contains('has-smooth');
    if (!hasSmooth) return window.scrollY;
    const smooth = document.getElementById('smooth');
    if (!smooth) return window.scrollY;
    const m = /translate3d\(0px,\s*(-?\d+(\.\d+)?)px/.exec(smooth.style.transform || '');
    const cur = m ? Math.abs(parseFloat(m[1])) : window.scrollY;
    return cur;
  }
  function visualTop(el){
    // distance from viewport top, ignoring element transforms
    return el.offsetTop - currentSmoothOffset();
  }
  function visualBottom(el){
    return visualTop(el) + el.offsetHeight;
  }

  let activeId = '__greet__';
  let ticking = false;

  function updateActive(){
    ticking = false;

    const threshold = getBarHeight() + 6;
    const work = document.getElementById('work');

    // Show greeting until Experience is reached
    if (work){
      const t = visualTop(work);
      if (t - threshold > 0){
        if (activeId !== '__greet__'){
          activeId = '__greet__';
          animator.set(GREETING);
        }
        highlight(null);
        return;
      }
    }

    // Snap to last section when at the bottom
    const doc = document.scrollingElement || document.documentElement;
    if (window.innerHeight + window.scrollY >= (doc.scrollHeight - 1)){
      const last = sections[sections.length - 1];
      if (last.id !== activeId){
        activeId = last.id;
        animator.set(last.title);
        highlight(last.id);
      }
      return;
    }

    // Choose the section whose top is closest above the bar
    let best = null;
    let bestDelta = Infinity;

    for (const s of sections){
      const el = document.getElementById(s.id);
      if (!el) continue;
      const top = visualTop(el);
      const delta = Math.abs(top - threshold);
      if (top <= threshold + 1 && delta < bestDelta){
        best = s; bestDelta = delta;
      }
    }

    // If none above, pick the deepest visible one
    if (!best){
      for (let i = sections.length - 1; i >= 0; i--){
        const s = sections[i];
        const el = document.getElementById(s.id);
        if (!el) continue;
        const top = visualTop(el);
        const bottom = visualBottom(el);
        if (bottom > 0 && top < window.innerHeight * 0.98){
          best = s; break;
        }
      }
    }

    const newId = best?.id || sections[0].id;
    if (newId !== activeId){
      activeId = newId;
      animator.set(best?.title || GREETING);
      highlight(newId);
    }
  }

  function onScroll(){
    if (!ticking){ ticking = true; requestAnimationFrame(updateActive); }
  }

  function highlight(id){
    const links = aside.querySelectorAll('.vnav-item');
    links.forEach(a=>{
      const tgt = a.dataset.target || (a.getAttribute('href')||'').replace('#','');
      a.classList.toggle('active', !!id && tgt === id);
    });
  }

  window.addEventListener('scroll', onScroll, {passive:true});
  window.addEventListener('resize', ()=>{ setDropHeight(); onScroll(); }, {passive:true});
  window.addEventListener('load', ()=>{ setDropHeight(); onScroll(); });
  onScroll();
})();

// Modals
(function(){
  const openers = document.querySelectorAll('.card[data-modal]');
  const modals  = document.querySelectorAll('.modal');
  const open = (id) => {
    const m = document.getElementById(id);
    if (!m) return;
    m.classList.add('open');
    m.setAttribute('aria-hidden', 'false');
  };
  const close = (m) => {
    m.classList.remove('open');
    m.setAttribute('aria-hidden', 'true');
  };
  openers.forEach(c=> c.addEventListener('click', ()=> open(c.dataset.modal)));
  modals.forEach(m=>{
    m.addEventListener('click', (e)=>{ if (e.target === m) close(m); });
    m.querySelectorAll('[data-close]').forEach(btn=> btn.addEventListener('click', ()=> close(m)));
    document.addEventListener('keydown', (e)=>{ if (e.key === 'Escape' && m.classList.contains('open')) close(m); });
  });
})();

// Ambient canvas light (throttled ~30fps to reduce GPU load)
(function(){
  const c = document.getElementById('ambient');
  if (!c) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const ctx = c.getContext('2d', {alpha:true});
  const state = { mx: innerWidth*0.7, my: innerHeight*0.3 };
  addEventListener('mousemove', (e)=>{ state.mx = e.clientX; state.my = e.clientY; }, {passive:true});
  const resize = () => { c.width = Math.floor(innerWidth * dpr); c.height = Math.floor(innerHeight * dpr); };
  resize(); addEventListener('resize', resize, {passive:true});

  const orbs = [
    {x:.75,y:.25,r:420,a:.07,spx:.00007,spy:.00005,t:Math.random()*1000},
    {x:.2,y:.8,r:340,a:.06,spx:.00006,spy:.00004,t:Math.random()*1000},
    {x:.9,y:.85,r:280,a:.05,spx:.00005,spy:.00003,t:Math.random()*1000},
  ];

  let running = true;
  document.addEventListener('visibilitychange', ()=>{ running = !document.hidden; if (running && !reduce) requestAnimationFrame(draw); });

  let last = 0;
  const FPS_MS = 33;

  const draw = (ts=0) => {
    if ((ts - last) < FPS_MS) { if (running && !reduce) requestAnimationFrame(draw); return; }
    last = ts;

    const w = c.width, h = c.height;
    ctx.clearRect(0,0,w,h);
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#6AA6FF';

    const sweep = ctx.createLinearGradient(0,0,w,h);
    sweep.addColorStop(0,'rgba(255,255,255,0.01)'); sweep.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle = sweep; ctx.fillRect(0,0,w,h);

    orbs.forEach(o=>{
      o.t += 1;
      const dx = Math.sin(o.t*o.spx)*0.02, dy = Math.cos(o.t*o.spy)*0.02;
      const x = (o.x+dx)*w, y = (o.y+dy)*h, r = o.r*dpr;
      const g = ctx.createRadialGradient(x,y,r*0.1,x,y,r);
      g.addColorStop(0, hexToRgba(accent, o.a*1.3)); g.addColorStop(1,'rgba(0,0,0,0)');
      ctx.globalCompositeOperation='lighter'; ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); ctx.globalCompositeOperation='source-over';
    });

    const hx = state.mx*dpr, hy = state.my*dpr;
    const halo = ctx.createRadialGradient(hx,hy,0,hx,hy,220*dpr);
    halo.addColorStop(0, hexToRgba(accent,.06)); halo.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(hx,hy,220*dpr,0,Math.PI*2); ctx.fill();

    if (running && !reduce) requestAnimationFrame(draw);
  };

  function hexToRgba(hex,a){const h=hex.replace('#','');const f=h.length===3?h.split('').map(c=>c+c).join(''):h;const n=parseInt(f,16);const r=(n>>16)&255,g=(n>>8)&255,b=n&255;return `rgba(${r},${g},${b},${a})`}
  if (!reduce) requestAnimationFrame(draw);
})();

/* ===== Hero name morph to top-left ===== */
(function(){
  const name = document.getElementById('morphName');
  const target = document.getElementById('brandTarget');
  const hero   = document.getElementById('home');
  if (!name || !target || !hero) return;

  const mediaOK = window.matchMedia('(min-width: 901px)');
  function clamp(n, min, max){return Math.max(min, Math.min(max, n));}

  function update(){
    if (!mediaOK.matches){
      name.style.visibility = ''; // ensure visible again on mobile
      name.style.transform = '';
      target.style.opacity = 0;
      return;
    }
    const heroRect   = hero.getBoundingClientRect();
    const nameRect   = name.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    const viewportH = window.innerHeight || 1;
    const end   = Math.max(120, Math.min(heroRect.height*0.7, viewportH*0.9));
    const scrolled = clamp(window.scrollY - hero.offsetTop, 0, end);
    const p = clamp(scrolled / end, 0, 1);

    const dx = (targetRect.left - nameRect.left);
    const dy = (targetRect.top  - nameRect.top);
    const scale = targetRect.width / Math.max(1, nameRect.width);

    const tX = dx * p;
    const tY = dy * p;
    const s  = 1 + (scale - 1) * p;
    name.style.transform = `translate(${tX}px, ${tY}px) scale(${s})`;
    target.style.opacity = p > 0 ? Math.min(1, p*1.2) : 0;

    // FIX: Do NOT switch to position:fixed (no layout jump). Hide when "pinned".
    if (p >= 0.999){
      name.style.transform = '';
      name.style.visibility = 'hidden'; // reserve layout, no jump
    }else{
      name.style.visibility = '';
    }
  }

  document.addEventListener('scroll', ()=> requestAnimationFrame(update), {passive:true});
  window.addEventListener('resize', update, {passive:true});
  update();
})();

/* ===== Kingston location + live time ===== */
(function(){
  const LAT = 44.2312, LON = -76.4860, TZ = 'America/Toronto';
  const coordsEl = document.getElementById('coords');
  const clockEl  = document.getElementById('clock');
  const coordsElDesk = document.getElementById('coordsDesk');
  const clockElDesk  = document.getElementById('clockDesk');
  const geoRoot  = document.getElementById('geoClock');
  const toggleBtn= document.getElementById('geoToggle');
  if (!coordsEl || !clockEl) return;

  function toDMS(dec, isLat){
    const abs = Math.abs(dec);
    const deg = Math.floor(abs);
    const minFloat = (abs - deg) * 60;
    const min = Math.floor(minFloat);
    const sec = Math.round((minFloat - min) * 60);
    const hemi = isLat ? (dec >= 0 ? 'N' : 'S') : (dec >= 0 ? 'E' : 'W');
    return `${deg}° ${String(min).padStart(2,'0')}' ${String(sec).padStart(2,'0')}" ${hemi}`;
  }
  const dmsText = `${toDMS(LAT,true)}  ${toDMS(LON,false)}`;
  coordsEl.textContent = dmsText;
  if (coordsElDesk) coordsElDesk.textContent = dmsText;

  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ, hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:false, timeZoneName:'short'
  });

  function tick(){
    const parts = fmt.formatToParts(new Date());
    const time = parts.filter(p=>['hour','minute','second'].includes(p.type)).map(p=>p.value).join(':');
    const tzname = parts.find(p=>p.type==='timeZoneName')?.value || '';
    const out = `${time} ${tzname}`;
    clockEl.textContent = out;
    if (clockElDesk) clockElDesk.textContent = out;
  }
  tick();
  setInterval(tick, 1000);

  if (geoRoot && toggleBtn){
    const mq = window.matchMedia('(max-width: 900px)');
    function sync(){
      if (!mq.matches){
        geoRoot.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded','false');
        return;
      }
      const expanded = geoRoot.classList.contains('open');
      toggleBtn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    }
    toggleBtn.addEventListener('click', ()=>{
      geoRoot.classList.toggle('open');
      toggleBtn.setAttribute('aria-expanded', geoRoot.classList.contains('open') ? 'true' : 'false');
    });
    window.addEventListener('resize', sync, {passive:true});
    sync();
  }
})();

/* ===== Subtle inertial smooth scrolling ===== */
(function(){
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(pointer: fine)').matches;
  const smoothEl = document.getElementById('smooth');
  if (!smoothEl || reduce || !fine) return;

  document.body.classList.add('has-smooth');

  const setHeight = () => { document.body.style.height = smoothEl.scrollHeight + 'px'; };
  let target = window.scrollY;
  let current = target;
  const ease = 0.12;

  // Event-driven RAF that idles when settled
  let rafId = null;
  let lastActiveAt = 0;
  const IDLE_AFTER = 120;

  function step(){
    rafId = null;
    current += (target - current) * ease;
    if (Math.abs(target - current) < 0.05) current = target;
    smoothEl.style.transform = `translate3d(0, ${-current.toFixed(2)}px, 0)`;

    const now = performance.now();
    const moving = Math.abs(target - current) >= 0.05;
    if (moving){ lastActiveAt = now; }
    if (moving || (now - lastActiveAt) < IDLE_AFTER){
      rafId = requestAnimationFrame(step);
    }
  }
  function ensureRAF(){ if (rafId == null) rafId = requestAnimationFrame(step); }

  function onScroll(){ target = window.scrollY; ensureRAF(); }
  function onResize(){ setHeight(); target = window.scrollY; ensureRAF(); }

  setHeight();
  window.addEventListener('resize', onResize, {passive:true});
  window.addEventListener('scroll', onScroll, {passive:true});
  ensureRAF();

  if (document.fonts && document.fonts.ready) { document.fonts.ready.then(setHeight).catch(()=>{}); }
  window.addEventListener('load', setHeight, {once:true});
  setTimeout(setHeight, 250);
  const ro = new ResizeObserver(setHeight);
  ro.observe(smoothEl);
})();

/* ===== Stack badges: staggered pop-in ===== */
(function(){
  const section = document.getElementById('stack');
  if (!section) return;
  const badges = [...section.querySelectorAll('.badge')];
  badges.forEach((b,i)=> b.style.setProperty('--i', i));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce){ badges.forEach(b=>b.classList.add('in')); return; }
  if (!('IntersectionObserver' in window)){ badges.forEach(b=>b.classList.add('in')); return; }

  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if (!e.isIntersecting) return;
      badges.forEach((b,i)=>{
        b.style.transitionDelay = (i*18) + 'ms';
        b.classList.add('in');
      });
      io.disconnect();
    });
  }, {rootMargin: '0px 0px -10% 0px', threshold: 0.05});
  io.observe(section);
})();

/* ===== Assign deterministic float delays to about chips ===== */
(function(){
  const chips = document.querySelectorAll('.chips.floaty .chip');
  chips.forEach((c,i)=> c.style.setProperty('--i', i));
})();

/* =========================================================================
   WebGPU Résumé Chatbot — LLM answers everything (dynamic + accurate)
   + Quick actions (chips) shown ONLY when model is loaded
   ========================================================================= */
(function(){
  try {
    const openBtn  = document.getElementById('chatOpenBtn');
    const overlay  = document.getElementById('chatWidget');
    const panel    = overlay?.querySelector('.chat-panel');
    const closeBtn = document.getElementById('chatCloseBtn');

    const logEl    = document.getElementById('chatLog');
    const form     = document.getElementById('chatForm');
    const input    = document.getElementById('chatInput');
    const sendBtn  = document.getElementById('chatSendBtn');

    const statusRow= document.querySelector('.chat-status');
    const statusEl = document.getElementById('chatStatus');

    const progWrap = document.getElementById('chatProgress');
    const progBar  = document.getElementById('chatProgressBar');
    const progLbl  = document.getElementById('chatProgressLabel');

    const gpuBadgeBtn    = document.getElementById('gpuBadge');
    const gpuBadgeHeader = document.getElementById('gpuBadgeHeader');

    if (!openBtn || !overlay || !panel || !form || !input || !logEl) return;

    const isLocalhost = ['localhost','127.0.0.1','[::1]'].some(h => location.hostname === h) || location.hostname.endsWith('.localhost');
    const isSecure = (window.isSecureContext && location.protocol === 'https:') || isLocalhost;
    const webgpuOk = !!navigator.gpu && isSecure;

    const setGpuBadge = (txt) => {
      if (gpuBadgeBtn)    gpuBadgeBtn.textContent = txt;
      if (gpuBadgeHeader) gpuBadgeHeader.textContent = txt;
    };
    setGpuBadge(webgpuOk ? 'On' : 'Off');

    const MODEL_PREFS = [
      'Qwen2.5-1.5B-Instruct-q4f16_1-MLC',
      'Qwen2.5-0.5B-Instruct-q4f16_1-MLC'
    ];

    let engine = null;
    let loading = false;

    const history = [];

    const ctx = getPreferredContextOrBuild();

    const SYSTEM = [
      "You are 'DarwinBot', a friendly, concise assistant for Darwin Chen's résumé site.",
      "Answer using ONLY the provided CONTEXT. If something isn't present, say you don't know and point to the résumé PDF link available on the page.",
      "Style: conversational and helpful. Use short sentences. If listing multiple items, use bullets.",
      "Keep answers focused and ≤ ~120 words unless asked for more. Avoid repeating the entire résumé.",
      "Never invent employers, schools, dates, or skills beyond what appears in CONTEXT."
    ].join("\n");

    let quickShown = false;
    function ensureQuickActions(){
      if (quickShown || !form || !input) return;
      const row = document.createElement('div');
      row.id = 'chatQuick';
      row.setAttribute('role','group');
      row.setAttribute('aria-label','Quick suggestions');
      row.style.gridColumn = '1 / -1';
      row.style.display = 'flex';
      row.style.gap = '8px';
      row.style.flexWrap = 'wrap';
      row.style.marginBottom = '6px';
      const mkChip = (label, message) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'quick-chip';
        b.style.border = '1px solid var(--line)';
        b.style.background = 'color-mix(in srgb,var(--card) 96%, transparent)';
        b.style.borderRadius = '999px';
        b.style.padding = '.5rem .8rem';
        b.style.cursor = 'pointer';
        b.style.boxShadow = 'var(--shadow)';
        b.style.color = 'var(--text)';
        b.style.fontSize = '.92rem';
        b.style.transition = 'filter .16s ease, transform .16s ease, border-color .16s ease';
        b.addEventListener('mouseenter', ()=>{ b.style.filter = 'brightness(1.02)'; b.style.transform = 'translateY(-1px)'; });
        b.addEventListener('mouseleave', ()=>{ b.style.filter = ''; b.style.transform = ''; });
        b.textContent = label;
        b.addEventListener('click', ()=>{
          input.value = message;
          form.requestSubmit();
        });
        return b;
      };
      row.appendChild(mkChip('Ask about my work experience', 'What did you do at your roles?'));
      row.appendChild(mkChip('Ask about my projects', 'Tell me about your projects.'));
      form.prepend(row);
      quickShown = true;
    }

    function openChat(){
      overlay.classList.add('open');
      overlay.setAttribute('aria-hidden','false');
      setTimeout(()=> input.focus({ preventScroll: true }), 0);
      trapFocus(panel);

      if (webgpuOk && !engine && !loading){
        showStatus('Loading local model…', true);
        initModel().catch(()=>{});
      } else if (!webgpuOk){
        showStatus('Fallback mode (enable WebGPU via https/localhost).', false);
        setTimeout(hideStatus, 1600);
        ungateInputs();
      } else if (engine){
        hideStatus();
        ungateInputs();
        ensureQuickActions();
      }
    }

    function closeChat(){
      overlay.classList.remove('open');
      overlay.setAttribute('aria-hidden','true');
      untrapFocus();
    }

    openBtn.addEventListener('click', openChat);
    if (closeBtn) closeBtn.addEventListener('click', closeChat);
    document.addEventListener('keydown', (e)=>{ if (e.key === 'Escape' && overlay.classList.contains('open')) closeChat(); });

    function trapFocus(scope){
      const focusables = scope.querySelectorAll('a,button,textarea,input,select,[tabindex]:not([tabindex="-1"])');
      const first = focusables[0], last = focusables[focusables.length-1];
      function onKey(e){
        if (e.key !== 'Tab') return;
        if (e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
      }
      scope.__focusTrap = onKey;
      scope.addEventListener('keydown', onKey);
    }
    function untrapFocus(){ if (panel?.__focusTrap) panel.removeEventListener('keydown', panel.__focusTrap); }

    function showStatus(text, withProgress){
      if (!statusRow) return;
      statusRow.classList.remove('hidden');
      if (panel) panel.classList.remove('status-hidden');
      if (statusEl) statusEl.textContent = text || '';
      if (progWrap) progWrap.hidden = !withProgress;
      if (!withProgress){
        if (progBar) progBar.style.width = '0%';
        if (progLbl) progLbl.textContent = '0%';
      }
    }
    function hideStatus(){
      if (!statusRow) return;
      statusRow.classList.add('hidden');
      if (panel) panel.classList.add('status-hidden');
    }

    function gateForModelLoad(){
      loading = true;
      showStatus('Loading local model…', true);
      if (sendBtn) sendBtn.disabled = true;
      if (input){
        input.disabled = true;
        input.placeholder = 'Loading local model…';
      }
    }
    function ungateInputs(){
      loading = false;
      if (sendBtn) sendBtn.disabled = false;
      if (input){
        input.disabled = false;
        input.placeholder = 'Ask about experience, projects, tools…';
      }
    }

    form.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const q = input.value.trim();
      if (!q) return;
      if (loading && webgpuOk){
        showStatus('Still preparing the local model…', true);
        return;
      }
      addMsg('user', q);
      input.value = '';
      await respond(q);
    });

    input.addEventListener('keydown', (e)=>{
      if (e.key === 'Enter' && !e.shiftKey){
        e.preventDefault();
        form.requestSubmit();
      }
    });

    function addMsg(role, content){
      const card = document.createElement('div');
      card.className = `msg ${role}`;
      const r = document.createElement('div'); r.className = 'role'; r.textContent = role === 'user' ? 'You' : 'DarwinBot';
      const c = document.createElement('div'); c.className = 'content'; c.textContent = content;
      card.appendChild(r); card.appendChild(c);
      logEl.appendChild(card);
      logEl.scrollTop = logEl.scrollHeight;
      return c;
    }

    async function initModel(){
      try{
        gateForModelLoad();
        const { CreateMLCEngine } = await import('https://esm.run/@mlc-ai/web-llm');
        let lastErr = null;
        for (const modelName of MODEL_PREFS){
          try{
            engine = await CreateMLCEngine(modelName, {
              initProgressCallback: ({ progress, text }) => {
                const pct = Math.round((progress || 0) * 100);
                if (progBar) progBar.style.width = pct + '%';
                if (progLbl) progLbl.textContent = pct + '%';
                if (statusEl) statusEl.textContent = `Preparing model… ${pct}%${text ? ' · ' + text : ''}`;
              }
            });
            setGpuBadge('On');
            break;
          }catch(err){
            lastErr = err;
            engine = null;
          }
        }
        if (!engine && lastErr) throw lastErr;
        hideStatus();
        ungateInputs();
        ensureQuickActions();
      }catch(err){
        console.warn('WebLLM init failed, falling back to rule-based answers.', err);
        setGpuBadge('Off');
        showStatus('Fallback mode (model unavailable).', false);
        setTimeout(hideStatus, 1600);
        engine = null;
      }finally{
        ungateInputs();
      }
    }

    function tokenize(t){ return (t||'').toLowerCase().replace(/[^a-z0-9\s]/g,' ').split(/\s+/).filter(Boolean); }
    function score(docToks, qToks){
      const set = new Set(docToks);
      let s = 0; for (const t of qToks){ if (set.has(t)) s++; }
      return s;
    }
    function relevantContext(query, rawContext, k=8, maxChars=1100){
      const cleaned = rawContext
        .replace(/^==.*?==$/gm,'')
        .replace(/^\s*[A-Z]{2,8}\s*$/gm,'')
        .replace(/\n{2,}/g,'\n\n')
        .trim();
      const q = tokenize(query);
      const chunks = cleaned.split('\n\n').map(c => c.trim()).filter(Boolean);
      const scored = chunks.map(c => ({ c, s: score(tokenize(c), q) }))
                           .sort((a,b)=> b.s - a.s)
                           .slice(0,k)
                           .map(x=>x.c);
      let buf = '';
      for (const c of scored){
        if ((buf + '\n\n' + c).length > maxChars) break;
        buf += (buf ? '\n\n' : '') + c;
      }
      return buf || cleaned.slice(0, maxChars);
    }
    function relevanceScore(query, rawContext){
      const q = tokenize(query);
      const c = tokenize(rawContext);
      return score(c, q);
    }

    function polish(text){
      let t = (text||'').replace(/\r/g,'').replace(/ {2,}/g,' ').replace(/\n{3,}/g,'\n\n');
      t = t.replace(/^(assistant|darwinbot)\s*:\s*/i,'');
      const lines = t.split('\n');
      const seen = new Set(); const out = [];
      for (const line of lines){
        const key = line.trim().toLowerCase();
        if (key && !seen.has(key)){ out.push(line); seen.add(key); }
      }
      t = out.join('\n').trim();
      return t.length > 1200 ? t.slice(0, 1200) + '…' : t;
    }

    function composeMessages(userQ, ctxSnippet){
      const tail = history.slice(-6);
      const msgs = [{ role: 'system', content: SYSTEM }];
      for (const m of tail){ msgs.push(m); }
      msgs.push({
        role: 'user',
        content:
          `CONTEXT (from page or provided JSON):\n${ctxSnippet}\n\n` +
          `QUESTION: ${userQ}\n\n` +
          `If the answer is not explicitly supported by CONTEXT, say you don't know and point to the résumé PDF link on the page.`
      });
      return msgs;
    }

    async function respond(q){
      const sink = addMsg('assistant', '');
      const ctxSnippet = relevantContext(q, ctx, 8, 1100);
      const rel = relevanceScore(q, ctxSnippet);

      if (rel < 2){
        const a = document.querySelector('a.btn[href$=".pdf"]');
        const link = a ? a.href : 'the résumé PDF on this page';
        const msg  = "I don’t have that in the on-page context. Please check " + link + ".";
        sink.textContent = msg;
        history.push({ role: 'user', content: q });
        history.push({ role: 'assistant', content: msg });
        return;
      }

      if (engine){
        try{
          const messages = composeMessages(q, ctxSnippet);
          const chunks = await engine.chat.completions.create({
            messages,
            temperature: 0.2,
            top_p: 0.7,
            max_tokens: 384,
            stream: true,
            stream_options: { include_usage: true }
          });

          let full = '';
          for await (const ch of chunks){
            const delta = ch?.choices?.[0]?.delta?.content || '';
            if (delta){
              full += delta;
              sink.textContent = polish(full);
              logEl.scrollTop = logEl.scrollHeight;
            }
          }
          const finalText = polish(full) || "I’m not seeing that in the page context. You can check the résumé PDF linked above.";
          sink.textContent = finalText;

          history.push({ role: 'user', content: q });
          history.push({ role: 'assistant', content: finalText });
          return;
        }catch(err){
          console.warn('WebLLM generation error:', err);
          sink.textContent = "Local generation hit a snag. I’ll answer from the page content directly.";
        }
      }

      const answer = fallbackQA(q, ctxSnippet);
      sink.textContent = answer;
      history.push({ role: 'user', content: q });
      history.push({ role: 'assistant', content: answer });
    }

    function getPreferredContextOrBuild(){
      try{
        if (typeof window.__RESUME_CONTEXT__ === 'string' && window.__RESUME_CONTEXT__.trim().length > 0){
          return window.__RESUME_CONTEXT__;
        }
        const node = document.getElementById('resumeContext');
        if (node && node.textContent){
          return String(node.textContent).trim();
        }
      }catch(_){}
      return buildResumeContextWithDerivedFacts();
    }

    function buildResumeContextWithDerivedFacts(){
      const pickText = (sel) => [...document.querySelectorAll(sel)].map(n => n.textContent.trim()).filter(Boolean).join('\n');

      const deriveFacts = ()=>{
        const months = {jan:0,feb:1,mar:2,apr:3,may:4,jun:5,jul:6,aug:7,sep:8,sept:8,oct:9,nov:10,dec:11};
        const parseRange = (s)=>{
          const m = /([A-Za-z]{3,9})\s+(\d{4})\s*[–-]\s*([A-Za-z]{3,9})\s+(\d{4})/.exec(s);
          if (!m) return null;
          const sm = months[m[1].toLowerCase()] ?? null;
          const sy = +m[2]; const em = months[m[3].toLowerCase()] ?? null; const ey = +m[4];
          if (sm==null || em==null || !sy || !ey) return null;
          const startIndex = sy*12 + sm;
          const endIndex   = ey*12 + em;
          const diff = Math.max(0, endIndex - startIndex);
          return {start:`${m[1]} ${sy}`, end:`${m[3]} ${ey}`, months: diff};
        };

        const facts = [];
        document.querySelectorAll('#work .t-card').forEach(card=>{
          const role = card.querySelector('.t-head h3')?.textContent?.trim();
          const when = card.querySelector('.t-head .when')?.textContent?.trim();
          if (!role || !when) return;
          const r = parseRange(when);
          if (r){
            const approx = r.months;
            facts.push(`• ${role}: ${r.start} – ${r.end} (about ${approx} months)`);
          }
        });
        return facts.join('\n');
      };

      const parts = [
        '== HERO ==',
        pickText('.hero .lead'),
        pickText('.cta-row .btn[href$=".pdf"]'),
        '== EXPERIENCE ==',
        pickText('#work .t-card'),
        '== PROJECTS ==',
        pickText('#projects .card-body'),
        '== EDUCATION ==',
        pickText('.edu'),
        '== LEADERSHIP ==',
        pickText('#about .bullets'),
        '== FOCUS ==',
        pickText('#about .chips'),
        '== STACK ==',
        pickText('#stack .badge'),
        '== CONTACT ==',
        pickText('#contact .c-right'),
        '== DERIVED FACTS ==',
        deriveFacts()
      ];
      return parts.join('\n').replace(/\n{3,}/g, '\n\n');
    }

    function fallbackQA(query, context){
      const cleaned = context
        .replace(/^==.*?==$/gm,'')
        .replace(/^\s*[A-Z]{2,8}\s*$/gm,'')
        .replace(/\n{2,}/g,'\n\n')
        .trim();

      const q = tokenize(query);
      const chunks = cleaned.split('\n\n').map(c => c.trim()).filter(Boolean);
      const scored = chunks.map(c => ({ c, s: score(tokenize(c), q) }))
                           .sort((a,b)=> b.s - a.s)
                           .slice(0,6);
      if (!scored.length || scored[0].s === 0){
        const a = document.querySelector('a.btn[href$=".pdf"]');
        const link = a ? a.href : 'the résumé PDF on this page';
        return `I couldn’t find that in the on-page context. Please check ${link}.`;
      }
      const top = scored.map(x => x.c.replace(/\s+/g,' ').trim()).join('\n\n');
      return polish(top);
    }
  } catch (err){
    console.warn('Chat overlay init error:', err);
  }
})();
