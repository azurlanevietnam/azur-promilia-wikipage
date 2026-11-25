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
    if (!id) return 2;
    if (window.AZUR_DATA && window.AZUR_DATA.materials && window.AZUR_DATA.materials[id] && window.AZUR_DATA.materials[id].rarity) {
      return Number(window.AZUR_DATA.materials[id].rarity);
    }
    if (KNOWN_MATERIALS[id] && typeof KNOWN_MATERIALS[id] === 'object' && KNOWN_MATERIALS[id].rarity) {
      return Number(KNOWN_MATERIALS[id].rarity);
    }
    if (id === 'linhtuyhuyensac') return 5;
    if (['linhtuyanhsang', 'dungdichtinhchat', 'banhxematvan', 'vayuquang'].includes(id)) return 4;
    if (['linhtuycuontrao', 'tinhhachngunghinh', 'moysacnhon', 'catbanthan', 'laphongmach', 'uni', 'mangmonglanquang', 'modongminmang'].includes(id)) return 3;
    if (['linhtuyngungtu', 'vomemdichchuyen', 'linhkienhaomon', 'longtominmang', 'voxacroirung', 'loihangdinh', 'sunglinhthu', 'ngungchatnguyento', 'thotrenhoidat', 'longvubansac'].includes(id) || id.startsWith('vihatnguyen')) return 2;
    if (id === 'linhtuyphothong') return 1;
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

  function getWeaponRarityInfo(w) {
    const rNum = getWeaponRarityNumber(w);
    switch (rNum) {
      case 5: return { name: 'Vàng', cls: 'rarity-val-gold' };
      case 4: return { name: 'Tím', cls: 'rarity-val-purple' };
      case 3: return { name: 'Lam', cls: 'rarity-val-blue' };
      case 2: return { name: 'Lục', cls: 'rarity-val-green' };
      case 1:
      default: return { name: 'Trắng', cls: 'rarity-val-white' };
    }
  }

  function renderCardStarsHtml(count, rel) {
    if (!count || count <= 0) return '';
    const stars = Array.from({ length: count }, () => `<img src="${rel}assets/star.png" class="bwiki-star-unit" alt="★">`).join('');
    return `<div class="bwiki-card-stars">${stars}</div>`;
  }

  // Shared quality bonus multipliers across all equipment (CBT3 verified: +60% ~ +100%)
  const QUALITY_TIERS = [
    { quality_level: 1, quality_name: 'Tân thủ',    quality_value: 6000 },
    { quality_level: 2, quality_name: 'Tiến giai',  quality_value: 7000 },
    { quality_level: 3, quality_name: 'Tinh lương', quality_value: 8000 },
    { quality_level: 4, quality_name: 'Sử thi',     quality_value: 9000 },
    { quality_level: 5, quality_name: 'Truyền kỳ',  quality_value: 10000 }
  ];

  let AFFIXES_DB = {};

  async function fetchAffixesData(rel) {
    if (window.AZUR_EQUIPMENT_AFFIXES) {
      AFFIXES_DB = window.AZUR_EQUIPMENT_AFFIXES;
      return;
    }
    if (window.AZUR_DATA && window.AZUR_DATA.equipment_affixes) {
      AFFIXES_DB = window.AZUR_DATA.equipment_affixes;
      return;
    }
    if (window.location.protocol !== 'file:') {
      try {
        const res = await fetch(`${rel}datas/equipments/affixes.json`);
        if (res.ok) {
          AFFIXES_DB = await res.json();
          return;
        }
      } catch (e) {}
    }
    try {
      await loadScript(`${rel}datas/equipments/affixes.js`);
      if (window.AZUR_EQUIPMENT_AFFIXES) {
        AFFIXES_DB = window.AZUR_EQUIPMENT_AFFIXES;
      }
    } catch (e) {}
  }

  function resolveAscensionAffix(a) {
    if (!a) return { title: '', description: '' };
    if (a.affix_id) {
      const entry = AFFIXES_DB[a.affix_id];
      const lvNum = Number(a.affix_level) || 1;
      if (entry) {
        const lvObj = (entry.levels || []).find(l => Number(l.level) === lvNum);
        return {
          title: `${entry.name} Lv${lvNum}`,
          description: lvObj ? lvObj.description : (entry.common_desc || '')
        };
      }
      return { title: `${a.affix_id} Lv${lvNum}`, description: '' };
    }
    if (a.affix_name) {
      return {
        title: formatSkillTitle(a.affix_name, a.affix_level),
        description: a.description || ''
      };
    }
    return {
      title: 'Không mở khóa kỹ năng mới',
      description: 'Mốc thăng sao này không mở khóa hoặc nâng cấp kỹ năng phụ.'
    };
  }

  function calculateBaseStatValue(baseVal, isRatio, qualityValue) {
    const scaledNumerator = Math.round(Number(baseVal) * (10000 + Number(qualityValue)));
    if (isRatio) {
      const pct = Math.floor(scaledNumerator / 100000) / 10;
      return `+${pct.toFixed(1)}%`;
    }
    const flatVal = Math.ceil(scaledNumerator / 10000);
    return `+${flatVal}`;
  }

  function formatSkillTitle(affixName, affixLevel) {
    if (!affixName) return '';
    if (!affixLevel) return affixName;
    const numMatch = affixLevel.match(/\d+/);
    if (numMatch) {
      return `${affixName} Lv${numMatch[0]}`;
    }
    return `${affixName} ${affixLevel}`;
  }

  function getStarLabel(starLevel) {
    if (!starLevel) return '0 sao';
    if (starLevel === 'Khởi đầu' || starLevel === '初始' || starLevel === '0 sao') return '0 sao';
    return starLevel;
  }

  function formatMaxStars(maxStarsStr) {
    if (!maxStarsStr) return 'Chưa mở';
    const m = maxStarsStr.match(/(\d+)\s*sao/i);
    return m ? `${m[1]} sao` : maxStarsStr;
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
    if (window.__ITEM_DATA__ && window.__ITEM_DATA__.id === itemId) {
      return window.__ITEM_DATA__;
    }

    const cat = document.body.dataset.category;
    const catList = cat ? [cat, 'vu_khi', 'ao_tren', 'quan_duoi', 'khuyen_tai', 'nhan'] : ['vu_khi', 'ao_tren', 'quan_duoi', 'khuyen_tai', 'nhan'];

    if (window.location.protocol !== 'file:') {
      for (const c of catList) {
        try {
          const res = await fetch(`${rel}datas/equipments/${c}/${itemId}.json`);
          if (res.ok) return await res.json();
        } catch (e) {}
      }
      try {
        const res = await fetch(`${rel}datas/equipments/equipments.json`);
        if (res.ok) {
          const all = await res.json();
          const list = Array.isArray(all) ? all : (all.value || []);
          const found = list.find(w => w.id === itemId);
          if (found) return found;
        }
      } catch (e) {}
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

  function renderEquipmentMain(w, rel, pagesRel) {
    if (!pagesRel) {
      const d = document.body.dataset.depth ? parseInt(document.body.dataset.depth, 10) : 2;
      pagesRel = d === 2 ? '../' : d === 1 ? '' : 'pages/';
    }

    const isWeapon = (w.category === 'vu_khi') || (!w.category && ((w.base_attributes && w.base_attributes.length > 0) || (w.main_attributes_by_quality && w.main_attributes_by_quality.length > 0)));
    const hasSuit = Boolean(w.suit && w.suit !== 'Không có bộ trang bị' && w.suit !== 'none' && w.suit_skills);
    const rNum = getWeaponRarityNumber(w);
    const starCount = w.star_count || getMaxStarsCount(w);
    const rarityInfo = getWeaponRarityInfo(w);
    const cleanType = isWeapon ? getCleanWeaponType(w.item_type) : (w.item_type || (w.category === 'ao_tren' ? 'Áo trên' : w.category === 'quan_duoi' ? 'Quần dưới' : w.category === 'khuyen_tai' ? 'Khuyên tai' : 'Nhẫn'));
    const suitVal = (!w.suit || w.suit === 'Không có bộ trang bị') ? 'Không có bộ trang bị' : w.suit;
    const loreText = w.description ? w.description.replace(/\n/g, '<br>') : 'Chưa có thông tin cốt truyện.';
    const typeLabel = isWeapon ? `Vũ khí (${cleanType})` : cleanType;

    // Screen 2: Base attributes & shared quality tiers
    const baseAttrs = w.base_attributes || [];
    const legacyQualities = w.main_attributes_by_quality || [];
    const qualities = baseAttrs.length > 0 ? QUALITY_TIERS : legacyQualities;
    const maxAttrLevel = typeof w.max_level === 'number'
      ? w.max_level
      : (baseAttrs[0] && Array.isArray(baseAttrs[0].levels) ? Math.max(0, baseAttrs[0].levels.length - 1) : 15);
    const defaultQ = 1;

    const qualityTabsHtml = qualities.map(q => `
      <button class="q-tab-btn ${q.quality_level === defaultQ ? 'active' : ''}" data-qlevel="${q.quality_level}">
        ${q.quality_name}
      </button>
    `).join('');

    // Screen 3: Star Ascension (Interactive Tabs & 2-Column Split: Skill left, Materials right)
    const ascensions = w.star_ascensions || [];
    const defaultAscIndex = 0;

    const ascButtonsHtml = ascensions.map((a, idx) => `
      <button type="button" class="asc-tab-btn ${idx === defaultAscIndex ? 'active' : ''}" data-asc-idx="${idx}">
        ${getStarLabel(a.star_level)}
      </button>
    `).join('');

    let initialAscContentHtml = '';
    if (ascensions.length > 0) {
      const activeAsc = ascensions[defaultAscIndex];
      const resolvedAffix = resolveAscensionAffix(activeAsc);
      const skillTitle = resolvedAffix.title;

      let costCardsHtml = '';
      if (activeAsc.upgrade_cost && activeAsc.upgrade_cost.length > 0) {
        costCardsHtml = activeAsc.upgrade_cost.map(c => {
          const isSelf = c.material_id === w.id;
          const costUrl = isSelf ? '#' : `${pagesRel}materials/${c.material_id}.html`;
          const iconSrc = isSelf ? `${rel}assets/equipment/${w.id}.png` : `${rel}assets/materials/${c.material_id}.png`;
          const qtyStr = Number(c.quantity).toLocaleString('vi-VN');
          const matName = isSelf ? w.name : (c.name || getMaterialName(c.material_id));
          const matRarity = getMaterialRarity(c.material_id);
          const cardFrameClass = isSelf ? `r${rNum}` : `r${matRarity}`;
          const starsHtml = isSelf ? renderCardStarsHtml(starCount, rel) : '';
          return `
            <a href="${costUrl}" class="bwiki-item-card ${cardFrameClass}" title="${matName} (x${qtyStr})">
              <div class="bwiki-item-visual">
                <img src="${iconSrc}" class="bwiki-item-img" alt="${matName}" loading="lazy">
              </div>
              ${starsHtml}
              <div class="bwiki-item-name-box">
                <span class="bwiki-item-name-text">x${qtyStr}</span>
              </div>
            </a>`;
        }).join('');
      } else {
        costCardsHtml = `<span class="asc-no-cost">Không yêu cầu tiêu hao nguyên liệu</span>`;
      }

      initialAscContentHtml = `
        <div class="asc-display-layout">
          <div class="asc-skill-pane">
            <div class="asc-section-label">Kỹ năng</div>
            <div class="asc-skill-name">${skillTitle}</div>
            <div class="asc-skill-desc">${resolvedAffix.description}</div>
          </div>
          <div class="asc-divider"></div>
          <div class="asc-cost-pane">
            <div class="asc-section-label">Nguyên liệu nâng cấp</div>
            <div class="enhance-mats-grid asc-mats-grid">
              ${costCardsHtml}
            </div>
          </div>
        </div>
      `;
    } else {
      initialAscContentHtml = `<p style="color:var(--text-dim);">Chưa có dữ liệu thăng sao.</p>`;
    }

    // Screen 4: Enhancement stages (Interactive Slider + Quick Buttons)
    const enhancements = w.enhancement_materials || [];
    const maxEnhanceLevel = enhancements.length > 0 ? enhancements.length : maxAttrLevel;

    let initialStageHtml = '';
    if (enhancements.length > 0) {
      const stage0 = enhancements[0];
      const stage0Cards = stage0.materials.map(m => {
        const matName = getMaterialName(m.material_id);
        const iconSrc = `${rel}assets/materials/${m.material_id}.png`;
        const linkHref = `${pagesRel}materials/${m.material_id}.html`;
        const qtyStr = Number(m.quantity).toLocaleString('vi-VN');
        const matRarity = getMaterialRarity(m.material_id);
        return `
          <a href="${linkHref}" class="bwiki-item-card r${matRarity}" title="${matName} (x${qtyStr})">
            <div class="bwiki-item-visual">
              <img src="${iconSrc}" class="bwiki-item-img" alt="${matName}" loading="lazy">
            </div>
            <div class="bwiki-item-name-box">
              <span class="bwiki-item-name-text">x${qtyStr}</span>
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

    // Left Rail Gauge Items & Extra Screens
    const hasStatsData = baseAttrs.length > 0 || legacyQualities.length > 0;
    const screenItems = [
      { id: 'screen-overview', label: isWeapon ? 'TỔNG QUAN VŨ KHÍ' : 'TỔNG QUAN TRANG BỊ' }
    ];

    let extraScreensHtml = '';
    let nextStep = 2;

    if (hasStatsData) {
      screenItems.push(
        { id: 'screen-attributes', label: 'THÔNG SỐ CƠ BẢN' },
        { id: 'screen-ascension', label: 'THĂNG CẤP SAO' },
        { id: 'screen-enhancement', label: 'NGUYÊN LIỆU CƯỜNG HÓA' }
      );

      extraScreensHtml += `
        <!-- SCREEN 2: THÔNG SỐ CƠ BẢN -->
        <section id="screen-attributes" class="detail-screen" data-step="${nextStep++}">
          <div class="screen-header">
            <h2>Thông Số Cơ Bản</h2>
          </div>

          <div class="attr-filters-bar">
            <div class="attr-filter-row">
              <span class="attr-filter-label">Theo phẩm chất</span>
              <div class="quality-tabs-bar">
                ${qualityTabsHtml}
              </div>
            </div>

            <div class="attr-filter-row">
              <span class="attr-filter-label">Theo cường hóa</span>
              <div class="enhance-controls-bar attr-enhance-controls">
                <button type="button" class="enhance-quick-btn attr-quick-btn active" data-val="0"><span class="btn-sign">+</span>0</button>
                <div class="enhance-slider-wrap">
                  <input type="range" class="enhance-slider" id="attr-enhance-slider" min="0" max="${maxAttrLevel}" value="0" step="1" aria-label="Cường hóa thông số">
                </div>
                <button type="button" class="enhance-quick-btn attr-quick-btn" data-val="${maxAttrLevel}"><span class="btn-sign">+</span>${maxAttrLevel}</button>
                <div class="enhance-level-indicator">
                  <span class="level-label">Cấp:</span>
                  <span class="level-val" id="attr-enhance-level-val">0</span>
                </div>
              </div>
            </div>
          </div>

          <table class="attr-table">
            <thead>
              <tr>
                <th style="width: 50%;">Thông số</th>
                <th style="width: 50%;">Chỉ số</th>
              </tr>
            </thead>
            <tbody id="attr-table-body">
              <!-- Rendered dynamically by script -->
            </tbody>
          </table>
        </section>

        <!-- SCREEN 3: THĂNG CẤP SAO -->
        <section id="screen-ascension" class="detail-screen" data-step="${nextStep++}">
          <div class="screen-header">
            <h2>Thăng Cấp Sao</h2>
          </div>

          <div class="asc-tabs-bar">
            ${ascButtonsHtml}
          </div>

          <div id="asc-content-root" class="asc-content-root">
            ${initialAscContentHtml}
          </div>
        </section>

        <!-- SCREEN 4: BẢNG CƯỜNG HÓA -->
        <section id="screen-enhancement" class="detail-screen" data-step="${nextStep++}">
          <div class="screen-header">
            <h2>Nguyên Liệu Cường Hóa</h2>
          </div>

          <div class="enhance-container">
            <div class="enhance-controls-bar">
              <button type="button" class="enhance-all-btn" id="enhance-all-btn">Tất cả nguyên liệu</button>
              <button type="button" class="enhance-quick-btn active" data-val="1"><span class="btn-sign">+</span>1</button>
              <div class="enhance-slider-wrap">
                <input type="range" class="enhance-slider" id="enhance-slider" min="1" max="${maxEnhanceLevel}" value="1" step="1" aria-label="Mức cường hóa">
              </div>
              <button type="button" class="enhance-quick-btn" data-val="${maxEnhanceLevel}"><span class="btn-sign">+</span>${maxEnhanceLevel}</button>
              <div class="enhance-level-indicator">
                <span class="level-label">Cấp:</span>
                <span class="level-val" id="enhance-level-val">1</span>
              </div>
            </div>

            <div id="enhance-stage-content" class="enhance-stage-content">
              ${initialStageHtml}
            </div>
          </div>
        </section>
      `;
    }

    if (hasSuit) {
      screenItems.push({ id: 'screen-suit-skills', label: 'KỸ NĂNG BỘ TRANG BỊ' });
      extraScreensHtml += `
          <!-- SCREEN SUIT SKILLS -->
          <section id="screen-suit-skills" class="detail-screen" data-step="${nextStep++}">
            <div class="screen-header">
              <h2>Kỹ Năng Bộ Trang Bị</h2>
            </div>

            <div class="suit-skill-card">
              <div class="suit-title-row">
                <span class="suit-badge-icon">✦</span>
                <span class="suit-title-name">${w.suit}</span>
              </div>
              <table class="set-skills-table" style="margin-top: 16px;">
                <thead>
                  <tr>
                    <th style="width: 140px;">Kích hoạt</th>
                    <th>Hiệu quả kỹ năng</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Bộ 2 món</strong></td>
                    <td>${((w.suit_skills && w.suit_skills.two_piece) || '—').replace(/thuộc tính/gi, 'nguyên tố')}</td>
                  </tr>
                  <tr>
                    <td><strong>Bộ 4 món</strong></td>
                    <td>${((w.suit_skills && w.suit_skills.four_piece) || '—').replace(/thuộc tính/gi, 'nguyên tố')}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
      `;
    }

    screenItems.push({ id: 'screen-sources', label: 'NGUỒN GỐC THU THẬP' });
    const sourcesStep = nextStep;
    const totalScreens = screenItems.length;
    const occupiedRulerSlots = [];
    const gaugeItemsHtml = screenItems.map((sc, i) => {
      const slot = i === 0 ? 7 : (15 - totalScreens + i);
      occupiedRulerSlots.push(slot);
      return `
        <a href="#${sc.id}" class="fremm-gauge-item ${i === 0 ? 'is-active' : 'is-future'}" data-index="${i}" data-target="${sc.id}" style="top: calc(${slot} * var(--gauge-tick-spacing, 28px));">
          <span class="fremm-item-dash"></span>
          <span class="fremm-item-label">${sc.label}</span>
        </a>`;
    }).join('');

    return `
    <div class="fremm-layout">
      
      <!-- LEFT RAIL: Integrated Breadcrumb Stack + Dynamic Vertical Gauge -->
      <aside class="fremm-sidebar" id="fremm-sidebar">
        <div class="fremm-breadcrumb-stack">
          <a href="${pagesRel}homepage.html" class="fremm-bc-item fremm-bc-l1">TRANG CHỦ</a>
          <a href="${pagesRel}equipments.html" class="fremm-bc-item fremm-bc-l2">TRANG BỊ</a>
          <div class="fremm-bc-item fremm-bc-l3">${w.name}</div>
        </div>

        <div class="fremm-gauge-container" id="fremm-gauge-container">
          <div class="fremm-gauge-ruler" id="fremm-gauge-ruler" aria-hidden="true">
            ${Array.from({length: 15}, (_, i) => `<div class="fremm-ruler-tick" data-tick="${i}" style="top: calc(${i} * var(--gauge-tick-spacing, 28px)); opacity: ${occupiedRulerSlots.includes(i) ? '0' : '1'};"></div>`).join('')}
          </div>
          <nav class="fremm-gauge-track" id="fremm-gauge-track">
            ${gaugeItemsHtml}
          </nav>
        </div>
      </aside>

      <!-- RIGHT COLUMN: INDEPENDENT SCREEN SECTIONS -->
      <div class="fremm-content">
        
        <!-- SCREEN 1: TỔNG QUAN (Wrapped in authentic rarity frame) -->
        <section id="screen-overview" class="detail-screen" data-step="1">
          <div class="screen-header">
            <h2>${isWeapon ? 'Tổng Quan Vũ Khí' : 'Tổng Quan Trang Bị'}</h2>
          </div>

          <div class="screen-overview-layout">
            <div class="screen-visual-frame r${rNum}-frame">
              <img class="screen-visual-icon" src="${rel}assets/equipment/${w.id}.png" alt="${w.name}">
              <div class="screen-stars-row" title="Có thể thăng ${starCount} sao">
                ${Array.from({ length: starCount }, () => `<img src="${rel}assets/star.png" class="screen-star-unit" alt="★">`).join('')}
              </div>
            </div>

            <div class="screen-overview-info">
              <h1>${w.name}</h1>
              <div class="screen-overview-original-name">${w.original_name ? `CN: ${w.original_name}` : ''}</div>

              <div class="screen-meta-grid">
                <div class="screen-meta-box">
                  <div class="meta-k">Phân loại</div>
                  <div class="meta-v">${typeLabel}</div>
                </div>
                <div class="screen-meta-box">
                  <div class="meta-k">Độ hiếm</div>
                  <div class="meta-v ${rarityInfo.cls}">${rarityInfo.name}</div>
                </div>
                <div class="screen-meta-box">
                  <div class="meta-k">Giới hạn thăng sao</div>
                  <div class="meta-v">${formatMaxStars(w.max_stars || (starCount + ' sao'))}</div>
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

        ${extraScreensHtml}

        <!-- SCREEN SOURCES -->
        <section id="screen-sources" class="detail-screen" data-step="${sourcesStep}">
          <div class="screen-header">
            <h2>Nguồn Gốc Thu Thập</h2>
          </div>

          <div class="source-badges">
            ${sourceBadgesHtml || '<div class="source-badge"><span>✦</span><span>Ủy thác thám hiểm & Chế tạo Tiệm Rèn</span></div>'}
          </div>
        </section>

      </div>
    </div>`;
  }

  function initEquipmentInteractivity(w, rel, pagesRel) {
    if (!pagesRel) {
      const d = document.body.dataset.depth ? parseInt(document.body.dataset.depth, 10) : 2;
      pagesRel = d === 2 ? '../' : d === 1 ? '' : 'pages/';
    }

    // 1. Initialize Fincantieri FREMM EVO Navigation FIRST (Resilient & Fail-Safe)
    function initFremmGaugeNavigation() {
      if (window.SiteLayout && typeof window.SiteLayout.initFremmGauge === "function") {
        window.SiteLayout.initFremmGauge();
        return;
      }
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

        // Position ruler background ticks at exact tickSpacing intervals
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

        // Directly replace default "-" at occupied slots: hide background tick so ONLY the tab dash shows!
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
          // When bottom is reached, select the lowest visible screen in the viewport
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
    }

    try {
      initFremmGaugeNavigation();
    } catch (err) {
      console.error('FREMM Gauge Init error:', err);
    }

    const baseAttrs = w.base_attributes || [];
    const legacyQualities = w.main_attributes_by_quality || [];
    const maxAttrLevel = typeof w.max_level === 'number'
      ? w.max_level
      : (baseAttrs[0] && Array.isArray(baseAttrs[0].levels) ? Math.max(0, baseAttrs[0].levels.length - 1) : 15);
    const ascensions = w.star_ascensions || [];
    const rNum = getWeaponRarityNumber(w);
    const qualityTabButtons = document.querySelectorAll('.q-tab-btn');
    const tableBody = document.getElementById('attr-table-body');
    const attrEnhanceSlider = document.getElementById('attr-enhance-slider');
    const attrEnhanceLevelVal = document.getElementById('attr-enhance-level-val');
    const attrQuickBtns = document.querySelectorAll('.attr-quick-btn');
    const attrThCurrent = document.getElementById('attr-th-current');

    let currentQualityLevel = 1;
    let currentAttrEnhance = 0;

    function calculateAttributeValue(val0Str, val15Str, level) {
      if (!val0Str || !val15Str) return val0Str || val15Str || '';
      const lvl = Math.max(0, Math.min(maxAttrLevel, parseInt(level, 10) || 0));
      if (lvl === 0) return val0Str;
      if (lvl === maxAttrLevel) return val15Str;

      const isPercent = val0Str.includes('%') || val15Str.includes('%');
      const hasPlus = val0Str.startsWith('+') || val15Str.startsWith('+');

      const num0 = parseFloat(val0Str.replace(/[^\d.-]/g, ''));
      const num15 = parseFloat(val15Str.replace(/[^\d.-]/g, ''));

      if (isNaN(num0) || isNaN(num15)) return val0Str;

      const currentNum = num0 + (num15 - num0) * (lvl / maxAttrLevel);

      let formatted = '';
      if (isPercent) {
        formatted = currentNum.toFixed(1) + '%';
      } else {
        formatted = Math.round(currentNum).toString();
      }

      return (hasPlus ? '+' : '') + formatted;
    }

    function renderQualityTable(qLevel, eLevel) {
      currentQualityLevel = Number(qLevel) || 1;
      currentAttrEnhance = Math.max(0, Math.min(maxAttrLevel, parseInt(eLevel, 10) || 0));

      if (!tableBody) return;

      if (attrThCurrent) {
        attrThCurrent.textContent = `Cường hóa +${currentAttrEnhance}`;
      }
      if (attrEnhanceLevelVal) {
        attrEnhanceLevelVal.textContent = currentAttrEnhance;
      }
      if (attrEnhanceSlider && parseInt(attrEnhanceSlider.value, 10) !== currentAttrEnhance) {
        attrEnhanceSlider.value = currentAttrEnhance;
      }
      attrQuickBtns.forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.dataset.val, 10) === currentAttrEnhance);
      });

      if (baseAttrs.length > 0) {
        const tier = QUALITY_TIERS.find(item => item.quality_level === currentQualityLevel) || QUALITY_TIERS[0];
        tableBody.innerHTML = baseAttrs.map(a => {
          const lvArr = Array.isArray(a.levels) ? a.levels : [];
          const baseVal = lvArr[currentAttrEnhance] !== undefined ? lvArr[currentAttrEnhance] : (lvArr[lvArr.length - 1] || 0);
          const currentVal = calculateBaseStatValue(baseVal, Boolean(a.is_ratio), tier.quality_value);
          const attrLabel = (a.attribute || '').replace(/%/g, '').replace(/thuộc tính/gi, 'nguyên tố').trim();
          return `
            <tr>
              <td><strong>${attrLabel}</strong></td>
              <td><strong style="color:var(--accent-azure);">${currentVal}</strong></td>
            </tr>
          `;
        }).join('');
        return;
      }

      const q = legacyQualities.find(item => item.quality_level == currentQualityLevel);
      if (!q || !q.attributes) return;

      tableBody.innerHTML = q.attributes.map(a => {
        const currentVal = calculateAttributeValue(a.enhancement_0, a.enhancement_15, currentAttrEnhance);
        const attrLabel = (a.attribute || '').replace(/%/g, '').replace(/thuộc tính/gi, 'nguyên tố').trim();
        return `
          <tr>
            <td><strong>${attrLabel}</strong></td>
            <td><strong style="color:var(--accent-azure);">${currentVal}</strong></td>
          </tr>
        `;
      }).join('');
    }

    qualityTabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        qualityTabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderQualityTable(btn.dataset.qlevel, currentAttrEnhance);
      });
    });

    if (attrEnhanceSlider) {
      attrEnhanceSlider.addEventListener('input', (e) => {
        renderQualityTable(currentQualityLevel, e.target.value);
      });
      attrEnhanceSlider.addEventListener('change', (e) => {
        renderQualityTable(currentQualityLevel, e.target.value);
      });
    }

    attrQuickBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const val = parseInt(btn.dataset.val, 10) || 0;
        renderQualityTable(currentQualityLevel, val);
      });
    });

    // Initial render for quality table (default Tân thủ)
    renderQualityTable(1, 0);

    // Screen 3: Star Ascension Tab Interactivity
    const ascTabBtns = document.querySelectorAll('.asc-tab-btn');
    const ascContentRoot = document.getElementById('asc-content-root');

    function renderAscensionDetail(idx) {
      const a = ascensions[idx];
      if (!a || !ascContentRoot) return;

      const resolvedAffix = resolveAscensionAffix(a);
      const skillTitle = resolvedAffix.title;

      let costCardsHtml = '';
      if (a.upgrade_cost && a.upgrade_cost.length > 0) {
        costCardsHtml = a.upgrade_cost.map(c => {
          const isWeapon = c.material_id === w.id;
          const costUrl = isWeapon ? '#' : `${pagesRel}materials/${c.material_id}.html`;
          const iconSrc = isWeapon ? `${rel}assets/equipment/${w.id}.png` : `${rel}assets/materials/${c.material_id}.png`;
          const qtyStr = Number(c.quantity).toLocaleString('vi-VN');
          const matName = isWeapon ? w.name : (c.name || getMaterialName(c.material_id));
          const matRarity = getMaterialRarity(c.material_id);
          const cardFrameClass = isWeapon ? `r${rNum}` : `r${matRarity}`;
          const starsHtml = isWeapon ? renderCardStarsHtml(w.star_count || getMaxStarsCount(w), rel) : '';
          return `
            <a href="${costUrl}" class="bwiki-item-card ${cardFrameClass}" title="${matName} (x${qtyStr})">
              <div class="bwiki-item-visual">
                <img src="${iconSrc}" class="bwiki-item-img" alt="${matName}" loading="lazy">
              </div>
              ${starsHtml}
              <div class="bwiki-item-name-box">
                <span class="bwiki-item-name-text">x${qtyStr}</span>
              </div>
            </a>`;
        }).join('');
      } else {
        costCardsHtml = `<span class="asc-no-cost">Không yêu cầu tiêu hao nguyên liệu</span>`;
      }

      ascContentRoot.innerHTML = `
        <div class="asc-display-layout">
          <div class="asc-skill-pane">
            <div class="asc-section-label">Kỹ năng</div>
            <div class="asc-skill-name">${skillTitle}</div>
            <div class="asc-skill-desc">${resolvedAffix.description}</div>
          </div>
          <div class="asc-divider"></div>
          <div class="asc-cost-pane">
            <div class="asc-section-label">Nguyên liệu nâng cấp</div>
            <div class="enhance-mats-grid asc-mats-grid">
              ${costCardsHtml}
            </div>
          </div>
        </div>
      `;
    }

    ascTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        ascTabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const idx = parseInt(btn.dataset.ascIdx, 10);
        renderAscensionDetail(idx);
      });
    });

    // Screen 4: Enhancement Slider & Materials Interactivity
    const enhanceSlider = document.getElementById('enhance-slider');
    const enhanceLevelVal = document.getElementById('enhance-level-val');
    const enhanceStageContent = document.getElementById('enhance-stage-content');
    const enhanceQuickBtns = document.querySelectorAll('#screen-enhancement .enhance-quick-btn');
    const enhanceAllBtn = document.getElementById('enhance-all-btn');
    const enhancements = w.enhancement_materials || [];
    const maxEnhance = enhancements.length > 0 ? enhancements.length : 15;

    function renderEnhanceStage(level) {
      const lvl = Math.max(1, Math.min(parseInt(level, 10) || 1, maxEnhance));
      if (enhanceLevelVal) {
        enhanceLevelVal.textContent = lvl;
      }
      if (enhanceSlider && parseInt(enhanceSlider.value, 10) !== lvl) {
        enhanceSlider.value = lvl;
      }
      if (enhanceAllBtn) {
        enhanceAllBtn.classList.remove('active');
      }
      enhanceQuickBtns.forEach(btn => {
        const btnVal = parseInt(btn.dataset.val, 10);
        btn.classList.toggle('active', btnVal === lvl);
      });

      if (!enhanceStageContent) return;

      const stageIdx = lvl - 1;
      const stageData = enhancements[stageIdx];
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
        const linkHref = `${pagesRel}materials/${m.material_id}.html`;
        const qtyStr = Number(m.quantity).toLocaleString('vi-VN');
        const matRarity = getMaterialRarity(m.material_id);
        return `
          <a href="${linkHref}" class="bwiki-item-card r${matRarity}" title="${matName} (x${qtyStr})">
            <div class="bwiki-item-visual">
              <img src="${iconSrc}" class="bwiki-item-img" alt="${matName}" loading="lazy">
            </div>
            <div class="bwiki-item-name-box">
              <span class="bwiki-item-name-text">x${qtyStr}</span>
            </div>
          </a>
        `;
      }).join('');

      enhanceStageContent.innerHTML = `
        <div class="enhance-stage-card">
          <div class="enhance-stage-header">
            <span class="enhance-stage-badge">Cấp: ${stageIdx} → ${lvl}</span>
          </div>
          <div class="enhance-mats-grid">
            ${matCards}
          </div>
        </div>
      `;
    }

    function renderAllMaterials() {
      if (!enhanceStageContent) return;

      if (enhanceAllBtn) {
        enhanceAllBtn.classList.add('active');
      }
      enhanceQuickBtns.forEach(btn => btn.classList.remove('active'));
      if (enhanceLevelVal) {
        enhanceLevelVal.textContent = `0 → ${maxEnhance}`;
      }

      if (!enhancements || enhancements.length === 0) {
        enhanceStageContent.innerHTML = `
          <div class="enhance-max-msg">Không có dữ liệu cường hóa.</div>
        `;
        return;
      }

      // Calculate aggregated totals
      const totalMatsMap = {};
      enhancements.forEach(st => {
        (st.materials || []).forEach(m => {
          if (!totalMatsMap[m.material_id]) {
            totalMatsMap[m.material_id] = {
              material_id: m.material_id,
              quantity: 0
            };
          }
          totalMatsMap[m.material_id].quantity += (Number(m.quantity) || 0);
        });
      });
      const totalMats = Object.values(totalMatsMap);

      const totalCards = totalMats.map(m => {
        const matName = getMaterialName(m.material_id);
        const iconSrc = `${rel}assets/materials/${m.material_id}.png`;
        const linkHref = `${pagesRel}materials/${m.material_id}.html`;
        const qtyStr = Number(m.quantity).toLocaleString('vi-VN');
        const matRarity = getMaterialRarity(m.material_id);
        return `
          <a href="${linkHref}" class="bwiki-item-card r${matRarity}" title="${matName} (x${qtyStr})">
            <div class="bwiki-item-visual">
              <img src="${iconSrc}" class="bwiki-item-img" alt="${matName}" loading="lazy">
            </div>
            <div class="bwiki-item-name-box">
              <span class="bwiki-item-name-text">x${qtyStr}</span>
            </div>
          </a>
        `;
      }).join('');

      enhanceStageContent.innerHTML = `
        <div class="enhance-stage-card">
          <div class="enhance-stage-header">
            <span class="enhance-stage-badge">Cấp: 0 → ${maxEnhance}</span>
          </div>
          <div class="enhance-mats-grid">
            ${totalCards}
          </div>
        </div>
      `;
    }

    if (enhanceAllBtn) {
      enhanceAllBtn.addEventListener('click', () => {
        renderAllMaterials();
      });
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

    // Initialize enhancement stage to level 1
    renderEnhanceStage(enhanceSlider ? parseInt(enhanceSlider.value, 10) : 1);
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

    const depth = document.body.dataset.depth ? parseInt(document.body.dataset.depth, 10) : 2;
    const rel = depth === 1 ? '../' : depth === 2 ? '../../' : '';
    const pagesRel = depth === 2 ? '../' : depth === 1 ? '' : 'pages/';

    rootEl.innerHTML = `<div style="text-align:center; padding: 100px 0; color: #64748b;">Đang tải dữ liệu trang bị...</div>`;

    const weapon = await fetchWeaponData(itemId, rel);
    if (!weapon) {
      rootEl.innerHTML = `
        <div class="empty-state">
          <h2>Không tìm thấy dữ liệu</h2>
          <p>Không thể tải dữ liệu trang bị từ cơ sở dữ liệu: <code>${itemId}.json</code></p>
          <a href="${pagesRel}equipments.html" style="color:var(--accent-azure); font-weight:700;">Quay lại danh sách trang bị</a>
        </div>`;
      return;
    }

    document.title = `${weapon.name} - Azur Promilia Wiki`;
    await Promise.all([fetchMaterialsData(rel), fetchAffixesData(rel)]);
    rootEl.innerHTML = renderEquipmentMain(weapon, rel, pagesRel);
    initEquipmentInteractivity(weapon, rel, pagesRel);
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
