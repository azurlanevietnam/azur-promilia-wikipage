# PowerShell Page Generator for Azur Promilia Wiki
# Generates all pages cleanly into the dedicated pages/ directory

$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "Creating target directories..."
$pagesDir = "pages"
$lingDir  = Join-Path $pagesDir "lingzi"
$equipDir = Join-Path $pagesDir "equipments"
$matDir   = Join-Path $pagesDir "materials"

if (-not (Test-Path $pagesDir)) { New-Item -ItemType Directory -Path $pagesDir -Force | Out-Null }
if (-not (Test-Path $lingDir))  { New-Item -ItemType Directory -Path $lingDir -Force | Out-Null }
if (-not (Test-Path $equipDir)) { New-Item -ItemType Directory -Path $equipDir -Force | Out-Null }
if (-not (Test-Path $matDir))   { New-Item -ItemType Directory -Path $matDir -Force | Out-Null }

# Load data
Write-Host "Loading equipment and material datasets..."
$eqData = Get-Content "datas/equipments/equipments.json" -Raw -Encoding UTF8 | ConvertFrom-Json
$matDataObj = Get-Content "datas/materials/materials.json" -Raw -Encoding UTF8 | ConvertFrom-Json

# Helper: Clean URL script
$cleanUrlScript = @"
<script>
  if (window.location.protocol !== 'file:') {
    const clean = window.location.pathname.replace(/\.html$/, '').replace(/\/index$/, '');
    if (clean !== window.location.pathname) {
      window.history.replaceState(null, '', clean + window.location.search + window.location.hash);
    }
  }
</script>
"@

# Helper: Render Stars for cards
function Get-CardStarsHtml($count, $rel) {
    if (-not $count -or $count -le 0) { return "" }
    $stars = ""
    for ($i = 0; $i -lt $count; $i++) {
        $stars += "<img src=`"${rel}assets/star.png`" class=`"bwiki-star-unit`" alt=`"★`">"
    }
    return "<div class=`"bwiki-card-stars`">$stars</div>"
}

# Helper: Clean weapon type
function Get-CleanWeaponType($rawType) {
    if (-not $rawType) { return "" }
    if ($rawType -match '\(([^)]+)\)') {
        return $matches[1]
    }
    return ($rawType -replace 'Vũ khí', '').Trim()
}

# Helper: Material category
function Get-MaterialCategory($id) {
    if ($id.StartsWith("linhtuy")) { return @{ cat = "essence"; label = "Linh Túy" } }
    if ($id.StartsWith("vihatnguyen")) { return @{ cat = "particle"; label = "Vi Hạt Nguyên Tố" } }
    if ($id -eq "uni") { return @{ cat = "currency"; label = "Tiền Tệ" } }
    return @{ cat = "monster"; label = "Sản Vật & Quái Vật" }
}

# Helper: Material rarity
function Get-MaterialRarity($id) {
    if ($matDataObj.$id -and $matDataObj.$id.rarity) { return [int]$matDataObj.$id.rarity }
    if ($id -eq "linhtuyhuyensac") { return 5 }
    if ($id -eq "linhtuyanhsang") { return 4 }
    if ($id -eq "linhtuycuontrao") { return 3 }
    if ($id -eq "linhtuyngungtu") { return 2 }
    if ($id -eq "linhtuyphothong") { return 1 }
    if (@("dungdichtinhchat", "banhxematvan", "vayuquang") -contains $id) { return 4 }
    if (@("tinhhachngunghinh", "moysacnhon", "catbanthan", "laphongmach", "uni", "mangmonglanquang", "modongminmang") -contains $id) { return 3 }
    return 2
}

# -------------------------------------------------------------
# 1. GENERATE pages/homepage.html
# -------------------------------------------------------------
Write-Host "Generating pages/homepage.html..."
$homepageHtml = @"
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Azur Promilia Wiki - Trang Chủ</title>
  <link rel="stylesheet" href="../style.css">
  <script src="../templates/layout.js" defer></script>
</head>
<body data-active-tab="home" data-depth="1">
  
  <div class="cosmic-stars"></div>

  <!-- Top Navigation Bar: Injected from master template templates/layout.js -->
  <header id="site-navbar" class="navbar"></header>

  <main class="container">
    <section class="hero-banner">
      <h2 class="hero-title">Bách Khoa Toàn Thư Azur Promilia</h2>
    </section>

    <!-- Community Strip -->
    <div class="community-strip">
      <div class="community-text">
        <h3>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#0369a1"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          Gia Nhập Cộng Đồng Khai Phá Azur Promilia Việt Nam
        </h3>
      </div>
      <div class="community-actions">
        <a href="https://www.facebook.com/azurlanevietnam/" target="_blank" rel="noopener noreferrer" class="hero-community-btn fb">
          Theo Dõi Fanpage
        </a>
        <a href="https://www.facebook.com/groups/678799927597047/" target="_blank" rel="noopener noreferrer" class="hero-community-btn group">
          Tham Gia Group
        </a>
      </div>
    </div>

    <!-- Feature Portals: Seamless & Zero Badges -->
    <div class="portal-grid">
      <!-- Portal 1: Linh Tử -->
      <a href="lingzi.html" class="portal-card">
        <div>
          <h2>Danh Sách Linh Tử</h2>
        </div>
        <div class="portal-action">
          Khám Phá Linh Tử →
        </div>
      </a>

      <!-- Portal 2: Equipments -->
      <a href="equipments.html" class="portal-card">
        <div>
          <h2>Danh Sách Trang Bị</h2>
        </div>
        <div class="portal-action">
          Khám Phá Trang Bị →
        </div>
      </a>

      <!-- Portal 3: Materials -->
      <a href="materials.html" class="portal-card">
        <div>
          <h2>Danh Sách Nguyên Liệu</h2>
        </div>
        <div class="portal-action">
          Khám Phá Nguyên Liệu →
        </div>
      </a>
    </div>
  </main>

  <!-- Footer: Injected from master template templates/layout.js -->
  <footer id="site-footer" class="footer"></footer>
  
  $cleanUrlScript
</body>
</html>
"@
[System.IO.File]::WriteAllText((Join-Path $pagesDir "homepage.html"), $homepageHtml, [System.Text.Encoding]::UTF8)

# -------------------------------------------------------------
# 2. GENERATE pages/equipments.html
# -------------------------------------------------------------
Write-Host "Generating pages/equipments.html (143 equipment items)..."

# Priority 1: Rarity Descending (5 -> 1); Priority 2: Category; Priority 3: Name
$catOrder = @{ "vu_khi" = 1; "ao_tren" = 2; "quan_duoi" = 3; "khuyen_tai" = 4; "nhan" = 5 }
$sortedEqData = $eqData | Sort-Object -Property `
    @{ Expression = { -([int]$_.base_rarity + 1) } }, `
    @{ Expression = { $c = if ($_.category) { $_.category } else { "vu_khi" }; if ($catOrder.ContainsKey($c)) { $catOrder[$c] } else { 99 } } }, `
    @{ Expression = { $_.name } }

$eqCardsHtml = ""
foreach ($w in $sortedEqData) {
    $rNum = [int]$w.base_rarity + 1
    $starCount = if ($w.star_count) { [int]$w.star_count } elseif ($w.max_star_count) { [int]$w.max_star_count } else { 5 }
    $cleanType = Get-CleanWeaponType $w.item_type
    $suitVal = if (-not $w.suit -or $w.suit -eq "Không có bộ trang bị") { "none" } else { $w.suit_id }
    if (-not $suitVal) { $suitVal = "none" }
    
    $origName = if ($w.original_name) { $w.original_name } else { "" }
    $searchTokens = "$($w.name) $origName $cleanType $($w.item_type)".ToLower()
    $starsHtml = Get-CardStarsHtml $starCount "../"
    $cat = if ($w.category) { $w.category } else { "vu_khi" }

    $eqCardsHtml += @"
      <a href="equipments/$($w.id).html" class="bwiki-item-card r${rNum}" data-category="$cat" data-rarity="$rNum" data-type="$cleanType" data-suit="$suitVal" data-name="$searchTokens">
        <div class="bwiki-item-visual">
          <img src="../assets/equipment/$($w.id).png" class="bwiki-item-img" alt="$($w.name)" loading="lazy">
        </div>
        $starsHtml
        <div class="bwiki-item-name-box">
          <span class="bwiki-item-name-text">$($w.name)</span>
        </div>
      </a>
"@
}

# Sets Table rows
$setTableRows = @"
              <tr>
                <td><strong>Trường Không Hiệp Tấu</strong></td>
                <td>Cường độ Siêu Hạn tăng 110 điểm.</td>
                <td>Mỗi khi tiêu hao ấn ký, sát thương Siêu Hạn của người trang bị tăng 7%, duy trì 15 giây, tối đa cộng dồn 3 tầng.</td>
              </tr>
              <tr>
                <td><strong>Tinh Nguyệt Tề Âm</strong></td>
                <td>Tỷ lệ Hội Tâm Siêu Hạn tăng 8%.</td>
                <td>Khi người trang bị vào sân, Cường độ Siêu Hạn bản thân tăng 175 điểm trong 15 giây; khi gây sát thương Siêu Hạn, hiệu quả xuyên phòng ngự của bản thân tăng 8% trong 15 giây, không thể cộng dồn.</td>
              </tr>
              <tr>
                <td><strong>Tàng Phong Phá Thế</strong></td>
                <td>Tỷ lệ bạo kích tăng 8%.</td>
                <td>Mỗi khi người trang bị gây sát thương bạo kích, sát thương bạo kích của bản thân tăng 3.5%, duy trì 15 giây, tối đa cộng dồn 10 tầng.</td>
              </tr>
              <tr>
                <td><strong>Ngang Dương Tuần Lễ</strong></td>
                <td>Tấn công tăng 10%.</td>
                <td>Khi người trang bị vào sân, tấn công bản thân tăng 12% trong 15 giây; khi đánh trúng kẻ địch bị phá vỡ tư thế, tấn công tăng thêm 8% trong 15 giây.</td>
              </tr>
              <tr>
                <td><strong>Hành Lữ Ma Phong</strong></td>
                <td>Tấn công tăng 10%.</td>
                <td>Sau khi người trang bị thi triển Kỹ năng Tinh Minh, toàn đội tăng 14% sát thương toàn thuộc tính trong 24 giây. Hiệu ứng giữa các trang bị cùng tên không cộng dồn.</td>
              </tr>
              <tr>
                <td><strong>Hãm Trận Dũng Chí</strong></td>
                <td>Cường độ Siêu Hạn tăng 110 điểm.</td>
                <td>Sau khi người trang bị thi triển Kỹ năng Tinh Quyết, toàn đội tăng 18% sát thương Siêu Hạn trong 24 giây. Hiệu ứng giữa các trang bị cùng tên không cộng dồn.</td>
              </tr>
              <tr>
                <td><strong>Tồi Phong</strong></td>
                <td>Hiệu suất phá vỡ tư thế tăng 15%.</td>
                <td>Mọi đòn tấn công của người trang bị mỗi khi trúng đích, chỉ số phá định lực của bản thân tăng 5 điểm trong 5 giây, tối đa cộng dồn 10 tầng.</td>
              </tr>
              <tr>
                <td><strong>Khích Gian Nhuệ Ảnh</strong></td>
                <td>Hiệu suất phá vỡ tư thế tăng 15%.</td>
                <td>Khi Kỹ năng Tinh Minh và trọng kích của người trang bị trúng đích, hiệu suất phá vỡ tư thế lên kẻ địch tăng 30% trong 24 giây. Hiệu ứng giữa các trang bị cùng tên không cộng dồn.</td>
              </tr>
              <tr>
                <td><strong>Dũ Thương Đích Từ Bi</strong></td>
                <td>Hiệu quả trị liệu gây ra tăng 24.0%.</td>
                <td>Khi người trang bị thực hiện trị liệu, nhân vật nhận trị liệu được tăng 12% tấn công trong 24 giây. Hiệu ứng giữa các trang bị cùng tên không cộng dồn.</td>
              </tr>
              <tr>
                <td><strong>Phục Tấu Chi Chương</strong></td>
                <td>Tốc độ hồi tích năng Tinh Quyết tăng 5%.</td>
                <td>Sau khi người trang bị thi triển Kỹ năng Tinh Minh, tốc độ hồi tích năng Tinh Quyết toàn đội tăng 20% trong 12 giây. Hiệu ứng giữa các trang bị cùng tên không cộng dồn.</td>
              </tr>
"@

$equipmentsCatalogHtml = @"
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kho Trang Bị - Azur Promilia Wiki</title>
  <link rel="stylesheet" href="../style.css">
  <script src="../templates/layout.js" defer></script>
</head>
<body data-active-tab="equip" data-depth="1">
  
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
          <th>Phân loại</th>
          <td>
            <div class="bwiki-filter-options" id="category-filters">
              <button class="filter-pill active" data-category="all">Tất cả</button>
              <button class="filter-pill" data-category="vu_khi">Vũ khí</button>
              <button class="filter-pill" data-category="ao_tren">Áo trên</button>
              <button class="filter-pill" data-category="quan_duoi">Quần dưới</button>
              <button class="filter-pill" data-category="khuyen_tai">Khuyên tai</button>
              <button class="filter-pill" data-category="nhan">Nhẫn</button>
            </div>
          </td>
        </tr>
        <tr>
          <th>Độ hiếm</th>
          <td>
            <div class="bwiki-filter-options" id="rarity-filters">
              <button class="filter-pill active" data-rarity="all">Tất cả</button>
              <button class="filter-pill" data-rarity="5">Vàng</button>
              <button class="filter-pill" data-rarity="4">Tím</button>
              <button class="filter-pill" data-rarity="3">Lam</button>
              <button class="filter-pill" data-rarity="2">Lục</button>
              <button class="filter-pill" data-rarity="1">Trắng</button>
            </div>
          </td>
        </tr>
        <tr>
          <th>Bộ trang bị</th>
          <td>
            <div class="bwiki-filter-options" id="suit-filters">
              <button class="filter-pill active" data-suit="all">Tất cả</button>
              <button class="filter-pill" data-suit="none">Không có bộ trang bị</button>
              <button class="filter-pill" data-suit="7">Trường Không Hiệp Tấu</button>
              <button class="filter-pill" data-suit="8">Tinh Nguyệt Tề Âm</button>
              <button class="filter-pill" data-suit="9">Tàng Phong Phá Thế</button>
              <button class="filter-pill" data-suit="10">Ngang Dương Tuần Lễ</button>
              <button class="filter-pill" data-suit="11">Hành Lữ Ma Phong</button>
              <button class="filter-pill" data-suit="12">Hãm Trận Dũng Chí</button>
              <button class="filter-pill" data-suit="13">Tồi Phong</button>
              <button class="filter-pill" data-suit="14">Khích Gian Nhuệ Ảnh</button>
              <button class="filter-pill" data-suit="15">Dũ Thương Đích Từ Bi</button>
              <button class="filter-pill" data-suit="16">Phục Tấu Chi Chương</button>
            </div>
          </td>
        </tr>
        <tr id="weapon-type-row">
          <th>Loại vũ khí</th>
          <td>
            <div class="bwiki-filter-options" id="type-filters">
              <button class="filter-pill active" data-type="all">Tất cả</button>
              <button class="filter-pill" data-type="Song đao">Song đao</button>
              <button class="filter-pill" data-type="Sách phép">Sách phép</button>
              <button class="filter-pill" data-type="Đại kiếm">Đại kiếm</button>
              <button class="filter-pill" data-type="Đại thái đao">Đại thái đao</button>
              <button class="filter-pill" data-type="Kiếm dài">Kiếm dài</button>
              <button class="filter-pill" data-type="Gậy phép">Gậy phép</button>
              <button class="filter-pill" data-type="Đại đao">Đại đao</button>
              <button class="filter-pill" data-type="Dao găm">Dao găm</button>
              <button class="filter-pill" data-type="Búa chiến">Búa chiến</button>
              <button class="filter-pill" data-type="Pháp bảo">Pháp bảo</button>
              <button class="filter-pill" data-type="Hoành đao">Hoành đao</button>
              <button class="filter-pill" data-type="Trường kiếm">Trường kiếm</button>
              <button class="filter-pill" data-type="Đoản đao">Đoản đao</button>
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
                <th style="width: 200px;">Bộ Trang Bị</th>
                <th style="width: 260px;">Kỹ Năng 2 Món</th>
                <th>Kỹ Năng 4 Món</th>
              </tr>
            </thead>
            <tbody>
$setTableRows
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- BWIKI Framed Items Grid -->
    <div id="weapons-grid" class="bwiki-items-grid">
$eqCardsHtml
    </div>

    <div id="weapons-empty" class="empty-state" style="display: none;">
      <p>Không tìm thấy trang bị phù hợp với điều kiện lọc.</p>
    </div>
  </main>

  <!-- Footer: Injected from master template templates/layout.js -->
  <footer id="site-footer" class="footer"></footer>
  $cleanUrlScript

  <script>
    (function() {
      const searchInput = document.getElementById('equipment-search');
      const cards = Array.from(document.querySelectorAll('.bwiki-item-card'));
      const emptyState = document.getElementById('weapons-empty');
      const resetBtn = document.getElementById('btn-reset-filters');
      const categoryBtns = document.querySelectorAll('#category-filters .filter-pill');
      const rarityBtns = document.querySelectorAll('#rarity-filters .filter-pill');
      const typeBtns = document.querySelectorAll('#type-filters .filter-pill');
      const suitBtns = document.querySelectorAll('#suit-filters .filter-pill');
      const weaponTypeRow = document.getElementById('weapon-type-row');

      let currentCategory = 'all';
      let currentRarity = 'all';
      let currentType = 'all';
      let currentSuit = 'all';
      let currentSearch = '';

      function applyFilters() {
        let visibleCount = 0;
        cards.forEach(card => {
          const cardCat = card.dataset.category || 'vu_khi';
          const cardRarity = card.dataset.rarity;
          const cardType = card.dataset.type;
          const cardSuit = card.dataset.suit;
          const cardName = card.dataset.name;

          const matchCat = currentCategory === 'all' || cardCat === currentCategory;
          const matchRarity = currentRarity === 'all' || cardRarity === currentRarity;
          const matchType = currentType === 'all' || cardType === currentType;
          const matchSuit = currentSuit === 'all' || cardSuit === currentSuit;
          const matchSearch = !currentSearch || cardName.includes(currentSearch);

          if (matchCat && matchRarity && matchType && matchSuit && matchSearch) {
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

      categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          categoryBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          currentCategory = btn.dataset.category;
          if (weaponTypeRow) {
            weaponTypeRow.style.display = (currentCategory === 'all' || currentCategory === 'vu_khi') ? '' : 'none';
          }
          if (currentCategory !== 'all' && currentCategory !== 'vu_khi') {
            currentType = 'all';
            typeBtns.forEach(b => b.classList.toggle('active', b.dataset.type === 'all'));
          }
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
          currentCategory = 'all';
          currentRarity = 'all';
          currentType = 'all';
          currentSuit = 'all';
          currentSearch = '';
          if (searchInput) searchInput.value = '';
          categoryBtns.forEach(b => b.classList.toggle('active', b.dataset.category === 'all'));
          rarityBtns.forEach(b => b.classList.toggle('active', b.dataset.rarity === 'all'));
          typeBtns.forEach(b => b.classList.toggle('active', b.dataset.type === 'all'));
          suitBtns.forEach(b => b.classList.toggle('active', b.dataset.suit === 'all'));
          if (weaponTypeRow) weaponTypeRow.style.display = '';
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
</html>
"@
[System.IO.File]::WriteAllText((Join-Path $pagesDir "equipments.html"), $equipmentsCatalogHtml, [System.Text.Encoding]::UTF8)

# -------------------------------------------------------------
# 3. GENERATE pages/materials.html
# -------------------------------------------------------------
Write-Host "Generating pages/materials.html (33 material items)..."

$matList = @()
foreach ($p in $matDataObj.PSObject.Properties) {
    $m = $p.Value
    $mId = $p.Name
    $rNum = Get-MaterialRarity $mId
    $cat = Get-MaterialCategory $mId
    $matList += [PSCustomObject]@{
        id = $mId
        data = $m
        rarity = $rNum
        cat = $cat
        name = $m.name
    }
}

# Priority 1: Rarity Descending (5 -> 1); Priority 2: Category; Priority 3: Name
$catMatOrder = @{ "essence" = 1; "monster" = 2; "particle" = 3; "currency" = 4 }
$sortedMatList = $matList | Sort-Object -Property `
    @{ Expression = { -[int]$_.rarity } }, `
    @{ Expression = { if ($catMatOrder.ContainsKey($_.cat.cat)) { $catMatOrder[$_.cat.cat] } else { 99 } } }, `
    @{ Expression = { $_.name } }

$matCardsHtml = ""
foreach ($item in $sortedMatList) {
    $m = $item.data
    $mId = $item.id
    $rNum = $item.rarity
    $cat = $item.cat
    $origName = if ($m.original_name) { $m.original_name } else { "" }
    $searchTokens = "$($m.name) $origName $($cat.label)".ToLower()

    $matCardsHtml += @"
      <a href="materials/${mId}.html" class="bwiki-item-card r${rNum}" data-category="$($cat.cat)" data-rarity="$rNum" data-name="$searchTokens">
        <div class="bwiki-item-visual">
          <img src="../assets/materials/${mId}.png" class="bwiki-item-img" alt="$($m.name)" loading="lazy">
        </div>
        <div class="bwiki-item-name-box">
          <span class="bwiki-item-name-text">$($m.name)</span>
        </div>
      </a>
"@
}

$materialsCatalogHtml = @"
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kho Nguyên Liệu - Azur Promilia Wiki</title>
  <link rel="stylesheet" href="../style.css">
  <script src="../templates/layout.js" defer></script>
</head>
<body data-active-tab="mat" data-depth="1">
  
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
              <button class="filter-pill" data-rarity="5">Vàng</button>
              <button class="filter-pill" data-rarity="4">Tím</button>
              <button class="filter-pill" data-rarity="3">Lam</button>
              <button class="filter-pill" data-rarity="2">Lục</button>
              <button class="filter-pill" data-rarity="1">Trắng</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- BWIKI Framed Items Grid -->
    <div id="materials-grid" class="bwiki-items-grid">
$matCardsHtml
    </div>

    <div id="materials-empty" class="empty-state" style="display: none;">
      <p>Không tìm thấy nguyên liệu phù hợp với điều kiện lọc.</p>
    </div>
  </main>

  <!-- Footer: Injected from master template templates/layout.js -->
  <footer id="site-footer" class="footer"></footer>
  $cleanUrlScript

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
</html>
"@
[System.IO.File]::WriteAllText((Join-Path $pagesDir "materials.html"), $materialsCatalogHtml, [System.Text.Encoding]::UTF8)

# -------------------------------------------------------------
# 4. GENERATE 143 EQUIPMENT DETAIL PAGES (pages/equipments/{id}.html)
# -------------------------------------------------------------
Write-Host "Generating 143 individual equipment detail pages in pages/equipments/..."
foreach ($w in $eqData) {
    $itemId = $w.id
    $itemName = $w.name
    $cat = if ($w.category) { $w.category } else { "vu_khi" }
    
    # Pre-embed item JSON for zero-latency instant render & file:// support
    $itemJson = $w | ConvertTo-Json -Depth 10 -Compress
    $escapedJson = $itemJson -replace '</script>', '<\/script>'

    $detailHtml = @"
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>$itemName - Azur Promilia Wiki</title>
  <link rel="stylesheet" href="../../style.css">
  <script>window.__ITEM_DATA__ = $escapedJson;</script>
  <script src="../../templates/layout.js" defer></script>
  <script src="../../templates/equipment-template.js" defer></script>
</head>
<body data-page="equipment-detail" data-item-id="$itemId" data-category="$cat" data-depth="2" data-active-tab="equip">
  
  <div class="cosmic-stars"></div>

  <!-- Top Navigation Bar: Injected from master template templates/layout.js -->
  <header id="site-navbar" class="navbar"></header>

  <!-- Main Content: Injected from master template templates/equipment-template.js -->
  <main id="equipment-detail-root" class="container detail-container"></main>

  <!-- Footer: Injected from master template templates/layout.js -->
  <footer id="site-footer" class="footer"></footer>

  $cleanUrlScript
</body>
</html>
"@
    [System.IO.File]::WriteAllText((Join-Path $equipDir "$itemId.html"), $detailHtml, [System.Text.Encoding]::UTF8)
}

# -------------------------------------------------------------
# 5. GENERATE 33 MATERIAL DETAIL PAGES (pages/materials/{id}.html)
# -------------------------------------------------------------
Write-Host "Generating 33 individual material detail pages in pages/materials/..."
foreach ($p in $matDataObj.PSObject.Properties) {
    $m = $p.Value
    $mId = $p.Name
    $mName = $m.name
    
    $mWithId = [PSCustomObject]@{
        id = $mId
        name = $m.name
        original_name = $m.original_name
        description = $m.description
        rarity = (Get-MaterialRarity $mId)
    }
    $matJson = $mWithId | ConvertTo-Json -Depth 5 -Compress
    $escapedMatJson = $matJson -replace '</script>', '<\/script>'

    $matDetailHtml = @"
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>$mName - Azur Promilia Wiki</title>
  <link rel="stylesheet" href="../../style.css">
  <script>window.__ITEM_DATA__ = $escapedMatJson;</script>
  <script src="../../templates/layout.js" defer></script>
  <script src="../../templates/material-template.js" defer></script>
</head>
<body data-page="material-detail" data-item-id="$mId" data-depth="2" data-active-tab="mat">
  
  <div class="cosmic-stars"></div>

  <!-- Top Navigation Bar: Injected from master template templates/layout.js -->
  <header id="site-navbar" class="navbar"></header>

  <!-- Main Content: Injected from master template templates/material-template.js -->
  <main id="material-detail-root" class="container detail-container"></main>

  <!-- Footer: Injected from master template templates/layout.js -->
  <footer id="site-footer" class="footer"></footer>

  $cleanUrlScript
</body>
</html>
"@
    [System.IO.File]::WriteAllText((Join-Path $matDir "$mId.html"), $matDetailHtml, [System.Text.Encoding]::UTF8)
}

# -------------------------------------------------------------
# 6. GENERATE ROOT index.html (Clean Redirect to pages/homepage.html)
# -------------------------------------------------------------
Write-Host "Generating root index.html redirector..."
$rootIndexHtml = @"
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0; url=pages/homepage.html">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Azur Promilia Wiki</title>
  <script>
    if (window.location.protocol === 'file:') {
      window.location.replace("pages/homepage.html");
    } else {
      window.location.replace("/homepage");
    }
  </script>
</head>
<body style="font-family:system-ui, sans-serif; display:flex; align-items:center; justify-content:center; height:100vh; margin:0; background:#f8fafc; color:#0f172a;">
  <div style="text-align:center;">
    <p>Đang chuyển hướng đến <a id="home-link" href="pages/homepage.html" style="color:#0369a1; font-weight:700;">Trang Chủ Azur Promilia</a>...</p>
  </div>
  <script>
    if (window.location.protocol !== 'file:') {
      const link = document.getElementById('home-link');
      if (link) link.setAttribute('href', '/homepage');
    }
  </script>
</body>
</html>
"@
[System.IO.File]::WriteAllText("index.html", $rootIndexHtml, [System.Text.Encoding]::UTF8)

Write-Host "All pages successfully generated inside pages/ directory!"
