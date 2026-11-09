const fs = require('fs');
const path = require('path');

// Mock browser window for bundle.js
global.window = {};
require('./datas/bundle.js');

const weaponsObj = window.AZUR_DATA.weapons;
const materialsObj = window.AZUR_DATA.materials;

const weapons = Object.values(weaponsObj);
const materials = materialsObj;

// Sets database based on Bilibili BWIKI
const SETS_DATA = [
  {
    name: "Kiếm Sĩ Quý Tộc",
    name_cn: "贵族剑士",
    piece2: "Tấn công tăng 15%",
    piece4: "Khi tấn công kẻ địch, tăng 12% sát thương thuộc tính tương ứng trong 10 giây, tối đa cộng dồn 3 tầng."
  },
  {
    name: "Dạ Khúc Tinh Linh",
    name_cn: "精灵夜曲",
    piece2: "Tỉ lệ bạo kích tăng 10%",
    piece4: "Khi kích hoạt bạo kích, sát thương bạo kích tăng thêm 30% trong 8 giây."
  },
  {
    name: "Lời Thề Bão Táp",
    name_cn: "风暴誓言",
    piece2: "Sát thương nguyên tố Phong tăng 15%",
    piece4: "Khi đánh trúng mục tiêu bị hiệu ứng Phong, giải phóng một luồng xoáy gió gây 240% sát thương diện rộng."
  },
  {
    name: "Vết Chân Tinh Thể",
    name_cn: "晶石足迹",
    piece2: "Phòng ngự tăng 20%",
    piece4: "Khi nhận sát thương, tạo một lớp lá chắn bằng 18% lượng HP tối đa, duy trì 10 giây (CD: 25 giây)."
  },
  {
    name: "Giấc Mộng Tiên Linh",
    name_cn: "仙灵之梦",
    piece2: "Hiệu quả hồi phục tăng 20%",
    piece4: "Khi hồi phục cho đồng đội, toàn đội nhận được trạng thái tăng 10% tấn công trong 12 giây."
  },
  {
    name: "Khiên Chắn Cổ Xưa",
    name_cn: "远古壁垒",
    piece2: "Lượng HP tối đa tăng 15%",
    piece4: "Khi HP dưới 50%, sát thương phải chịu giảm 25% và hồi phục 2% HP mỗi giây trong 6 giây."
  },
  {
    name: "Ánh Sáng Rực Rỡ",
    name_cn: "耀眼之光",
    piece2: "Sát thương nguyên tố Quang tăng 15%",
    piece4: "Đòn đánh mang thuộc tính Quang làm mù mục tiêu trong 3 giây và tăng 20% sát thương lên mục tiêu bị mù."
  },
  {
    name: "Cội Nguồn Sinh Mệnh",
    name_cn: "生命之源",
    piece2: "Tốc độ hồi năng lượng tăng 20%",
    piece4: "Khi thi triển Tuyệt Kỹ, hoàn trả 15 điểm năng lượng và giảm 15% thời gian hồi chiêu của kỹ năng nguyên tố."
  },
  {
    name: "Dòng Chảy Vĩnh Cửu",
    name_cn: "永恒之流",
    piece2: "Sát thương nguyên tố Thủy tăng 15%",
    piece4: "Các đòn tấn công hệ Thủy gây hiệu ứng Ẩm Ướt, làm chậm 30% tốc độ di chuyển và nhận thêm 15% sát thương Băng/Lôi."
  },
  {
    name: "Hơi Thở Hoang Dã",
    name_cn: "荒野之息",
    piece2: "Sát thương đòn đánh thường và trọng kích tăng 18%",
    piece4: "Sau khi tung trọng kích, tốc độ đánh tăng 25% và tăng 20% xuyên giáp trong 6 giây."
  }
];

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

function getCleanWeaponType(rawType) {
  if (!rawType) return '';
  const match = rawType.match(/\(([^)]+)\)/);
  return match ? match[1] : rawType.replace('Vũ khí', '').trim();
}

function getWeaponRarityNumber(w) {
  return (w.base_rarity !== undefined ? w.base_rarity : 0) + 1;
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

function getStarsString(rarityNumber) {
  return '★'.repeat(rarityNumber);
}

// Build Reverse Material -> Weapons Mapping
const matToWeapons = {};
for (const mid in materials) {
  matToWeapons[mid] = [];
}
for (const wep of weapons) {
  if (wep.enhancement_materials) {
    for (const row of wep.enhancement_materials) {
      if (row.materials) {
        for (const req of row.materials) {
          const mid = req.material_id;
          if (matToWeapons[mid] && !matToWeapons[mid].some(x => x.id === wep.id)) {
            matToWeapons[mid].push(wep);
          }
        }
      }
    }
  }
}

// Ensure target directories exist
function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}
ensureDir('equipments');
ensureDir('materials');

const CLEAN_URL_SCRIPT = `
<script>
  if (window.location.protocol !== 'file:') {
    const clean = window.location.pathname.replace(/\\.html$/, '').replace(/\\/index$/, '');
    if (clean !== window.location.pathname) {
      window.history.replaceState(null, '', clean + window.location.search + window.location.hash);
    }
  }
</script>`;

function renderNavbar(depth, activeTab) {
  const rel = depth === 0 ? '' : depth === 1 ? '../' : '../../';
  return `
  <!-- Top Navigation Bar -->
  <header class="navbar">
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
    </div>
  </header>`;
}

function renderFooter() {
  return `
  <footer class="footer">
    <div class="container">
      <div class="footer-links">
        <a href="https://www.facebook.com/azurlanevietnam/" target="_blank" rel="noopener noreferrer">Facebook Fanpage</a>
        <a href="https://www.facebook.com/groups/678799927597047/" target="_blank" rel="noopener noreferrer">Facebook Group</a>
      </div>
      <p>Azur Promilia Wiki Companion • Bách khoa toàn thư trang bị & nguyên liệu tiếng Việt.</p>
    </div>
  </footer>`;
}

// -------------------------------------------------------------
// 1. GENERATE EQUIPMENTS CATALOG (equipments.html & equipments/index.html)
// -------------------------------------------------------------
function generateEquipmentsCatalog(depth) {
  const rel = depth === 0 ? '' : depth === 1 ? '../' : '../../';
  const detailPrefix = depth === 0 ? 'equipments/' : depth === 1 ? '' : '../';

  const typesList = [
    'Song đao', 'Sách phép', 'Đại kiếm', 'Đại thái đao',
    'Kiếm dài', 'Gậy phép', 'Đại đao', 'Dao găm',
    'Búa chiến', 'Pháp bảo', 'Hoành đao', 'Trường kiếm', 'Đoản đao'
  ];

  const cardsHtml = weapons.map(w => {
    const rNum = getWeaponRarityNumber(w);
    const starCount = getMaxStarsCount(w);
    const cleanType = getCleanWeaponType(w.item_type);
    const suitVal = (!w.suit || w.suit === 'Không có bộ trang bị') ? 'none' : w.suit;
    const searchTokens = `${w.name} ${w.original_name || ''} ${cleanType}`.toLowerCase();
    const itemHref = `${detailPrefix}${w.id}.html`;

    return `
      <a href="${itemHref}" class="bwiki-item-card r${rNum}" data-rarity="${w.base_rarity}" data-type="${cleanType}" data-suit="${suitVal}" data-name="${searchTokens}">
        <div class="bwiki-item-visual">
          <img src="${rel}assets/equipment/${w.id}.png" class="bwiki-item-img" alt="${w.name}" loading="lazy">
        </div>
        ${renderCardStarsHtml(starCount, rel)}
        <div class="bwiki-item-name-box">
          <span class="bwiki-item-name-text">${w.name}</span>
        </div>
      </a>`;
  }).join('');

  const setRowsHtml = SETS_DATA.map(s => `
    <tr>
      <td><strong>${s.name}</strong></td>
      <td>${s.piece2}</td>
      <td>${s.piece4}</td>
    </tr>
  `).join('');

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kho Trang Bị - Azur Promilia Wiki</title>
  <link rel="stylesheet" href="${rel}style.css">
  <script src="${rel}templates/layout.js" defer></script>
</head>
<body data-active-tab="equip" data-depth="${depth}">
  
  <div class="cosmic-stars"></div>

  <!-- Top Navigation Bar: Injected from master template templates/layout.js -->
  <header id="site-navbar" class="navbar"></header>

  <main class="container">
    <div class="page-header">
      <h1 class="page-title">Kho Trang Bị</h1>
    </div>

    <!-- Search Input: Zero Placeholder -->
    <div class="search-box">
      <span class="search-icon">🔍</span>
      <input type="text" id="equipment-search" class="search-input" aria-label="Tìm kiếm trang bị">
    </div>

    <!-- Filter Matrix Table (BWIKI Standard) -->
    <table class="bwiki-filter-table">
      <tbody>
        <tr>
          <th>Tất cả</th>
          <td>
            <button class="filter-pill active" id="btn-reset-filters">Xem tất cả</button>
          </td>
        </tr>
        <tr>
          <th>Độ hiếm</th>
          <td>
            <div class="bwiki-filter-options" id="rarity-filters">
              <button class="filter-pill active" data-rarity="all">Tất cả</button>
              <button class="filter-pill" data-rarity="4">5★</button>
              <button class="filter-pill" data-rarity="3">4★</button>
              <button class="filter-pill" data-rarity="2">3★</button>
              <button class="filter-pill" data-rarity="1">2★</button>
              <button class="filter-pill" data-rarity="0">1★</button>
            </div>
          </td>
        </tr>
        <tr>
          <th>Bộ trang bị</th>
          <td>
            <div class="bwiki-filter-options" id="suit-filters">
              <button class="filter-pill active" data-suit="all">Tất cả</button>
              <button class="filter-pill" data-suit="none">Không có bộ trang bị</button>
            </div>
          </td>
        </tr>
        <tr>
          <th>Loại vũ khí</th>
          <td>
            <div class="bwiki-filter-options" id="type-filters">
              <button class="filter-pill active" data-type="all">Tất cả</button>
              ${typesList.map(t => `<button class="filter-pill" data-type="${t}">${t}</button>`).join('\n              ')}
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Collapsible Set Skills Reference Table -->
    <div class="bwiki-collapse-wrap">
      <div class="bwiki-collapse-header" id="collapse-set-header" role="button" tabindex="0" aria-expanded="false">
        <span>Bảng Tra Cứu Kỹ Năng Bộ Trang Bị</span>
        <span class="collapse-icon" id="collapse-icon">▼</span>
      </div>
      <div class="bwiki-collapse-content" id="collapse-set-content" style="display: none;">
        <div style="overflow-x: auto;">
          <table class="set-skills-table">
            <thead>
              <tr>
                <th style="width: 180px;">Bộ Trang Bị</th>
                <th style="width: 220px;">Kỹ Năng 2 Món</th>
                <th>Kỹ Năng 4 Món</th>
              </tr>
            </thead>
            <tbody>
              ${setRowsHtml}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- BWIKI Framed Items Grid -->
    <div id="weapons-grid" class="bwiki-items-grid">
      ${cardsHtml}
    </div>

    <div id="weapons-empty" class="empty-state" style="display: none;">
      <p>Không tìm thấy trang bị phù hợp với điều kiện lọc.</p>
    </div>
  </main>

  <!-- Footer: Injected from master template templates/layout.js -->
  <footer id="site-footer" class="footer"></footer>
  ${CLEAN_URL_SCRIPT}

  <script>
    (function() {
      const searchInput = document.getElementById('equipment-search');
      const cards = Array.from(document.querySelectorAll('.bwiki-item-card'));
      const emptyState = document.getElementById('weapons-empty');
      const resetBtn = document.getElementById('btn-reset-filters');
      const rarityBtns = document.querySelectorAll('#rarity-filters .filter-pill');
      const typeBtns = document.querySelectorAll('#type-filters .filter-pill');
      const suitBtns = document.querySelectorAll('#suit-filters .filter-pill');

      let currentRarity = 'all';
      let currentType = 'all';
      let currentSuit = 'all';
      let currentSearch = '';

      function applyFilters() {
        let visibleCount = 0;
        cards.forEach(card => {
          const cardRarity = card.dataset.rarity;
          const cardType = card.dataset.type;
          const cardSuit = card.dataset.suit;
          const cardName = card.dataset.name;

          const matchRarity = currentRarity === 'all' || cardRarity === currentRarity;
          const matchType = currentType === 'all' || cardType === currentType;
          const matchSuit = currentSuit === 'all' || cardSuit === currentSuit;
          const matchSearch = !currentSearch || cardName.includes(currentSearch);

          if (matchRarity && matchType && matchSuit && matchSearch) {
            card.style.display = 'inline-flex';
            visibleCount++;
          } else {
            card.style.display = 'none';
          }
        });

        if (emptyState) {
          emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
        }
      }

      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          currentSearch = e.target.value.trim().toLowerCase();
          applyFilters();
        });
      }

      rarityBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          rarityBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          currentRarity = btn.dataset.rarity;
          applyFilters();
        });
      });

      typeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          typeBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          currentType = btn.dataset.type;
          applyFilters();
        });
      });

      suitBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          suitBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          currentSuit = btn.dataset.suit;
          applyFilters();
        });
      });

      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          currentRarity = 'all';
          currentType = 'all';
          currentSuit = 'all';
          currentSearch = '';
          if (searchInput) searchInput.value = '';
          rarityBtns.forEach(b => b.classList.toggle('active', b.dataset.rarity === 'all'));
          typeBtns.forEach(b => b.classList.toggle('active', b.dataset.type === 'all'));
          suitBtns.forEach(b => b.classList.toggle('active', b.dataset.suit === 'all'));
          applyFilters();
        });
      }

      // Collapsible Toggle
      const collapseHeader = document.getElementById('collapse-set-header');
      const collapseContent = document.getElementById('collapse-set-content');
      const collapseIcon = document.getElementById('collapse-icon');
      if (collapseHeader && collapseContent) {
        collapseHeader.addEventListener('click', () => {
          const isHidden = collapseContent.style.display === 'none';
          collapseContent.style.display = isHidden ? 'block' : 'none';
          collapseHeader.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
          if (collapseIcon) collapseIcon.textContent = isHidden ? '▲' : '▼';
        });
      }


    })();
  </script>
</body>
</html>`;
}

// -------------------------------------------------------------
// 2. GENERATE MATERIALS CATALOG (materials.html & materials/index.html)
// -------------------------------------------------------------
function generateMaterialsCatalog(depth) {
  const rel = depth === 0 ? '' : depth === 1 ? '../' : '../../';
  const detailPrefix = depth === 0 ? 'materials/' : depth === 1 ? '' : '../';

  const cardsHtml = Object.values(materials).map(m => {
    const rNum = getMaterialRarity(m.id);
    const cat = getMaterialCategory(m.id);
    const searchTokens = `${m.name} ${m.original_name || ''} ${cat.label}`.toLowerCase();
    const itemHref = `${detailPrefix}${m.id}.html`;

    return `
      <a href="${itemHref}" class="bwiki-item-card r${rNum}" data-category="${cat.cat}" data-rarity="${rNum}" data-name="${searchTokens}">
        <div class="bwiki-item-visual">
          <img src="${rel}assets/materials/${m.id}.png" class="bwiki-item-img" alt="${m.name}" loading="lazy">
        </div>
        ${renderCardStarsHtml(rNum, rel)}
        <div class="bwiki-item-name-box">
          <span class="bwiki-item-name-text">${m.name}</span>
        </div>
      </a>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kho Nguyên Liệu - Azur Promilia Wiki</title>
  <link rel="stylesheet" href="${rel}style.css">
  <script src="${rel}templates/layout.js" defer></script>
</head>
<body data-active-tab="mat" data-depth="${depth}">
  
  <div class="cosmic-stars"></div>

  <!-- Top Navigation Bar: Injected from master template templates/layout.js -->
  <header id="site-navbar" class="navbar"></header>

  <main class="container">
    <div class="page-header">
      <h1 class="page-title">Kho Nguyên Liệu</h1>
    </div>

    <!-- Search Input: Zero Placeholder -->
    <div class="search-box">
      <span class="search-icon">🔍</span>
      <input type="text" id="material-search" class="search-input" aria-label="Tìm kiếm nguyên liệu">
    </div>

    <!-- Filter Matrix Table (BWIKI Standard) -->
    <table class="bwiki-filter-table">
      <tbody>
        <tr>
          <th>Tất cả</th>
          <td>
            <button class="filter-pill active" id="btn-reset-filters">Xem tất cả</button>
          </td>
        </tr>
        <tr>
          <th>Phân nhóm</th>
          <td>
            <div class="bwiki-filter-options" id="category-filters">
              <button class="filter-pill active" data-category="all">Tất cả</button>
              <button class="filter-pill" data-category="essence">Linh Túy</button>
              <button class="filter-pill" data-category="particle">Vi Hạt Nguyên Tố</button>
              <button class="filter-pill" data-category="monster">Sản Vật & Quái Vật</button>
              <button class="filter-pill" data-category="currency">Tiền Tệ</button>
            </div>
          </td>
        </tr>
        <tr>
          <th>Độ hiếm</th>
          <td>
            <div class="bwiki-filter-options" id="rarity-filters">
              <button class="filter-pill active" data-rarity="all">Tất cả</button>
              <button class="filter-pill" data-rarity="5">5★</button>
              <button class="filter-pill" data-rarity="4">4★</button>
              <button class="filter-pill" data-rarity="3">3★</button>
              <button class="filter-pill" data-rarity="2">2★</button>
              <button class="filter-pill" data-rarity="1">1★</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- BWIKI Framed Items Grid -->
    <div id="materials-grid" class="bwiki-items-grid">
      ${cardsHtml}
    </div>

    <div id="materials-empty" class="empty-state" style="display: none;">
      <p>Không tìm thấy nguyên liệu phù hợp với điều kiện lọc.</p>
    </div>
  </main>

  <!-- Footer: Injected from master template templates/layout.js -->
  <footer id="site-footer" class="footer"></footer>
  ${CLEAN_URL_SCRIPT}

  <script>
    (function() {
      const searchInput = document.getElementById('material-search');
      const cards = Array.from(document.querySelectorAll('.bwiki-item-card'));
      const emptyState = document.getElementById('materials-empty');
      const resetBtn = document.getElementById('btn-reset-filters');
      const catBtns = document.querySelectorAll('#category-filters .filter-pill');
      const rarityBtns = document.querySelectorAll('#rarity-filters .filter-pill');

      let currentCategory = 'all';
      let currentRarity = 'all';
      let currentSearch = '';

      function applyFilters() {
        let visibleCount = 0;
        cards.forEach(card => {
          const cardCat = card.dataset.category;
          const cardRarity = card.dataset.rarity;
          const cardName = card.dataset.name;

          const matchCat = currentCategory === 'all' || cardCat === currentCategory;
          const matchRarity = currentRarity === 'all' || cardRarity === currentRarity;
          const matchSearch = !currentSearch || cardName.includes(currentSearch);

          if (matchCat && matchRarity && matchSearch) {
            card.style.display = 'inline-flex';
            visibleCount++;
          } else {
            card.style.display = 'none';
          }
        });

        if (emptyState) {
          emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
        }
      }

      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          currentSearch = e.target.value.trim().toLowerCase();
          applyFilters();
        });
      }

      catBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          catBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          currentCategory = btn.dataset.category;
          applyFilters();
        });
      });

      rarityBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          rarityBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          currentRarity = btn.dataset.rarity;
          applyFilters();
        });
      });

      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          currentCategory = 'all';
          currentRarity = 'all';
          currentSearch = '';
          if (searchInput) searchInput.value = '';
          catBtns.forEach(b => b.classList.toggle('active', b.dataset.category === 'all'));
          rarityBtns.forEach(b => b.classList.toggle('active', b.dataset.rarity === 'all'));
          applyFilters();
        });
      }


    })();
  </script>
</body>
</html>`;
}

// -------------------------------------------------------------
// 3. GENERATE WEAPON DETAIL PAGES (equipments/${id}.html & equipments/${id}/index.html)
// Master Template Architecture: Clean ~20-line semantic shells that load
// Navbar/Footer from templates/layout.js and Main UI from templates/equipment-template.js
// -------------------------------------------------------------
function generateWeaponDetailPage(w, depth) {
  const rel = depth === 1 ? '../' : '../../';
  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${w.name} - Azur Promilia Wiki</title>
  <link rel="stylesheet" href="${rel}style.css">
  <script src="${rel}templates/layout.js" defer></script>
  <script src="${rel}templates/equipment-template.js" defer></script>
</head>
<body data-page="equipment-detail" data-item-id="${w.id}" data-depth="${depth}" data-active-tab="equip">
  
  <div class="cosmic-stars"></div>

  <!-- Top Navigation Bar: Injected from master template templates/layout.js -->
  <header id="site-navbar" class="navbar"></header>

  <!-- Main Content: Injected from master template templates/equipment-template.js using datas/equipments/vu_khi/${w.id}.json -->
  <main id="equipment-detail-root" class="container detail-container"></main>

  <!-- Footer: Injected from master template templates/layout.js -->
  <footer id="site-footer" class="footer"></footer>

  ${CLEAN_URL_SCRIPT}
</body>
</html>`;
}

// -------------------------------------------------------------
// 4. GENERATE MATERIAL DETAIL PAGES (materials/${id}.html & materials/${id}/index.html)
// Master Template Architecture: Clean ~20-line semantic shells that load
// Navbar/Footer from templates/layout.js and Main UI from templates/material-template.js
// -------------------------------------------------------------
function generateMaterialDetailPage(m, depth) {
  const rel = depth === 1 ? '../' : '../../';
  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${m.name} - Azur Promilia Wiki</title>
  <link rel="stylesheet" href="${rel}style.css">
  <script src="${rel}templates/layout.js" defer></script>
  <script src="${rel}templates/material-template.js" defer></script>
</head>
<body data-page="material-detail" data-item-id="${m.id}" data-depth="${depth}" data-active-tab="mat">
  
  <div class="cosmic-stars"></div>

  <!-- Top Navigation Bar: Injected from master template templates/layout.js -->
  <header id="site-navbar" class="navbar"></header>

  <!-- Main Content: Injected from master template templates/material-template.js using datas/materials/materials.json -->
  <main id="material-detail-root" class="container detail-container"></main>

  <!-- Footer: Injected from master template templates/layout.js -->
  <footer id="site-footer" class="footer"></footer>

  ${CLEAN_URL_SCRIPT}
</body>
</html>`;
}

// -------------------------------------------------------------
// EXECUTE GENERATION
// -------------------------------------------------------------
console.log('Generating equipments.html and equipments/index.html...');
fs.writeFileSync('equipments.html', generateEquipmentsCatalog(0));
fs.writeFileSync(path.join('equipments', 'index.html'), generateEquipmentsCatalog(1));

console.log('Generating materials.html and materials/index.html...');
fs.writeFileSync('materials.html', generateMaterialsCatalog(0));
fs.writeFileSync(path.join('materials', 'index.html'), generateMaterialsCatalog(1));

console.log('Generating 25 weapon detail pages...');
for (const w of weapons) {
  // Flat html: equipments/${id}.html
  fs.writeFileSync(path.join('equipments', `${w.id}.html`), generateWeaponDetailPage(w, 1));
  // Directory index: equipments/${id}/index.html
  const itemDir = path.join('equipments', w.id);
  ensureDir(itemDir);
  fs.writeFileSync(path.join(itemDir, 'index.html'), generateWeaponDetailPage(w, 2));
}

console.log('Generating 33 material detail pages...');
for (const mid in materials) {
  const m = materials[mid];
  // Flat html: materials/${id}.html
  fs.writeFileSync(path.join('materials', `${m.id}.html`), generateMaterialDetailPage(m, 1));
  // Directory index: materials/${id}/index.html
  const itemDir = path.join('materials', m.id);
  ensureDir(itemDir);
  fs.writeFileSync(path.join(itemDir, 'index.html'), generateMaterialDetailPage(m, 2));
}

console.log('All pages generated successfully with dual hover & in-frame names!');
