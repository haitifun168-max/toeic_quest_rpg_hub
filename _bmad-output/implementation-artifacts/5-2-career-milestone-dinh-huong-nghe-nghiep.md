# Story 5.2: Định hướng nghề nghiệp (Career Milestones)

Status: review

## Story

As a học viên,
I want xem bản đồ lộ trình nghề nghiệp và danh sách tuyển dụng thực tế tương ứng với điểm Estimated TOEIC score hiện tại,
so that I can see the real-world value of my language learning efforts.

## Acceptance Criteria

1. **TOEIC Career Tree Map:** Hiển thị lộ trình cột mốc (Novice 450, Associate 650, Specialist 800, Leader 850+) dưới dạng skill tree.
2. **Job vacancies recommendation:** Đọc điểm Estimated TOEIC cao nhất từ các kỳ thi thử Dungeon để lọc ra các tin tuyển dụng Shopee, FPT, VNG tương thích.
3. **ProgressBar Target:** Hiển thị thanh tiến trình trực quan dẫn đến điểm TOEIC mục tiêu của mốc tiếp theo.

## Proposed Changes

- Frontend Screen: [CareerMilestonesScreen.js](file:///c:/CuongPH/02-bmad-toeic_quest_rpg_hub/frontend/src/screens/CareerMilestonesScreen.js)
- Backend Router: [user.js](file:///c:/CuongPH/02-bmad-toeic_quest_rpg_hub/backend/src/api/user.js)
- SQL Seeder: [09_add_career_milestones.sql](file:///c:/CuongPH/02-bmad-toeic_quest_rpg_hub/backend/src/db/migrations/09_add_career_milestones.sql)

## Dev Agent Record

### Agent Model Used

Antigravity (Claude Sonnet) — 2026-06-30

### Debug Log References

- Real-time job filtering REST tests passed.
- UI screenshot: `career_milestones_1782806933866.png`
