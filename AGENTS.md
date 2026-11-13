# AGENTS.md - Quy Chuẩn Phát Triển, Kiến Trúc & Thiết Kế Giao Diện

Tài liệu này là quy chuẩn cốt lõi dành cho AI Agent (Antigravity) và các nhà phát triển khi xây dựng, chỉnh sửa và mở rộng dự án **Azur Promilia Wiki** hoặc các dự án giao diện frontend tương tự.

---

## 1. Phương Pháp Kết Hợp Bộ Ba Thiết Kế: UI/UX Pro Max, Taste Skill & Impeccable

Dự án tích hợp sức mạnh tổng hợp từ bộ ba công cụ thiết kế hàng đầu nhằm loại bỏ hoàn toàn các trang web mang tính "AI slop" và nâng tầm giao diện lên đẳng cấp chuyên nghiệp:
* **UI/UX Pro Max**: Đóng vai trò là **Kiến trúc sư & Thư viện Tri thức Thiết kế (Design Intelligence)**. Cung cấp dữ liệu về phong cách (80 styles), bảng màu chuyên ngành (192 product palettes), cặp font chữ (74 pairings), tech stacks và UX heuristics.
* **Taste Skill (design-taste-frontend)**: Đóng vai trò là **Đạo diễn Mỹ thuật & Thẩm mỹ Trình duyệt (Art Direction, Editorial Taste & Real Browser Consistency)**. Định hình giao diện đạt đẳng cấp `figma.com` và `x.ai`: bố cục một màn hình một phân mục (`one section per screen`), căn mép đối xứng (`equal edges`), hình ảnh thực tế chất lượng cao (stand-ins có bản quyền), micro-interactions tinh tế và bộ kiểm định layout thực tế trên headless Chrome/Edge.
* **Impeccable**: Đóng vai trò là **Thanh tra Chất lượng & Chuẩn Tiếp cận (Craft Floor & Quality Gatekeeper)**. Thiết lập sàn chất lượng tối thiểu (craft-floor), kiểm tra khả năng tiếp cận WCAG AA (độ tương phản ≥ 4.5:1), loại bỏ AI slop (dark-glow, gradient-text, side-tab) thông qua công cụ cơ học `impeccable detect`.

### Quy trình 5 bước phối hợp (Workflow):

```
┌────────────────────────────────────────────────────────┐
│  1. KHÁM PHÁ & THIẾT KẾ HỆ THỐNG (UI/UX Pro Max)      │
│     - Tra cứu bảng màu, phong cách, kiểu chữ bằng CLI  │
│     - python search.py "gaming wiki" --design-system   │
└────────────────────────────────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│  2. ĐỊNH HÌNH PHONG VỊ & BỐ CỤC (Taste Skill)          │
│     - Deal layout hero, token hệ thống & typography    │
│     - Áp dụng cấu trúc 1-section/screen, visual thật   │
│     - node scripts/start.mjs deal --page gaming        │
└────────────────────────────────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│  3. THIẾT LẬP RÀNG BUỘC CHẤT LƯỢNG (Impeccable)        │
│     - Đọc craft-floor.md trước khi viết mã UI          │
│     - Nghiêm cấm anti-patterns: dark glow, neon        │
│       gradients, side-tabs, độ tương phản yếu          │
└────────────────────────────────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│  4. TRIỂN KHAI MÃ NGUỒN (Code-First + Custom Rules)   │
│     - Viết mã HTML/CSS/JS độc lập, tường minh          │
│     - Tuân thủ tuyệt đối 3 Custom Rules cốt lõi       │
│       (Zero-Clutter, Border-Radius, Seamless BG)       │
└────────────────────────────────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│  5. KIỂM ĐỊNH TỰ ĐỘNG ĐA TẦNG (Dual Gatekeeper)        │
│     - Quét Impeccable: & impeccable.cmd detect .       │
│     - Kiểm tra Taste: node scripts/consistency.mjs     │
│       trên Chrome/Edge (1440, 1024, 768, 390px)        │
│     - Đảm bảo 0 FAIL trước khi hoàn tất bàn giao       │
└────────────────────────────────────────────────────────┘
```

---

## 2. Quy Chuẩn Tra Cứu & Khai Thác Codebase với Graphify (Bắt Buộc Trên Mỗi Truy Vấn)

Dự án áp dụng mô hình đồ thị tri thức mã nguồn (**Graphify Knowledge Graph**) để lập bản đồ cấu trúc, lời gọi hàm, dependencies và luồng dữ liệu cục bộ.

### Nguyên tắc hành động bắt buộc (Always-on Rules):
1. **Ưu tiên đồ thị hơn đọc file thô (Graph-First on Every Query)**:
   - Khi nhận bất kỳ câu hỏi hay yêu cầu nào liên quan đến cấu trúc mã nguồn, quan hệ giữa các component/file, hoặc luồng dữ liệu: Nếu `graphify-out/graph.json` tồn tại, **BẮT BUỘC** chạy lệnh `graphify query "<câu hỏi>"` trước khi thực hiện bất kỳ thao tác `grep` hay đọc file thô nào.
   - Kết quả từ Graphify là một đồ thị con (scoped subgraph) có ngữ nghĩa rõ ràng, giúp agent nắm bắt đúng trọng tâm mà không làm tràn ngữ cảnh (context window).
2. **Truy vấn đường đi quan hệ & giải thích khái niệm**:
   - Dùng `graphify path "<Module A>" "<Module B>"` để tìm đường đi ngắn nhất và mối quan hệ trực tiếp/gián tiếp giữa hai thành phần.
   - Dùng `graphify explain "<Khái niệm/Node>"` để đọc phân tích chuyên sâu về một hàm, class hoặc thực thể cụ thể.
3. **Điều hướng qua Wiki**:
   - Nếu thư mục `graphify-out/wiki/index.md` tồn tại, agent điều hướng và duyệt qua các bài viết wiki của từng cộng đồng (community) thay vì duyệt mò mẫm các file mã nguồn.
   - Chỉ đọc `graphify-out/GRAPH_REPORT.md` khi cần đánh giá tổng thể kiến trúc hoặc khi câu lệnh query chưa đủ ngữ cảnh.
4. **Tự động cập nhật đồ thị sau khi chỉnh sửa code (AST Update)**:
   - Sau khi tạo mới hoặc sửa đổi code trong phiên làm việc, chạy ngay lệnh `graphify update .` để giữ đồ thị luôn đồng bộ (hoàn toàn cục bộ với Tree-sitter AST, tốc độ nhanh và không tốn chi phí token/API).
5. **Khởi tạo đồ thị cho dự án mới**:
   - Nếu dự án chưa có thư mục `graphify-out/`, chạy `graphify .` hoặc gõ `/graphify` để tạo đồ thị tri thức ban đầu.

---

## 3. Các Quy Tắc Tùy Biến Cốt Lõi (Custom Rules)

Khi triển khai HTML, CSS và JavaScript, Agent bắt buộc phải tuân thủ nghiêm ngặt 3 nguyên tắc sau (tương thích hoàn hảo với House Rules của Taste Skill):

### Quy tắc 1: Loại bỏ triệt để chú thích thừa (Zero-Clutter Annotations)
Tuyệt đối không đưa các chú thích, thẻ nhãn hoặc số đếm mang tính trang trí thừa thãi vào giao diện:
1. **Không chú thích sau tiêu đề / logo**:
   - Logo chỉ để thương hiệu chính (`AZUR PROMILIA`), không kèm dòng phụ giải thích kiểu "BÁCH KHOA TRANG BỊ & NGUYÊN LIỆU".
   - Tiêu đề mục chỉ nêu tên nội dung, không kèm subtitle giải thích dông dài bên dưới.
2. **Không chú thích dạng thẻ (Badge / Pill Annotations)**:
   - Loại bỏ các thẻ pill trôi nổi kiểu `KHO VŨ KHÍ`, `KHO NGUYÊN LIỆU`, `SCREEN 01`, `✦ Lam Sắc Tinh Nguyên ✦`.
   - Tiêu đề và vị trí bố cục tự thể hiện ý nghĩa mà không cần dán nhãn phân loại.
3. **Không chú thích mở ngoặc hoặc đếm số trong nhãn**:
   - Menu điều hướng: Dùng `Trang Bị`, `Nguyên Liệu` (KHÔNG dùng `Trang Bị (25)`, `Nguyên Liệu (33)`).
   - Bộ lọc danh mục: Dùng `Tất cả`, `Linh Túy`, `Vi Hạt`, `Sản Vật`, `Tiền Tệ` (KHÔNG kèm `(33)`, `(5)`, `(8)`...).
   - Tab thuộc tính: Dùng tên phẩm chất thuần túy `Tân thủ`, `Tiến giai` (KHÔNG mở ngoặc `(Khởi đầu)`).
4. **Không chú thích dạng placeholder**:
   - Các ô nhập tìm kiếm (`<input type="text">`) không sử dụng thuộc tính `placeholder` mang tính hướng dẫn thừa thãi. Ô tìm kiếm chỉ cần icon kính lúp hoặc nhãn ngữ nghĩa ẩn.
5. **Không chú thích đếm số lượng bản ghi hoặc chỉ mục**:
   - Loại bỏ bộ đếm bước số lượng kiểu `02 / 05` trên thanh điều hướng.
   - Loại bỏ tiền tố đánh số thứ tự như `01.`, `02.`, `03.` trước tiêu đề mục.
   - Loại bỏ các dòng chú thích thống kê phụ kiểu `25 vũ khí sử dụng`, `33 loại nguyên liệu` nếu không phục vụ chức năng cốt lõi.
6. **Không chú thích / mô tả dưới ảnh (No Captions Under Images)**:
   - Đồng bộ hoàn toàn với House Rule 1 của Taste Skill: Tuyệt đối không gắn caption hay mô tả dưới hình ảnh hoặc visual elements. Thông tin tác quyền / license được ghi tinh gọn ở footer.

---

### Quy tắc 2: Quy tắc Viền Bo Góc (Border-Radius Discipline)
1. **Chỉ áp dụng `border-radius` cho Button**:
   - Thuộc tính `border-radius` (dạng bo nhẹ hoặc pill) **CHỈ ĐƯỢC PHÉP** sử dụng trên các phần tử nút bấm có thể nhấp (`<button>`, thẻ `<a>` đóng vai trò là button, tab chuyển đổi tương tác).
   - Mọi phần tử giao diện khác (card, container, modal box, bảng dữ liệu, ô nhập liệu, danh sách) **KHÔNG** sử dụng border radius (`border-radius: 0`).
2. **Hình ảnh tuyệt đối không bo góc**:
   - Tất cả thẻ `<img>`, khung chứa ảnh (`.weapon-img-box`, `.screen-visual-frame`, `.material-icon-wrap`) phải có `border-radius: 0;` tuyệt đối.

---

### Quy tắc 3: Hòa Khối Trực Tiếp Vào Nền (Seamless Background Integration)
1. **Hộp bọc nội dung (Containers / Screens) phải hòa vào nền**:
   - Các khung bao bọc nhóm thông tin lớn (`.detail-screen`, `.screen-content-area`, `.filter-panel`, `.portal-card`, `.community-strip`) không được đóng khung bằng các hộp nền trắng riêng biệt có viền dày và đổ bóng nặng.
   - Ưu tiên `background: transparent; border: none; box-shadow: none;` để toàn bộ nội dung hòa quyện tự nhiên vào canvas của trang web.
2. **Hiệu ứng chỉ tập trung vào phần tử bên trong**:
   - Thay vì làm nổi bật cả cái hộp chứa, chỉ các phần tử tương tác cụ thể bên trong (nút bấm, dòng dữ liệu, thẻ chi tiết nhỏ) mới có hiệu ứng hover, đường kẻ phân cách tinh tế hoặc bóng đổ nhẹ nhàng.

---

## 4. Lệnh & Công Cụ Kiểm Tra

* **Tra cứu & Khai thác Codebase với Graphify**:
  ```powershell
  # Truy vấn tri thức codebase (luôn ưu tiên chạy trước khi grep)
  graphify query "<câu hỏi>"

  # Tìm đường đi quan hệ giữa hai thành phần
  graphify path "<Module A>" "<Module B>"

  # Giải thích chuyên sâu một khái niệm / component
  graphify explain "<Khái niệm>"

  # Cập nhật đồ thị sau khi chỉnh sửa code
  graphify update .

  # Khởi tạo đồ thị toàn diện
  graphify .
  ```
* **Quét chất lượng Impeccable (Craft-floor & Anti-patterns)**:
  ```powershell
  & ".agent\skills\impeccable\scripts\impeccable.cmd" detect .
  ```
* **Tra cứu Design System với UI/UX Pro Max**:
  ```powershell
  python .agent/skills/ui-ux-pro-max/scripts/search.py "<chủ đề>" --design-system
  ```
* **Khởi tạo bố cục & Design Tokens với Taste Skill**:
  ```powershell
  node .agent/skills/taste-skill/scripts/start.mjs deal --page gaming
  ```
* **Kiểm định tính nhất quán trên trình duyệt với Taste Skill (Chrome / Edge)**:
  ```powershell
  node .agent/skills/taste-skill/scripts/consistency.mjs index.html --page gaming
  ```
* **Kiểm tra độ bền vững bố cục (Stress-test Layout)**:
  ```powershell
  node .agent/skills/taste-skill/assets/layout/check.mjs
  ```
