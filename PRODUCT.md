# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Đối tượng chính**: Cộng đồng game thủ Việt Nam chơi *Azur Promilia* (Nhà Khai Phá / Khai Phá Giả).
- **Ngữ cảnh sử dụng**: Đang trải nghiệm game hoặc lên kế hoạch nuôi dưỡng nhân vật, cần tra cứu nhanh chóng và chính xác thông số vũ khí, lộ trình cường hóa (+0 → +15), các mốc thăng sao, và nguồn gốc thu thập nguyên liệu.

## Product Purpose

- Cung cấp một bách khoa toàn thư (wiki companion) độc lập, hoàn chỉnh, chuẩn hóa 100% tiếng Việt cho dữ liệu trang bị và nguyên liệu trong game *Azur Promilia*.
- Giúp người chơi dễ dàng tra cứu, đối chiếu 5 bậc phẩm chất, tính toán nguyên liệu nâng cấp, và kết nối với cộng đồng người chơi tại Việt Nam.

## Positioning

- Khác biệt hoàn toàn so với việc xem các trang wiki tiếng Trung thô sơ (như Bilibili Game Wiki) nhờ:
  1. Chuẩn hóa dịch thuật chuyên biệt: Tên trang bị dịch Hán Việt (âm vang, chuẩn phong cách kiếm hiệp/kỳ ảo), toàn bộ nguyên liệu, mô tả và cốt truyện dịch tiếng Việt thuần chuẩn xác.
  2. Kiến trúc trang tĩnh độc lập tải nhanh với thanh điều hướng cuộn theo từng Screen lấy cảm hứng từ Fincantieri FREMM EVO, tối ưu trải nghiệm đọc sâu.
  3. Toàn bộ hình ảnh HD 252×252 được lưu trữ cục bộ, không phụ thuộc vào link ảnh ngoài hay proxy mạng.

## Operating Context

- Môi trường trình duyệt web (Desktop và Mobile).
- Hoạt động mượt mà cả ở chế độ offline cục bộ (`file:///`) lẫn khi triển khai trên hosting/cloud (Vercel, Netlify, Cloudflare, GitHub Pages, Nginx...) với hỗ trợ Clean URLs.

## Capabilities and Constraints

- **Kiến trúc trang độc lập**: Mỗi trang bị và nguyên liệu có file HTML riêng biệt, khi nhấp vào sẽ chuyển trang (real reload) thay vì tráo đổi khối DOM trong một trang đơn (SPA).
- **Thanh điều hướng Fincantieri**: Phía bên trái mỗi trang chi tiết có thanh điều hướng bám dính (sticky) nhận diện ngưỡng cuộn (scroll threshold), hiển thị tiến trình (VD: `01 / 05`) và vạch trượt mượt mà.
- **Hệ thống dữ liệu**: 25 vũ khí đầy đủ 5 bậc phẩm chất, 6 mốc thăng sao, 15 cấp cường hóa; 33 nguyên liệu độc nhất phân nhóm Linh Túy, Vi Hạt, Sản Vật, Tiền Tệ (Uni).
- **Kế hoạch mở rộng**: Cần mở rộng thêm các tính năng nâng cao trong tương lai (máy tính nguyên liệu, bộ lọc nâng cao, trang tra cứu nhân vật).

## Brand Commitments

- **Tên sản phẩm**: Azur Promilia Wiki (Lam Sắc Tinh Nguyên: Du Lịch Dao).
- **Ngôn ngữ & Giọng điệu**: Tiếng Việt thuần, trang nhã, chính xác; tôn trọng tên Hán Việt của vũ khí.
- **Liên kết cộng đồng**: Tích hợp liên kết chính thức tới Fanpage Facebook Azur Lane Việt Nam và Nhóm Thảo Luận Azur Promilia Việt Nam.

## Evidence on Hand

- Dữ liệu hoàn chỉnh tại `datas/bundle.js` và `datas/equipments/vu_khi/` (25 JSON) cùng `datas/materials/materials.json` (33 nguyên liệu).
- Thư mục hình ảnh cục bộ `assets/equipment/` (50 ảnh) và `assets/materials/` (33 ảnh HD 252×252).
- Bộ quy chuẩn thiết kế `style.css` nền sáng đạt tiêu chuẩn WCAG AA và Impeccable (0 anti-patterns).

## Product Principles

1. **Chính xác & Rõ ràng**: Dữ liệu chỉ số, công thức cường hóa và nguồn rớt phải tuyệt đối khớp với dữ liệu gốc của game, không suy đoán.
2. **Trải nghiệm Đọc sâu (Focus & Flow)**: Thiết kế chia Screen độc lập giúp người dùng tập trung vào từng khía cạnh (Cốt truyện → Thuộc tính → Thăng sao → Nguyên liệu → Nguồn gốc) mà không bị ngợp thông tin.
3. **Độc lập & Bền bỉ**: Trang web hoạt động ổn định trên mọi nền tảng, không phụ thuộc tài nguyên mạng từ bên thứ ba, tải trang tức thì.
4. **Mở rộng có kiểm soát**: Các tính năng mới (nhân vật, máy tính) phải kế thừa phong cách thiết kế và cấu trúc điều hướng đã xác lập.

## Accessibility & Inclusion

- Chuẩn WCAG AA: Độ tương phản màu chữ với nền luôn ≥ 4.5:1 (chữ chính đạt > 15:1).
- Cấu trúc tiêu đề phân cấp chuẩn ngữ nghĩa (`h1` → `h2` → `h3`), hỗ trợ tốt công cụ đọc màn hình.
