/**
 * MASTER TEMPLATE: Lingzi Detail Page
 * Azur Promilia Wiki
 * 
 * Provides unified rendering for Lingzi overview, exclusive skill, base attributes, and sources.
 * Strictly adheres to AGENTS.md:
 * - Only color for rarity (no parentheses, no star suffix)
 * - Zero clutter: NO identifier (mã định danh)
 * - Border-radius only on interactive buttons
 * - Seamless background integration
 */
(function() {
  const RARITY_MAP = {
    5: { name: 'Vàng', cls: 'rarity-val-gold' },
    4: { name: 'Tím', cls: 'rarity-val-purple' },
    3: { name: 'Lam', cls: 'rarity-val-blue' }
  };

  function getLingziRarityInfo(rNum) {
    return RARITY_MAP[rNum] || RARITY_MAP[3];
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

  function renderLingziDetail(lz, depth) {
    const rel = getRelPrefix(depth);
    const pagesRel = getPagesRel(depth);
    const rNum = Number(lz.rarity) || 5;
    const rarityInfo = getLingziRarityInfo(rNum);
    const className = lz.class_name || 'Chung';
    const statName = lz.stat_name || 'Tấn Công';
    const introText = lz.intro || 'Linh tử bí ẩn chứa đựng năng lượng tinh khiết của thế giới Promilia.';
    const skill = lz.skill || {};
    const attrs = lz.attrs || [];
    const sources = lz.acquisition_sources || [];

    const sourceBadgesHtml = sources.map(s => `
      <div class="source-badge">
        <span>✦</span>
        <span>${s}</span>
      </div>
    `).join('');

    const attrsRowsHtml = attrs.map(a => `
      <div class="screen-meta-box">
        <div class="meta-k">${a.name}</div>
        <div class="meta-v" style="color:var(--accent-azure);">${a.value}</div>
      </div>
    `).join('');

    return `
    <div class="fremm-layout">
      
      <!-- LEFT RAIL: Integrated Breadcrumb Stack + Dynamic Vertical Gauge -->
      <aside class="fremm-sidebar" id="fremm-sidebar">
        <div class="fremm-breadcrumb-stack">
          <a href="${pagesRel}homepage.html" class="fremm-bc-item fremm-bc-l1">TRANG CHỦ</a>
          <a href="${pagesRel}lingzi.html" class="fremm-bc-item fremm-bc-l2">LINH TỬ</a>
          <div class="fremm-bc-item fremm-bc-l3">${lz.name}</div>
        </div>

        <div class="fremm-gauge-container" id="fremm-gauge-container">
          <div class="fremm-gauge-ruler" id="fremm-gauge-ruler" aria-hidden="true">
            ${Array.from({length: 15}, (_, i) => `<div class="fremm-ruler-tick" data-tick="${i}" style="top: calc(${i} * var(--gauge-tick-spacing, 28px)); opacity: ${[5, 9, 12, 14].includes(i) ? '0' : '1'};"></div>`).join('')}
          </div>
          <nav class="fremm-gauge-track" id="fremm-gauge-track">
            <a href="#screen-lz-overview" class="fremm-gauge-item is-active" data-index="0" data-target="screen-lz-overview" style="top: calc(5 * var(--gauge-tick-spacing, 28px));">
              <span class="fremm-item-dash"></span>
              <span class="fremm-item-label">TỔNG QUAN LINH TỬ</span>
            </a>
            <a href="#screen-lz-skill" class="fremm-gauge-item is-future" data-index="1" data-target="screen-lz-skill" style="top: calc(9 * var(--gauge-tick-spacing, 28px));">
              <span class="fremm-item-dash"></span>
              <span class="fremm-item-label">KỸ NĂNG CHUYÊN DỤNG</span>
            </a>
            <a href="#screen-lz-attrs" class="fremm-gauge-item is-future" data-index="2" data-target="screen-lz-attrs" style="top: calc(12 * var(--gauge-tick-spacing, 28px));">
              <span class="fremm-item-dash"></span>
              <span class="fremm-item-label">THUỘC TÍNH CƠ BẢN</span>
            </a>
            <a href="#screen-lz-sources" class="fremm-gauge-item is-future" data-index="3" data-target="screen-lz-sources" style="top: calc(14 * var(--gauge-tick-spacing, 28px));">
              <span class="fremm-item-dash"></span>
              <span class="fremm-item-label">NGUỒN GỐC THU THẬP</span>
            </a>
          </nav>
        </div>
      </aside>

      <!-- RIGHT COLUMN: INDEPENDENT SCREEN SECTIONS -->
      <div class="fremm-content">
        
        <!-- SCREEN 1: TỔNG QUAN LINH TỬ -->
        <section id="screen-lz-overview" class="detail-screen" data-step="1">
          <div class="screen-header">
            <h2>Tổng Quan Linh Tử</h2>
          </div>

          <div class="screen-overview-layout">
            <div class="screen-visual-frame r${rNum}-frame">
              <img class="screen-visual-icon" src="${rel}assets/lingzi/${lz.id}.png" alt="${lz.name}">
              <div class="screen-stars-row" title="${rNum} sao">
                ${Array.from({ length: rNum }, () => `<img src="${rel}assets/star.png" class="screen-star-unit" alt="★">`).join('')}
              </div>
            </div>

            <div class="screen-overview-info">
              <h1>${lz.name}</h1>
              <div class="screen-overview-original-name">${lz.original_name || ''}</div>

              <!-- Zero-Clutter Meta Grid: Strictly Only Color, NO Identifier -->
              <div class="screen-meta-grid">
                <div class="screen-meta-box">
                  <div class="meta-k">Phân loại</div>
                  <div class="meta-v">${className}</div>
                </div>
                <div class="screen-meta-box">
                  <div class="meta-k">Độ hiếm</div>
                  <div class="meta-v ${rarityInfo.cls}">${rarityInfo.name}</div>
                </div>
                <div class="screen-meta-box" style="grid-column: span 2;">
                  <div class="meta-k">Thuộc tính chính</div>
                  <div class="meta-v" style="color:var(--accent-azure);">${statName}</div>
                </div>
              </div>

              <div class="screen-lore-card">
                <div>${introText}</div>
              </div>
            </div>
          </div>
        </section>

        <!-- SCREEN 2: KỸ NĂNG CHUYÊN DỤNG -->
        <section id="screen-lz-skill" class="detail-screen" data-step="2">
          <div class="screen-header">
            <h2>Kỹ Năng Chuyên Dụng</h2>
          </div>

          <div class="screen-section-block">
            <div style="margin-bottom: 16px; font-weight: 700; color: var(--text-dim);">
              Áp dụng hiệu quả cho nhân vật: <span style="color: var(--accent-azure);">${skill.target_role || className}</span>
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 16px;">
              <div class="screen-lore-card" style="margin: 0;">
                <div style="font-weight: 800; color: #0f172a; margin-bottom: 6px;">Khởi đầu (Lv.1)</div>
                <div>${skill.desc_lv1 || 'Gia tăng năng lực chiến đấu trong trận hình.'}</div>
              </div>

              <div class="screen-lore-card" style="margin: 0; border-left: 3px solid #0284c7;">
                <div style="font-weight: 800; color: #0f172a; margin-bottom: 6px;">Toàn mãn (Lv.100 / Mãn sao)</div>
                <div>${skill.desc_lvmax || 'Gia tăng mạnh mẽ năng lực chiến đấu trong trận hình.'}</div>
              </div>
            </div>
          </div>
        </section>

        <!-- SCREEN 3: THUỘC TÍNH CƠ BẢN -->
        <section id="screen-lz-attrs" class="detail-screen" data-step="3">
          <div class="screen-header">
            <h2>Thuộc Tính Cơ Bản</h2>
          </div>

          <div class="screen-section-block">
            <div style="margin-bottom: 14px; font-size: 0.88rem; color: var(--text-dim); font-weight: 600;">
              Giá trị hiển thị theo định dạng: Khởi điểm Lv.1 / Tối đa Lv.100
            </div>
            <div class="screen-meta-grid" style="margin-bottom: 0;">
              ${attrsRowsHtml}
            </div>
          </div>
        </section>

        <!-- SCREEN 4: NGUỒN GỐC THU THẬP -->
        <section id="screen-lz-sources" class="detail-screen" data-step="4">
          <div class="screen-header">
            <h2>Nguồn Gốc Thu Thập</h2>
          </div>

          <div class="screen-sources-list">
            ${sourceBadgesHtml || '<div class="empty-state">Chưa có thông tin nguồn gốc.</div>'}
          </div>
        </section>

      </div>
    </div>`;
  }

  function initGaugeScroll() {
    if (window.SiteLayout && typeof window.SiteLayout.initFremmGauge === "function") {
      window.SiteLayout.initFremmGauge();
      return;
    }
    const screens = document.querySelectorAll('.detail-screen');
    const gaugeItems = document.querySelectorAll('.fremm-gauge-item');
    if (!screens.length || !gaugeItems.length) return;

    function onScroll() {
      const scrollPos = window.scrollY + 200;
      let activeIndex = 0;

      screens.forEach((screen, index) => {
        const top = screen.offsetTop;
        const height = screen.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          activeIndex = index;
        }
      });

      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50) {
        activeIndex = screens.length - 1;
      }

      gaugeItems.forEach((item, index) => {
        if (index === activeIndex) {
          item.className = 'fremm-gauge-item is-active';
        } else if (index < activeIndex) {
          item.className = 'fremm-gauge-item is-past';
        } else {
          item.className = 'fremm-gauge-item is-future';
        }
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    gaugeItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = item.getAttribute('data-target');
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          const offsetTop = targetEl.offsetTop - 80;
          window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
      });
    });
  }

  function initLingziDetail() {
    const rootEl = document.getElementById('lingzi-detail-root');
    if (!rootEl) return;

    const depth = (document.body && document.body.dataset.depth !== undefined) 
      ? parseInt(document.body.dataset.depth, 10) 
      : 2;

    const lzData = window.__ITEM_DATA__;
    if (!lzData) {
      rootEl.innerHTML = '<div class="container empty-state" style="padding:60px 0; text-align:center;">Dữ liệu linh tử không tồn tại.</div>';
      return;
    }

    rootEl.innerHTML = renderLingziDetail(lzData, depth);
    initGaugeScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLingziDetail);
  } else {
    initLingziDetail();
  }

  window.LingziTemplate = {
    renderLingziDetail,
    initLingziDetail
  };
})();