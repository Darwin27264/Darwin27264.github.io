// Reliable Theme Toggle Logic
(function () {
  const root = document.documentElement;
  const btn = document.getElementById('themeToggle');
  const saved = localStorage.getItem('darwin-theme');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Set initial theme based on local storage or system pref
  const initial = saved ? saved : (systemDark ? 'dark' : 'light');
  root.setAttribute('data-theme', initial);

  if (btn) {
    btn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('darwin-theme', next);
    });
  }
})();

// Fetch Live Weather for Kingston, ON (No API Key Required)
(function () {
  async function fetchWeather() {
    try {
      // Open-Meteo free API - Coordinates for Kingston, Ontario
      const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=44.2312&longitude=-76.4860&current_weather=true');
      const data = await res.json();
      const temp = Math.round(data.current_weather.temperature);
      const weatherEl = document.getElementById('weatherStatus');

      if(weatherEl) {
        weatherEl.textContent = `${temp}°C LOCAL`;
      }
    } catch (e) {
      console.error('Weather fetch failed, falling back to default text.', e);
      // Keep the default "--°C LOCAL" text if fetch fails
    }
  }
  fetchWeather();
})();

// Intersection Observer for Smooth Scroll Reveals
(function () {
  const els = document.querySelectorAll('.reveal-up, .reveal-scale, .reveal-stagger, .fade-up');

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!('IntersectionObserver' in window) || reduce) {
    els.forEach(el => el.classList.add('is-in'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    });
  }, {
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.05
  });

  els.forEach((el) => io.observe(el));
})();

// Chatbot UI Wrapper
(function(){
  const openBtn = document.getElementById('chatOpenBtn');
  const overlay = document.getElementById('chatWidget');
  const closeBtn = document.getElementById('chatCloseBtn');
  const form = document.getElementById('chatForm');
  const input = document.getElementById('chatInput');
  const logEl = document.getElementById('chatLog');

  if (!openBtn || !overlay) return;

  function openChat() {
    overlay.classList.add('open');
    input.focus();
  }

  function closeChat() {
    overlay.classList.remove('open');
  }

  openBtn.addEventListener('click', openChat);
  closeBtn.addEventListener('click', closeChat);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeChat();
  });

  function addMsg(role, content) {
    const card = document.createElement('div');
    card.className = `msg ${role}`;
    card.textContent = content;
    logEl.appendChild(card);
    logEl.scrollTop = logEl.scrollHeight;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (!q) return;

    addMsg('user', q);
    input.value = '';

    setTimeout(() => {
      addMsg('assistant', "Thanks for your inquiry. To view full details about my work, please refer to the resume linked on this page or reach out via email.");
    }, 800);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      form.requestSubmit();
    }
  });
})();