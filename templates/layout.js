/**
 * MASTER TEMPLATE: Site Layout (Navbar & Footer)
 * Azur Promilia Wiki
 * 
 * Provides a single source of truth for Navbar and Footer UI across all pages.
 */
(function() {
  function getDepth() {
    if (document.body && document.body.dataset.depth !== undefined) {
      return parseInt(document.body.dataset.depth, 10);
    }
    const path = window.location.pathname.replace(/\\/g, '/').replace(/^\//, '');
    const segments = path.split('/').filter(Boolean);
    if (segments.length <= 1) return 0;
    // Check if last segment is index.html or empty
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

  function getActiveTab() {
    if (document.body && document.body.dataset.activeTab) {
      return document.body.dataset.activeTab;
    }
    const path = (window.location.pathname || '').toLowerCase();
    if (path.includes('equip') || path.includes('vu_khi')) return 'equip';
    if (path.includes('material') || path.includes('nguyen_lieu')) return 'mat';
    return 'home';
  }

  function renderNavbarHTML(rel, activeTab) {
    return `
    <div class="container nav-container">
      <a href="${rel}homepage.html" class="brand-logo">
        <div class="brand-icon">✦</div>
        <div class="brand-info">
          <h1>AZUR PROMILIA</h1>
        </div>
      </a>

      <nav class="nav-links">
        <a href="${rel}homepage.html" class="nav-item ${activeTab === 'home' ? 'active' : ''}">Trang Chủ</a>
        <a href="${rel}equipments.html" class="nav-item ${activeTab === 'equip' ? 'active' : ''}">Trang Bị</a>
        <a href="${rel}materials.html" class="nav-item ${activeTab === 'mat' ? 'active' : ''}">Nguyên Liệu</a>
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
      <p>Azur Promilia Wiki Companion • Bách khoa toàn thư trang bị & nguyên liệu tiếng Việt.</p>
    </div>`;
  }

  function initLayout() {
    const depth = getDepth();
    const rel = getRelPrefix(depth);
    const activeTab = getActiveTab();

    // 1. Inject or update Navbar
    let navEl = document.getElementById('site-navbar');
    if (!navEl) {
      navEl = document.querySelector('header.navbar');
    }
    if (navEl) {
      navEl.className = 'navbar';
      navEl.innerHTML = renderNavbarHTML(rel, activeTab);
    }

    // 2. Inject or update Footer
    let footerEl = document.getElementById('site-footer');
    if (!footerEl) {
      footerEl = document.querySelector('footer.footer');
    }
    if (footerEl) {
      footerEl.className = 'footer';
      footerEl.innerHTML = renderFooterHTML();
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
    initLayout
  };
})();
