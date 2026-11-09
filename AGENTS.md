# AGENTS.md - Quy Chuẩn Phát Triển & Thiết Kế Giao Diện

Tài liệu này là quy chuẩn cốt lõi dành cho AI Agent (Antigravity) và các nhà phát triển khi xây dựng, chỉnh sửa và mở rộng dự án **Azur Promilia Wiki** hoặc các dự án giao diện frontend tương tự.

---

## 1. Phương Pháp Kết Hợp Hiệu Quả: Impeccable & UI/UX Pro Max

Dự án tích hợp sức mạnh tổng hợp từ 2 bộ công cụ thiết kế hàng đầu:
* **UI/UX Pro Max**: Đóng vai trò là **Kiến trúc sư & Thư viện Tri thức Thiết kế (Design Intelligence)**. Cung cấp dữ liệu về phong cách (80 styles), bảng màu chuyên ngành (192 product palettes), cặp font chữ (74 pairings), tech stacks và UX heuristics.
* **Impeccable**: Đóng vai trò là **Giám đốc Nghệ thuật & Thanh tra Chất lượng (Art Direction & Quality Gatekeeper)**. Thiết lập sàn chất lượng tối thiểu (craft-floor), kiểm tra khả năng tiếp cận WCAG AA (độ tương phản ≥ 4.5:1), loại bỏ AI slop (dark-glow, gradient-text, side-tab) thông qua công cụ cơ học `impeccable detect`.

### Quy trình 4 bước phối hợp (Workflow):

```
┌────────────────────────────────────────────────────────┐
│  1. KHÁM PHÁ & THIẾT KẾ HỆ THỐNG (UI/UX Pro Max)      │
│     - Tra cứu bảng màu, phong cách, kiểu chữ bằng CLI  │
│     - python search.py "<domain>" --design-system      │
└────────────────────────────────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│  2. THIẾT LẬP RÀNG BUỘC CHẤT LƯỢNG (Impeccable)        │
│     - Đọc craft-floor.md trước khi viết mã UI          │
│     - Nghiêm cấm mọi anti-pattern: dark glow, neon     │
│       gradients, side-tabs, độ tương phản yếu          │
└────────────────────────────────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│  3. TRIỂN KHAI MÃ NGUỒN (Code-First + Custom Rules)   │
│     - Viết mã HTML/CSS/JS độc lập, tường minh          │
│     - Tuân thủ tuyệt đối các Custom Rules bên dưới     │
└────────────────────────────────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│  4. KIỂM ĐỊNH TỰ ĐỘNG (Impeccable Detect)              │
│     - Chạy: impeccable detect .                        │
│     - Đảm bảo 0 anti-patterns trước khi bàn giao       │
└────────────────────────────────────────────────────────┘
```

---

## 2. Các Quy Tắc Tùy Biến Cốt Lõi (Custom Rules)

Khi triển khai HTML, CSS và JavaScript, Agent bắt buộc phải tuân thủ nghiêm ngặt 3 nguyên tắc sau:

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

## 3. Lệnh & Công Cụ Kiểm Tra

* **Quét chất lượng Impeccable**:
  ```powershell
  & ".agent\skills\impeccable\scripts\impeccable.cmd" detect .
  ```
* **Tra cứu Design System với UI/UX Pro Max**:
  ```powershell
  python .agent/skills/ui-ux-pro-max/scripts/search.py "<chủ đề>" --design-system
  ```
