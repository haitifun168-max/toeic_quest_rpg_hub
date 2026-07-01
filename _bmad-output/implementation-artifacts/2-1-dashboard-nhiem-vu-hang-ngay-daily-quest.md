---
baseline_commit: NO_VCS
---

# Story 2.1: Dashboard nhiệm vụ hàng ngày (Daily Quest)

Status: done

## Story

As a người học,  
I want truy cập Home Dashboard để thấy danh sách 3 nhiệm vụ học tập hôm nay và chỉ số Stamina hiện tại,  
so that dễ dàng bắt đầu việc ôn luyện hàng ngày mà không bị quá tải.

## Acceptance Criteria

1. **Giao diện Home Dashboard Screen:**
   - Thiết kế bám sát mockup tại `input/stitch_toeic_quest_rpg_hub/home_dashboard/` sử dụng phong cách Glassmorphism tối HSL.
   - **Top Bar:** Hiển thị Avatar nhân vật, Tên người dùng, Số ngày Streak, Điểm KP tích lũy và Huy hiệu Rank hiện tại.
   - **Nhiệm vụ hôm nay Widget:** Hiển thị danh sách 3 nhiệm vụ học tập hàng ngày:
     - *DQ-01: Từ vựng* (ví dụ: "Học 10 từ vựng Part 1" - có thanh tiến độ).
     - *DQ-02: Nghe hiểu* (ví dụ: "Hoàn thành 1 bài nghe Part 2" - có thanh tiến độ).
     - *DQ-03: Ngữ pháp/PvP* (ví dụ: "Thắng 1 trận PvP Battle" - có trạng thái hoàn thành).
   - **Chỉ số Stamina:** Hiển thị thanh Stamina hiện tại của người dùng (ví dụ: 12/15 đối với tài khoản Free). Nếu Stamina về 0, hiển thị cảnh báo và vô hiệu hóa nút truy cập PvP Battle.
   - **Các Widgets phụ:**
     - Goal/Streak Widget: Thể hiện chuỗi ngày học hiện tại và tỷ lệ hoàn thành mục tiêu ngày.
     - Năng lực Widget: Radar mini thể hiện hạng hiện tại (ví dụ: B1 - Hạng Vàng).
     - Lộ trình Widget: Tiến trình chinh phục mục tiêu TOEIC (ví dụ: 45% Giai đoạn 3/5).
     - Flashcard Widget: Ôn tập nhanh các từ khó trong ngày.
     - AI Mentor Widget: Đưa ra gợi ý bài học cá nhân hóa ("Bạn đang gặp khó ở Part 5...").
   - **Bottom Navigation:** Tích hợp thanh điều hướng dưới chân màn hình, hỗ trợ đổi tab hoặc điều hướng sang màn hình Profile.

2. **Server-side REST API & CSDL:**
   - **Cơ sở dữ liệu:**
     - Thiết lập bảng `user_quests` lưu trữ tiến trình nhiệm vụ của người dùng: `id`, `user_id`, `quest_type` (vocab, listening, grammar/pvp), `title`, `target_count`, `current_count`, `is_completed`, `quest_date`.
   - **API Endpoint:**
     - `GET /api/quests/daily` (Yêu cầu JWT Token): Trả về danh sách 3 nhiệm vụ hàng ngày của người học. Nếu là lần đầu tiên truy cập trong ngày mới (sau 00:00), hệ thống tự động reset stamina (nếu đến hạn reset) và khởi tạo/sinh ngẫu nhiên 3 nhiệm vụ mới phù hợp với mục tiêu của người dùng.
     - `GET /api/users/stamina` (Yêu cầu JWT Token): Lấy stamina hiện tại và thời gian đếm ngược đến lần reset tiếp theo.

## Tasks / Subtasks

- [x] **Task 1: Thiết lập cơ sở dữ liệu cho Nhiệm vụ hàng ngày (Migration)** (AC: 2)
  - [x] Tạo file migration `backend/src/db/migrations/05_create_user_quests.sql` định nghĩa bảng `user_quests`.
- [x] **Task 2: Phát triển các endpoint API cho Quests & Stamina** (AC: 2)
  - [x] Phát triển API endpoint `GET /api/quests/daily` trong file mới `backend/src/api/quest.js`.
  - [x] Tích hợp logic tự động kiểm tra ngày mới, reset Stamina (15 cho Free, 30 cho Premium) và tạo 3 nhiệm vụ mặc định/ngẫu nhiên.
  - [x] Đăng ký route `/api/quests` vào Express app trong `backend/src/app.js`.
  - [x] Viết test suite tại `backend/tests/quest.test.js` để kiểm thử logic sinh nhiệm vụ hàng ngày và tự động reset.
- [x] **Task 3: Thiết kế Giao diện Home Dashboard (React Native)** (AC: 1)
  - [x] Tạo màn hình `HomeDashboardScreen.js` trong thư mục `frontend/src/screens/`.
  - [x] Lập trình giao diện Glassmorphism tối bám sát mockup Home Dashboard.
  - [x] Tích hợp hiển thị danh sách nhiệm vụ từ API, thanh tiến trình Stamina và các widget phụ.
  - [x] Kết nối Bottom Navigation để chuyển đổi qua lại giữa HomeDashboard và CharacterProfileScreen.

## Dev Notes

*   **Ràng buộc kiến trúc (Architecture Compliance):**
    *   `AD-6 (Daily Stamina limit)`: Stamina tối đa 15 cho Free, 30 cho Premium. Giới hạn tham gia PvP nếu stamina bằng 0.
    *   `Conventions`: Phản hồi REST API tuân thủ envelope `{ "ok": boolean, "data": object/array, "error": { "code": string, "message": string } }`.
*   **Thư mục mã nguồn cần tạo/sửa đổi:**
    *   Database schema update: `backend/src/db/migrations/05_create_user_quests.sql`
    *   Backend API routes: `backend/src/api/quest.js`, `backend/src/app.js`
    *   Frontend screen: `frontend/src/screens/HomeDashboardScreen.js`
*   **Tiêu chuẩn kiểm thử:**
    *   Viết unit/integration tests kiểm thử API `/api/quests/daily` trả về đúng 3 nhiệm vụ hàng ngày, tự động sinh nhiệm vụ mới cho ngày mới và cập nhật chính xác stamina.

## References

*   **Đặc tả Yêu cầu sản phẩm:** [prd.md#L129-L150](file:///c:/CuongPH/02-bmad-toeic_quest_rpg_hub/_bmad-output/planning-artifacts/prds/prd-02-bmad-toeic_quest_rpg_hub-2026-06-23/prd.md#L129-L150) (FR-4: Tải danh sách Daily Quest, FR-6: Streak hàng ngày).
*   **Kiến trúc hệ thống:** [ARCHITECTURE-SPINE.md#L71-L75](file:///c:/CuongPH/02-bmad-toeic_quest_rpg_hub/_bmad-output/planning-artifacts/architecture/architecture-02-bmad-toeic_quest_rpg_hub-2026-06-23/ARCHITECTURE-SPINE.md#L71-L75) (AD-6: Daily Stamina limit).

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
