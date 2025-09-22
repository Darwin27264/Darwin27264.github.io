// Theme toggle with animated transition + correct icon inversion
(function () {
  const root = document.documentElement;
  const btn  = document.getElementById('themeToggle');
  const key  = 'darwin-theme';
  const saved = localStorage.getItem(key);
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = saved ? saved : (systemDark ? 'dark' : 'light');
  root.setAttribute('data-theme', initial);
  btn.setAttribute('aria-pressed', initial === 'dark');

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

  btn.addEventListener('click', () => {
    withTransition(() => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem(key, next);
      btn.setAttribute('aria-pressed', next === 'dark');
      updateMeta(); // sync browser UI
    });
  });
})();

// Progress hairline + "scroll-active" flag for fading geo card while scrolling
(function(){
  const bar = document.getElementById('progress');
  const root = document.documentElement;
  let timer;

  const updateBar = () => {
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight);
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

/* ===== Smooth anchors (works with inertial scroller if enabled) ===== */
(function(){
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', e=>{
      const id = a.getAttribute('href');
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();

      // If inertial scroller is active, compute target using its current offset
      const smooth = document.getElementById('smooth');
      const hasSmooth = document.body.classList.contains('has-smooth');
      let current = hasSmooth ? parseFloat((/translate3d\(0px,\s*(-?\d+(\.\d+)?)px/).exec(smooth.style.transform)?.[1] || 0) * -1 : window.scrollY;
      const y = el.getBoundingClientRect().top + current;

      window.scrollTo({behavior:'smooth', top: y});
      history.pushState(null, '', id);
    });
  });
})();

// Scrollspy (fix: at top, none selected)
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

// Ambient canvas light (paused when tab hidden)
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

  const draw = () => {
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

/* ===== (Removed) Footer last updated auto-script
   Footer is now a fixed date in HTML to ensure consistency. ===== */

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
      name.classList.remove('pinned'); name.style.transform = ''; target.style.opacity = 0; return;
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

    if (p >= 0.999){
      name.classList.add('pinned');
      name.style.transform = '';
      name.style.setProperty('--brand-top',  targetRect.top + 'px');
      name.style.setProperty('--brand-left', targetRect.left + 'px');
      name.style.setProperty('--brand-scale', scale);
    }else{
      name.classList.remove('pinned');
    }
  }

  document.addEventListener('scroll', ()=> requestAnimationFrame(update), {passive:true});
  window.addEventListener('resize', update);
  update();
})();

/* ===== Bottom-right Kingston location + live time ===== */
(function(){
  // Kingston, Ontario approx: 44.2312° N, -76.4860° W
  const LAT = 44.2312, LON = -76.4860, TZ = 'America/Toronto';
  const coordsEl = document.getElementById('coords');
  const clockEl  = document.getElementById('clock');
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
  coordsEl.textContent = `${toDMS(LAT,true)}  ${toDMS(LON,false)}`;

  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ, hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:false, timeZoneName:'short'
  });

  function tick(){
    const parts = fmt.formatToParts(new Date());
    const time = parts.filter(p=>['hour','minute','second'].includes(p.type)).map(p=>p.value).join(':');
    const tzname = parts.find(p=>p.type==='timeZoneName')?.value || '';
    clockEl.textContent = `${time} ${tzname}`;
  }
  tick();
  setInterval(tick, 1000);
})();

/* ===== Subtle inertial smooth scrolling (desktop, respects Reduced Motion) ===== */
(function(){
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(pointer: fine)').matches; // desktop/laptop mice & trackpads
  const smoothEl = document.getElementById('smooth');
  if (!smoothEl || reduce || !fine) return;

  document.body.classList.add('has-smooth');

  const setHeight = () => { document.body.style.height = smoothEl.scrollHeight + 'px'; };
  let target = window.scrollY;
  let current = target;
  const ease = 0.12; // lower = laggier, keep subtle

  function raf(){
    current += (target - current) * ease;
    // snap when close to avoid jitter
    if (Math.abs(target - current) < 0.05) current = target;
    smoothEl.style.transform = `translate3d(0, ${-current.toFixed(2)}px, 0)`;
    requestAnimationFrame(raf);
  }

  function onScroll(){ target = window.scrollY; }
  function onResize(){ setHeight(); target = window.scrollY; }

  // Robust height syncing to prevent disappearing footer/content
  setHeight();
  window.addEventListener('resize', onResize);
  window.addEventListener('scroll', onScroll, {passive:true});
  requestAnimationFrame(raf);

  // Recompute when fonts/images/content resize
  if (document.fonts && document.fonts.ready) { document.fonts.ready.then(setHeight).catch(()=>{}); }
  window.addEventListener('load', setHeight);
  setTimeout(setHeight, 250); // after initial layout
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
