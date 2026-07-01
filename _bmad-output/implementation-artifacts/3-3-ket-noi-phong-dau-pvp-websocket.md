# Story 3.3: Kết nối phòng đấu PvP WebSocket

Status: review

## Story

As a người thi đấu,
I want tham gia vào phòng đấu đồng bộ hóa thời gian thực thông qua kết nối WebSocket,
so that I can play concurrently against my opponent.

## Acceptance Criteria

1. **Pre-match countdown:** Hiển thị 5 giây pre-match countdown giới thiệu thông số Avatar, ELO và tên hiển thị của hai người chơi.
2. **Reconnection Grace Period:** Nếu một bên mất kết nối WebSocket, phòng đấu được lưu tạm trong 15 giây. Nếu reconnect thành công trong 15s, người chơi tiếp tục chơi tiếp. Quá 15s xử thua forfeit cuộc.

## Proposed Changes

- Backend Gateway: [pvpHandler.js](file:///c:/CuongPH/02-bmad-toeic_quest_rpg_hub/backend/src/websocket/pvpHandler.js)
- Entry point: [server.js](file:///c:/CuongPH/02-bmad-toeic_quest_rpg_hub/backend/src/server.js)

## Dev Agent Record

### Agent Model Used

Antigravity (Claude Sonnet) — 2026-06-30

### Debug Log References

- Sockets room mapping active registration tests.
