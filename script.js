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
  function setupReveals() {
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
      rootMargin: '0px 0px -5% 0px',
      threshold: 0.02
    });

    els.forEach((el) => io.observe(el));

    // Instant reveal safeguard for top-of-page content
    requestAnimationFrame(() => {
      document.querySelectorAll('.hero .fade-up, .hero, #statement').forEach(el => el.classList.add('is-in'));
    });

    // Unconditional safety fallback: ensure every element is revealed even if observer is inactive or slow
    setTimeout(() => {
      document.querySelectorAll('.reveal-up, .reveal-scale, .fade-up').forEach(el => el.classList.add('is-in'));
    }, 600);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupReveals);
  } else {
    setupReveals();
  }
})();

// Chatbot UI & Dual-Tier AI Engine (WebGPU Local LLM + Instant Fast Fallback)
(function(){
  function setupChatbot() {
    const openBtn = document.getElementById('chatOpenBtn');
    const overlay = document.getElementById('chatWidget');
    const closeBtn = document.getElementById('chatCloseBtn');
    const form = document.getElementById('chatForm');
  const input = document.getElementById('chatInput');
  const logEl = document.getElementById('chatLog');
  const sendBtn = document.getElementById('chatSendBtn');

  // WebGPU & UI Elements
  const webgpuToggleBtn = document.getElementById('webgpuToggleBtn');
  const webgpuBtnText = document.getElementById('webgpuBtnText');
  const chatModeBadge = document.getElementById('chatModeBadge');
  const chatStatus = document.getElementById('chatStatus');
  const chatSpeedTag = document.getElementById('chatSpeedTag');
  const chatProgressWrap = document.getElementById('chatProgressWrap');
  const chatProgressBar = document.getElementById('chatProgressBar');
  const suggestionsWrap = document.getElementById('chatSuggestions');

  if (!openBtn || !overlay) return;

  // Engine state
  let webgpuActive = false;
  let isModelLoading = false;
  let engine = null;
  const conversationHistory = [];

  const SYSTEM_PROMPT = `You are DarwinBot, an intelligent and friendly portfolio assistant for Darwin Chen.
Answer questions accurately, conversationally, and concisely (1 to 2 short paragraphs or clean bullets) using ONLY the following verified facts.
If something is not present, politely say you do not know and invite them to view his resume or contact him via email.

VERIFIED FACTS:
- Current Role: Software Engineer (SWE 5G/6G CloudRAN) at Ericsson in Ottawa, ON (PRESENT). Focusing on CloudRAN software systems, high-performance telemetry, and wireless infrastructure.
- Past Experience: Software Developer Intern at Ericsson (Ottawa, ON, May 2024 – Aug 2025). Shipped React + OpenSearch observability dashboards auto-indexing 15+ Jenkins pipelines, reducing triage time by ~60%. Prototyped on-device LLM failure summarizer with llama.cpp converting 3,000+ error logs and 50,000+ lines into structured JSON. Built Python AST validation pipeline.
- Past Experience: Web Developer & Manager at Pathfinders (2021-2023, Fredericton, NB). PHP, HTML/CSS, JS internal tooling, campaign telemetry.
- Teaching: Teaching Assistant at Queen's University (Sept–Apr 2023-2026, Kingston, ON) for CISC 151 (Computing with Data Analytics) and CISC 203 (Discrete Structures II).
- Education: Bachelor of Computing Honours (Artificial Intelligence Specialization) at Queen's University. GRADUATED 2026.
- Honors & Awards: Queen's University Excellence Scholarship, Dean's Honour List (2022, 2024).
- Leadership: Perception Integration Team Lead at Queen's AutoDrive (SAE Lv.4 autonomous vehicle, MATLAB 3D sim, vision detection). Consulting Design Team Manager at QMIND (fine-tuned GPT + LangChain client pipeline).
- Flagship Project: ofln (https://github.com/Darwin27264/ofln) — Open-source offline on-device LLM chat for Android & iOS using llama.rn and React Native. Fully on-device, zero cloud, zero accounts, supports multimodal VLM, RAG, custom personas, and real-time tok/s & memory telemetry.
- Other Projects: cognito (OSINT dashboard, Next.js, React-Leaflet, TypeScript), Lexiloom (minimal word wallpaper generator), Fishing Mapper (lake and species data visualization), EzCap (Whisper + FFmpeg mobile captioning), AI Content Pipeline (Ollama, Whisper, FFmpeg, ElevenLabs).
- Technical Arsenal: Python, TypeScript, JavaScript, Java, C#, PHP, HTML/CSS. AI/ML: LLMs, LangChain, llama.cpp, RAG, PyTorch, TensorFlow, OpenCV, Jupyter, MATLAB. Frameworks: React, React Native, Next.js, Tailwind CSS, Node.js, ASP.NET. Tools: AWS, GCP, Docker, Jenkins, Git, OpenSearch, Firebase, Linux.
- Technical Writing & Blog: Darwin authors 'Metis (Μῆτις)', a technical engineering & systems architecture archive hosted directly on this portfolio (at /blog/ and blog/index.html). Named after the Greek concept of cunning craft and pragmatic intelligence, Metis features deep architectural breakdowns on on-device LLM inference (llama.rn, WebGPU, GGUF), local-first computing, and low-latency systems architecture.
- Location: Ottawa, ON, Canada (previously Kingston).
- Contact: darwinchen8@outlook.com | LinkedIn: /in/darwinchen | GitHub: @Darwin27264.`;

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
    return card;
  }

  // Fast Instant Knowledge Base Response (Tier 1)
  function getFastAssistantResponse(prompt) {
    const p = prompt.toLowerCase();
    if (p.includes('metis') || p.includes('blog') || p.includes('article') || p.includes('writing') || p.includes('essay') || p.includes('post') || p.includes('note') || p.includes('dispatch')) {
      return "Darwin authors 'Metis (Μῆτις)', a technical architecture publication right here on this portfolio (visit /blog/). Named after the ancient Greek concept of pragmatic intelligence and craft, Metis explores deep-dives into on-device LLM inference (llama.rn & WebGPU), local-first computing, and low-latency systems architecture.";
    }
    if (p.includes('ericsson') || p.includes('cloudran') || p.includes('role') || p.includes('job') || p.includes('work') || p.includes('career') || p.includes('current')) {
      return "Darwin is currently working full-time at Ericsson as a Software Engineer (SWE 5G/6G CloudRAN) in Ottawa, ON, engineering software infrastructure and high-performance CloudRAN architectures. He previously interned at Ericsson shipping React/OpenSearch observability dashboards and on-device LLM diagnostic tools.";
    }
    if (p.includes('ottawa') || p.includes('location') || p.includes('where') || p.includes('city') || p.includes('kingston') || p.includes('live')) {
      return "Darwin is based in Ottawa, ON, Canada (previously in Kingston during his studies at Queen's University).";
    }
    if (p.includes('queen') || p.includes('degree') || p.includes('graduat') || p.includes('scholarship') || p.includes('education') || p.includes('honour') || p.includes('school')) {
      return "Darwin graduated from Queen's University with a Bachelor of Computing Honours (Artificial Intelligence Specialization, Class of 2026). He was awarded the prestigious Queen's University Excellence Scholarship and named to the Dean's Honour List in both 2022 and 2024.";
    }
    if (p.includes('ofln') || p.includes('offline') || p.includes('project') || p.includes('llm') || p.includes('mobile') || p.includes('llama') || p.includes('react native')) {
      return "Darwin's flagship project is ofln: a fully offline, on-device LLM chat application for Android & iOS built with llama.rn, React Native, and C++. It runs GGUF models directly on phone hardware with zero cloud dependencies or accounts, featuring multimodal VLM, RAG, personas, and live tok/s telemetry (https://github.com/Darwin27264/ofln).";
    }
    if (p.includes('skill') || p.includes('tech') || p.includes('stack') || p.includes('language') || p.includes('framework') || p.includes('python') || p.includes('typescript')) {
      return "Darwin's technical stack spans Languages (Python, TypeScript, JavaScript, Java, C#, PHP), AI/ML (LLMs, llama.cpp, LangChain, RAG, PyTorch, OpenCV), Frameworks (React, React Native, Next.js, Node.js), and Tools (Docker, AWS, GCP, Jenkins, OpenSearch, Linux).";
    }
    if (p.includes('contact') || p.includes('email') || p.includes('reach') || p.includes('hire') || p.includes('message')) {
      return "You can reach Darwin directly via email at darwinchen8@outlook.com, connect on LinkedIn (/in/darwinchen), or inspect his open-source work on GitHub (@Darwin27264).";
    }
    return "Thanks for inquiring! Darwin is a Software Engineer at Ericsson (SWE 5G/6G CloudRAN) based in Ottawa, ON. Feel free to explore his projects on this site, check his résumé, or contact him at darwinchen8@outlook.com.";
  }

  // WebGPU Engine Initialization (Tier 2)
  async function initWebGPU() {
    if (isModelLoading) return;
    if (engine) {
      // Toggle active status if already initialized
      webgpuActive = !webgpuActive;
      updateWebGPUStatusUI();
      return;
    }

    if (!navigator.gpu) {
      if (chatStatus) chatStatus.textContent = 'WEBGPU NOT SUPPORTED ON THIS BROWSER (USING FAST MODE)';
      alert('WebGPU is not supported or not enabled in your current browser. Falling back to the fast instant assistant.');
      return;
    }

    if (location.protocol === 'file:') {
      if (chatStatus) chatStatus.textContent = 'WEBGPU WORKERS REQUIRE HTTP/HTTPS HOSTING';
      alert('WebGPU Web Workers require an HTTP/HTTPS or localhost server environment due to browser security restrictions.');
      return;
    }

    try {
      isModelLoading = true;
      if (webgpuToggleBtn) {
        webgpuToggleBtn.classList.add('loading');
      }
      if (webgpuBtnText) webgpuBtnText.textContent = 'LOADING (0%)…';
      if (chatProgressWrap) chatProgressWrap.style.display = 'block';
      if (chatProgressBar) chatProgressBar.style.width = '0%';
      if (chatStatus) chatStatus.textContent = 'CONNECTING WEBGPU PIPELINE…';

      // Dynamic import prevents loading WebLLM library during regular page visits
      const { CreateWebWorkerMLCEngine } = await import('https://esm.run/@mlc-ai/web-llm');
      const workerUrl = new URL('./ai-worker.js', window.location.href);
      const worker = new Worker(workerUrl, { type: 'module' });

      // SmolLM2-360M-Instruct: ~200MB, ultra-fast token rate, low VRAM (<400MB)
      engine = await CreateWebWorkerMLCEngine(worker, 'SmolLM2-360M-Instruct-q4f16_1-MLC', {
        initProgressCallback: (report) => {
          const pct = Math.round((report.progress || 0) * 100);
          if (chatProgressBar) chatProgressBar.style.width = pct + '%';
          if (webgpuBtnText) webgpuBtnText.textContent = `LOADING (${pct}%)…`;
          if (chatStatus) chatStatus.textContent = `DOWNLOADING MODEL WEIGHTS… ${pct}% ${report.text ? '· ' + report.text : ''}`;
        }
      });

      webgpuActive = true;
      isModelLoading = false;
      updateWebGPUStatusUI();
      addMsg('assistant', "✨ WebGPU Neural Model loaded! You are now chatting with an on-device SmolLM2 LLM running directly on your local GPU.");
    } catch (err) {
      console.warn('WebGPU model initialization error:', err);
      isModelLoading = false;
      webgpuActive = false;
      if (webgpuToggleBtn) webgpuToggleBtn.classList.remove('loading');
      if (webgpuBtnText) webgpuBtnText.textContent = 'RETRY WEBGPU';
      if (chatProgressWrap) chatProgressWrap.style.display = 'none';
      if (chatStatus) chatStatus.textContent = 'WEBGPU LOAD FAILED (CONTINUING IN FAST MODE)';
      if (chatSpeedTag) chatSpeedTag.textContent = '0ms LATENCY';
    }
  }

  function updateWebGPUStatusUI() {
    if (!webgpuToggleBtn || !chatModeBadge) return;
    if (chatProgressWrap) chatProgressWrap.style.display = 'none';
    webgpuToggleBtn.classList.remove('loading');

    if (webgpuActive && engine) {
      webgpuToggleBtn.classList.add('active');
      if (webgpuBtnText) webgpuBtnText.textContent = 'WEBGPU ACTIVE';
      chatModeBadge.textContent = 'WEBGPU AI';
      chatModeBadge.classList.add('active-gpu');
      if (chatStatus) chatStatus.textContent = 'LOCAL NEURAL ENGINE READY (CACHED ON-DEVICE)';
      if (chatSpeedTag) chatSpeedTag.textContent = 'ON-DEVICE GPU';
    } else {
      webgpuToggleBtn.classList.remove('active');
      if (webgpuBtnText) webgpuBtnText.textContent = 'ENABLE WEBGPU';
      chatModeBadge.textContent = 'FAST MODE';
      chatModeBadge.classList.remove('active-gpu');
      if (chatStatus) chatStatus.textContent = 'READY • INSTANT KNOWLEDGE BASE';
      if (chatSpeedTag) chatSpeedTag.textContent = '0ms LATENCY';
    }
  }

  if (webgpuToggleBtn) {
    webgpuToggleBtn.addEventListener('click', initWebGPU);
  }

  // Suggestion chips
  if (suggestionsWrap) {
    suggestionsWrap.addEventListener('click', (e) => {
      const chip = e.target.closest('.suggestion-chip');
      if (chip && chip.dataset.query) {
        input.value = chip.dataset.query;
        form.requestSubmit();
      }
    });
  }

  // Handle Form Submission with Streaming Support
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (!q) return;

    addMsg('user', q);
    input.value = '';

    // If WebGPU is active, stream through local model
    if (webgpuActive && engine) {
      const sink = addMsg('assistant', 'Generating…');
      try {
        const historyTail = conversationHistory.slice(-4);
        const messages = [
          { role: 'system', content: SYSTEM_PROMPT },
          ...historyTail,
          { role: 'user', content: q }
        ];

        const stream = await engine.chat.completions.create({
          messages,
          temperature: 0.25,
          max_tokens: 300,
          stream: true
        });

        let fullReply = '';
        let isFirstToken = true;

        for await (const chunk of stream) {
          const delta = chunk.choices[0]?.delta?.content || '';
          if (delta) {
            if (isFirstToken) {
              sink.textContent = '';
              isFirstToken = false;
            }
            fullReply += delta;
            sink.textContent = fullReply;
            logEl.scrollTop = logEl.scrollHeight;
          }
        }

        if (!fullReply.trim()) {
          sink.textContent = getFastAssistantResponse(q);
        }

        conversationHistory.push({ role: 'user', content: q });
        conversationHistory.push({ role: 'assistant', content: sink.textContent });
      } catch (err) {
        console.warn('WebGPU generation error, falling back:', err);
        sink.textContent = getFastAssistantResponse(q);
      }
    } else {
      // Fast mode fallback
      setTimeout(() => {
        addMsg('assistant', getFastAssistantResponse(q));
      }, 350);
    }
  });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        form.requestSubmit();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupChatbot);
  } else {
    setupChatbot();
  }
})();

// Floating Controls Scroll-Fade Behavior
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