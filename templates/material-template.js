/**
 * MASTER TEMPLATE: Material Detail View
 * Azur Promilia Wiki
 * 
 * Dynamically fetches material data from datas/materials/materials.json and bundle.js
 * and renders the complete Fincantieri FREMM EVO layout without any manual HTML duplication.
 */
(function() {
  function getMaterialCategory(id) {
    if (id.startsWith('linhtuy')) return { cat: 'essence', label: 'Linh Túy' };
    if (id.startsWith('vihatnguyen')) return { cat: 'particle', label: 'Vi Hạt Nguyên Tố' };
    if (id === 'uni') return { cat: 'currency', label: 'Tiền Tệ' };
    return { cat: 'monster', label: 'Sản Vật & Quái Vật' };
  }

  function getMaterialRarity(id) {
    if (id === 'linhtuyhuyensac') return 5;
    if (id === 'linhtuyanhsang') return 4;
    if (id === 'linhtuycuontrao') return 3;
    if (id === 'linhtuyngungtu') return 2;
    if (id === 'linhtuyphothong') return 1;
    if (['dungdichtinhchat', 'banhxematvan', 'vayuquang'].includes(id)) return 4;
    if (['tinhhachngunghinh', 'moysacnhon', 'catbanthan', 'laphongmach', 'uni'].includes(id)) return 3;
    return 2;
  }

  function getWeaponRarityNumber(w) {
    if (w.base_rarity !== undefined) return w.base_rarity + 1;
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
    const r = getWeaponRarityNumber(w);
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
    if (window.location.protocol !== 'file:') {
      try {
        const res = await fetch(`${rel}datas/materials/materials.json`);
        if (res.ok) {
          const mats = await res.json();
          if (mats[itemId]) return mats[itemId];
        }
      } catch (err) {
        console.warn('Fetch materials.json failed, falling back to bundle:', err);
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

    return null;
  }

  async function getUsedWeapons(itemId, rel) {
    let weapons = [];
    if (window.AZUR_DATA && window.AZUR_DATA.weapons) {
      weapons = Array.isArray(window.AZUR_DATA.weapons) ? window.AZUR_DATA.weapons : Object.values(window.AZUR_DATA.weapons);
    } else {
      try {
        await loadScript(`${rel}datas/bundle.js`);
        if (window.AZUR_DATA && window.AZUR_DATA.weapons) {
          weapons = Array.isArray(window.AZUR_DATA.weapons) ? window.AZUR_DATA.weapons : Object.values(window.AZUR_DATA.weapons);
        }
      } catch (e) {}
    }

    return weapons.filter(w => {
      if (w.star_ascensions) {
        for (const a of w.star_ascensions) {
          if (a.upgrade_cost && a.upgrade_cost.some(c => c.material_id === itemId)) return true;
        }
      }
      if (w.enhancement_materials) {
        for (const eh of w.enhancement_materials) {
          if (eh.materials && eh.materials.some(m => m.material_id === itemId)) return true;
        }
      }
      return false;
    });
  }

  function renderMaterialMain(m, usedWeapons, rel) {
    const rNum = getMaterialRarity(m.id);
    const cat = getMaterialCategory(m.id);
    const stars = '★'.repeat(rNum);
    const loreText = m.description ? m.description.replace(/\n/g, '<br>') : `Nguyên liệu thuộc nhóm ${cat.label}, sử dụng để cường hóa và thăng sao vũ khí trong Azur Promilia.`;

    const usedWeaponsCardsHtml = usedWeapons.map(w => {
      const wRarity = getWeaponRarityNumber(w);
      const starCount = getMaxStarsCount(w);
      return `
        <a href="${rel}equipments/${w.id}.html" class="bwiki-item-card r${wRarity}">
          <div class="bwiki-item-visual">
            <img class="bwiki-item-img" src="${rel}assets/equipment/${w.id}.png" alt="${w.name}" loading="lazy">
          </div>
          ${renderCardStarsHtml(starCount, rel)}
          <div class="bwiki-item-name-box">
            <span class="bwiki-item-name-text">${w.name}</span>
          </div>
        </a>`;
    }).join('');

    return `
    <div class="fremm-layout">
      
      <!-- LEFT RAIL: Integrated Breadcrumb Stack + Dynamic Vertical Gauge -->
      <aside class="fremm-sidebar" id="fremm-sidebar">
        <div class="fremm-breadcrumb-stack">
          <a href="${rel}homepage.html" class="fremm-bc-item fremm-bc-l1">TRANG CHỦ</a>
          <a href="${rel}materials.html" class="fremm-bc-item fremm-bc-l2">NGUYÊN LIỆU</a>
          <div class="fremm-bc-item fremm-bc-l3">${m.name}</div>
        </div>

        <div class="fremm-gauge-container" id="fremm-gauge-container">
          <div class="fremm-gauge-ruler" id="fremm-gauge-ruler" aria-hidden="true">
            ${Array.from({length: 15}, (_, i) => `<div class="fremm-ruler-tick" data-tick="${i}"></div>`).join('')}
          </div>
          <nav class="fremm-gauge-track" id="fremm-gauge-track">
            <a href="#screen-mat-info" class="fremm-gauge-item is-active" data-index="0" data-target="screen-mat-info">
              <span class="fremm-item-dash"></span>
              <span class="fremm-item-label">THÔNG TIN CHI TIẾT</span>
            </a>
            <a href="#screen-mat-weapons" class="fremm-gauge-item is-future" data-index="1" data-target="screen-mat-weapons">
              <span class="fremm-item-dash"></span>
              <span class="fremm-item-label">VŨ KHÍ SỬ DỤNG</span>
            </a>
          </nav>
        </div>
      </aside>

      <!-- RIGHT COLUMN: INDEPENDENT SCREEN SECTIONS -->
      <div class="fremm-content">
        
        <!-- SCREEN 1: THÔNG TIN CHI TIẾT (Wrapped in authentic rarity frame) -->
        <section id="screen-mat-info" class="detail-screen" data-step="1">
          <div class="screen-header">
            <h2>Thông Tin Chi Tiết</h2>
          </div>

          <div class="screen-overview-layout">
            <div class="screen-visual-frame r${rNum}-frame">
              <img class="screen-visual-icon" src="${rel}assets/materials/${m.id}.png" alt="${m.name}">
            </div>

            <div class="screen-overview-info">
              <h1>${m.name}</h1>
              <div class="screen-overview-original-name">${m.original_name || ''}</div>

              <div class="screen-meta-grid">
                <div class="screen-meta-box">
                  <div class="meta-k">Mã định danh</div>
                  <div class="meta-v" style="font-family:monospace; color:var(--accent-azure);">${m.id}</div>
                </div>
                <div class="screen-meta-box">
                  <div class="meta-k">Phân nhóm</div>
                  <div class="meta-v">${cat.label}</div>
                </div>
                <div class="screen-meta-box">
                  <div class="meta-k">Độ hiếm</div>
                  <div class="meta-v" style="color: #b45309;">${stars}</div>
                </div>
              </div>

              <div class="screen-lore-card">
                <div>${loreText}</div>
              </div>
            </div>
          </div>
        </section>

        <!-- SCREEN 2: WEAPONS USING THIS MATERIAL -->
        <section id="screen-mat-weapons" class="detail-screen" data-step="2">
          <div class="screen-header">
            <h2>Vũ Khí Sử Dụng</h2>
          </div>

          ${usedWeapons.length > 0 ? `
            <div class="bwiki-items-grid" style="justify-content: flex-start;">
              ${usedWeaponsCardsHtml}
            </div>
          ` : `
            <div class="empty-state">
              <p>Hiện chưa có trang bị nào trong cơ sở dữ liệu yêu cầu nguyên liệu này để cường hóa.</p>
            </div>
          `}
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
    const TICK_SPACING = 28;
    let currentIdx = 0;

    function checkFooterCollision() {
      if (!sidebar || window.innerWidth <= 1024) {
        if (sidebar) sidebar.style.transform = 'none';
        return;
      }
      const footer = document.querySelector('footer.footer');
      if (!footer) return;
      const footerRect = footer.getBoundingClientRect();
      const sidebarRect = sidebar.getBoundingClientRect();
      if (footerRect.top < sidebarRect.bottom + 24) {
        const overlap = (sidebarRect.bottom + 24) - footerRect.top;
        sidebar.style.transform = 'translateY(-' + overlap + 'px)';
      } else {
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

      rulerTicks.forEach((tick, s) => {
        tick.style.top = (s * TICK_SPACING) + 'px';
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
        item.style.top = (slot * TICK_SPACING) + 'px';
        item.style.transform = 'none';
        occupiedSlots.add(slot);
      });

      rulerTicks.forEach((tick, s) => {
        tick.style.opacity = occupiedSlots.has(s) ? '0' : '1';
      });
    }

    items.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = item.dataset.target;
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          const targetTop = targetEl.getBoundingClientRect().top + window.pageYOffset - 90;
          window.scrollTo({ top: targetTop, behavior: 'smooth' });
          updateGaugePositions(parseInt(item.dataset.index, 10));
        }
      });
    });

    function onScroll() {
      checkFooterCollision();
      const scrollPos = window.scrollY + 220;
      let activeIdx = 0;
      screens.forEach((screen, idx) => {
        if (scrollPos >= screen.offsetTop) {
          activeIdx = idx;
        }
      });
      if (activeIdx !== currentIdx) {
        updateGaugePositions(activeIdx);
      }
    }

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

    const depth = document.body.dataset.depth ? parseInt(document.body.dataset.depth, 10) : 1;
    const rel = depth === 1 ? '../' : depth === 2 ? '../../' : '';

    rootEl.innerHTML = `<div style="text-align:center; padding: 100px 0; color: #64748b;">Đang tải dữ liệu nguyên liệu...</div>`;

    const material = await fetchMaterialData(itemId, rel);
    if (!material) {
      rootEl.innerHTML = `
        <div class="empty-state">
          <h2>Không tìm thấy dữ liệu</h2>
          <p>Không thể tải dữ liệu nguyên liệu từ cơ sở dữ liệu: <code>${itemId}</code></p>
          <a href="${rel}materials.html" style="color:var(--accent-azure); font-weight:700;">Quay lại danh sách nguyên liệu</a>
        </div>`;
      return;
    }

    const usedWeapons = await getUsedWeapons(itemId, rel);

    document.title = `${material.name} - Azur Promilia Wiki`;
    rootEl.innerHTML = renderMaterialMain(material, usedWeapons, rel);
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
