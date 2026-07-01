# Story 4.2: Thi Dungeon & Tự động lưu nháp (Checkpoint Auto-Save)

Status: review

## Story

As a người thi,
I want hệ thống tự động lưu nháp câu trả lời của tôi lên cơ sở dữ liệu định kỳ,
so that I do not lose progress if my device crashes or connection drops.

## Acceptance Criteria

1. **Auto-save Checkpoint:** Tự động gửi API `POST /api/dungeons/checkpoint` mỗi khi người dùng làm được thêm 10 câu mới.
2. **Resume answers:** Tải lại toàn bộ các câu trả lời nháp từ DB lên giao diện khi tiếp tục.
3. **Timer countdown:** Đếm ngược 60 phút (Mini) hoặc 120 phút (Full) và tự động nộp bài khi hết giờ.

## Proposed Changes

- Frontend: [DungeonExamScreen.js](file:///c:/CuongPH/02-bmad-toeic_quest_rpg_hub/frontend/src/screens/DungeonExamScreen.js)
- Backend: [dungeon.js](file:///c:/CuongPH/02-bmad-toeic_quest_rpg_hub/backend/src/api/dungeon.js)

## Dev Agent Record

### Agent Model Used

Antigravity (Claude Sonnet) — 2026-06-30

### Debug Log References

- Mock checkActiveSession & auto-save test pass logs.
- UI screenshot: `dungeon_exam_screen_2_1782805093313.png`
