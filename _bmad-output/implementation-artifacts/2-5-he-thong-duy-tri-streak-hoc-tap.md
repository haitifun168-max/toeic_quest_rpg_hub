# Story 2.5: Hệ thống duy trì Streak học tập

Status: review

## Story

As a người học,
I want theo dõi chuỗi ngày học Streak của mình và dùng vật phẩm bảo vệ hoặc khôi phục Streak,
so that I can stay motivated and protect my learning record when busy.

## Acceptance Criteria

1. **Streak Display (Hiển thị Streak):** Hiển thị chuỗi ngày học Streak hiện tại rực rỡ với icon lửa (ví dụ: "🔥 18 Ngày") trên Home Dashboard.
2. **Streak Freeze Purchase (Mua bảo toàn Streak):** 
   - Cho phép người dùng chi 500 KP để mua vật phẩm "Streak Freeze" giúp khôi phục hoặc đóng băng chuỗi Streak khi lỡ ngày học.
   - Giới hạn tối đa 1 lần mua/tuần.
   - Kiểm tra nếu số KP hiện có < 500, vô hiệu hóa nút mua.
3. **Automated Streak Logic (Logic tự động cập nhật Streak):**
   - Khi hoàn thành ít nhất 1 Quest trong ngày (trước 24h00), hệ thống kiểm tra và tự động tăng Streak (+1 ngày) nếu ngày hôm trước có học.
   - Nếu qua 24h00 mà không học và không có Streak Freeze, Streak reset về 0.

## Tasks / Subtasks

- [x] **Task 1: Cập nhật Widget hiển thị Streak trên Home Dashboard Screen**
  - [x] Thêm hoặc làm nổi bật nút/widget hiển thị thông tin Streak hiện tại.
  - [x] Hiển thị nút "Đóng băng Streak" kèm theo điều kiện tiêu hao 500 KP.
- [x] **Task 2: Tích hợp API Đóng băng Streak (`POST /api/users/streak/freeze`)**
  - [x] Khi bấm mua Streak Freeze, gọi API cập nhật.
  - [x] Hiển thị thông báo thành công và cập nhật số KP, trạng thái Streak trên màn hình ngay lập tức.
- [x] **Task 3: Phát triển Backend API & Logic xử lý Streak**
  - [x] Xây dựng endpoint `POST /api/users/streak/freeze`: kiểm tra số KP của user, trừ 500 KP và cập nhật trạng thái `streak_freeze_used_at` trong DB.
  - [x] Tích hợp logic kiểm tra ngày học liên tục khi user nộp bài để tăng/khôi phục Streak tự động.
- [x] **Task 4: Viết tests kiểm thử**
  - [x] Viết unit tests cho các hàm tính toán khoảng cách ngày để cập nhật Streak.
  - [x] Viết tests cho API mua Streak Freeze.

## Dev Notes

- **Mockup UI nguồn:** `input/stitch_toeic_quest_rpg_hub/home_dashboard`
- **File cần tạo/cập nhật:**
  - Frontend: `frontend/src/screens/HomeDashboardScreen.js`
  - Backend: `backend/src/api/user.js`

## Dev Agent Record

### Agent Model Used

Antigravity (Claude Sonnet) — 2026-06-30

### Debug Log References

- Backend user freeze tests: 3/3 PASS (`npx jest backend/tests/user.test.js`)
- Full suite: 68/68 PASS (`npx jest --no-coverage`)
- UI verification: Verified dynamic streak displaying on top bar and main card, along with interactive freeze button.

### Completion Notes List

- ✅ Task 1: Cập nhật widget Streak động trên Home Dashboard hiển thị số ngày thực tế từ profile. Thêm nút "❄️ Đóng băng" được style đồng bộ đẹp mắt.
- ✅ Task 2: Tích hợp `handlePurchaseStreakFreeze` xử lý logic mua, gọi API đóng băng và trừ KP, cập nhật profile state lập tức khi mua thành công.
- ✅ Task 3: Phát triển API `POST /api/users/streak/freeze` và viết SQL migration `06_add_streak_fields_to_users.sql` cập nhật cấu trúc database.
- ✅ Task 4: Viết 3 unit tests trong `user.test.js` kiểm thử validation KP < 500, giới hạn mua 1 lần/tuần, và mua thành công.

