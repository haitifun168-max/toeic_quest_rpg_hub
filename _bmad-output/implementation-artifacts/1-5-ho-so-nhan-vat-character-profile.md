---
baseline_commit: NO_VCS
---

# Story 1.5: Hồ sơ nhân vật (Character Profile)

Status: done

## Story

As a người học,  
I want xem hồ sơ nhân vật của mình hiển thị 6 chỉ số Stats năng lực thực tế,  
so that theo dõi được tiến trình phát triển và kết quả học tập của bản thân.

## Acceptance Criteria

1. **Giao diện Hồ sơ nhân vật (Character Profile Screen):**
   - Thiết kế theo phong cách Glassmorphism tối chủ đạo, tông màu chính HSL (theo thiết kế tham chiếu).
   - Hiển thị ảnh Avatar đã chọn, cấp độ nhân vật (Level 1 ban đầu hoặc dựa trên KP), tên nhân vật (character_name) và Rank hiện tại.
   - Hiển thị điểm số TOEIC ước lượng (Sim Score) quy đổi từ ELO/kết quả test.
   - Hiển thị hai chỉ số chính: Tổng điểm tích lũy (Total KP) và Số ngày Streak học tập hiện tại.
   - Vẽ biểu đồ Radar (bằng SVG) thể hiện 6 chỉ số năng lực: *Grammar Power, Reading Speed, Listening Reflex, Vocabulary Bank, Error Pattern IQ, Stamina*. Các chỉ số này được tính toán/phản ánh từ trình độ thực tế của người dùng.
   - Hiển thị danh sách các thành tựu (Achievements): ví dụ chuỗi 14 ngày học liên tiếp, thắng 10 trận PvP, v.v. Hỗ trợ hiển thị mờ/grayscale cho các thành tựu chưa mở khóa (đang khóa).
   - Hiển thị banner trạng thái tài khoản Premium (nếu active).

2. **Server-side REST API:**
   - Cung cấp API endpoint `GET /api/users/profile` yêu cầu xác thực JWT Token để trả về chi tiết thông tin hồ sơ của người học hiện tại.
   - Response trả về đầy đủ các trường: display_name, character_name, avatar_id, current_rank, total_kp, current_elo, target_score, target_deadline, current_stamina và các chỉ số năng lực.
   - Dữ liệu trả về tuân thủ envelope chuẩn của REST API.

## Tasks / Subtasks

- [x] **Task 1: Phát triển API lấy thông tin hồ sơ người dùng** (AC: 2)
  - [x] Viết API endpoint `GET /api/users/profile` trong `backend/src/api/user.js`.
  - [x] Thực hiện truy vấn thông tin chi tiết của người dùng từ CSDL PostgreSQL (bao gồm cả các trường character_name, avatar_id vừa cập nhật ở Story 1.4).
  - [x] Viết unit/integration tests kiểm chứng API này trả về dữ liệu đúng cấu trúc và trả về lỗi 401 nếu thiếu xác thực.
- [x] **Task 2: Thiết kế Giao diện Client (React Native)** (AC: 1)
  - [x] Tạo màn hình `CharacterProfileScreen.js` trong thư mục `frontend/src/screens/`.
  - [x] Lập trình giao diện Glassmorphism bám sát mockup tại `input/stitch_toeic_quest_rpg_hub/character_profile/`.
  - [x] Vẽ biểu đồ Radar (sử dụng SVG) biểu diễn 6 stats năng lực: Grammar Power, Reading Speed, Listening Reflex, Vocabulary Bank, Error Pattern IQ, Stamina.
  - [x] Hiển thị danh sách các Achievements (Huy chương đạt được) có phân chia trạng thái mở khóa/khóa.
  - [x] Kết nối API `GET /api/users/profile` để tải dữ liệu nhân vật thực tế hiển thị lên màn hình.

## Dev Notes

*   **Ràng buộc kiến trúc (Architecture Compliance):**
    *   `AD-1 (PostgreSQL DB)`: Lấy dữ liệu hồ sơ nhân vật trực tiếp từ PostgreSQL.
    *   `Conventions`: Phản hồi REST API tuân thủ envelope `{ "ok": boolean, "data": object/array, "error": { "code": string, "message": string } }`.
*   **Thư mục mã nguồn cần tạo/sửa đổi:**
    *   Backend API routes: `backend/src/api/user.js`
    *   Frontend screen: `frontend/src/screens/CharacterProfileScreen.js`
*   **Tiêu chuẩn kiểm thử:**
    *   Viết test suite kiểm tra API `GET /api/users/profile` đảm bảo trả về đúng các thông tin profile đã thiết lập của user, không lộ mật khẩu hash, và bảo mật thông tin bằng token xác thực.

## References

*   **Đặc tả Yêu cầu sản phẩm:** [prd.md#L41-L48](file:///c:/CuongPH/02-bmad-toeic_quest_rpg_hub/_bmad-output/planning-artifacts/prds/prd-02-bmad-toeic_quest_rpg_hub-2026-06-23/prd.md#L41-L48) (UJ-5: Nam tham dự Lễ thăng hạng / Hồ sơ nhân vật).
*   **Kiến trúc hệ thống:** [ARCHITECTURE-SPINE.md#L55-L60](file:///c:/CuongPH/02-bmad-toeic_quest_rpg_hub/_bmad-output/planning-artifacts/architecture/architecture-02-bmad-toeic_quest_rpg_hub-2026-06-23/ARCHITECTURE-SPINE.md#L55-L60) (AD-1: PostgreSQL DB).

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
