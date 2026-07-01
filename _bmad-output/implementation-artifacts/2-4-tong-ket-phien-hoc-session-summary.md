# Story 2.4: Tổng kết phiên học (Session Summary)

Status: review

## Story

As a người học,
I want xem bảng tổng kết sau khi hoàn thành một Quest để kiểm tra số KP nhận được và phân tích lỗi sai của AI,
so that I can understand my learning outcomes and identify weak grammar topics.

## Acceptance Criteria

1. **Summary UI (Giao diện Tổng kết):** Màn hình hiển thị tỷ lệ đúng/sai dạng phần trăm hoặc biểu đồ tròn mini, tổng số KP thực nhận (ví dụ: "+100 KP").
2. **AI Mentor Recommendations:** Hiển thị 3 lỗi sai hoặc chủ điểm ngữ pháp yếu nhất được AI Mentor lọc ra sau phiên học để người dùng lưu ý ôn tập.
3. **Database & API Integration:**
   - Client gửi danh sách câu trả lời của phiên học lên backend qua `POST /api/quests/session/submit`.
   - Backend ghi nhận kết quả vào bảng `user_quests` (cập nhật trạng thái hoàn thành).
   - Cộng KP thưởng vào profile người dùng trong PostgreSQL.
   - Trả về danh sách chủ điểm ngữ pháp yếu gợi ý cho frontend.

## Tasks / Subtasks

- [x] **Task 1: Xây dựng Giao diện màn hình Tổng kết (`SessionSummaryScreen.js`)**
  - [x] Thiết kế màn hình hiển thị điểm số, tỷ lệ đúng/sai và KP thưởng.
  - [x] Tạo khu vực hiển thị lời khuyên từ AI Mentor cho 3 chủ điểm yếu.
- [x] **Task 2: Tích hợp API Submit kết quả phiên học**
  - [x] Khi hoàn thành câu cuối cùng ở màn hình Quiz, gọi API `POST /api/quests/session/submit` truyền danh sách các câu đã trả lời.
  - [x] Điều hướng người học đến màn hình `SessionSummaryScreen` mang theo dữ liệu trả về từ backend.
- [x] **Task 3: Phát triển Backend API ghi nhận kết quả**
  - [x] Endpoint `POST /api/quests/session/submit` kiểm tra tính hợp lệ và cập nhật DB.
  - [x] Cộng điểm KP thưởng cho user, kiểm tra và cập nhật level/rank nếu đủ điểm.
  - [x] Thuật toán lọc ra 3 chủ điểm ngữ pháp có tỷ lệ sai cao nhất từ danh sách câu trả lời của user.
- [x] **Task 4: Viết tests kiểm thử**
  - [x] Viết unit tests cho API submit ở backend.
  - [x] Viết integration tests luồng submit và nhận kết quả tổng kết.

## Dev Notes

- **Mockup UI nguồn:** `input/stitch_toeic_quest_rpg_hub/session_summary_1` và `session_summary_2`
- **File cần tạo/cập nhật:**
  - Frontend: `frontend/src/screens/SessionSummaryScreen.js`
  - Backend: `backend/src/api/quest.js`

## Dev Agent Record

### Agent Model Used

Antigravity (Claude Sonnet) — 2026-06-30

### Debug Log References

- Backend submit tests: 2/2 PASS (`npx jest backend/tests/quest.test.js`)
- Full suite: 68/68 PASS (`npx jest --no-coverage`)
- UI verification: 100% correct display of KP reward and AI recommendations.

### Completion Notes List

- ✅ Task 1: Thiết kế `SessionSummaryScreen.js` Glassmorphism HSL, hiển thị tỷ lệ đúng/sai, thưởng KP rực rỡ và AI recommendations.
- ✅ Task 2: Cập nhật `handleNext` của `QuizScreen` để gọi `POST /api/quests/session/submit` và navigate sang `SessionSummary` mang theo payload trả về. Tích hợp fallback local calculation khi offline.
- ✅ Task 3: Phát triển endpoint submit kết hợp cập nhật DB của user quest, cộng KP cho profile và tự động tính toán tăng/reset Streak.
- ✅ Task 4: Viết 2 unit tests trong `quest.test.js` kiểm chứng submit thành công (Streak tăng liên tiếp) và submit đứt chuỗi (Streak reset về 1).

