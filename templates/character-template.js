/**
 * MASTER TEMPLATE: Character Detail Page
 * Azur Promilia Wiki
 * 
 * Renders Character overview, portrait splash art, combat skills with interactive
 * Lv.1-Lv.12 scaling tables, 12-stage Star Blessings (Tinh Tứ), profile lore & stories
 * with the Fincantieri FREMM EVO left-rail navigation.
 *
 * Strictly adheres to AGENTS.md & Impeccable craft-floor:
 * - Zero-clutter: NO technical identifiers, NO decorative badges, NO captions under images
 * - Border-radius ONLY on interactive buttons & pills
 * - Seamless transparent containers with hairline dividers
 * - WCAG AA contrast >= 4.5:1 across all elements
 */
(function() {
  const ELEM_META = {
    fire:    { name: 'Hỏa',   color: '#c2410c', bg: '#ffedd5' },
    wind:    { name: 'Phong', color: '#0f766e', bg: '#ccfbf1' },
    earth:   { name: 'Địa',   color: '#a16207', bg: '#fef9c3' },
    wood:    { name: 'Mộc',   color: '#15803d', bg: '#dcfce7' },
    ice:     { name: 'Băng',  color: '#0369a1', bg: '#e0f2fe' },
    water:   { name: 'Thủy',  color: '#1d4ed8', bg: '#dbeafe' },
    thunder: { name: 'Lôi',   color: '#6d28d9', bg: '#ede9fe' },
    light:   { name: 'Quang', color: '#b45309', bg: '#fef3c7' },
    dark:    { name: 'Ám',    color: '#581c87', bg: '#f3e8ff' },
    none:    { name: 'Vô',    color: '#475569', bg: '#f1f5f9' }
  };

  const RARITY_META = {
    5: { name: 'Vàng', color: '#b45309', border: '#f59e0b', bg: '#fef3c7' },
    4: { name: 'Tím',  color: '#334155', border: '#cbd5e1', bg: '#f1f5f9' }
  };

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

  function renderElementChips(elements, rel) {
    return (elements || []).map((elId, idx) => {
      const m = ELEM_META[elId] || ELEM_META.none;
      const isPrimary = idx === 0;
      return `
        <span class="kibo-elem-inline ${isPrimary ? 'elem-primary' : 'elem-secondary'}" style="color:${m.color};">
          <img src="${rel}assets/elements/${elId}.png" alt="${m.name}" class="kibo-elem-mini-icon ${isPrimary ? 'elem-icon-primary' : 'elem-icon-secondary'}">
          <span class="${isPrimary ? 'elem-name-primary' : 'elem-name-secondary'}">${m.name}</span>
        </span>`;
    }).join('');
  }

  function renderSkillsSection(skills, rel) {
    if (!skills || !skills.length) {
      return '<div class="kibo-empty-note">Chưa có dữ liệu kỹ năng.</div>';
    }

    return `
      <div class="char-skills-wrapper">
        <!-- Skill Tabs -->
        <div class="quality-tabs-bar char-skill-tabs" id="char-skill-tab-list" role="tablist">
          ${skills.map((sk, idx) => `
            <button type="button" 
                    class="quality-tab char-skill-tab-btn ${idx === 0 ? 'active' : ''}" 
                    data-skill-index="${idx}" 
                    role="tab" 
                    aria-selected="${idx === 0 ? 'true' : 'false'}">
              ${sk.icon ? `<img src="${rel}assets/characters/skills/${sk.icon}" class="char-skill-tab-icon" alt="" loading="lazy">` : ''}
              <span>${sk.name}</span>
            </button>
          `).join('')}
        </div>

        <!-- Skill Details Panels -->
        <div class="char-skill-panels">
          ${skills.map((sk, idx) => {
            const hasLevels = sk.levels && sk.levels.length > 0;
            const hasStats = sk.stat_names && sk.stat_names.length > 0;

            return `
              <div class="char-skill-panel ${idx === 0 ? 'active' : ''}" id="char-skill-panel-${idx}" data-skill-idx="${idx}">
                <div class="char-skill-header">
                  <div class="char-skill-icon-frame">
                    ${sk.icon ? `<img src="${rel}assets/characters/skills/${sk.icon}" class="char-skill-icon-img" alt="${sk.name}" loading="lazy">` : ''}
                  </div>
                  <div class="char-skill-title-block">
                    <div class="char-skill-type-tag">${sk.type_label}</div>
                    <h3 class="char-skill-name">${sk.name}</h3>
                    <div class="char-skill-meta-row">
                      ${sk.cooldown && sk.cooldown !== '0.0' && sk.cooldown !== '0' ? `<span class="char-skill-meta-item">Thời gian hồi: <strong>${sk.cooldown}s</strong></span>` : ''}
                      ${sk.energy && sk.energy !== '0' ? `<span class="char-skill-meta-item">Năng lượng: <strong>${sk.energy}</strong></span>` : ''}
                    </div>
                  </div>
                </div>

                <div class="char-skill-desc">
                  ${sk.desc}
                </div>

                ${sk.whisper ? `
                  <div class="char-skill-whisper">
                    <span class="whisper-quote">“</span>${sk.whisper}<span class="whisper-quote">”</span>
                  </div>
                ` : ''}

                ${hasLevels && hasStats ? `
                  <div class="char-scaling-box">
                    <h4 class="kibo-sub-heading">Bảng Tăng Trưởng Chỉ Số Kỹ Năng</h4>
                    <div class="char-scaling-table-wrap">
                      <table class="attr-table char-scaling-table">
                        <thead>
                          <tr>
                            <th>Chỉ số</th>
                            ${sk.levels.map(lvObj => `<th>Lv.${lvObj.lv}</th>`).join('')}
                          </tr>
                        </thead>
                        <tbody>
                          ${sk.stat_names.map((statName, sIdx) => `
                            <tr>
                              <td class="stat-name-cell">${statName}</td>
                              ${sk.levels.map(lvObj => `
                                <td>${(lvObj.values && lvObj.values[sIdx]) || '—'}</td>
                              `).join('')}
                            </tr>
                          `).join('')}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  function renderStarBlessingsSection(blessings) {
    if (!blessings || !blessings.length) {
      return '<div class="kibo-empty-note">Dữ liệu Tinh Tứ đang được cập nhật từ phiên bản thử nghiệm.</div>';
    }

    return `
      <div class="char-starblessings-grid">
        ${blessings.map(b => `
          <div class="char-blessing-card">
            <div class="char-blessing-tier">GIAI ĐOẠN ${b.tier}</div>
            <h4 class="char-blessing-name">${b.name || `Tinh Tứ ${b.tier}`}</h4>
            <div class="char-blessing-upgrade">${b.upgrade}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  function renderStoriesSection(stories, char) {
    const bioHtml = (char.bio || '')
      .split('\n')
      .filter(Boolean)
      .map(p => `<p>${p}</p>`)
      .join('');

    return `
      <div class="char-stories-container">
        <div class="screen-section-block">
          <h3 class="kibo-sub-heading">Hồ Sơ Nhân Vật</h3>
          <div class="screen-lore-card">
            ${bioHtml || '<p>Chưa có thông tin hồ sơ nhân vật.</p>'}
          </div>
        </div>

        ${(stories && stories.length) ? `
          <div class="screen-section-block" style="margin-top: 36px;">
            <h3 class="kibo-sub-heading">Truyền Kỳ & Giai Thoại</h3>
            <div class="char-story-list">
              ${stories.map((st, i) => `
                <div class="char-story-item">
                  <div class="char-story-title">${st.title || `Câu Chuyện ${i + 1}`}</div>
                  <div class="char-story-text">${st.text}</div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : `
          <div class="screen-section-block" style="margin-top: 36px;">
            <h3 class="kibo-sub-heading">Truyền Kỳ & Giai Thoại</h3>
            <div class="kibo-empty-note">Dữ liệu cốt truyện và truyền kỳ đang được cập nhật.</div>
          </div>
        `}
      </div>
    `;
  }

  function renderCharacterDetail(char, depth) {
    const rel = getRelPrefix(depth);
    const pagesRel = getPagesRel(depth);
    const isServer = window.location.protocol !== 'file:';
    const homeHref = isServer ? '/homepage' : `${pagesRel}homepage.html`;
    const charListHref = isServer ? '/characters' : `${pagesRel}characters.html`;

    const primaryEl = (char.elements && char.elements[0]) || 'none';
    const elMeta = ELEM_META[primaryEl] || ELEM_META.none;
    const rNum = Number(char.rarity) || 5;
    const rarityCls = rNum === 5 ? 'rarity-val-gold' : 'rarity-val-purple';
    const rarityName = rNum === 5 ? 'Vàng' : 'Tím';

    let origSubtitle = '';
    const enName = char.english_name || char.en_name || '';
    if (char.is_hanviet || (enName && enName.toLowerCase() !== char.name.toLowerCase())) {
      origSubtitle = `EN: ${enName} · CN: ${char.original_name || ''}`;
    } else if (char.original_name) {
      origSubtitle = `CN: ${char.original_name}`;
    }

    // Build section list for Fincantieri Left Rail
    const navSections = [
      { id: 'screen-char-overview',      label: 'TỔNG QUAN' },
      { id: 'screen-char-skills',        label: 'KỸ NĂNG CHIẾN ĐẤU' },
      { id: 'screen-char-starblessings', label: 'TINH TỨ' },
      { id: 'screen-char-lore',          label: 'TIỂU SỬ & CỐT TRUYỆN' }
    ];

    const activeSlots = [4, 7, 10, 13];

    const gaugeTicksHtml = Array.from({ length: 15 }, (_, i) =>
      `<div class="fremm-ruler-tick" data-tick="${i}" style="top: calc(${i} * var(--gauge-tick-spacing, 28px)); opacity: ${activeSlots.includes(i) ? '0' : '1'};"></div>`
    ).join('');

    const gaugeItemsHtml = navSections.map((sec, idx) => `
      <a href="#${sec.id}" class="fremm-gauge-item ${idx === 0 ? 'is-active' : 'is-future'}" data-index="${idx}" data-target="${sec.id}" style="top: calc(${activeSlots[idx]} * var(--gauge-tick-spacing, 28px));">
        <span class="fremm-item-dash"></span>
        <span class="fremm-item-label">${sec.label}</span>
      </a>
    `).join('');

    // Lore paragraphs
    const loreHtml = (char.bio || '')
      .split('\n')
      .filter(Boolean)
      .map(p => `<p>${p}</p>`)
      .join('');

    return `
    <div class="fremm-layout">
      <!-- LEFT RAIL: Integrated Breadcrumb Stack + Dynamic Vertical Gauge -->
      <aside class="fremm-sidebar" id="fremm-sidebar">
        <div class="fremm-breadcrumb-stack">
          <a href="${homeHref}" class="fremm-bc-item fremm-bc-l1">TRANG CHỦ</a>
          <a href="${charListHref}" class="fremm-bc-item fremm-bc-l2">NHÂN VẬT</a>
          <div class="fremm-bc-item fremm-bc-l3">${char.name}</div>
        </div>

        <div class="fremm-gauge-container" id="fremm-gauge-container">
          <div class="fremm-gauge-ruler" id="fremm-gauge-ruler" aria-hidden="true">
            ${gaugeTicksHtml}
          </div>
          <nav class="fremm-gauge-track" id="fremm-gauge-track">
            ${gaugeItemsHtml}
          </nav>
        </div>
      </aside>

      <!-- RIGHT COLUMN: INDEPENDENT SCREEN SECTIONS -->
      <div class="fremm-content">

        <!-- SCREEN 1: TỔNG QUAN NHÂN VẬT -->
        <section id="screen-char-overview" class="detail-screen" data-step="1">
          <div class="screen-header">
            <h2>Tổng Quan Nhân Vật</h2>
          </div>

          <!-- TẦNG 1: KHỐI 1 (ẢNH MỞ RỘNG) + KHỐI 2 (TÊN & BẢNG THÔNG TIN) -->
          <div class="char-overview-tier-1">
            <!-- Khối 1: Ảnh chân dung mở rộng, fit khung, bỏ icon góc -->
            <div class="char-visual-frame" style="background: linear-gradient(180deg, ${elMeta.bg}66 0%, #ffffff 100%);">
              <img class="char-visual-portrait" 
                   src="${rel}${char.portrait}" 
                   alt="${char.name}" 
                   loading="eager"
                   onerror="this.src='${rel}${char.icon}'">
            </div>

            <!-- Khối 2: Tên & Bảng thông tin -->
            <div class="char-overview-info-block">
              <h1 class="char-overview-name">${char.name}</h1>
              <div class="screen-overview-original-name">${origSubtitle}</div>

              <!-- Standard Meta Grid (Seamless Hairline Accent) -->
              <div class="screen-meta-grid">
                <div class="screen-meta-box">
                  <div class="meta-k">Nguyên tố</div>
                  <div class="meta-v kibo-meta-elems">${renderElementChips(char.elements, rel)}</div>
                </div>
                <div class="screen-meta-box">
                  <div class="meta-k">Độ hiếm</div>
                  <div class="meta-v ${rarityCls}">${rarityName}</div>
                </div>
                <div class="screen-meta-box">
                  <div class="meta-k">Vai trò</div>
                  <div class="meta-v">${char.role || 'Chưa rõ'}</div>
                </div>
                <div class="screen-meta-box">
                  <div class="meta-k">Vũ khí</div>
                  <div class="meta-v">${char.weapon || 'Chưa rõ'}</div>
                </div>
                <div class="screen-meta-box">
                  <div class="meta-k">Trận doanh</div>
                  <div class="meta-v">${char.faction || 'Chưa rõ'}</div>
                </div>
                <div class="screen-meta-box">
                  <div class="meta-k">Chủng tộc</div>
                  <div class="meta-v">${char.race || 'Chưa rõ'}</div>
                </div>
                <div class="screen-meta-box">
                  <div class="meta-k">Ngày sinh</div>
                  <div class="meta-v">${char.birthday || 'Chưa rõ'}</div>
                </div>
                <div class="screen-meta-box">
                  <div class="meta-k">Lồng tiếng</div>
                  <div class="meta-v">${(char.cv && (char.cv.jp || char.cv.vi)) || 'Chưa rõ'}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- TẦNG 2: KHỐI 3 (ĐỊNH VỊ CHIẾN ĐẤU + LỜI THOẠI & TIỂU SỬ) -->
          <div class="char-overview-tier-2">
            ${char.combat_role ? `
              <div class="char-combat-callout-box">
                <div class="meta-k">Định vị chiến đấu</div>
                <div class="char-combat-callout-text">${char.combat_role}</div>
              </div>
            ` : ''}

            <div class="screen-lore-card">
              ${char.quote ? `<p class="char-quote-text" style="margin-bottom: 12px; font-weight: 600; color: #0369a1;">“${char.quote}”</p>` : ''}
              ${loreHtml}
            </div>
          </div>
        </section>

        <!-- SCREEN 2: KỸ NĂNG CHIẾN ĐẤU -->
        <section id="screen-char-skills" class="detail-screen" data-step="2">
          <div class="screen-header">
            <h2>Kỹ Năng Chiến Đấu</h2>
          </div>
          ${renderSkillsSection(char.skills, rel)}
        </section>

        <!-- SCREEN 3: TINH TỨ -->
        <section id="screen-char-starblessings" class="detail-screen" data-step="3">
          <div class="screen-header">
            <h2>Tinh Tứ</h2>
          </div>
          ${renderStarBlessingsSection(char.star_blessings)}
        </section>

        <!-- SCREEN 4: TIỂU SỬ & CỐT TRUYỆN -->
        <section id="screen-char-lore" class="detail-screen" data-step="4">
          <div class="screen-header">
            <h2>Tiểu Sử &amp; Cốt Truyện</h2>
          </div>
          ${renderStoriesSection(char.stories, char)}
        </section>

      </div>
    </div>
    `;
  }

  function bindInteractions() {
    // Skill tab switching
    const tabList = document.getElementById('char-skill-tab-list');
    if (tabList) {
      const tabs = tabList.querySelectorAll('.char-skill-tab-btn');
      tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
          e.preventDefault();
          const targetIdx = tab.dataset.skillIndex;
          tabs.forEach(t => {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
          });
          tab.classList.add('active');
          tab.setAttribute('aria-selected', 'true');

          const panels = document.querySelectorAll('.char-skill-panel');
          panels.forEach(p => p.classList.remove('active'));
          const targetPanel = document.getElementById(`char-skill-panel-${targetIdx}`);
          if (targetPanel) targetPanel.classList.add('active');
        });
      });
    }

    // Initialize Fincantieri FREMM Gauge scroll & ticks
    const gaugeTrack = document.getElementById('fremm-gauge-track');
    if (gaugeTrack) {
      const gaugeItems = Array.from(gaugeTrack.querySelectorAll('.fremm-gauge-item'));
      const screens = [
        document.getElementById('screen-char-overview'),
        document.getElementById('screen-char-skills'),
        document.getElementById('screen-char-starblessings'),
        document.getElementById('screen-char-lore')
      ].filter(Boolean);

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

    // Call layout's initFremmGauge if present
    if (window.SiteLayout && typeof window.SiteLayout.initFremmGauge === 'function') {
      window.SiteLayout.initFremmGauge();
    }
  }

  function initCharacterDetail() {
    const root = document.getElementById('character-detail-root');
    if (!root) return;

    const char = window.__ITEM_DATA__;
    if (!char) {
      root.innerHTML = '<div class="container empty-state" style="padding:60px 0; text-align:center;">Dữ liệu Nhân Vật không tồn tại.</div>';
      return;
    }

    const depth = (document.body && document.body.dataset.depth !== undefined)
      ? parseInt(document.body.dataset.depth, 10)
      : 2;

    root.innerHTML = renderCharacterDetail(char, depth);
    bindInteractions();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCharacterDetail);
  } else {
    initCharacterDetail();
  }

  window.CharacterTemplate = {
    renderCharacterDetail,
    initCharacterDetail
  };
})();
