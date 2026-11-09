/**
 * MASTER TEMPLATE: Equipment Detail View
 * Azur Promilia Wiki
 * 
 * Dynamically fetches equipment data from datas/equipments/vu_khi/{id}.json
 * and renders the complete Fincantieri FREMM EVO layout with authentic styling.
 */
(function() {
  const KNOWN_MATERIALS = {
    "linhtuyphothong": "Linh Túy Phổ Thông",
    "linhtuyngungtu": "Linh Túy Ngưng Tụ",
    "linhtuycuontrao": "Linh Túy Cuộn Trào",
    "linhtuyanhsang": "Linh Túy Ánh Sáng",
    "linhtuyhuyensac": "Linh Túy Huyễn Sắc",
    "vayuquang": "Vảy U Quang",
    "banhxematvan": "Bánh Xe Mật Văn",
    "dungdichtinhchat": "Dung Dịch Tinh Chất",
    "mangmonglanquang": "Màng Mỏng Lân Quang",
    "tinhhachngunghinh": "Tinh Hạch Ngưng Hình",
    "modongminmang": "Mỡ Đông Mịn Màng",
    "vihatnguyentoquang": "Vi Hạt Nguyên Tố Quang",
    "uni": "Uni",
    "vomemdichchuyen": "Vỏ Mềm Biến Hình",
    "vihatnguyentoam": "Vi Hạt Nguyên Tố Ám",
    "linhkienhaomon": "Linh Kiện Hao Mòn",
    "longtominmang": "Lông Tơ Mịn Màng",
    "voxacroirung": "Vỏ Xác Rơi Rụng",
    "loihangdinh": "Lõi Hằng Định",
    "sunglinhthu": "Sừng Linh Thú",
    "ngungchatnguyento": "Ngưng Chất Nguyên Tố",
    "vihatnguyenthoa": "Vi Hạt Nguyên Tố Hỏa",
    "thotrenhoidat": "Đất Phủ Rêu",
    "longvubansac": "Lông Vũ Rực Rỡ",
    "catbanthan": "Cát Bản Thể",
    "laphongmach": "Phiến Lá Khổng Mạch",
    "moysacnhon": "Mỏ Nhọn Sắc Bén",
    "vihatnguyentodia": "Vi Hạt Nguyên Tố Địa",
    "vihatnguyentothuy": "Vi Hạt Nguyên Tố Thủy",
    "vihatnguyentoloi": "Vi Hạt Nguyên Tố Lôi",
    "vihatnguyentophong": "Vi Hạt Nguyên Tố Phong",
    "vihatnguyentobang": "Vi Hạt Nguyên Tố Băng",
    "vihatnguyentomoc": "Vi Hạt Nguyên Tố Mộc"
  };

  function getMaterialName(id) {
    if (!id) return '';
    if (id === 'uni') return 'Uni';
    if (window.AZUR_DATA && window.AZUR_DATA.materials && window.AZUR_DATA.materials[id]) {
      return window.AZUR_DATA.materials[id].name;
    }
    if (KNOWN_MATERIALS[id]) {
      return typeof KNOWN_MATERIALS[id] === 'string' ? KNOWN_MATERIALS[id] : (KNOWN_MATERIALS[id].name || id);
    }
    return id;
  }

  async function fetchMaterialsData(rel) {
    if (window.AZUR_DATA && window.AZUR_DATA.materials) {
      Object.assign(KNOWN_MATERIALS, window.AZUR_DATA.materials);
      return;
    }
    if (window.location.protocol !== 'file:') {
      try {
        const res = await fetch(`${rel}datas/materials/materials.json`);
        if (res.ok) {
          const data = await res.json();
          Object.assign(KNOWN_MATERIALS, data);
          return;
        }
      } catch (e) {}
    }
  }

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
    if (w.max_stars && w.max_stars.includes('6')) return 5;
    if (w.max_stars && w.max_stars.includes('5')) return 4;
    if (w.base_rarity) return w.base_rarity;
    return 3;
  }

  function getCleanWeaponType(rawType) {
    if (!rawType) return '';
    const match = rawType.match(/\(([^)]+)\)/);
    return match ? match[1] : rawType.replace('Vũ khí', '').trim();
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

  async function fetchWeaponData(itemId, rel) {
    if (window.location.protocol !== 'file:') {
      try {
        const res = await fetch(`${rel}datas/equipments/vu_khi/${itemId}.json`);
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.warn('Fetch JSON failed, attempting bundle fallback:', err);
      }
    }

    if (window.AZUR_DATA && window.AZUR_DATA.weapons) {
      if (Array.isArray(window.AZUR_DATA.weapons)) {
        const found = window.AZUR_DATA.weapons.find(w => w.id === itemId);
        if (found) return found;
      } else if (window.AZUR_DATA.weapons[itemId]) {
        return window.AZUR_DATA.weapons[itemId];
      }
    }

    try {
      await loadScript(`${rel}datas/bundle.js`);
      if (window.AZUR_DATA && window.AZUR_DATA.weapons) {
        if (Array.isArray(window.AZUR_DATA.weapons)) {
          return window.AZUR_DATA.weapons.find(w => w.id === itemId);
        }
        return window.AZUR_DATA.weapons[itemId];
      }
    } catch (e) {
      console.error('Failed to load bundle data fallback:', e);
    }

    return null;
  }

  function renderEquipmentMain(w, rel) {
    const rNum = getWeaponRarityNumber(w);
    const cleanType = getCleanWeaponType(w.item_type);
    const suitVal = (!w.suit || w.suit === 'Không có bộ trang bị') ? 'Không có bộ trang bị' : w.suit;
    const stars = '★'.repeat(rNum);
    const loreText = w.description ? w.description.replace(/\n/g, '<br>') : 'Chưa có thông tin cốt truyện.';

    // Screen 2: Quality attributes
    const qualities = w.main_attributes_by_quality || [];
    const maxQ = qualities.length ? qualities[qualities.length - 1].quality_level : 1;

    const qualityTabsHtml = qualities.map(q => `
      <button class="q-tab-btn ${q.quality_level === maxQ ? 'active' : ''}" data-qlevel="${q.quality_level}">
        ${q.quality_name}
      </button>
    `).join('');

    // Screen 3: Star Ascension nodes
    const ascensions = w.star_ascensions || [];
    const ascensionNodesHtml = ascensions.map(a => {
      let costChips = '';
      if (a.upgrade_cost && a.upgrade_cost.length > 0) {
        costChips = a.upgrade_cost.map(c => {
          const isWeapon = c.material_id === w.id;
          const costUrl = isWeapon ? '#' : `${rel}materials/${c.material_id}.html`;
          const iconSrc = isWeapon ? `${rel}assets/equipment/${w.id}.png` : `${rel}assets/materials/${c.material_id}.png`;
          const qtyStr = Number(c.quantity).toLocaleString('vi-VN');
          const matName = isWeapon ? w.name : (c.name || getMaterialName(c.material_id));
          return `
            <a href="${costUrl}" class="cost-chip" title="${matName}">
              <img src="${iconSrc}" alt="${matName}">
              <span>${matName} × <strong>${qtyStr}</strong></span>
            </a>`;
        }).join('');
      } else {
        costChips = `<span style="font-size: 0.82rem; color: #64748b; font-style: italic;">Không yêu cầu tiêu hao</span>`;
      }

      return `
        <div class="ascension-node">
          <div class="asc-node-header">
            <div class="asc-node-title">${a.affix_name || ''}</div>
            <span class="asc-node-star">${a.star_level || ''} • ${a.affix_level || ''}</span>
          </div>
          <div class="asc-desc">${a.description || ''}</div>
          <div class="asc-costs">
            ${costChips}
          </div>
        </div>`;
    }).join('');

    // Screen 4: Enhancement stages (Interactive Slider + Quick Buttons)
    const enhancements = w.enhancement_materials || [];
    const maxEnhanceLevel = enhancements.length > 0 ? enhancements.length : 15;

    let initialStageHtml = '';
    if (enhancements.length > 0) {
      const stage0 = enhancements[0];
      const stage0Cards = stage0.materials.map(m => {
        const matName = getMaterialName(m.material_id);
        const iconSrc = `${rel}assets/materials/${m.material_id}.png`;
        const linkHref = `${rel}materials/${m.material_id}.html`;
        return `
          <a href="${linkHref}" class="bwiki-item-card r3" title="${matName} (x${m.quantity})">
            <div class="bwiki-item-visual">
              <img src="${iconSrc}" class="bwiki-item-img" alt="${matName}" loading="lazy">
            </div>
            <div class="bwiki-item-name-box">
              <span class="bwiki-item-name-text">x${m.quantity}</span>
            </div>
          </a>`;
      }).join('');

      initialStageHtml = `
        <div class="enhance-stage-card">
          <div class="enhance-stage-header">
            <span class="enhance-stage-badge">Cấp: 0 → 1</span>
          </div>
          <div class="enhance-mats-grid">
            ${stage0Cards}
          </div>
        </div>`;
    } else {
      initialStageHtml = `<div class="enhance-max-msg">Không có dữ liệu cường hóa.</div>`;
    }

    // Screen 5: Acquisition sources
    const sources = w.acquisition_sources || [];
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
          <a href="${rel}homepage.html" class="fremm-bc-item fremm-bc-l1">TRANG CHỦ</a>
          <a href="${rel}equipments.html" class="fremm-bc-item fremm-bc-l2">TRANG BỊ</a>
          <div class="fremm-bc-item fremm-bc-l3">${w.name}</div>
        </div>

        <div class="fremm-gauge-container" id="fremm-gauge-container">
          <div class="fremm-gauge-ruler" id="fremm-gauge-ruler" aria-hidden="true">
            ${Array.from({length: 15}, (_, i) => `<div class="fremm-ruler-tick" data-tick="${i}"></div>`).join('')}
          </div>
          <nav class="fremm-gauge-track" id="fremm-gauge-track">
            <a href="#screen-overview" class="fremm-gauge-item is-active" data-index="0" data-target="screen-overview">
              <span class="fremm-item-dash"></span>
              <span class="fremm-item-label">TỔNG QUAN VŨ KHÍ</span>
            </a>
            <a href="#screen-attributes" class="fremm-gauge-item is-future" data-index="1" data-target="screen-attributes">
              <span class="fremm-item-dash"></span>
              <span class="fremm-item-label">THUỘC TÍNH PHẨM CẤP</span>
            </a>
            <a href="#screen-ascension" class="fremm-gauge-item is-future" data-index="2" data-target="screen-ascension">
              <span class="fremm-item-dash"></span>
              <span class="fremm-item-label">CÂY THĂNG SAO</span>
            </a>
            <a href="#screen-enhancement" class="fremm-gauge-item is-future" data-index="3" data-target="screen-enhancement">
              <span class="fremm-item-dash"></span>
              <span class="fremm-item-label">BẢNG CƯỜNG HÓA</span>
            </a>
            <a href="#screen-sources" class="fremm-gauge-item is-future" data-index="4" data-target="screen-sources">
              <span class="fremm-item-dash"></span>
              <span class="fremm-item-label">NGUỒN GỐC THU THẬP</span>
            </a>
          </nav>
        </div>
      </aside>

      <!-- RIGHT COLUMN: INDEPENDENT SCREEN SECTIONS -->
      <div class="fremm-content">
        
        <!-- SCREEN 1: TỔNG QUAN VŨ KHÍ (Wrapped in authentic rarity frame) -->
        <section id="screen-overview" class="detail-screen" data-step="1">
          <div class="screen-header">
            <h2>Tổng Quan & Cốt Truyện</h2>
          </div>

          <div class="screen-overview-layout">
            <div class="screen-visual-frame r${rNum}-frame">
              <img class="screen-visual-icon" src="${rel}assets/equipment/${w.id}.png" alt="${w.name}">
            </div>

            <div class="screen-overview-info">
              <h1>${w.name}</h1>
              <div class="screen-overview-original-name">${w.original_name || ''}</div>

              <div class="screen-meta-grid">
                <div class="screen-meta-box">
                  <div class="meta-k">Phân loại</div>
                  <div class="meta-v">Vũ khí (${cleanType})</div>
                </div>
                <div class="screen-meta-box">
                  <div class="meta-k">Độ hiếm</div>
                  <div class="meta-v" style="color: #b45309;">${stars}</div>
                </div>
                <div class="screen-meta-box">
                  <div class="meta-k">Giới hạn thăng sao</div>
                  <div class="meta-v">${w.max_stars || 'Chưa mở'}</div>
                </div>
                <div class="screen-meta-box">
                  <div class="meta-k">Bộ trang bị</div>
                  <div class="meta-v">${suitVal}</div>
                </div>
              </div>

              <div class="screen-lore-card">
                <div>${loreText}</div>
              </div>
            </div>
          </div>
        </section>

        <!-- SCREEN 2: THUỘC TÍNH PHẨM CẤP -->
        <section id="screen-attributes" class="detail-screen" data-step="2">
          <div class="screen-header">
            <h2>Thuộc Tính Theo Phẩm Cấp</h2>
          </div>

          <div class="quality-tabs-bar">
            ${qualityTabsHtml}
          </div>

          <table class="attr-table">
            <thead>
              <tr>
                <th style="width: 35%;">Thuộc tính</th>
                <th style="width: 20%;">Cường hóa 0</th>
                <th style="width: 20%;">Cường hóa 15</th>
                <th style="width: 25%;">Phạm vi tăng</th>
              </tr>
            </thead>
            <tbody id="attr-table-body">
              <!-- Rendered dynamically by script -->
            </tbody>
          </table>
        </section>

        <!-- SCREEN 3: CÂY THĂNG SAO -->
        <section id="screen-ascension" class="detail-screen" data-step="3">
          <div class="screen-header">
            <h2>Cây Thăng Sao</h2>
          </div>

          <div class="ascension-list">
            ${ascensionNodesHtml}
          </div>
        </section>

        <!-- SCREEN 4: BẢNG CƯỜNG HÓA -->
        <section id="screen-enhancement" class="detail-screen" data-step="4">
          <div class="screen-header">
            <h2>Nguyên Liệu Cường Hóa</h2>
          </div>

          <div class="enhance-container">
            <div class="enhance-controls-bar">
              <button type="button" class="enhance-quick-btn active" data-val="0">+0</button>
              <div class="enhance-slider-wrap">
                <input type="range" class="enhance-slider" id="enhance-slider" min="0" max="${maxEnhanceLevel}" value="0" step="1" aria-label="Mức cường hóa">
              </div>
              <button type="button" class="enhance-quick-btn" data-val="${maxEnhanceLevel}">+${maxEnhanceLevel}</button>
              <div class="enhance-level-indicator">
                <span class="level-label">Cấp:</span>
                <span class="level-val" id="enhance-level-val">0</span>
              </div>
            </div>

            <div id="enhance-stage-content" class="enhance-stage-content">
              ${initialStageHtml}
            </div>
          </div>
        </section>

        <!-- SCREEN 5: NGUỒN GỐC THU THẬP -->
        <section id="screen-sources" class="detail-screen" data-step="5">
          <div class="screen-header">
            <h2>Nguồn Gốc Thu Thập</h2>
          </div>

          <div class="source-badges">
            ${sourceBadgesHtml || '<p style="color:var(--text-dim);">Chưa rõ nguồn gốc thu thập.</p>'}
          </div>
        </section>

      </div>
    </div>`;
  }

  function initEquipmentInteractivity(w, rel) {
    const qualities = w.main_attributes_by_quality || [];
    const tabButtons = document.querySelectorAll('.q-tab-btn');
    const tableBody = document.getElementById('attr-table-body');

    function renderQualityTable(qLevel) {
      const q = qualities.find(item => item.quality_level == qLevel);
      if (!q || !q.attributes || !tableBody) return;

      tableBody.innerHTML = q.attributes.map(a => `
        <tr>
          <td><strong>${a.attribute}</strong></td>
          <td>${a.enhancement_0}</td>
          <td><strong style="color:var(--accent-azure);">${a.enhancement_15}</strong></td>
          <td><span class="growth-badge">${a.range}</span></td>
        </tr>
      `).join('');
    }

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderQualityTable(btn.dataset.qlevel);
      });
    });

    const maxQ = qualities.length ? qualities[qualities.length - 1].quality_level : 1;
    renderQualityTable(maxQ);

    // Screen 4: Enhancement Slider & Materials Interactivity
    const enhanceSlider = document.getElementById('enhance-slider');
    const enhanceLevelVal = document.getElementById('enhance-level-val');
    const enhanceStageContent = document.getElementById('enhance-stage-content');
    const enhanceQuickBtns = document.querySelectorAll('.enhance-quick-btn');
    const enhancements = w.enhancement_materials || [];
    const maxEnhance = enhancements.length > 0 ? enhancements.length : 15;

    function renderEnhanceStage(level) {
      const lvl = parseInt(level, 10);
      if (enhanceLevelVal) {
        enhanceLevelVal.textContent = lvl;
      }
      if (enhanceSlider && parseInt(enhanceSlider.value, 10) !== lvl) {
        enhanceSlider.value = lvl;
      }
      enhanceQuickBtns.forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.dataset.val, 10) === lvl);
      });

      if (!enhanceStageContent) return;

      if (lvl >= maxEnhance) {
        enhanceStageContent.innerHTML = `
          <div class="enhance-max-msg">
            Trang bị đã đạt mức cường hóa tối đa.
          </div>
        `;
        return;
      }

      const stageData = enhancements[lvl];
      if (!stageData || !stageData.materials || stageData.materials.length === 0) {
        enhanceStageContent.innerHTML = `
          <div class="enhance-max-msg">
            Không có dữ liệu cường hóa cho mốc này.
          </div>
        `;
        return;
      }

      const matCards = stageData.materials.map(m => {
        const matName = getMaterialName(m.material_id);
        const iconSrc = `${rel}assets/materials/${m.material_id}.png`;
        const linkHref = `${rel}materials/${m.material_id}.html`;
        return `
          <a href="${linkHref}" class="bwiki-item-card r3" title="${matName} (x${m.quantity})">
            <div class="bwiki-item-visual">
              <img src="${iconSrc}" class="bwiki-item-img" alt="${matName}" loading="lazy">
            </div>
            <div class="bwiki-item-name-box">
              <span class="bwiki-item-name-text">x${m.quantity}</span>
            </div>
          </a>
        `;
      }).join('');

      enhanceStageContent.innerHTML = `
        <div class="enhance-stage-card">
          <div class="enhance-stage-header">
            <span class="enhance-stage-badge">Cấp: ${lvl} → ${lvl + 1}</span>
          </div>
          <div class="enhance-mats-grid">
            ${matCards}
          </div>
        </div>
      `;
    }

    if (enhanceSlider) {
      enhanceSlider.addEventListener('input', (e) => {
        renderEnhanceStage(e.target.value);
      });
      enhanceSlider.addEventListener('change', (e) => {
        renderEnhanceStage(e.target.value);
      });
    }

    enhanceQuickBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const val = parseInt(btn.dataset.val, 10);
        renderEnhanceStage(val);
      });
    });

    // Initialize enhancement stage to current slider value
    renderEnhanceStage(enhanceSlider ? parseInt(enhanceSlider.value, 10) : 0);

    // Fincantieri FREMM EVO Navigation & Gauge Transition Logic
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

      // Position ruler background ticks at exact 28px intervals
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

      // Directly replace default "-" at occupied slots: hide background tick so ONLY the tab dash shows!
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

  async function initEquipmentPage() {
    const rootEl = document.getElementById('equipment-detail-root') || document.querySelector('main.detail-container');
    if (!rootEl) return;

    const itemId = document.body.dataset.itemId ||
                   new URLSearchParams(window.location.search).get('id') ||
                   window.location.pathname.split('/').pop().replace(/\.html$/, '');

    if (!itemId) {
      rootEl.innerHTML = `<div class="empty-state"><p>Không tìm thấy mã trang bị.</p></div>`;
      return;
    }

    const depth = document.body.dataset.depth ? parseInt(document.body.dataset.depth, 10) : 1;
    const rel = depth === 1 ? '../' : depth === 2 ? '../../' : '';

    rootEl.innerHTML = `<div style="text-align:center; padding: 100px 0; color: #64748b;">Đang tải dữ liệu trang bị...</div>`;

    const weapon = await fetchWeaponData(itemId, rel);
    if (!weapon) {
      rootEl.innerHTML = `
        <div class="empty-state">
          <h2>Không tìm thấy dữ liệu</h2>
          <p>Không thể tải dữ liệu trang bị từ cơ sở dữ liệu: <code>${itemId}.json</code></p>
          <a href="${rel}equipments.html" style="color:var(--accent-azure); font-weight:700;">Quay lại danh sách trang bị</a>
        </div>`;
      return;
    }

    document.title = `${weapon.name} - Azur Promilia Wiki`;
    await fetchMaterialsData(rel);
    rootEl.innerHTML = renderEquipmentMain(weapon, rel);
    initEquipmentInteractivity(weapon, rel);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEquipmentPage);
  } else {
    initEquipmentPage();
  }

  window.EquipmentTemplate = {
    fetchWeaponData,
    renderEquipmentMain,
    initEquipmentInteractivity,
    initEquipmentPage
  };
})();
