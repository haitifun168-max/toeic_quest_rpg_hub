---
baseline_commit: NO_VCS
---

# Story 1.2: Đặt mục tiêu học tập (Goal Setting)

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a người học mới,  
I want chọn mức điểm TOEIC đích và thời hạn hoàn thành,  
so that cá nhân hóa lộ trình học tập của riêng mình.

---

## Acceptance Criteria

1.  **Lựa chọn điểm số mục tiêu (Target Score):** Giao diện phải cung cấp 6 thẻ lựa chọn điểm số mục tiêu: `300`, `450`, `600`, `750`, `850`, `900+` (CEFR tương ứng: A1, A2, B1, B2, C1, C2).
    *   *Giao diện tham chiếu:* [input/stitch_toeic_quest_rpg_hub/goal_setting_1](file:///c:/CuongPH/02-bmad-toeic_quest_rpg_hub/input/stitch_toeic_quest_rpg_hub/goal_setting_1)
2.  **Lựa chọn thời hạn & Tính toán ngày thi dự kiến:** Giao diện cho phép chọn thời gian hoàn thành mục tiêu (`1 tháng`, `3 tháng`, `6 tháng`, `12 tháng`).
    *   *Giao diện tham chiếu:* [input/stitch_toeic_quest_rpg_hub/goal_setting_2](file:///c:/CuongPH/02-bmad-toeic_quest_rpg_hub/input/stitch_toeic_quest_rpg_hub/goal_setting_2)
    *   *Logic đếm ngày:* Hệ thống phải hiển thị chính xác ngày thi dự kiến bằng công thức: `Ngày hiện tại + số tháng đã chọn`.
3.  **Lưu trữ thông tin (PostgreSQL):** Khi người dùng lưu mục tiêu học tập, thông tin mục tiêu (`target_score` và `target_deadline`) phải được ghi nhận và lưu trữ vào bảng `users` trong PostgreSQL DB của người dùng hiện tại (qua token JWT).

---

## Tasks / Subtasks

- [x] **Task 1: Cập nhật cấu trúc cơ sở dữ liệu PostgreSQL** (AC: 3)
  - [x] Viết file migration SQL (`backend/src/db/migrations/02_add_goals_to_users.sql`) để bổ sung các cột `target_score` (INTEGER) và `target_deadline` (TIMESTAMP WITH TIME ZONE) vào bảng `users`.
- [x] **Task 2: Phát triển JWT Authentication Middleware & API cập nhật mục tiêu** (AC: 3)
  - [x] Viết middleware xác thực token JWT (`backend/src/middleware/auth.js`) để lấy thông tin user ID từ header `Authorization: Bearer <token>`.
  - [x] Viết API endpoint `PUT /api/users/goal` trong `backend/src/api/user.js` để cập nhật `target_score` và `target_deadline` (tính toán dựa trên số tháng người dùng truyền lên).
  - [x] Đăng ký route API `/api/users` trong `backend/src/app.js`.
- [x] **Task 3: Xây dựng màn hình Client (React Native)** (AC: 1, 2)
  - [x] Lập trình màn hình chọn Điểm số mục tiêu (`goal_setting_1`) và màn hình chọn Thời gian hoàn thành (`goal_setting_2`) bám sát thiết kế Glassmorphism và màu sắc thương hiệu.
  - [x] Kết nối API `PUT /api/users/goal` để lưu mục tiêu lên server.
  - [x] Điều hướng người dùng sang màn hình làm bài kiểm tra đầu vào (Placement Test) khi hoàn thành.

### Review Findings

- [x] [Review][Patch] Fragile Authorization Header Parsing [backend/src/middleware/auth.js:10]
- [x] [Review][Patch] Hardcoded localhost URL in mobile screen [frontend/src/screens/GoalSettingScreen.js:26]
- [x] [Review][Defer] Date calculation overflow on month boundary [backend/src/api/user.js:51] — deferred, pre-existing

---

## Dev Notes

*   **Ràng buộc kiến trúc (Architecture Compliance):**
    *   `AD-1 (PostgreSQL)`: Các thông tin transactional như mục tiêu học tập lưu tại PostgreSQL, không lưu tại Redis.
    *   `Conventions`: Response của REST API phải tuân thủ đúng định dạng: `{ "ok": boolean, "data": object/array, "error": { "code": string, "message": string } }`.
*   **Thư mục mã nguồn cần tạo/sửa đổi:**
    *   Database schema update: `backend/src/db/migrations/02_add_goals_to_users.sql`
    *   Auth Middleware: `backend/src/middleware/auth.js`
    *   Backend API routes: `backend/src/api/user.js`
    *   Frontend screen: `frontend/src/screens/GoalSettingScreen.js`
*   **Tiêu chuẩn kiểm thử:**
    *   Viết unit test kiểm tra tính chính xác của thuật toán tính toán ngày thi dự kiến (Ví dụ: `NOW() + 3 months` có đúng múi giờ UTC không).
    *   Kiểm tra tính năng bảo mật của API (yêu cầu chặn truy cập 401 nếu thiếu hoặc sai token JWT).

---

## References

*   **Đặc tả Yêu cầu sản phẩm:** [prd.md#L102-L107](file:///c:/CuongPH/02-bmad-toeic_quest_rpg_hub/_bmad-output/planning-artifacts/prds/prd-02-bmad-toeic_quest_rpg_hub-2026-06-23/prd.md#L102-L107) (FR-1: Thiết lập mục tiêu ban đầu).
*   **Kiến trúc hệ thống:** [ARCHITECTURE-SPINE.md#L41-L47](file:///c:/CuongPH/02-bmad-toeic_quest_rpg_hub/_bmad-output/planning-artifacts/architecture/architecture-02-bmad-toeic_quest_rpg_hub-2026-06-23/ARCHITECTURE-SPINE.md#L41-L47) (AD-1: Phân tách PostgreSQL và Redis).

---

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
