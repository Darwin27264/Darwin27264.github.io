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

// Fetch Live Weather for Ottawa, ON (No API Key Required)
(function () {
  async function fetchWeather() {
    try {
      // Open-Meteo free API - Coordinates for Ottawa, Ontario
      const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=45.4215&longitude=-75.6972&current_weather=true');
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

  function getAssistantResponse(prompt) {
    const p = prompt.toLowerCase();
    if (p.includes('ericsson') || p.includes('job') || p.includes('work') || p.includes('role') || p.includes('cloudran')) {
      return "Darwin is currently working full-time at Ericsson as a Software Engineer (SWE 5G/6G CloudRAN) in Ottawa, ON.";
    }
    if (p.includes('ottawa') || p.includes('location') || p.includes('where') || p.includes('city') || p.includes('kingston')) {
      return "Darwin is currently based in Ottawa, ON (previously Kingston).";
    }
    if (p.includes('queen') || p.includes('degree') || p.includes('graduat') || p.includes('scholarship') || p.includes('education') || p.includes('honour')) {
      return "Darwin graduated from Queen's University with a Bachelor of Computing Honours (AI Specialization), awarded the Queen's University Excellence Scholarship and Dean's Honour List (2022 & 2024).";
    }
    if (p.includes('ofln') || p.includes('project') || p.includes('llm') || p.includes('mobile') || p.includes('llama')) {
      return "Darwin's flagship project is ofln: an open-source, fully offline on-device LLM chat application for Android & iOS built with llama.rn and React Native (https://github.com/Darwin27264/ofln).";
    }
    return "Thanks for your inquiry! Darwin is a Software Engineer at Ericsson (5G/6G CloudRAN) based in Ottawa, ON. Feel free to explore his projects on this site, inspect his résumé, or contact him at darwinchen8@outlook.com.";
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (!q) return;

    addMsg('user', q);
    input.value = '';

    setTimeout(() => {
      addMsg('assistant', getAssistantResponse(q));
    }, 500);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      form.requestSubmit();
    }
  });
})();