---
baseline_commit: NO_VCS
---

# Story 1.3: Làm bài kiểm tra đầu vào (Placement Test)

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a người học mới,  
I want làm bài kiểm tra nhanh 10 câu,  
so that xác định trình độ xuất phát điểm.

## Acceptance Criteria

1. **Giao diện làm bài thi (Placement Test Quiz Screen):**
   - Thiết kế giao diện Glassmorphism với tông màu tối chủ đạo, hiển thị tiến độ làm bài (Ví dụ: "Câu 5/10", "Part 5: Hoàn thành câu").
   - Giao diện hiển thị đếm ngược 5 phút (300 giây). Khi đếm ngược về 0, hệ thống tự động nộp bài và khóa tương tác chọn đáp án.
   - Ẩn hoặc vô hiệu hóa nút quay lại (Back Button) trong quá trình làm bài kiểm tra để tránh người dùng thoát giữa chừng.
   - *Giao diện tham chiếu:* [input/stitch_toeic_quest_rpg_hub/placement_test_quiz](file:///c:/CuongPH/02-bmad-toeic_quest_rpg_hub/input/stitch_toeic_quest_rpg_hub/placement_test_quiz)

2. **Server-side validation & Trích xuất câu hỏi:**
   - Cung cấp API endpoint `GET /api/placement/questions` trả về danh sách 10 câu hỏi trắc nghiệm ngẫu nhiên từ cơ sở dữ liệu.
   - Phản hồi của API lấy câu hỏi không được chứa trường `correct_option` để đảm bảo bảo mật và chống gian lận.
   - Mọi đáp án chọn của người học phải được gửi lên server qua API endpoint `POST /api/placement/submit` để chấm điểm tập trung, không lưu logic chấm điểm hay đáp án đúng ở client.
   - Response của API chấm điểm phải trả về số câu trả lời đúng và ước lượng điểm TOEIC tương đương (Sim Score).

3. **Lưu trữ dữ liệu câu hỏi (PostgreSQL):**
   - Tạo bảng CSDL `questions` và `questions_explanation` trong PostgreSQL để lưu trữ thông tin câu hỏi và giải thích 3 tầng tương ứng.
   - Thực hiện di chuyển cơ sở dữ liệu (Migration) nạp sẵn ít nhất 10 câu hỏi mẫu làm dữ liệu ban đầu cho Placement Test.

## Tasks / Subtasks

- [x] **Task 1: Cấu trúc cơ sở dữ liệu & Di chuyển dữ liệu (Migration)** (AC: 3)
  - [x] Tạo file migration SQL `backend/src/db/migrations/03_create_questions.sql` định nghĩa bảng `questions` và `questions_explanation`.
  - [x] Viết lệnh SQL trong file migration để chèn (seed) 10 câu hỏi mẫu (gồm nội dung, các lựa chọn A, B, C, D, đáp án đúng và phần giải thích 3 tầng).
- [x] **Task 2: Phát triển API nạp câu hỏi và nộp bài kiểm tra** (AC: 2, 3)
  - [x] Viết route API `/api/placement` kết nối với Express app trong `backend/src/app.js`.
  - [x] API endpoint `GET /api/placement/questions` lấy ngẫu nhiên 10 câu hỏi từ DB (loại bỏ trường `correct_option` trước khi trả về client).
  - [x] API endpoint `POST /api/placement/submit` (cần authenticate JWT) nhận danh sách câu trả lời của người dùng, thực hiện so khớp đáp án đúng trên server, cập nhật ELO/Rank dự kiến và lưu tạm kết quả kiểm tra.
- [x] **Task 3: Phát triển giao diện phía Client (React Native)** (AC: 1, 2)
  - [x] Lập trình màn hình `PlacementTestScreen.js` sử dụng Tailwind/CSS theo thiết kế Glassmorphism tối.
  - [x] Triển khai bộ đếm thời gian ngược 5 phút (300 giây) bằng `setInterval`. Khi hết giờ, tự động gọi hàm nộp bài.
  - [x] Kết nối API để tải câu hỏi và gửi kết quả chấm điểm. Điều hướng sang màn hình xếp hạng nhân vật khi hoàn thành.

### Review Findings

- [x] [Review][Patch] Duplicate question IDs in submit payload can inflate score [backend/src/api/placement.js:90]
- [x] [Review][Patch] Fragile map/filter on payload attributes [backend/src/api/placement.js:70]
- [x] [Review][Defer] Timer drift in background state [frontend/src/screens/PlacementTestScreen.js:63] — deferred, pre-existing

## Dev Notes

*   **Ràng buộc kiến trúc (Architecture Compliance):**
    *   `AD-3 (Server-side validation)`: Mọi logic chấm điểm và kiểm tra đáp án phải thực hiện hoàn toàn tại server-side để tránh hack/cheat.
    *   `AD-5 (Pre-generated explanation)`: Phần giải thích 3 tầng phải lưu ở PostgreSQL bảng `questions_explanation`.
    *   `Conventions`: Phản hồi REST API tuân thủ envelope `{ "ok": boolean, "data": object/array, "error": { "code": string, "message": string } }`.
*   **Thư mục mã nguồn cần tạo/sửa đổi:**
    *   Database schema update: `backend/src/db/migrations/03_create_questions.sql`
    *   Backend API routes: `backend/src/api/placement.js`
    *   Frontend screen: `frontend/src/screens/PlacementTestScreen.js`
*   **Tiêu chuẩn kiểm thử:**
    *   Viết test suite kiểm tra API `GET /api/placement/questions` không làm lộ trường `correct_option`.
    *   Viết test suite kiểm tra API `POST /api/placement/submit` chấm điểm chính xác số câu đúng dựa trên mock DB.

## References

*   **Đặc tả Yêu cầu sản phẩm:** [prd.md#L108-L113](file:///c:/CuongPH/02-bmad-toeic_quest_rpg_hub/_bmad-output/planning-artifacts/prds/prd-02-bmad-toeic_quest_rpg_hub-2026-06-23/prd.md#L108-L113) (FR-2: Placement Test rút gọn).
*   **Kiến trúc hệ thống:** [ARCHITECTURE-SPINE.md#L66-L70](file:///c:/CuongPH/02-bmad-toeic_quest_rpg_hub/_bmad-output/planning-artifacts/architecture/architecture-02-bmad-toeic_quest_rpg_hub-2026-06-23/ARCHITECTURE-SPINE.md#L66-L70) (AD-5: Pre-generated explanation).

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
