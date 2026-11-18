/**
 * MASTER TEMPLATE: Kibo Detail Page
 * Azur Promilia Wiki
 * 
 * Renders Kibo overview, passives & interactive Lv.1-Lv.5 skills,
 * homestead & dropped materials, evolution lineage, 6-stage Yuanmai (Source Vein),
 * and acquisition sources with the Fincantieri FREMM EVO left-rail navigation.
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

  const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI'];

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

  function formatNumber(n) {
    return Number(n).toLocaleString('en-US');
  }

  function renderElementChips(elements, rel) {
    return (elements || []).map(elId => {
      const m = ELEM_META[elId] || ELEM_META.none;
      return `
        <span class="kibo-elem-inline" style="color:${m.color};">
          <img src="${rel}assets/elements/${elId}.png" alt="${m.name}" class="kibo-elem-mini-icon">
          <span>${m.name}</span>
        </span>`;
    }).join('');
  }

  function renderMaterialCard(mat, rel, pagesRel) {
    const isServer = window.location.protocol !== 'file:';
    if (mat.mat_id) {
      const href = isServer ? `/materials/${mat.mat_id}` : `${pagesRel}materials/${mat.mat_id}.html`;
      const rNum = Number(mat.rarity) || 1;
      const stars = Array.from({ length: rNum }, () =>
        `<img src="${rel}assets/star.png" class="bwiki-star-unit" alt="★">`
      ).join('');
      return `
        <a href="${href}" class="bwiki-item-card r${rNum}">
          <div class="bwiki-item-visual">
            <img src="${rel}assets/materials/${mat.mat_id}.png" class="bwiki-item-img" alt="${mat.name}" loading="lazy">
            <div class="bwiki-card-stars">${stars}</div>
          </div>
          <div class="bwiki-item-name-box">
            <span class="bwiki-item-name-text">${mat.name}</span>
          </div>
        </a>`;
    }
    return `
      <div class="source-badge">
        <span>✦</span>
        <span>${mat.name}</span>
      </div>`;
  }

  function renderSkillCard(skill, idx, rel) {
    const elMeta = ELEM_META[skill.element_id] || ELEM_META.none;
    const levels = skill.levels || [];
    const maxLv = levels.length || 1;
    const defaultLv = 1;
    const initialDesc = levels[0] || '';

    const lvButtonsHtml = maxLv > 1
      ? `<div class="kibo-skill-lv-bar" data-skill-idx="${idx}">
          ${levels.map((_, li) => `
            <button type="button" class="kibo-lv-btn ${li === 0 ? 'active' : ''}" data-lv="${li + 1}">Lv.${li + 1}</button>
          `).join('')}
        </div>`
      : '';

    const iconHtml = skill.icon
      ? `<div class="kibo-skill-icon-box" style="background:${elMeta.bg}; border-color:${elMeta.color}33;">
           <img src="${rel}assets/kibo/skills/${skill.icon}" alt="${skill.name}" loading="lazy">
         </div>`
      : '';

    return `
      <div class="kibo-skill-row" data-skill-idx="${idx}">
        <div class="kibo-skill-head">
          ${iconHtml}
          <div class="kibo-skill-title-col">
            <div class="kibo-skill-name-line">
              <h3>${skill.name}</h3>
              <span class="kibo-skill-type">${skill.type_label}</span>
              ${skill.element_id && skill.element_id !== 'none' ? renderElementChips([skill.element_id], rel) : ''}
            </div>
            ${lvButtonsHtml}
          </div>
        </div>
        <div class="kibo-skill-desc" id="kibo-skill-desc-${idx}">${initialDesc}</div>
      </div>`;
  }

  function renderEvolutionSection(kibo, rel, pagesRel) {
    const chain = kibo.evolution_chain || [];
    if (chain.length < 2) {
      return `<div class="kibo-empty-note">Kibo này không có lộ trình tiến hóa tiếp theo.</div>`;
    }

    const isServer = window.location.protocol !== 'file:';
    const nodesHtml = chain.map((step, i) => {
      const isCurrent = step.id === kibo.id;
      const href = isServer ? `/kibo/${step.id}` : `${step.id}.html`;
      const arrowHtml = i < chain.length - 1 ? (() => {
        const reqs = [];
        if (step.next_level) reqs.push(`Lv.${step.next_level}`);
        if (step.next_materials && step.next_materials.length) {
          reqs.push(...step.next_materials.map(m => `${m.name} ×${m.count}`));
        }
        return `
          <div class="kibo-evo-connector">
            <div class="kibo-evo-req">${reqs.join(' · ') || 'Tiến hóa'}</div>
            <div class="kibo-evo-arrow" aria-hidden="true">→</div>
          </div>`;
      })() : '';

      return `
        <a href="${href}" class="kibo-evo-node ${isCurrent ? 'is-current' : ''}">
          <div class="kibo-evo-img-wrap">
            <img src="${rel}assets/kibo/${step.id}.png" alt="${step.name}" loading="lazy">
          </div>
          <div class="kibo-evo-name">${step.name}</div>
          <div class="kibo-evo-stage">${step.stage}</div>
        </a>
        ${arrowHtml}`;
    }).join('');

    return `<div class="kibo-evo-track">${nodesHtml}</div>`;
  }

  function renderYuanmaiStage(stageObj, ymData, petInfo) {
    const attrsDict = ymData.attrs || {};
    const itemsDict = ymData.items || {};

    function formatAttrPair(pair) {
      const info = attrsDict[String(pair[0])];
      if (!info) return '';
      const valStr = info.ratio ? `${(pair[1] / 100).toFixed(1)}%` : formatNumber(pair[1]);
      return `<span class="kibo-ym-attr">${info.name} <strong>+${valStr}</strong></span>`;
    }

    function formatCostItem(kind, itemId, count) {
      if (kind === 10) {
        return `<span class="kibo-ym-cost">Uni × ${formatNumber(count)}</span>`;
      }
      const info = itemsDict[String(itemId)];
      if (!info) return '';
      return `<span class="kibo-ym-cost">${info.name} × ${formatNumber(count)}</span>`;
    }

    const rowsHtml = (stageObj.nodes || []).map(node => {
      const title = node.kind === 2 ? 'Đột Phá Giai Đoạn' : `Nút ${node.node}`;
      const cond = node.level > 0 ? `Tinh Thức Lv.${node.level}` : '';
      const effects = [];
      (node.attrs || []).forEach(p => {
        const s = formatAttrPair(p);
        if (s) effects.push(s);
      });
      if (node.skillGain > 0) {
        effects.push(`<span class="kibo-ym-attr kibo-ym-skill">Cấp Kỹ Năng <strong>+${node.skillGain}</strong></span>`);
      }

      const costs = [];
      if (node.echoNum > 0 && petInfo && petInfo.echo) {
        const c = formatCostItem(3, petInfo.echo, node.echoNum);
        if (c) costs.push(c);
      }
      (node.cost || []).forEach(item => {
        const c = formatCostItem(item[0], item[1], item[2]);
        if (c) costs.push(c);
      });

      return `
        <tr class="${node.kind === 2 ? 'kibo-ym-breakthrough' : ''}">
          <td>
            <div class="kibo-ym-node-title">${title}</div>
            ${cond ? `<div class="kibo-ym-node-cond">${cond}</div>` : ''}
          </td>
          <td><div class="kibo-ym-effects">${effects.join('') || '—'}</div></td>
          <td><div class="kibo-ym-costs">${costs.join('') || '—'}</div></td>
        </tr>`;
    }).join('');

    const cumHtml = (stageObj.cumulative || []).map(formatAttrPair).filter(Boolean).join('');

    return `
      <table class="attr-table kibo-ym-table">
        <thead>
          <tr>
            <th style="width: 24%;">Mốc Nguyên Mạch</th>
            <th style="width: 38%;">Thuộc Tính Gia Tăng</th>
            <th style="width: 38%;">Nguyên Liệu Tiêu Hao</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
      ${cumHtml ? `
        <div class="kibo-ym-cumulative">
          <span class="kibo-ym-cum-label">Tổng Cộng Giai Đoạn ${ROMAN[(stageObj.stage || 1) - 1] || stageObj.stage}</span>
          <div class="kibo-ym-effects">${cumHtml}</div>
        </div>` : ''}`;
  }

  function renderKiboDetail(kibo, depth) {
    const rel = getRelPrefix(depth);
    const pagesRel = getPagesRel(depth);
    const isServer = window.location.protocol !== 'file:';
    const homeHref = isServer ? '/homepage' : `${pagesRel}homepage.html`;
    const kiboListHref = isServer ? '/kibo' : `${pagesRel}kibo.html`;

    const primaryEl = (kibo.elements && kibo.elements[0]) || 'none';
    const elMeta = ELEM_META[primaryEl] || ELEM_META.none;

    // Check Yuanmai availability
    const ymData = window.KIBO_YUANMAI || null;
    const petYm = ymData && kibo.game_id ? ymData.pets[String(kibo.game_id)] : null;
    const ymStages = (petYm && ymData.templates[String(petYm.template)]) || null;
    const hasYuanmai = Boolean(ymStages && ymStages.length);

    // Build section list for Fincantieri Left Rail
    const navSections = [
      { id: 'screen-kibo-overview',  label: 'TỔNG QUAN KIBO' },
      { id: 'screen-kibo-skills',    label: 'KỸ NĂNG & ĐẶC TÍNH' },
      { id: 'screen-kibo-homestead', label: 'GIA VIÊN & SẢN VẬT' },
      { id: 'screen-kibo-evolution', label: 'LỘ TRÌNH TIẾN HÓA' }
    ];
    if (hasYuanmai) {
      navSections.push({ id: 'screen-kibo-yuanmai', label: 'NGUYÊN MẠCH' });
    }
    navSections.push({ id: 'screen-kibo-sources', label: 'NGUỒN GỐC THU THẬP' });

    // Distribute ticks cleanly across 15 slots
    const activeSlots = navSections.length === 6
      ? [4, 7, 9, 11, 13, 14]
      : [5, 8, 10, 12, 14];

    const gaugeTicksHtml = Array.from({ length: 15 }, (_, i) =>
      `<div class="fremm-ruler-tick" data-tick="${i}" style="top: calc(${i} * var(--gauge-tick-spacing, 28px)); opacity: ${activeSlots.includes(i) ? '0' : '1'};"></div>`
    ).join('');

    const gaugeItemsHtml = navSections.map((sec, idx) => `
      <a href="#${sec.id}" class="fremm-gauge-item ${idx === 0 ? 'is-active' : 'is-future'}" data-index="${idx}" data-target="${sec.id}" style="top: calc(${activeSlots[idx]} * var(--gauge-tick-spacing, 28px));">
        <span class="fremm-item-dash"></span>
        <span class="fremm-item-label">${sec.label}</span>
      </a>
    `).join('');

    // Variant summary text
    const variantFlags = [];
    if (kibo.has_shiny) variantFlags.push('Dị Sắc');
    if (kibo.has_starcolor) variantFlags.push('Tinh Thải');
    if (kibo.is_special) variantFlags.push('Đặc Biệt');
    const variantText = variantFlags.length ? variantFlags.join(' · ') : 'Tiêu Chuẩn';

    // Lore paragraphs
    const loreHtml = (kibo.desc || 'Kibo sinh sống trên lục địa Promilia.')
      .split('\n')
      .filter(Boolean)
      .map(p => `<p>${p}</p>`)
      .join('');

    // Passives
    const passivesHtml = (kibo.passives || []).length
      ? `<div class="kibo-passives-block">
           <h3 class="kibo-sub-heading">Đặc Tính Kibo</h3>
           <div class="kibo-passive-list">
             ${kibo.passives.map(p => `
               <div class="kibo-passive-item">
                 <div class="kibo-passive-name">${p.name}</div>
                 <div class="kibo-passive-desc">${p.desc}</div>
               </div>
             `).join('')}
           </div>
         </div>`
      : '';

    // Skills
    const skillsHtml = (kibo.skills || []).map((sk, idx) => renderSkillCard(sk, idx, rel)).join('');

    // Homestead & Drops
    const jobsText = (kibo.homestead_jobs && kibo.homestead_jobs.length)
      ? kibo.homestead_jobs.join(' · ')
      : 'Chưa cập nhật';
    const traitsText = (kibo.features && kibo.features.length)
      ? kibo.features.join(' · ')
      : 'Không';
    const dropsHtml = (kibo.drop_materials || []).length
      ? kibo.drop_materials.map(m => renderMaterialCard(m, rel, pagesRel)).join('')
      : '<div class="kibo-empty-note">Chưa có dữ liệu nguyên liệu rơi.</div>';

    // Yuanmai section
    const yuanmaiScreenHtml = hasYuanmai ? `
      <section id="screen-kibo-yuanmai" class="detail-screen" data-step="5">
        <div class="screen-header">
          <h2>Nguyên Mạch</h2>
        </div>
        <div class="quality-tabs-bar" id="kibo-ym-tabs">
          ${ymStages.map((st, si) => `
            <button type="button" class="quality-tab ${si === 0 ? 'active' : ''}" data-stage-idx="${si}">
              Giai Đoạn ${ROMAN[(st.stage || (si + 1)) - 1] || (si + 1)}
            </button>
          `).join('')}
        </div>
        <div id="kibo-ym-content">
          ${renderYuanmaiStage(ymStages[0], ymData, petYm)}
        </div>
      </section>` : '';

    // Sources
    const sourcesHtml = (kibo.acquisition_sources || []).map(s => `
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
          <a href="${homeHref}" class="fremm-bc-item fremm-bc-l1">TRANG CHỦ</a>
          <a href="${kiboListHref}" class="fremm-bc-item fremm-bc-l2">KIBO</a>
          <div class="fremm-bc-item fremm-bc-l3">${kibo.name}</div>
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

        <!-- SCREEN 1: TỔNG QUAN KIBO -->
        <section id="screen-kibo-overview" class="detail-screen" data-step="1">
          <div class="screen-header">
            <h2>Tổng Quan Kibo</h2>
          </div>

          <div class="screen-overview-layout">
            <div class="kibo-visual-frame" style="background: linear-gradient(180deg, ${elMeta.bg}66 0%, #ffffff 100%);">
              <div class="kibo-visual-elems">
                ${(kibo.elements || []).map(elId => `
                  <img src="${rel}assets/elements/${elId}.png" alt="${(ELEM_META[elId] || ELEM_META.none).name}" class="kibo-visual-elem-icon">
                `).join('')}
              </div>
              <img class="kibo-visual-portrait" src="${rel}assets/kibo/${kibo.id}.png" alt="${kibo.name}">
            </div>

            <div class="screen-overview-info">
              <h1>${kibo.name}</h1>
              <div class="screen-overview-original-name">${kibo.original_name || ''}</div>

              <div class="screen-meta-grid">
                <div class="screen-meta-box">
                  <div class="meta-k">Nguyên tố</div>
                  <div class="meta-v kibo-meta-elems">${renderElementChips(kibo.elements, rel)}</div>
                </div>
                <div class="screen-meta-box">
                  <div class="meta-k">Chủng tộc</div>
                  <div class="meta-v">${kibo.race || 'Chưa rõ'}</div>
                </div>
                <div class="screen-meta-box">
                  <div class="meta-k">Giai đoạn</div>
                  <div class="meta-v">${kibo.stage || 'Chưa rõ'}</div>
                </div>
                <div class="screen-meta-box">
                  <div class="meta-k">Vai trò</div>
                  <div class="meta-v">${kibo.role || 'Chưa rõ'}</div>
                </div>
                <div class="screen-meta-box">
                  <div class="meta-k">Kích thước</div>
                  <div class="meta-v">${kibo.size || 'Chưa rõ'}${kibo.height ? ` · ${kibo.height}` : ''}</div>
                </div>
                <div class="screen-meta-box">
                  <div class="meta-k">Biến thể</div>
                  <div class="meta-v">${variantText}</div>
                </div>
              </div>

              <div class="screen-lore-card">
                ${loreHtml}
              </div>
            </div>
          </div>
        </section>

        <!-- SCREEN 2: KỸ NĂNG & ĐẶC TÍNH -->
        <section id="screen-kibo-skills" class="detail-screen" data-step="2">
          <div class="screen-header">
            <h2>Kỹ Năng &amp; Đặc Tính</h2>
          </div>

          ${passivesHtml}

          <div class="kibo-skills-block">
            <h3 class="kibo-sub-heading">Kỹ Năng Chiến Đấu</h3>
            <div class="kibo-skills-list">
              ${skillsHtml || '<div class="kibo-empty-note">Chưa có dữ liệu kỹ năng.</div>'}
            </div>
          </div>
        </section>

        <!-- SCREEN 3: GIA VIÊN & SẢN VẬT -->
        <section id="screen-kibo-homestead" class="detail-screen" data-step="3">
          <div class="screen-header">
            <h2>Gia Viên &amp; Sản Vật</h2>
          </div>

          <div class="screen-meta-grid">
            <div class="screen-meta-box">
              <div class="meta-k">Công việc Gia Viên</div>
              <div class="meta-v">${jobsText}</div>
            </div>
            <div class="screen-meta-box">
              <div class="meta-k">Đặc trưng</div>
              <div class="meta-v">${traitsText}</div>
            </div>
          </div>

          <div class="kibo-drops-block">
            <h3 class="kibo-sub-heading">Nguyên Liệu Rơi</h3>
            <div class="enhance-mats-grid">
              ${dropsHtml}
            </div>
          </div>
        </section>

        <!-- SCREEN 4: LỘ TRÌNH TIẾN HÓA -->
        <section id="screen-kibo-evolution" class="detail-screen" data-step="4">
          <div class="screen-header">
            <h2>Lộ Trình Tiến Hóa</h2>
          </div>

          ${renderEvolutionSection(kibo, rel, pagesRel)}
        </section>

        ${yuanmaiScreenHtml}

        <!-- LAST SCREEN: NGUỒN GỐC THU THẬP -->
        <section id="screen-kibo-sources" class="detail-screen" data-step="${hasYuanmai ? 6 : 5}">
          <div class="screen-header">
            <h2>Nguồn Gốc Thu Thập</h2>
          </div>

          <div class="source-badges">
            ${sourcesHtml || '<div class="kibo-empty-note">Thám hiểm thế giới Promilia và Tinh Kết cùng Kibo.</div>'}
          </div>
        </section>

      </div>
    </div>`;
  }

  function bindInteractions(kibo) {
    // 1. Skill Lv.1 - Lv.5 switcher
    const skills = kibo.skills || [];
    document.querySelectorAll('.kibo-skill-lv-bar').forEach(bar => {
      const sIdx = parseInt(bar.dataset.skillIdx, 10);
      const descEl = document.getElementById(`kibo-skill-desc-${sIdx}`);
      const sk = skills[sIdx];
      if (!sk || !descEl) return;

      bar.querySelectorAll('.kibo-lv-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const lv = parseInt(btn.dataset.lv, 10);
          bar.querySelectorAll('.kibo-lv-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          descEl.textContent = (sk.levels && sk.levels[lv - 1]) || '';
        });
      });
    });

    // 2. Yuanmai Stage I - VI switcher
    const ymData = window.KIBO_YUANMAI || null;
    const petYm = ymData && kibo.game_id ? ymData.pets[String(kibo.game_id)] : null;
    const ymStages = (petYm && ymData.templates[String(petYm.template)]) || null;
    const ymTabs = document.getElementById('kibo-ym-tabs');
    const ymContent = document.getElementById('kibo-ym-content');
    if (ymTabs && ymContent && ymStages) {
      ymTabs.querySelectorAll('.quality-tab').forEach(tab => {
        tab.addEventListener('click', () => {
          const stIdx = parseInt(tab.dataset.stageIdx, 10);
          ymTabs.querySelectorAll('.quality-tab').forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          if (ymStages[stIdx]) {
            ymContent.innerHTML = renderYuanmaiStage(ymStages[stIdx], ymData, petYm);
          }
        });
      });
    }
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

  function initKiboDetail() {
    const rootEl = document.getElementById('kibo-detail-root');
    if (!rootEl) return;

    const depth = (document.body && document.body.dataset.depth !== undefined)
      ? parseInt(document.body.dataset.depth, 10)
      : 2;

    const kiboData = window.__ITEM_DATA__;
    if (!kiboData) {
      rootEl.innerHTML = '<div class="container empty-state" style="padding:60px 0; text-align:center;">Dữ liệu Kibo không tồn tại.</div>';
      return;
    }

    rootEl.innerHTML = renderKiboDetail(kiboData, depth);
    bindInteractions(kiboData);
    initGaugeScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initKiboDetail);
  } else {
    initKiboDetail();
  }

  window.KiboTemplate = {
    renderKiboDetail,
    initKiboDetail
  };
})();
