# Story 3.5: Bảng kết quả PvP (Victory & Consolation)

Status: review

## Story

As a người thi đấu,
I want xem thống kê kết quả thắng/thua, KP nhận được và biến động ELO sau khi trận đấu kết thúc,
so that I can see my progress.

## Acceptance Criteria

1. **Victory rewards:** Nếu Thắng, cộng ELO xếp hạng (ví dụ: +24 ELO), thưởng nóng +300 KP.
2. **Consolation rewards:** Nếu Thua, trừ nhẹ ELO (ví dụ: -8 ELO, cam kết không âm dưới 0), thưởng điểm an ủi +50 KP động viên.
3. **Stamina deduction:** Cả hai bên đều bị trừ 1 Stamina sau trận đấu kết thúc.
4. **DB history sync:** Lưu log thông tin trận đấu vào bảng `battle_sessions` PostgreSQL.

## Proposed Changes

- Frontend Screen: [PvpResultScreen.js](file:///c:/CuongPH/02-bmad-toeic_quest_rpg_hub/frontend/src/screens/PvpResultScreen.js)
- Backend adjustment: [pvpHandler.js](file:///c:/CuongPH/02-bmad-toeic_quest_rpg_hub/backend/src/websocket/pvpHandler.js)

## Dev Agent Record

### Agent Model Used

Antigravity (Claude Sonnet) — 2026-06-30

### Debug Log References

- ELO probability calculator functions tested and verify min ELO clamps to >= 0.
