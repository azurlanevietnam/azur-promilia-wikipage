/* ===================================================================
   AZUR PROMILIA WIKI - INTERACTIVE APPLICATION SCRIPT
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Ensure data exists
  if (!window.AZUR_DATA) {
    console.error('AZUR_DATA not found. Please check datas/bundle.js');
    return;
  }

  const { weapons, materials } = window.AZUR_DATA;

  // Helper to resolve relative asset paths safely
  function resolveAssetPath(p) {
    if (!p) return '';
    return p.replace(/^(\.\.\/)+/, '');
  }

  // State
  let currentView = 'home';
  let selectedWeapon = null;
  let activeQuality = 5; // Default to 5 (Truyền kỳ) or max available

  let weaponSearchTerm = '';
  let selectedRarity = 'all';
  let selectedWeaponType = 'all';

  let materialSearchTerm = '';
  let selectedMaterialCategory = 'all';

  // DOM Elements
  const views = {
    home: document.getElementById('view-home'),
    weapons: document.getElementById('view-weapons'),
    weaponDetail: document.getElementById('view-weapon-detail'),
    materials: document.getElementById('view-materials')
  };

  const navItems = document.querySelectorAll('.nav-item');

  // Navigation handlers
  function navigateTo(viewName, weaponId = null) {
    currentView = viewName;

    // Update active nav button
    navItems.forEach(item => {
      if (item.dataset.view === viewName || (viewName === 'weaponDetail' && item.dataset.view === 'weapons')) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Toggle views
    Object.keys(views).forEach(key => {
      if (key === viewName) {
        views[key].classList.add('active');
      } else {
        views[key].classList.remove('active');
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (viewName === 'weaponDetail' && weaponId) {
      renderWeaponDetail(weaponId);
    }
  }

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetView = item.dataset.view;
      if (targetView) navigateTo(targetView);
    });
  });

  // Logo home click
  document.getElementById('brand-home-link').addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('home');
  });

  // Portal cards click
  document.getElementById('portal-to-weapons').addEventListener('click', () => {
    navigateTo('weapons');
  });
  document.getElementById('portal-to-materials').addEventListener('click', () => {
    navigateTo('materials');
  });

  // Back from detail to weapons
  document.getElementById('btn-back-to-weapons').addEventListener('click', () => {
    navigateTo('weapons');
  });

  // ===================================================================
  // 1. WEAPONS VIEW LOGIC
  // ===================================================================
  const weaponsGrid = document.getElementById('weapons-grid');
  const weaponSearchInput = document.getElementById('weapon-search');
  const rarityPills = document.querySelectorAll('.rarity-filter .filter-pill');
  const typePills = document.querySelectorAll('.type-filter .filter-pill');

  function renderWeapons() {
    weaponsGrid.innerHTML = '';

    const filtered = weapons.filter(w => {
      // Search
      const search = weaponSearchTerm.toLowerCase();
      const matchSearch = !search || 
        w.name.toLowerCase().includes(search) || 
        w.original_name.toLowerCase().includes(search) ||
        w.id.toLowerCase().includes(search);

      // Rarity
      const matchRarity = selectedRarity === 'all' || w.base_rarity === parseInt(selectedRarity, 10);

      // Type
      const matchType = selectedWeaponType === 'all' || w.item_type.includes(selectedWeaponType);

      return matchSearch && matchRarity && matchType;
    });

    if (filtered.length === 0) {
      weaponsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--text-dim);">
          <div style="font-size: 2.5rem; margin-bottom: 12px;">🔍</div>
          <h3>Không tìm thấy vũ khí nào phù hợp</h3>
          <p style="font-size: 0.9rem; margin-top: 6px;">Vui lòng thử từ khóa khác hoặc bỏ bớt điều kiện lọc.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(weapon => {
      const card = document.createElement('div');
      card.className = `weapon-card rarity-${weapon.base_rarity}`;

      // Star string
      const starCount = weapon.max_star_count > 0 ? weapon.max_star_count : (weapon.base_rarity + 1);
      const starsStr = '★'.repeat(starCount);

      // Extract preview stats (from highest quality)
      const highestQ = weapon.main_attributes_by_quality[weapon.main_attributes_by_quality.length - 1];
      let statPreviewHtml = '';
      if (highestQ && highestQ.attributes) {
        statPreviewHtml = highestQ.attributes.map(a => `
          <div class="stat-preview-item">
            <span>${a.attribute}</span>
            <span style="color: #fff; font-weight: 700;">${a.enhancement_15}</span>
          </div>
        `).join('');
      }

      // Local asset paths
      const iconPath = resolveAssetPath(weapon.image);
      const bgPath = resolveAssetPath(weapon.rarity_bg_image);

      card.innerHTML = `
        <div class="card-top">
          <span class="type-tag">${weapon.item_type}</span>
          <span class="stars-display">${starsStr}</span>
        </div>
        <div class="weapon-img-box">
          <img class="weapon-bg-img" src="${bgPath}" alt="Rarity BG" loading="lazy">
          <img class="weapon-icon-img" src="${iconPath}" alt="${weapon.name}" loading="lazy">
        </div>
        <div class="weapon-card-info">
          <div class="weapon-name-vi">${weapon.name}</div>
          <div class="weapon-name-cn">${weapon.original_name}</div>
          <div class="weapon-stat-preview">
            ${statPreviewHtml}
          </div>
          <div class="card-cta-btn">Chi tiết vũ khí →</div>
        </div>
      `;

      card.addEventListener('click', () => {
        navigateTo('weaponDetail', weapon.id);
      });

      weaponsGrid.appendChild(card);
    });
  }

  // Filter listeners
  weaponSearchInput.addEventListener('input', (e) => {
    weaponSearchTerm = e.target.value.trim();
    renderWeapons();
  });

  rarityPills.forEach(pill => {
    pill.addEventListener('click', () => {
      rarityPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      selectedRarity = pill.dataset.rarity;
      renderWeapons();
    });
  });

  typePills.forEach(pill => {
    pill.addEventListener('click', () => {
      typePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      selectedWeaponType = pill.dataset.type;
      renderWeapons();
    });
  });

  // ===================================================================
  // 2. WEAPON DETAIL VIEW LOGIC
  // ===================================================================
  function renderWeaponDetail(weaponId) {
    selectedWeapon = weapons.find(w => w.id === weaponId);
    if (!selectedWeapon) {
      console.warn('Weapon not found with id:', weaponId);
      return;
    }

    // Breadcrumb name
    const breadcrumbEl = document.getElementById('detail-breadcrumb-name');
    if (breadcrumbEl) breadcrumbEl.textContent = selectedWeapon.name;

    // Visual card
    const iconPath = resolveAssetPath(selectedWeapon.image);
    const bgPath = resolveAssetPath(selectedWeapon.rarity_bg_image);

    const imgIconEl = document.getElementById('detail-img-icon');
    if (imgIconEl) {
      imgIconEl.src = iconPath;
      imgIconEl.alt = selectedWeapon.name;
    }

    const imgBgEl = document.getElementById('detail-img-bg');
    if (imgBgEl) imgBgEl.src = bgPath;

    const nameViEl = document.getElementById('detail-name-vi');
    if (nameViEl) nameViEl.textContent = selectedWeapon.name;

    const nameCnEl = document.getElementById('detail-name-cn');
    if (nameCnEl) nameCnEl.textContent = selectedWeapon.original_name;

    const metaTypeEl = document.getElementById('meta-type');
    if (metaTypeEl) metaTypeEl.textContent = selectedWeapon.item_type;

    const metaRarityEl = document.getElementById('meta-rarity');
    if (metaRarityEl) metaRarityEl.textContent = `${selectedWeapon.base_rarity + 1} Sao (Cơ sở: ${selectedWeapon.base_rarity})`;

    const metaStarsEl = document.getElementById('meta-stars');
    if (metaStarsEl) metaStarsEl.textContent = selectedWeapon.max_stars;

    const metaSuitEl = document.getElementById('meta-suit');
    if (metaSuitEl) metaSuitEl.textContent = selectedWeapon.suit;

    const loreViEl = document.getElementById('detail-lore-vi');
    if (loreViEl) loreViEl.textContent = `"${selectedWeapon.description}"`;

    const loreCnEl = document.getElementById('detail-lore-cn');
    if (loreCnEl) loreCnEl.textContent = selectedWeapon.original_description;

    // Sources badges
    const sourcesContainer = document.getElementById('detail-sources-list');
    if (sourcesContainer) {
      sourcesContainer.innerHTML = selectedWeapon.acquisition_sources.map(s => `
        <span class="source-badge">📍 ${s}</span>
      `).join('');
    }

    // Quality tabs setup
    const qualityTabsContainer = document.getElementById('quality-tabs-bar');
    qualityTabsContainer.innerHTML = '';

    const availableQualities = selectedWeapon.main_attributes_by_quality;
    // Default active to highest quality
    activeQuality = availableQualities[availableQualities.length - 1].quality_level;

    availableQualities.forEach(q => {
      const btn = document.createElement('button');
      btn.className = `q-tab-btn ${q.quality_level === activeQuality ? 'active' : ''}`;
      btn.textContent = `${q.quality_name} (${q.original_quality_name})`;
      btn.addEventListener('click', () => {
        activeQuality = q.quality_level;
        document.querySelectorAll('.q-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderQualityAttributes();
      });
      qualityTabsContainer.appendChild(btn);
    });

    renderQualityAttributes();
    renderStarAscensions();
    renderEnhancementMaterials();
  }

  function renderQualityAttributes() {
    const tableBody = document.getElementById('attr-table-body');
    tableBody.innerHTML = '';

    const qData = selectedWeapon.main_attributes_by_quality.find(q => q.quality_level === activeQuality);
    if (!qData || !qData.attributes) return;

    qData.attributes.forEach(attr => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-weight: 700; color: #fff;">${attr.attribute} <span style="font-size: 0.78rem; color: var(--text-dim);">(${attr.original_attribute})</span></td>
        <td style="color: #94a3b8;">${attr.enhancement_0}</td>
        <td class="attr-highlight">${attr.enhancement_15}</td>
        <td>
          <div style="background: rgba(255,255,255,0.06); border-radius: 4px; padding: 4px 8px; font-size: 0.85rem; font-family: monospace;">
            ${attr.range}
          </div>
        </td>
      `;
      tableBody.appendChild(tr);
    });
  }

  function renderStarAscensions() {
    const container = document.getElementById('ascension-list-container');
    container.innerHTML = '';

    if (!selectedWeapon.star_ascensions || selectedWeapon.star_ascensions.length === 0) {
      container.innerHTML = `<p style="color: var(--text-dim);">Trang bị này không có bậc thăng sao.</p>`;
      return;
    }

    selectedWeapon.star_ascensions.forEach(asc => {
      const item = document.createElement('div');
      item.className = 'ascension-item';

      let costHtml = '';
      if (asc.upgrade_cost && asc.upgrade_cost.length > 0) {
        costHtml = `
          <div class="ascension-cost">
            <span class="cost-label">Chi phí thăng sao:</span>
            ${asc.upgrade_cost.map(c => {
              let icon = 'assets/materials/uni.png';
              if (c.material_id === selectedWeapon.id) {
                icon = resolveAssetPath(selectedWeapon.image);
              } else if (materials[c.material_id]) {
                icon = resolveAssetPath(materials[c.material_id].image);
              }
              return `
                <span class="cost-chip">
                  <img src="${icon}" alt="${c.name}">
                  <span>${c.name} × <strong>${c.quantity.toLocaleString()}</strong></span>
                </span>
              `;
            }).join('')}
          </div>
        `;
      }

      item.innerHTML = `
        <div class="ascension-header">
          <span class="star-badge">${asc.star_level}</span>
          <span class="affix-title">${asc.affix_name}</span>
          <span class="affix-lvl">${asc.affix_level}</span>
        </div>
        <div class="ascension-desc">${asc.description}</div>
        ${costHtml}
      `;

      container.appendChild(item);
    });
  }

  function renderEnhancementMaterials() {
    const container = document.getElementById('enhancement-grid-container');
    container.innerHTML = '';

    if (!selectedWeapon.enhancement_materials || selectedWeapon.enhancement_materials.length === 0) {
      container.innerHTML = `<p style="color: var(--text-dim);">Không có thông tin cường hóa.</p>`;
      return;
    }

    selectedWeapon.enhancement_materials.forEach(stage => {
      const row = document.createElement('div');
      row.className = 'enhancement-row';

      const matsHtml = stage.materials.map(m => {
        const matData = materials[m.material_id];
        const matName = matData ? matData.name : m.material_id;
        const iconPath = matData ? resolveAssetPath(matData.image) : '';

        return `
          <span class="mat-item-pill" data-mat-id="${m.material_id}" title="Xem chi tiết nguyên liệu">
            <img src="${iconPath}" alt="${matName}">
            <span>${matName} × <strong>${m.quantity.toLocaleString()}</strong></span>
          </span>
        `;
      }).join('');

      row.innerHTML = `
        <span class="stage-badge">${stage.stage}</span>
        <div class="stage-mats">
          ${matsHtml}
        </div>
      `;

      container.appendChild(row);
    });

    // Add click listeners to material pills
    container.querySelectorAll('.mat-item-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const matId = pill.dataset.matId;
        openMaterialModal(matId);
      });
    });
  }

  // ===================================================================
  // 3. MATERIALS VIEW LOGIC
  // ===================================================================
  const materialsGrid = document.getElementById('materials-grid');
  const materialSearchInput = document.getElementById('material-search');
  const matCategoryPills = document.querySelectorAll('.mat-category-filter .filter-pill');

  function getWeaponsUsingMaterial(matId) {
    const list = [];
    weapons.forEach(w => {
      let isUsed = false;
      if (w.enhancement_materials) {
        w.enhancement_materials.forEach(stage => {
          if (stage.materials.some(m => m.material_id === matId)) {
            isUsed = true;
          }
        });
      }
      if (w.star_ascensions) {
        w.star_ascensions.forEach(asc => {
          if (asc.upgrade_cost && asc.upgrade_cost.some(c => c.material_id === matId)) {
            isUsed = true;
          }
        });
      }
      if (isUsed) list.push(w);
    });
    return list;
  }

  function renderMaterials() {
    materialsGrid.innerHTML = '';

    const matKeys = Object.keys(materials);
    const filtered = matKeys.filter(key => {
      const m = materials[key];
      const search = materialSearchTerm.toLowerCase();
      const matchSearch = !search ||
        m.name.toLowerCase().includes(search) ||
        m.original_name.toLowerCase().includes(search) ||
        m.id.toLowerCase().includes(search);

      // Category filter
      let matchCategory = true;
      if (selectedMaterialCategory === 'essence') {
        matchCategory = m.name.includes('Linh Túy');
      } else if (selectedMaterialCategory === 'particle') {
        matchCategory = m.name.includes('Vi Hạt');
      } else if (selectedMaterialCategory === 'currency') {
        matchCategory = m.id === 'uni';
      } else if (selectedMaterialCategory === 'monster') {
        matchCategory = !m.name.includes('Linh Túy') && !m.name.includes('Vi Hạt') && m.id !== 'uni';
      }

      return matchSearch && matchCategory;
    });

    if (filtered.length === 0) {
      materialsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--text-dim);">
          <div style="font-size: 2.5rem; margin-bottom: 12px;">💎</div>
          <h3>Không tìm thấy nguyên liệu nào phù hợp</h3>
        </div>
      `;
      return;
    }

    filtered.forEach(key => {
      const mat = materials[key];
      const usedInWeapons = getWeaponsUsingMaterial(mat.id);
      const iconPath = resolveAssetPath(mat.image);

      const card = document.createElement('div');
      card.className = 'material-card';
      card.innerHTML = `
        <div class="material-icon-wrap">
          <img src="${iconPath}" alt="${mat.name}">
        </div>
        <div class="material-name-vi">${mat.name}</div>
        <div class="material-name-cn">${mat.original_name}</div>
        <span class="material-usage-tag">Dùng cho ${usedInWeapons.length} vũ khí</span>
      `;

      card.addEventListener('click', () => {
        openMaterialModal(mat.id);
      });

      materialsGrid.appendChild(card);
    });
  }

  materialSearchInput.addEventListener('input', (e) => {
    materialSearchTerm = e.target.value.trim();
    renderMaterials();
  });

  matCategoryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      matCategoryPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      selectedMaterialCategory = pill.dataset.category;
      renderMaterials();
    });
  });

  // ===================================================================
  // 4. MATERIAL DETAIL MODAL
  // ===================================================================
  const modalOverlay = document.getElementById('material-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  function openMaterialModal(matId) {
    const mat = materials[matId];
    if (!mat) return;

    const usedIn = getWeaponsUsingMaterial(matId);
    const iconPath = resolveAssetPath(mat.image);

    document.getElementById('modal-mat-img').src = iconPath;
    document.getElementById('modal-mat-name').textContent = mat.name;
    document.getElementById('modal-mat-orig').textContent = `${mat.original_name} (ID: ${mat.id})`;

    const listContainer = document.getElementById('modal-weapons-list');
    listContainer.innerHTML = '';

    if (usedIn.length === 0) {
      listContainer.innerHTML = `<p style="color: var(--text-dim); padding: 10px 0;">Không có vũ khí nào sử dụng nguyên liệu này.</p>`;
    } else {
      usedIn.forEach(w => {
        const item = document.createElement('div');
        item.className = 'modal-used-item';
        const wIcon = resolveAssetPath(w.image);
        item.innerHTML = `
          <div class="item-left">
            <img src="${wIcon}" alt="${w.name}">
            <div>
              <div class="item-name">${w.name}</div>
              <div style="font-size: 0.78rem; color: var(--text-dim);">${w.item_type} • ${w.max_stars}</div>
            </div>
          </div>
          <span style="font-size: 0.85rem; color: var(--accent-cyan); font-weight: 700;">Xem →</span>
        `;
        item.addEventListener('click', () => {
          modalOverlay.classList.remove('active');
          navigateTo('weaponDetail', w.id);
        });
        listContainer.appendChild(item);
      });
    }

    modalOverlay.classList.add('active');
  }

  modalCloseBtn.addEventListener('click', () => {
    modalOverlay.classList.remove('active');
  });

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.classList.remove('active');
    }
  });

  // ===================================================================
  // EXPOSE FOR TESTING & EXTERNAL NAVIGATION
  // ===================================================================
  window.__AZUR_APP = {
    navigateTo,
    renderWeaponDetail,
    openMaterialModal,
    renderWeapons,
    renderMaterials
  };

  // ===================================================================
  // INITIAL RENDER
  // ===================================================================
  renderWeapons();
  renderMaterials();
  navigateTo('home');
});
