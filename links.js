// ==========================================================================
// DARWIN CHEN — LINKS & PROFILES HUB INTERACTIVE SCRIPTS
// ==========================================================================

// 1. Theme Toggle Logic (Synchronized with Portfolio & Dynamic Canvas)
(function () {
  const root = document.documentElement;
  const btn = document.getElementById('themeToggle');
  const saved = localStorage.getItem('darwin-theme');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  const initial = saved ? saved : (systemDark ? 'dark' : 'light');
  root.setAttribute('data-theme', initial);

  if (btn) {
    btn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('darwin-theme', next);
      window.dispatchEvent(new CustomEvent('themeChanged', { detail: next }));
    });
  }
})();

// 2. Clean, Subtle Cascading Entrance Animation Choreography
(function () {
  function initEntrance() {
    const cards = document.querySelectorAll('.link-card');
    cards.forEach((card, i) => {
      card.style.animationDelay = `${0.22 + i * 0.052}s`;
    });

    requestAnimationFrame(() => {
      document.body.classList.add('animate-ready');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEntrance);
  } else {
    initEntrance();
  }
})();

// 3. Interactive Cursor Spotlight Shimmer on Cards
(function () {
  const cards = document.querySelectorAll('.link-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
})();

// 4. Live Ticking Ottawa Local Clock
(function () {
  const clockEl = document.getElementById('liveClock');
  if (!clockEl) return;

  function updateClock() {
    try {
      const now = new Date();
      const options = {
        timeZone: 'America/Toronto',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      };
      clockEl.textContent = new Intl.DateTimeFormat('en-US', options).format(now);
    } catch (e) {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      clockEl.textContent = `${h}:${m}:${s}`;
    }
  }

  updateClock();
  setInterval(updateClock, 1000);
})();

// 5. Live Weather Fetch for Ottawa, ON
(function () {
  async function fetchWeather() {
    try {
      const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=45.4215&longitude=-75.6972&current_weather=true');
      const data = await res.json();
      const temp = Math.round(data.current_weather.temperature);
      const weatherEl = document.getElementById('weatherStatus');
      if (weatherEl) {
        weatherEl.textContent = `${temp}°C LOCAL`;
      }
    } catch (e) {
      console.warn('Weather fetch failed, keeping default text.', e);
    }
  }
  fetchWeather();
})();


// 7. Playful Animated Greeting Typewriter & Rotator
(function () {
  const greetingBox = document.getElementById('greetingBox');
  const textEl = document.getElementById('greetingText');
  const emojiEl = document.getElementById('greetingEmoji');
  if (!textEl) return;

  const greetings = [
    { emoji: "👋", text: "Hey there!" },
    { emoji: "✨", text: "Welcome!" },
    { emoji: "☕", text: "Good to see you!" },
    { emoji: "🚀", text: "Glad you're here!" },
    { emoji: "💻", text: "Hello, world!" },
    { emoji: "👀", text: "Thanks for stopping by!" },
    { emoji: "⚡", text: "Hope you're having a great day!" }
  ];

  let currentIndex = 0;
  let isTyping = false;
  let typeTimeout = null;
  let cycleTimer = null;

  function typeWriter(targetText, targetEmoji, onComplete) {
    isTyping = true;
    if (emojiEl) emojiEl.textContent = targetEmoji;
    textEl.textContent = "";
    let charIndex = 0;

    function nextChar() {
      if (charIndex < targetText.length) {
        textEl.textContent += targetText.charAt(charIndex);
        charIndex++;
        const delay = Math.random() * 18 + 24;
        typeTimeout = setTimeout(nextChar, delay);
      } else {
        isTyping = false;
        if (onComplete) onComplete();
      }
    }

    nextChar();
  }

  function showNextGreeting() {
    clearTimeout(typeTimeout);
    clearTimeout(cycleTimer);
    currentIndex = (currentIndex + 1) % greetings.length;
    const next = greetings[currentIndex];

    textEl.style.opacity = "0.25";
    setTimeout(() => {
      textEl.style.opacity = "1";
      typeWriter(next.text, next.emoji, () => {
        scheduleNext();
      });
    }, 120);
  }

  function scheduleNext() {
    clearTimeout(cycleTimer);
    cycleTimer = setTimeout(showNextGreeting, 4800);
  }

  // Initial typewriter start
  const first = greetings[0];
  typeWriter(first.text, first.emoji, () => {
    scheduleNext();
  });

  if (greetingBox) {
    greetingBox.addEventListener('click', (e) => {
      e.preventDefault();
      showNextGreeting();
    });
  }
})();

// 8. Share & Quick-Copy Micro-Interactions with Toast
(function () {
  const shareBtn = document.getElementById('shareBtn');
  const toast = document.getElementById('linksToast');
  let toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    const textEl = toast.querySelector('.toast-text');
    if (textEl && message) textEl.textContent = message;

    toast.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('visible');
    }, 2400);
  }

  // Main Share Button
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      const shareData = {
        title: 'Darwin Chen — Links & Profiles',
        text: 'Darwin Chen — Software Engineer @ Ericsson & AI builder.',
        url: window.location.href
      };

      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        try {
          await navigator.share(shareData);
          return;
        } catch (err) {
          if (err.name !== 'AbortError') console.warn('Share sheet failed, falling back to copy.', err);
          else return;
        }
      }

      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast('Profile link copied to clipboard!');
      } catch (err) {
        showToast('Unable to copy profile link.');
      }
    });
  }

  // Mini Quick-Copy Buttons on Specific Link Cards
  const quickCopyBtns = document.querySelectorAll('.link-quick-copy');
  quickCopyBtns.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation(); // Prevent card navigation
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);
        btn.classList.add('copied');
        const origSvg = btn.innerHTML;
        btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
        showToast(`Copied: ${textToCopy}`);

        setTimeout(() => {
          btn.classList.remove('copied');
          btn.innerHTML = origSvg;
        }, 1800);
      } catch (err) {
        showToast('Unable to copy.');
      }
    });
  });
})();

// 8. Sticky HUD & Controls Scroll-Fade Behavior
(function () {
  let scrollTimeout = null;
  const onScroll = () => {
    if (!document.body.classList.contains('is-scrolling')) {
      document.body.classList.add('is-scrolling');
    }
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      document.body.classList.remove('is-scrolling');
    }, 450);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
})();

