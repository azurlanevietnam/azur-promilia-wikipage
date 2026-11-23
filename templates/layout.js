/**
 * MASTER TEMPLATE: Site Layout (Navbar, Footer & Unified Fincantieri FREMM Gauge)
 * Azur Promilia Wiki
 * 
 * Provides a single source of truth for Navbar, Footer, and the responsive
 * full-height Fincantieri vertical scale gauge across all detail pages.
 */
(function() {
  function getDepth() {
    if (document.body && document.body.dataset.depth !== undefined) {
      return parseInt(document.body.dataset.depth, 10);
    }
    const path = window.location.pathname.replace(/\\/g, '/').replace(/^\//, '');
    const segments = path.split('/').filter(Boolean);
    if (segments.length <= 1) return 0;
    const last = segments[segments.length - 1];
    if (last === 'index.html' || last.endsWith('.html')) {
      return segments.length - 1;
    }
    return segments.length;
  }

  function getRelPrefix(depth) {
    if (depth === 0) return '';
    if (depth === 1) return '../';
    if (depth === 2) return '../../';
    let rel = '';
    for (let i = 0; i < depth; i++) rel += '../';
    return rel;
  }

  function getPagesRel(depth) {
    if (depth === 0) return 'pages/';
    if (depth === 1) return '';
    if (depth === 2) return '../';
    let rel = '';
    for (let i = 1; i < depth; i++) rel += '../';
    return rel;
  }

  function getActiveTab() {
    if (document.body && document.body.dataset.activeTab) {
      return document.body.dataset.activeTab;
    }
    const path = (window.location.pathname || '').toLowerCase();
    if (path.includes('character') || path.includes('nhan_vat') || path.includes('nhanvat')) return 'character';
    if (path.includes('kibo')) return 'kibo';
    if (path.includes('lingzi') || path.includes('linhtu') || path.includes('linh_tu')) return 'lingzi';
    if (path.includes('equip') || path.includes('vu_khi')) return 'equip';
    if (path.includes('material') || path.includes('nguyen_lieu')) return 'mat';
    return 'home';
  }

  function renderNavbarHTML(pagesRel, activeTab) {
    const isServer = window.location.protocol !== 'file:';
    const homeHref = isServer ? '/homepage' : `${pagesRel}homepage.html`;
    const charHref = isServer ? '/characters' : `${pagesRel}characters.html`;
    const kiboHref = isServer ? '/kibo' : `${pagesRel}kibo.html`;
    const lingziHref = isServer ? '/lingzi' : `${pagesRel}lingzi.html`;
    const equipHref = isServer ? '/equipments' : `${pagesRel}equipments.html`;
    const matHref = isServer ? '/materials' : `${pagesRel}materials.html`;

    return `
    <div class="container nav-container">
      <a href="${homeHref}" class="brand-logo">
        <div class="brand-icon">✦</div>
        <div class="brand-info">
          <h1>AZUR PROMILIA</h1>
        </div>
      </a>

      <nav class="nav-links">
        <a href="${homeHref}" class="nav-item ${activeTab === 'home' ? 'active' : ''}">Trang Chủ</a>
        <a href="${charHref}" class="nav-item ${activeTab === 'character' ? 'active' : ''}">Nhân Vật</a>
        <a href="${kiboHref}" class="nav-item ${activeTab === 'kibo' ? 'active' : ''}">Kibo</a>
        <a href="${lingziHref}" class="nav-item ${activeTab === 'lingzi' ? 'active' : ''}">Linh Tử</a>
        <a href="${equipHref}" class="nav-item ${activeTab === 'equip' ? 'active' : ''}">Trang Bị</a>
        <a href="${matHref}" class="nav-item ${activeTab === 'mat' ? 'active' : ''}">Nguyên Liệu</a>
      </nav>

      <div class="nav-socials">
        <a href="https://www.facebook.com/azurlanevietnam/" target="_blank" rel="noopener noreferrer" class="social-btn fb-page" title="Fanpage Facebook chính thức">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          Fanpage FB
        </a>
        <a href="https://www.facebook.com/groups/678799927597047/" target="_blank" rel="noopener noreferrer" class="social-btn fb-group" title="Cộng đồng thảo luận Facebook">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
          Group Thảo Luận
        </a>
      </div>
    </div>`;
  }

  function renderFooterHTML() {
    return `
    <div class="container">
      <div class="footer-links">
        <a href="https://www.facebook.com/azurlanevietnam/" target="_blank" rel="noopener noreferrer">Facebook Fanpage</a>
        <a href="https://www.facebook.com/groups/678799927597047/" target="_blank" rel="noopener noreferrer">Facebook Group</a>
      </div>
      <p>Azur Promilia Wiki Companion • Bách khoa toàn thư nhân vật, Kibo, linh tử, trang bị & nguyên liệu tiếng Việt.</p>
    </div>`;
  }

  /**
   * Unified Fincantieri FREMM EVO Left-Rail Gauge Controller
   *
   * Stretches the 15-tick vertical ruler precisely from below the breadcrumb stack
   * down to the exact maximum safe boundary above the footer across all 4 desktop
   * tiers (HD, Full HD, 2K/QHD, 4K/UHD) regardless of OS display scaling.
   */
  function initFremmGauge() {
    const sidebar = document.getElementById('fremm-sidebar');
    const track = document.getElementById('fremm-gauge-track');
    const ruler = document.getElementById('fremm-gauge-ruler');
    if (!sidebar || !track || !ruler) return;

    // Prevent duplicate binding if called twice
    if (sidebar.dataset.fremmBound === '1') return;
    sidebar.dataset.fremmBound = '1';

    const items = Array.from(track.querySelectorAll('.fremm-gauge-item'));
    const rulerTicks = Array.from(ruler.querySelectorAll('.fremm-ruler-tick'));
    const screens = items.map(it => document.getElementById(it.dataset.target)).filter(Boolean);
    const numItems = items.length;
    const TOTAL_TICKS = rulerTicks.length || 15;
    const CENTER_TICK = Math.floor(TOTAL_TICKS / 2); // 7 for 15 ticks

    let currentIdx = 0;
    let isUserClicking = false;
    let clickLockTimer = null;

    function computeTickSpacing() {
      if (window.innerWidth <= 1024) {
        sidebar.style.removeProperty('--gauge-tick-spacing');
        return 28;
      }

      const cs = getComputedStyle(sidebar);
      const sidebarTop = parseFloat(cs.top) || 84;
      const footerGap = parseFloat(cs.getPropertyValue('--fremm-footer-gap')) || 24;

      const bc = sidebar.querySelector('.fremm-breadcrumb-stack');
      let bcTotalH = 96;
      if (bc) {
        const bcCs = getComputedStyle(bc);
        bcTotalH = bc.getBoundingClientRect().height + (parseFloat(bcCs.marginBottom) || 14);
      }

      const footer = document.querySelector('footer.footer') || document.getElementById('site-footer');
      const footerH = (footer && footer.offsetHeight > 40) ? footer.offsetHeight : 136;

      // Exact vertical budget from under breadcrumb down to `footerGap` px above footer
      const viewportH = window.innerHeight;
      const maxSidebarBottom = viewportH - footerH - footerGap;
      const availableGaugeH = maxSidebarBottom - sidebarTop - bcTotalH;

      // Keep comfortable minimum tick height (18px) on ultra-short windows; checkFooterCollision protects overlap
      const minTick = window.innerWidth >= 2561 ? 48 : window.innerWidth >= 1921 ? 30 : 18;
      const tickSpacing = Math.max(minTick, availableGaugeH / TOTAL_TICKS);

      sidebar.style.setProperty('--gauge-tick-spacing', tickSpacing.toFixed(2) + 'px');
      return tickSpacing;
    }

    function checkFooterCollision() {
      if (window.innerWidth <= 1024) {
        sidebar.dataset.currentTranslateY = '0';
        sidebar.style.transform = 'none';
        return;
      }

      const footer = document.querySelector('footer.footer') || document.getElementById('site-footer');
      if (!footer) return;

      const cs = getComputedStyle(sidebar);
      const footerGap = parseFloat(cs.getPropertyValue('--fremm-footer-gap')) || 24;
      const footerRect = footer.getBoundingClientRect();
      const sidebarRect = sidebar.getBoundingClientRect();

      const navbar = document.querySelector('header.navbar') || document.getElementById('site-navbar');
      const navbarBottom = navbar ? navbar.getBoundingClientRect().bottom : 68;
      const minTop = navbarBottom + 10;

      const currentTranslate = parseFloat(sidebar.dataset.currentTranslateY || '0');
      const baseTop = sidebarRect.top - currentTranslate;
      const baseBottom = sidebarRect.bottom - currentTranslate;

      if (footerRect.top < baseBottom + footerGap) {
        const rawOverlap = (baseBottom + footerGap) - footerRect.top;
        const maxAllowedTranslate = Math.max(0, baseTop - minTop);
        const overlap = Math.min(rawOverlap, maxAllowedTranslate);
        sidebar.dataset.currentTranslateY = String(-overlap);
        sidebar.style.transform = overlap > 0.5 ? `translateY(-${overlap.toFixed(1)}px)` : 'none';
      } else {
        sidebar.dataset.currentTranslateY = '0';
        sidebar.style.transform = 'none';
      }
    }

    function updateGaugePositions(idx) {
      currentIdx = Math.max(0, Math.min(numItems - 1, idx));
      const isMobile = window.innerWidth <= 1024;

      if (isMobile) {
        sidebar.style.transform = 'none';
        items.forEach((item, i) => {
          item.style.top = '';
          item.style.transform = '';
          if (i === currentIdx) {
            item.className = 'fremm-gauge-item is-active';
          } else if (i < currentIdx) {
            item.className = 'fremm-gauge-item is-past';
          } else {
            item.className = 'fremm-gauge-item is-future';
          }
        });
        return;
      }

      const tickSpacing = computeTickSpacing();

      rulerTicks.forEach((tick, s) => {
        tick.style.top = (s * tickSpacing).toFixed(2) + 'px';
      });

      const occupiedSlots = new Set();

      items.forEach((item, i) => {
        let slot;
        if (i < currentIdx) {
          slot = i;
          item.className = 'fremm-gauge-item is-past';
        } else if (i === currentIdx) {
          slot = CENTER_TICK;
          item.className = 'fremm-gauge-item is-active';
        } else {
          slot = TOTAL_TICKS - numItems + i;
          item.className = 'fremm-gauge-item is-future';
        }
        item.style.top = (slot * tickSpacing).toFixed(2) + 'px';
        item.style.transform = 'none';
        occupiedSlots.add(slot);
      });

      rulerTicks.forEach((tick, s) => {
        tick.style.opacity = occupiedSlots.has(s) ? '0' : '1';
      });
    }

    function getActiveScreenIndex() {
      if (screens.length === 0) return 0;

      const viewportH = window.innerHeight;
      const scrollY = window.scrollY || window.pageYOffset;
      const docH = document.documentElement.scrollHeight;
      const footer = document.querySelector('footer.footer') || document.getElementById('site-footer');
      const footerRect = footer ? footer.getBoundingClientRect() : null;

      const isAtDocBottom = (scrollY + viewportH >= docH - 45);
      const isFooterVisible = footerRect && (footerRect.top <= viewportH - 15);

      if (isAtDocBottom || isFooterVisible) {
        for (let i = screens.length - 1; i >= 0; i--) {
          const rect = screens[i].getBoundingClientRect();
          if (rect.top < viewportH - 50 && rect.bottom > 50) {
            return i;
          }
        }
        return screens.length - 1;
      }

      const focalLine = Math.max(160, Math.min(viewportH * 0.38, 700));
      let candidateIdx = 0;
      for (let i = 0; i < screens.length; i++) {
        const rect = screens[i].getBoundingClientRect();
        if (rect.top <= focalLine) {
          candidateIdx = i;
        } else {
          break;
        }
      }

      const lastIdx = screens.length - 1;
      const lastRect = screens[lastIdx].getBoundingClientRect();
      if (lastRect.top < viewportH * 0.70 && lastRect.bottom > 80) {
        if (candidateIdx >= lastIdx - 1) {
          candidateIdx = lastIdx;
        }
      }

      return candidateIdx;
    }

    function onScroll() {
      checkFooterCollision();
      if (isUserClicking) return;

      const activeIdx = getActiveScreenIndex();
      if (activeIdx !== currentIdx) {
        updateGaugePositions(activeIdx);
      }
    }

    function syncAll() {
      updateGaugePositions(getActiveScreenIndex());
      checkFooterCollision();
    }

    items.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = item.dataset.target;
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          const targetIdx = parseInt(item.dataset.index, 10);
          isUserClicking = true;
          if (clickLockTimer) clearTimeout(clickLockTimer);
          clickLockTimer = setTimeout(() => {
            isUserClicking = false;
          }, 850);

          updateGaugePositions(targetIdx);

          const navbar = document.querySelector('header.navbar') || document.getElementById('site-navbar');
          const navH = navbar ? navbar.offsetHeight : 68;
          const targetTop = targetEl.getBoundingClientRect().top + window.pageYOffset - navH - 24;
          window.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });
        }
      });
    });

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => {
      updateGaugePositions(currentIdx);
      checkFooterCollision();
    });
    window.addEventListener('load', syncAll);

    // Initial sync (immediate + after footer/layout settles)
    syncAll();
    requestAnimationFrame(syncAll);
    setTimeout(syncAll, 80);
  }

  function initLayout() {
    const depth = getDepth();
    const pagesRel = getPagesRel(depth);
    const activeTab = getActiveTab();

    let navEl = document.getElementById('site-navbar');
    if (!navEl) {
      navEl = document.querySelector('header.navbar');
    }
    if (navEl) {
      navEl.className = 'navbar';
      navEl.innerHTML = renderNavbarHTML(pagesRel, activeTab);
    }

    let footerEl = document.getElementById('site-footer');
    if (!footerEl) {
      footerEl = document.querySelector('footer.footer');
    }
    if (footerEl) {
      footerEl.className = 'footer';
      footerEl.innerHTML = renderFooterHTML();
    }

    if (window.location.protocol !== 'file:') {
      const orig = window.location.pathname;
      let clean = orig.replace(/\.html$/, '').replace(/\/index$/, '');
      if (clean.startsWith('/pages/')) {
        clean = clean.replace(/^\/pages\//, '/');
      }
      if (clean !== orig) {
        window.history.replaceState(null, '', clean + window.location.search + window.location.hash);
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLayout);
  } else {
    initLayout();
  }

  window.SiteLayout = {
    getDepth,
    getRelPrefix,
    getActiveTab,
    renderNavbarHTML,
    renderFooterHTML,
    initFremmGauge,
    initLayout
  };
})();
