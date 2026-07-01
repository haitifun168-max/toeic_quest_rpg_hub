# Story 5.1: Hoạt họa Lễ thăng hạng (Rank-up Ceremony)

Status: review

## Story

As a người học,
I want xem màn hình Lễ thăng hạng hoành tráng khi đạt đủ điểm KP tích lũy,
so that I can celebrate my learning milestones and see my new privileges.

## Acceptance Criteria

1. **Rank Up Check:** Tự động gọi API check-rank sau khi hoàn thành nhiệm vụ để kiểm tra thăng hạng.
2. **Upgrade Showcase:** Hiển thị Huy hiệu Rank cũ chuyển dịch mượt mà và xoay 3D sang Huy hiệu Rank mới lấp lánh.
3. **Privilege List:** Hiển thị danh sách các tính năng được mở khóa tương ứng với cấp rank mới (Ví dụ: đấu PvP Ranked ở Rank 2).
4. **Rank Bonus:** Thưởng nóng +200 KP khi thăng hạng thành công.

## Proposed Changes

- Frontend: [RankUpCeremonyScreen.js](file:///c:/CuongPH/02-bmad-toeic_quest_rpg_hub/frontend/src/screens/RankUpCeremonyScreen.js)
- Core Logic: [HomeDashboardScreen.js](file:///c:/CuongPH/02-bmad-toeic_quest_rpg_hub/frontend/src/screens/HomeDashboardScreen.js)

## Dev Agent Record

### Agent Model Used

Antigravity (Claude Sonnet) — 2026-06-30

### Debug Log References

- API check-rank unit test PASS.
