# GEMINI.md - Graphify & Project Context Rules

## Graphify Knowledge Graph (Bắt Buộc Chạy Trên Mỗi Truy Vấn Codebase)

Dự án này sử dụng mô hình đồ thị tri thức mã nguồn cục bộ qua **Graphify**.

### Quy tắc tra cứu mã nguồn (Codebase Query Rules):
1. **Ưu tiên tra cứu đồ thị trước (Graph-first)**: Khi người dùng hoặc Agent thực hiện bất kỳ câu hỏi/truy vấn nào về mã nguồn, cấu trúc dự án, quan hệ component/hàm, hay luồng dữ liệu:
   - Nếu `graphify-out/graph.json` tồn tại, **BẮT BUỘC** chạy lệnh `graphify query "<câu hỏi>"` trước bất kỳ thao tác `grep` hay đọc raw file nào.
   - Thao tác này trả về một đồ thị con (scoped subgraph) chính xác, gọn gàng và đầy đủ ngữ cảnh hơn so với việc quét tìm văn bản thuần túy.
2. **Truy vấn quan hệ cụ thể**:
   - Dùng `graphify path "<A>" "<B>"` để tìm đường đi và mối liên kết giữa 2 khái niệm/module.
   - Dùng `graphify explain "<concept>"` để phân tích tập trung một hàm, class hoặc thành phần.
3. **Duyệt cấu trúc qua Wiki**:
   - Nếu `graphify-out/wiki/index.md` tồn tại, duyệt qua tài liệu wiki được tạo bởi Graphify thay vì duyệt thủ công từng file nguồn rời rạc.
4. **Đồng bộ đồ thị sau khi sửa mã nguồn (AST Update)**:
   - Sau khi tạo mới, chỉnh sửa hoặc xóa code trong phiên làm việc, chạy ngay lệnh `graphify update .` để cập nhật lại đồ thị (sử dụng Tree-sitter AST cục bộ, nhanh chóng và không tốn chi phí API/token).
5. **Khởi tạo đồ thị**:
   - Khi dự án chưa có `graphify-out/`, chạy `graphify .` hoặc `/graphify` để trích xuất toàn bộ đồ thị tri thức của dự án.
