# Story 3.2: Ghép cặp đối thủ (Matchmaking Service)

Status: review

## Story

As a người học,
I want hệ thống tự động ghép cặp thi đấu với đối thủ có cùng mức trình độ ELO,
so that I can play balanced competitive matches.

## Acceptance Criteria

1. **ELO Match Range:** Tìm kiếm đối thủ trong phạm vi chênh lệch ELO ±100.
2. **Abstractions:** Hỗ trợ song song In-memory queue sắp xếp theo ELO và Redis ZSET khi có biến môi trường `USE_REDIS=true`.
3. **Bot Fallback Timeout:** Đếm ngược tối đa 15 giây. Nếu sau 15s không có đối thủ thật, tự động ghép với BOT mô phỏng (ELO gần tương đương) để bắt đầu trận đấu ngay lập tức.

## Proposed Changes

- Backend Service: [matchmaking.js](file:///c:/CuongPH/02-bmad-toeic_quest_rpg_hub/backend/src/services/matchmaking.js)
- Frontend Screen: [PvpMatchmakingScreen.js](file:///c:/CuongPH/02-bmad-toeic_quest_rpg_hub/frontend/src/screens/PvpMatchmakingScreen.js)

## Dev Agent Record

### Agent Model Used

Antigravity (Claude Sonnet) — 2026-06-30

### Debug Log References

- Queue scan logs: Match found successfully log prints.
- UI verification: `pvp_matchmaking_1782803321916.png`
