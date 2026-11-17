/**
 * MASTER TEMPLATE: Material Detail View
 * Azur Promilia Wiki
 * 
 * Dynamically fetches material data from datas/materials/materials.json and bundle.js
 * and renders the complete Fincantieri FREMM EVO layout with authentic styling.
 */
(function() {
  const CATEGORY_LABELS = {
    'vu_khi': 'Vũ khí',
    'ao_tren': 'Áo trên',
    'quan_duoi': 'Quần dưới',
    'khuyen_tai': 'Khuyên tai',
    'nhan': 'Nhẫn'
  };

  const RARITY_MAP = {
    5: { name: 'Vàng', cls: 'rarity-val-gold' },
    4: { name: 'Tím', cls: 'rarity-val-purple' },
    3: { name: 'Lam', cls: 'rarity-val-blue' },
    2: { name: 'Lục', cls: 'rarity-val-green' },
    1: { name: 'Trắng', cls: 'rarity-val-white' }
  };

  function getMaterialRarityNumber(m) {
    if (m && m.rarity !== undefined) return Number(m.rarity) || 1;
    return 1;
  }

  function getMaterialRarityInfo(rNum) {
    return RARITY_MAP[rNum] || RARITY_MAP[1];
  }

  function getEquipmentRarityNumber(w) {
    if (w.base_rarity !== undefined) return w.base_rarity + 1;
    if (w.rarity !== undefined) return Number(w.rarity);
    if (w.max_stars && w.max_stars.includes('6')) return 5;
    if (w.max_stars && w.max_stars.includes('5')) return 4;
    return 3;
  }

  function getMaxStarsCount(w) {
    if (w.max_stars) {
      const m = w.max_stars.match(/(\d+)\s*sao/i);
      if (m) return parseInt(m[1], 10);
    }
    if (w.star_ascensions && w.star_ascensions.length > 0) {
      let max = 0;
      w.star_ascensions.forEach(a => {
        const m = (a.star_level || '').match(/(\d+)/);
        if (m) max = Math.max(max, parseInt(m[1], 10));
      });
      if (max > 0) return max;
    }
    const r = getEquipmentRarityNumber(w);
    if (r === 5) return 6;
    if (r === 4) return 3;
    if (r === 3) return 3;
    if (r === 2) return 2;
    return 1;
  }

  function renderCardStarsHtml(count, rel) {
    if (!count || count <= 0) return '';
    const stars = Array.from({ length: count }, () => `<img src="${rel}assets/star.png" class="bwiki-star-unit" alt="★">`).join('');
    return `<div class="bwiki-card-stars">${stars}</div>`;
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  async function fetchMaterialData(itemId, rel) {
    if (window.__ITEM_DATA__ && window.__ITEM_DATA__.id === itemId && window.__ITEM_DATA__.description) {
      return window.__ITEM_DATA__;
    }
    if (window.location.protocol !== 'file:') {
      try {
        const res = await fetch(`${rel}datas/materials/materials.json`);
        if (res.ok) {
          const mats = await res.json();
          if (mats[itemId]) return mats[itemId];
        }
      } catch (err) {
        console.warn('Fetch materials.json failed, falling back:', err);
      }
    }

    if (window.AZUR_DATA && window.AZUR_DATA.materials && window.AZUR_DATA.materials[itemId]) {
      return window.AZUR_DATA.materials[itemId];
    }

    try {
      await loadScript(`${rel}datas/bundle.js`);
      if (window.AZUR_DATA && window.AZUR_DATA.materials && window.AZUR_DATA.materials[itemId]) {
        return window.AZUR_DATA.materials[itemId];
      }
    } catch (e) {
      console.error('Failed to load bundle data fallback:', e);
    }

    return window.__ITEM_DATA__ || null;
  }

  async function getUsedEquipments(itemId, rel) {
    let allEquips = [];

    if (window.AZUR_DATA && window.AZUR_DATA.equipments) {
      allEquips = Array.isArray(window.AZUR_DATA.equipments) ? window.AZUR_DATA.equipments : Object.values(window.AZUR_DATA.equipments);
    } else {
      if (window.location.protocol !== 'file:') {
        try {
          const res = await fetch(`${rel}datas/equipments/equipments.json`);
          if (res.ok) {
            allEquips = await res.json();
          }
        } catch (e) {}
      }
      if (allEquips.length === 0 && window.AZUR_DATA && window.AZUR_DATA.equipments) {
        allEquips = Array.isArray(window.AZUR_DATA.equipments) ? window.AZUR_DATA.equipments : Object.values(window.AZUR_DATA.equipments);
      }
      if (allEquips.length === 0 && window.AZUR_DATA && window.AZUR_DATA.weapons) {
        allEquips = Array.isArray(window.AZUR_DATA.weapons) ? window.AZUR_DATA.weapons : Object.values(window.AZUR_DATA.weapons);
      }
      if (allEquips.length === 0) {
        try {
          await loadScript(`${rel}datas/bundle.js`);
          if (window.AZUR_DATA && window.AZUR_DATA.equipments) {
            allEquips = Array.isArray(window.AZUR_DATA.equipments) ? window.AZUR_DATA.equipments : Object.values(window.AZUR_DATA.equipments);
          } else if (window.AZUR_DATA && window.AZUR_DATA.weapons) {
            allEquips = Array.isArray(window.AZUR_DATA.weapons) ? window.AZUR_DATA.weapons : Object.values(window.AZUR_DATA.weapons);
          }
        } catch (e) {}
      }
    }

    return allEquips.filter(eq => {
      if (eq.star_ascensions) {
        for (const a of eq.star_ascensions) {
          if (a.upgrade_cost && a.upgrade_cost.some(c => c.material_id === itemId)) return true;
        }
      }
      if (eq.enhancement_materials) {
        for (const eh of eq.enhancement_materials) {
          if (eh.materials && eh.materials.some(m => m.material_id === itemId)) return true;
        }
      }
      if (eq.craft_materials) {
        for (const cm of eq.craft_materials) {
          if (cm.material_id === itemId) return true;
        }
      }
      return false;
    });
  }

  function sortEquipments(equips) {
    const catPriority = { 'vu_khi': 1, 'ao_tren': 2, 'quan_duoi': 3, 'khuyen_tai': 4, 'nhan': 5 };
    return equips.slice().sort((a, b) => {
      // 1. Rarity descending
      const rA = getEquipmentRarityNumber(a);
      const rB = getEquipmentRarityNumber(b);
      if (rB !== rA) return rB - rA;

      // 2. Category order
      const cA = catPriority[a.category] || 99;
      const cB = catPriority[b.category] || 99;
      if (cA !== cB) return cA - cB;

      // 3. Name alphabetical (Vietnamese locale)
      return (a.name || '').localeCompare(b.name || '', 'vi');
    });
  }

  function renderMaterialMain(m, usedEquips, rel, pagesRel) {
    if (!pagesRel) {
      const d = document.body.dataset.depth ? parseInt(document.body.dataset.depth, 10) : 2;
      pagesRel = d === 2 ? '../' : d === 1 ? '' : 'pages/';
    }

    const rNum = getMaterialRarityNumber(m);
    const rarityInfo = getMaterialRarityInfo(rNum);
    const categoryName = m.category || 'Nguyên liệu';
    const introText = m.intro || 'Nguyên liệu cường hóa và thám hiểm.';
    const loreText = m.description ? m.description.replace(/\n/g, '<br>') : introText;

    // Sort equipments
    const sortedEquips = sortEquipments(usedEquips);

    // Identify unique categories among used equipments
    const usedCatSet = new Set(sortedEquips.map(e => e.category || 'vu_khi'));
    const availableCats = ['vu_khi', 'ao_tren', 'quan_duoi', 'khuyen_tai', 'nhan']
      .filter(c => usedCatSet.has(c))
      .map(c => ({ id: c, label: CATEGORY_LABELS[c] || c }));

    const sortedEquipsCardsHtml = sortedEquips.map(w => {
      const wRarity = getEquipmentRarityNumber(w);
      const starCount = getMaxStarsCount(w);
      const catKey = w.category || 'vu_khi';
      return `
        <a href="${pagesRel}equipments/${w.id}.html" class="bwiki-item-card r${wRarity}" data-eq-category="${catKey}" title="${w.name} (${CATEGORY_LABELS[catKey] || 'Trang bị'})">
          <div class="bwiki-item-visual">
            <img class="bwiki-item-img" src="${rel}assets/equipment/${w.id}.png" alt="${w.name}" loading="lazy">
          </div>
          ${renderCardStarsHtml(starCount, rel)}
          <div class="bwiki-item-name-box">
            <span class="bwiki-item-name-text">${w.name}</span>
          </div>
        </a>`;
    }).join('');

    // Sources badges
    const sources = m.acquisition_sources || [];
    const sourceBadgesHtml = sources.map(s => `
      <div class="source-badge">
        <span>✦</span>
        <span>${s}</span>
      </div>
    `).join('');

    return `
    <div class="fremm-layout">
      
      <!-- LEFT RAIL: Integrated Breadcrumb Stack + Dynamic Vertical Gauge -->
      <aside class="fremm-sidebar" id="fremm-sidebar">
        <div class="fremm-breadcrumb-stack">
          <a href="${pagesRel}homepage.html" class="fremm-bc-item fremm-bc-l1">TRANG CHỦ</a>
          <a href="${pagesRel}materials.html" class="fremm-bc-item fremm-bc-l2">NGUYÊN LIỆU</a>
          <div class="fremm-bc-item fremm-bc-l3">${m.name}</div>
        </div>

        <div class="fremm-gauge-container" id="fremm-gauge-container">
          <div class="fremm-gauge-ruler" id="fremm-gauge-ruler" aria-hidden="true">
            ${Array.from({length: 15}, (_, i) => `<div class="fremm-ruler-tick" data-tick="${i}" style="top: calc(${i} * var(--gauge-tick-spacing, 28px)); opacity: ${[7, 13, 14].includes(i) ? '0' : '1'};"></div>`).join('')}
          </div>
          <nav class="fremm-gauge-track" id="fremm-gauge-track">
            <a href="#screen-mat-overview" class="fremm-gauge-item is-active" data-index="0" data-target="screen-mat-overview" style="top: calc(7 * var(--gauge-tick-spacing, 28px));">
              <span class="fremm-item-dash"></span>
              <span class="fremm-item-label">TỔNG QUAN NGUYÊN LIỆU</span>
            </a>
            <a href="#screen-mat-equipments" class="fremm-gauge-item is-future" data-index="1" data-target="screen-mat-equipments" style="top: calc(13 * var(--gauge-tick-spacing, 28px));">
              <span class="fremm-item-dash"></span>
              <span class="fremm-item-label">TRANG BỊ SỬ DỤNG</span>
            </a>
            <a href="#screen-mat-sources" class="fremm-gauge-item is-future" data-index="2" data-target="screen-mat-sources" style="top: calc(14 * var(--gauge-tick-spacing, 28px));">
              <span class="fremm-item-dash"></span>
              <span class="fremm-item-label">NGUỒN GỐC THU THẬP</span>
            </a>
          </nav>
        </div>
      </aside>

      <!-- RIGHT COLUMN: INDEPENDENT SCREEN SECTIONS -->
      <div class="fremm-content">
        
        <!-- SCREEN 1: TỔNG QUAN NGUYÊN LIỆU -->
        <section id="screen-mat-overview" class="detail-screen" data-step="1">
          <div class="screen-header">
            <h2>Tổng Quan Nguyên Liệu</h2>
          </div>

          <div class="screen-overview-layout">
            <div class="screen-visual-frame r${rNum}-frame">
              <img class="screen-visual-icon" src="${rel}assets/materials/${m.id}.png" alt="${m.name}">
              <div class="screen-stars-row" title="${rNum} sao">
                ${Array.from({ length: rNum }, () => `<img src="${rel}assets/star.png" class="screen-star-unit" alt="★">`).join('')}
              </div>
            </div>

            <div class="screen-overview-info">
              <h1>${m.name}</h1>
              <div class="screen-overview-original-name">${m.original_name || ''}</div>

              <div class="screen-meta-grid">
                <div class="screen-meta-box">
                  <div class="meta-k">Phân loại</div>
                  <div class="meta-v">${categoryName}</div>
                </div>
                <div class="screen-meta-box">
                  <div class="meta-k">Độ hiếm</div>
                  <div class="meta-v ${rarityInfo.cls}">${rarityInfo.name}</div>
                </div>
                <div class="screen-meta-box" style="grid-column: span 2;">
                  <div class="meta-k">Giới thiệu</div>
                  <div class="meta-v" title="${introText}">${introText}</div>
                </div>
              </div>

              <div class="screen-lore-card">
                <div>${loreText}</div>
              </div>
            </div>
          </div>
        </section>

        <!-- SCREEN 2: TRANG BỊ SỬ DỤNG -->
        <section id="screen-mat-equipments" class="detail-screen" data-step="2">
          <div class="screen-header">
            <h2>Trang Bị Sử Dụng</h2>
          </div>

          ${sortedEquips.length > 0 ? `
            ${availableCats.length > 1 ? `
              <div class="mat-equips-toolbar">
                <div class="mat-cat-filter-tabs" id="mat-cat-filter-tabs">
                  <button type="button" class="mat-filter-tab active" data-cat="all">Tất cả</button>
                  ${availableCats.map(c => `<button type="button" class="mat-filter-tab" data-cat="${c.id}">${c.label}</button>`).join('')}
                </div>
              </div>
            ` : ''}
            <div class="bwiki-items-grid" id="mat-equips-grid" style="justify-content: flex-start;">
              ${sortedEquipsCardsHtml}
            </div>
          ` : `
            <div class="empty-state">
              <p>Hiện chưa có trang bị nào trong cơ sở dữ liệu yêu cầu nguyên liệu này để cường hóa hoặc thăng cấp.</p>
            </div>
          `}
        </section>

        <!-- SCREEN 3: NGUỒN GỐC THU THẬP -->
        <section id="screen-mat-sources" class="detail-screen" data-step="3">
          <div class="screen-header">
            <h2>Nguồn Gốc Thu Thập</h2>
          </div>

          <div class="source-badges">
            ${sourceBadgesHtml || '<div class="source-badge"><span>✦</span><span>Ủy thác thám hiểm & Sản vật Mục Trường</span></div>'}
          </div>
        </section>

      </div>
    </div>`;
  }

  function initMaterialInteractivity() {
    const track = document.getElementById('fremm-gauge-track');
    const ruler = document.getElementById('fremm-gauge-ruler');
    const sidebar = document.getElementById('fremm-sidebar');
    if (!track || !ruler) return;

    const items = Array.from(track.querySelectorAll('.fremm-gauge-item'));
    const rulerTicks = Array.from(ruler.querySelectorAll('.fremm-ruler-tick'));
    const screens = items.map(it => document.getElementById(it.dataset.target)).filter(Boolean);
    const numItems = items.length;
    const TOTAL_TICKS = 15;
    const CENTER_TICK = 7;
    let currentIdx = 0;
    let isUserClicking = false;
    let clickLockTimer = null;

    function getTickSpacing() {
      if (!sidebar) return 28;
      const customSpacing = parseFloat(getComputedStyle(sidebar).getPropertyValue('--gauge-tick-spacing'));
      return (!isNaN(customSpacing) && customSpacing > 0) ? customSpacing : 28;
    }

    function checkFooterCollision() {
      if (!sidebar || window.innerWidth <= 1024) {
        if (sidebar) sidebar.style.transform = 'none';
        return;
      }
      const footer = document.querySelector('footer.footer') || document.getElementById('site-footer');
      if (!footer) return;
      const footerRect = footer.getBoundingClientRect();
      const sidebarRect = sidebar.getBoundingClientRect();

      const navbar = document.querySelector('header.navbar') || document.getElementById('site-navbar');
      const navbarBottom = navbar ? navbar.getBoundingClientRect().bottom : 70;
      const minTop = navbarBottom + 12;

      if (footerRect.top < sidebarRect.bottom + 24) {
        const rawOverlap = (sidebarRect.bottom + 24) - footerRect.top;
        const currentTranslate = parseFloat(sidebar.dataset.currentTranslateY || 0);
        const baseTop = sidebarRect.top - currentTranslate;
        const maxAllowedTranslate = Math.max(0, baseTop - minTop);
        const overlap = Math.min(rawOverlap, maxAllowedTranslate);
        sidebar.dataset.currentTranslateY = -overlap;
        sidebar.style.transform = 'translateY(-' + overlap + 'px)';
      } else {
        sidebar.dataset.currentTranslateY = 0;
        sidebar.style.transform = 'none';
      }
    }

    function updateGaugePositions(idx) {
      currentIdx = Math.max(0, Math.min(numItems - 1, idx));
      const isMobile = window.innerWidth <= 1024;

      if (isMobile) {
        if (sidebar) sidebar.style.transform = 'none';
        items.forEach((item, i) => {
          item.style.top = '';
          item.style.transform = '';
          if (i === currentIdx) {
            item.className = 'fremm-gauge-item is-active';
            item.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
          } else if (i < currentIdx) {
            item.className = 'fremm-gauge-item is-past';
          } else {
            item.className = 'fremm-gauge-item is-future';
          }
        });
        return;
      }

      const tickSpacing = getTickSpacing();

      rulerTicks.forEach((tick, s) => {
        tick.style.top = (s * tickSpacing) + 'px';
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
        item.style.top = (slot * tickSpacing) + 'px';
        item.style.transform = 'none';
        occupiedSlots.add(slot);
      });

      rulerTicks.forEach((tick, s) => {
        tick.style.opacity = occupiedSlots.has(s) ? '0' : '1';
      });
    }

    function getActiveScreenIndex() {
      if (screens.length === 0) return 0;

      const viewportHeight = window.innerHeight;
      const scrollY = window.scrollY || window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight;
      const footer = document.querySelector('footer.footer') || document.getElementById('site-footer');
      const footerRect = footer ? footer.getBoundingClientRect() : null;

      // 1. Detect if page is scrolled near bottom
      const isAtDocBottom = (scrollY + viewportHeight >= docHeight - 45);
      const isFooterVisible = footerRect && (footerRect.top <= viewportHeight - 15);

      if (isAtDocBottom || isFooterVisible) {
        for (let i = screens.length - 1; i >= 0; i--) {
          const rect = screens[i].getBoundingClientRect();
          if (rect.top < viewportHeight - 50 && rect.bottom > 50) {
            return i;
          }
        }
        return screens.length - 1;
      }

      // 2. Proportional focal line based on viewport height (38% of viewport)
      const focalLine = Math.max(160, Math.min(viewportHeight * 0.38, 700));

      let candidateIdx = 0;
      for (let i = 0; i < screens.length; i++) {
        const rect = screens[i].getBoundingClientRect();
        if (rect.top <= focalLine) {
          candidateIdx = i;
        } else {
          break;
        }
      }

      // 3. Bottom-screen awareness for short sections
      const lastIdx = screens.length - 1;
      const lastRect = screens[lastIdx].getBoundingClientRect();
      if (lastRect.top < viewportHeight * 0.70 && lastRect.bottom > 80) {
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
          const navH = navbar ? navbar.offsetHeight : 70;
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

    updateGaugePositions(0);
    setTimeout(() => {
      updateGaugePositions(0);
      checkFooterCollision();
    }, 50);

    // Filter toolbar handling
    const filterTabs = document.querySelectorAll('.mat-filter-tab');
    const equipCards = document.querySelectorAll('#mat-equips-grid .bwiki-item-card');

    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const selectedCat = tab.dataset.cat;
        equipCards.forEach(card => {
          if (selectedCat === 'all' || card.dataset.eqCategory === selectedCat) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  async function initMaterialPage() {
    const rootEl = document.getElementById('material-detail-root') || document.querySelector('main.detail-container');
    if (!rootEl) return;

    const itemId = document.body.dataset.itemId ||
                   new URLSearchParams(window.location.search).get('id') ||
                   window.location.pathname.split('/').pop().replace(/\.html$/, '');

    if (!itemId) {
      rootEl.innerHTML = `<div class="empty-state"><p>Không tìm thấy mã nguyên liệu.</p></div>`;
      return;
    }

    const depth = document.body.dataset.depth ? parseInt(document.body.dataset.depth, 10) : 2;
    const rel = depth === 1 ? '../' : depth === 2 ? '../../' : '';
    const pagesRel = depth === 2 ? '../' : depth === 1 ? '' : 'pages/';

    rootEl.innerHTML = `<div style="text-align:center; padding: 100px 0; color: #64748b;">Đang tải dữ liệu nguyên liệu...</div>`;

    const material = await fetchMaterialData(itemId, rel);
    if (!material) {
      rootEl.innerHTML = `
        <div class="empty-state">
          <h2>Không tìm thấy dữ liệu</h2>
          <p>Không thể tải dữ liệu nguyên liệu từ cơ sở dữ liệu: <code>${itemId}</code></p>
          <a href="${pagesRel}materials.html" style="color:var(--accent-azure); font-weight:700;">Quay lại danh sách nguyên liệu</a>
        </div>`;
      return;
    }

    const usedEquips = await getUsedEquipments(itemId, rel);

    document.title = `${material.name} - Azur Promilia Wiki`;
    rootEl.innerHTML = renderMaterialMain(material, usedEquips, rel, pagesRel);
    initMaterialInteractivity();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMaterialPage);
  } else {
    initMaterialPage();
  }

  window.MaterialTemplate = {
    fetchMaterialData,
    renderMaterialMain,
    initMaterialPage
  };
})();
