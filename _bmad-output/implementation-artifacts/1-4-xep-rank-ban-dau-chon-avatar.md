---
baseline_commit: NO_VCS
---

# Story 1.4: Xếp rank ban đầu & Chọn avatar

Status: done

## Story

As a người học mới,  
I want xem điểm số TOEIC ước tính của mình, Rank ban đầu được cấp và chọn Avatar đại diện,  
so that bắt đầu cuộc hành trình phiêu lưu học tập RPG.

## Acceptance Criteria

1. **Giao diện kết quả Placement & Thiết lập nhân vật (Placement Result Screen):**
   - Thiết kế theo phong cách Glassmorphism tối chủ đạo, tông màu chính HSL (theo thiết kế tham chiếu).
   - Hiển thị điểm số TOEIC ước lượng thu được từ kết quả Placement Test trước đó (có hoạt họa đếm số tăng dần từ 0 đến điểm thật).
   - Hiển thị tên Rank và Huy hiệu tương ứng dựa trên ELO/Rank hiện có của người chơi trong DB.
   - Hiển thị radar stats phản ánh 6 chỉ số: Ngữ pháp, Từ vựng, Nghe, Đọc, Phát âm, Tốc độ.
   - Hiển thị hai thẻ đánh giá nhanh: "Mạnh: Ngữ pháp" và "Yếu: Nghe" (hoặc tùy biến dựa trên kết quả làm bài).
   - Cho phép chọn 1 trong 6 Avatar RPG: Kỵ sĩ (knight), Pháp sư (mage), Sát thủ (assassin), Phi công (pilot), Học giả (scholar), Trinh sát (scout). Avatar được chọn sẽ hiển thị sinh động và bỏ grayscale.
   - Cho phép nhập tên nhân vật ("DANH XƯNG ANH HÙNG") với độ dài từ 2 đến 30 ký tự.
   - Hiển thị ô xem trước (Preview Card) đồng bộ thời gian thực gồm avatar, tên nhân vật, Level 1 và thanh XP.
   - Khi nhấn "Bắt Đầu Cuộc Phiêu Lưu!", gọi API lưu avatar & tên nhân vật và chuyển hướng người dùng sang màn hình Home Dashboard.

2. **Server-side Validation & API:**
   - Cung cấp API endpoint `PUT /api/users/character` yêu cầu JWT Token để cập nhật thông tin nhân vật của người học.
   - Validation chặt chẽ: `characterName` bắt buộc từ 2 đến 30 ký tự, không chứa ký tự đặc biệt gây hại. `avatarId` phải là một trong các giá trị hợp lệ: `knight`, `mage`, `assassin`, `pilot`, `scholar`, `scout`.
   - Cập nhật thông tin thành công vào CSDL PostgreSQL và trả về envelope REST API chuẩn.

3. **Lưu trữ dữ liệu PostgreSQL:**
   - Tạo file migration `backend/src/db/migrations/04_add_character_fields.sql` để bổ sung cột `character_name` (VARCHAR) và `avatar_id` (VARCHAR) vào bảng `users`.

## Tasks / Subtasks

- [x] **Task 1: Cấu trúc cơ sở dữ liệu (Migration)** (AC: 3)
  - [x] Tạo file migration SQL `backend/src/db/migrations/04_add_character_fields.sql` để bổ sung cột `character_name` và `avatar_id` vào bảng `users`.
- [x] **Task 2: Phát triển API cập nhật thông tin nhân vật** (AC: 2)
  - [x] Viết API endpoint `PUT /api/users/character` trong `backend/src/api/user.js` để cập nhật `character_name` và `avatar_id`.
  - [x] Thêm validation kiểm tra dữ liệu đầu vào.
  - [x] Bổ sung unit/integration tests trong `backend/tests/user.test.js` để kiểm chứng endpoint này hoạt động đúng, từ chối dữ liệu sai.
- [x] **Task 3: Thiết kế Giao diện Client (React Native)** (AC: 1)
  - [x] Lập trình màn hình `PlacementResultScreen.js` sử dụng Tailwind/CSS theo phong cách Glassmorphism tối.
  - [x] Triển khai biểu đồ Radar, hoạt họa chạy số điểm thi TOEIC ước lượng.
  - [x] Kết nối API cập nhật thông tin nhân vật và thực hiện chuyển hướng khi nhấn nút hoàn thành.

## Dev Notes

*   **Ràng buộc kiến trúc (Architecture Compliance):**
    *   `AD-1 (PostgreSQL DB)`: Lưu trữ thông tin nhân vật (tên, avatar) trong cơ sở dữ liệu PostgreSQL.
    *   `Conventions`: Phản hồi REST API tuân thủ envelope `{ "ok": boolean, "data": object/array, "error": { "code": string, "message": string } }`.
*   **Thư mục mã nguồn cần tạo/sửa đổi:**
    *   Database schema update: `backend/src/db/migrations/04_add_character_fields.sql`
    *   Backend API routes: `backend/src/api/user.js`
    *   Frontend screen: `frontend/src/screens/PlacementResultScreen.js`
*   **Tiêu chuẩn kiểm thử:**
    *   Viết test suite kiểm tra API `PUT /api/users/character` hoạt động chính xác với token hợp lệ, trả về lỗi 400 nếu dữ liệu sai định dạng (tên quá ngắn, avatar không hợp lệ) hoặc lỗi 401 nếu thiếu token.

## References

*   **Đặc tả Yêu cầu sản phẩm:** [prd.md#L114-L121](file:///c:/CuongPH/02-bmad-toeic_quest_rpg_hub/_bmad-output/planning-artifacts/prds/prd-02-bmad-toeic_quest_rpg_hub-2026-06-23/prd.md#L114-L121) (FR-3: Xếp hạng và Chọn Avatar).
*   **Kiến trúc hệ thống:** [ARCHITECTURE-SPINE.md#L55-L60](file:///c:/CuongPH/02-bmad-toeic_quest_rpg_hub/_bmad-output/planning-artifacts/architecture/architecture-02-bmad-toeic_quest_rpg_hub-2026-06-23/ARCHITECTURE-SPINE.md#L55-L60) (AD-1: PostgreSQL DB).

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
