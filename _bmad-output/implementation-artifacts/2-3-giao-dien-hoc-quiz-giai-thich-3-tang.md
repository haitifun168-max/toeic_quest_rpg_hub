---
baseline_commit: NO_VCS
---

# Story 2.3: Giao diện học Quiz & giải thích 3 tầng

Status: review

## Story

As a người học,
I want trả lời câu hỏi trắc nghiệm, nhận phản hồi đúng/sai tức thì và xem giải thích 3 tầng tương ứng,
so that I can learn from my mistakes and master the grammar/vocabulary.

## Acceptance Criteria

1. **Quiz Interface (Giao diện Quiz):** Màn hình hiển thị câu hỏi hiện tại, thanh tiến trình (ví dụ: "Câu 3/10"), và 4 lựa chọn (A, B, C, D) dạng Glassmorphism.
2. **Micro-feedback:** 
   - Khi chọn đáp án: Khóa tương tác, phản hồi trong vòng <= 2 giây.
   - Nếu Đúng: Hiển thị hiệu ứng Confetti, nền nút bấm chuyển xanh lá sáng (`#4ade80`).
   - Nếu Sai: Rung nhẹ thiết bị/nút bấm, nền nút bấm chuyển đỏ cam (`#f87171`), đồng thời highlight viền xanh lá ở đáp án đúng.
3. **3-Tier Explanation Accordion (Giải thích 3 tầng):**
   - **Tầng 1 (Dịch & Key):** Tự động hiển thị ngay sau khi trả lời xong.
   - **Tầng 2 (Ngữ pháp & Dấu hiệu nhận biết):** Dạng Accordion, chỉ load/hiển thị khi bấm "Xem cấu trúc ngữ pháp".
   - **Tầng 3 (AI Tips & Mở rộng):** Chỉ load khi bấm "Xem bí quyết AI Mentor".
4. **Lazy-loading & Caching:** Tầng 2 & 3 sử dụng lazy loading từ API `/api/questions/:id/explanations` để giảm tải I/O.
5. **Stamina Check (Tiêu hao năng lượng):** Mỗi lần kết thúc phiên học (hoặc khi bắt đầu), kiểm tra Stamina phải > 0.

## Tasks / Subtasks

- [x] **Task 1: Xây dựng Giao diện màn hình Quiz (`QuizScreen.js`)**
  - [x] Thiết kế khu vực hiển thị câu hỏi và 4 nút lựa chọn Glassmorphism nền tối.
  - [x] Tạo thanh tiến trình (ProgressBar) hiển thị số lượng câu hiện tại.
- [x] **Task 2: Lập trình hiệu ứng Micro-feedback đúng/sai**
  - [x] Hiển thị màu xanh lá/đỏ cam tương ứng khi click đáp án.
  - [x] Tích hợp hiệu ứng Confetti động (sử dụng thư viện có sẵn hoặc CSS animation mượt trên Web).
- [x] **Task 3: Xây dựng Component Accordion giải thích 3 tầng**
  - [x] Tạo Accordion collapsible mượt mà.
  - [x] Lazy-load dữ liệu Tầng 2 & Tầng 3 từ backend khi user mở Accordion.
- [x] **Task 4: Thiết lập API Backend**
  - [x] Endpoint `GET /api/quests/:id/questions` lấy danh sách câu hỏi.
  - [x] Endpoint `GET /api/quests/questions/:id/explanations` lấy giải thích chi tiết Tầng 2 & 3.
- [x] **Task 5: Viết Unit Test & Integration Test**
  - [x] Test component QuizScreen với mock data.
  - [x] Test backend API cho câu hỏi và giải thích.

## Dev Notes

- **Mockup UI nguồn:** `input/stitch_toeic_quest_rpg_hub/quiz_screen_grammar`
- **File cần tạo/cập nhật:**
  - Frontend: `frontend/src/screens/QuizScreen.js`
  - Backend: `backend/src/routes/quests.js`, `backend/src/controllers/questController.js`

## Dev Agent Record

### Agent Model Used

Antigravity (Claude Sonnet) — 2026-06-29

### Debug Log References

- Backend unit tests: 7/7 PASS (`npx jest backend/tests/quest.test.js`)
- Frontend unit tests: 3/3 PASS (`npx jest frontend/src/screens/QuizScreen.test.js`)
- Full suite: 63/63 PASS (`npx jest --no-coverage`)
- Web verification: 100% correct micro-feedback, accordion lazy loading, arrow key state transitions.

### Completion Notes List
- ✅ Task 1: Thiết kế giao diện Quiz Screen và Progress Bar Glassmorphism mượt mà.
- ✅ Task 2: Thiết lập phản hồi đúng/sai tức thì (Confetti khi đúng, shake animation & highlight đáp án khi sai).
- ✅ Task 3: Phát triển Accordion giải thích 3 tầng dạng lazy-load & cache phía client để tối ưu hoá I/O.
- ✅ Task 4: Bổ sung endpoint `GET /api/quests/:id` cho backend và sửa lỗi thiếu endpoint chi tiết Quest; tích hợp kiểm tra Stamina trước khi bắt đầu bài học.
- ✅ Task 5: Viết và chạy thành công 63/63 test cases trong dự án.

### File List
```
frontend/App.js                          [MODIFIED] - Đăng ký màn hình Quiz
frontend/src/screens/QuestDetailScreen.js [MODIFIED] - Thêm kiểm tra Stamina và điều hướng sang Quiz
frontend/src/screens/QuizScreen.js       [NEW]      - Màn hình trắc nghiệm học tập & Giải thích 3 tầng
frontend/src/screens/QuizScreen.test.js  [NEW]      - Bộ kiểm thử unit test cho QuizScreen
backend/src/api/quest.js                 [MODIFIED] - Bổ sung endpoint GET /api/quests/:id
backend/tests/quest.test.js              [MODIFIED] - Bổ sung kiểm thử cho GET /api/quests/:id
```
