// ==========================================================================
// DARWIN CHEN — BLOG CLIENT-SIDE CONTROLLER
// ==========================================================================

// 1. Theme Synchronization (Shares darwin-theme with Portfolio & Links)
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
    });
  }
})();

// 2. Blog Homepage: Category Type Filter & Live Search
(function () {
  const filterTabs = document.querySelectorAll('.filter-tab');
  const searchInput = document.getElementById('blogSearch');
  const cards = document.querySelectorAll('.article-card-item');
  const noResults = document.getElementById('noResults');
  const resetBtn = document.getElementById('resetFilterBtn');
  const countDisplay = document.getElementById('matchCount');

  if (!cards.length) return; // Exit if on an individual article page

  let activeType = 'all';
  let searchQuery = '';

  function applyFilters() {
    let visibleCount = 0;

    cards.forEach(cardItem => {
      const cardType = cardItem.getAttribute('data-type') || '';
      const cardText = (cardItem.textContent || '').toLowerCase();

      const matchesType = activeType === 'all' || cardType.includes(activeType);
      const matchesSearch = !searchQuery || cardText.includes(searchQuery);

      if (matchesType && matchesSearch) {
        cardItem.style.display = '';
        cardItem.style.opacity = '1';
        cardItem.style.transform = 'translateY(0)';
        visibleCount++;
      } else {
        cardItem.style.display = 'none';
      }
    });

    if (countDisplay) {
      countDisplay.textContent = `Showing ${visibleCount} of ${cards.length} articles`;
    }

    if (noResults) {
      if (visibleCount === 0) {
        noResults.classList.add('visible');
      } else {
        noResults.classList.remove('visible');
      }
    }
  }

  // Filter Tabs Event Listeners
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeType = tab.getAttribute('data-type') || 'all';
      applyFilters();
    });
  });

  // Search Input Event Listener
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      applyFilters();
    });
  }

  // Reset Button
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      activeType = 'all';
      searchQuery = '';
      if (searchInput) searchInput.value = '';
      filterTabs.forEach(t => t.classList.remove('active'));
      const allTab = document.querySelector('.filter-tab[data-type="all"]');
      if (allTab) allTab.classList.add('active');
      applyFilters();
    });
  }

  applyFilters();
})();

// 3. Single Article: Reading Progress Bar
(function () {
  const progressBar = document.getElementById('readingProgressBar');
  if (!progressBar) return;

  function updateReadingProgress() {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight <= 0) return;
    const progress = (window.scrollY / totalHeight) * 100;
    progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  }

  window.addEventListener('scroll', updateReadingProgress, { passive: true });
  updateReadingProgress();
})();
