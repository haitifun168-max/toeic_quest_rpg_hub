# Story 3.1: Sảnh chờ PvP (Lobby ELO)

Status: review

## Story

As a người học,
I want vào sảnh chờ PvP để theo dõi thông số ELO hiện tại và lịch sử trận đấu của mình,
so that I can decide when to participate in ranked matching.

## Acceptance Criteria

1. **ELO & League Display:** Hiển thị điểm ELO hiện tại và phân loại League tương ứng (Ví dụ: 1120 ELO -> Hạng Vàng II).
2. **Rank Requirement Check:** Chỉ cho phép người dùng có Rank ≥ 2 tham gia đấu trường PvP Ranked. Vô hiệu hóa nút tìm trận nếu Rank < 2.
3. **Stamina Check:** Hiển thị số lượng Stamina hiện có (Ví dụ: `14/15`). Nếu Stamina = 0, vô hiệu hóa nút tìm trận và báo lỗi.
4. **Lịch sử trận đấu:** Hiển thị tối đa 3 trận đấu gần nhất gồm: Tên đối thủ, kết quả Thắng/Thua, tỉ số chung cuộc và biến động ELO.

## Proposed Changes

- Frontend: [PvpLobbyScreen.js](file:///c:/CuongPH/02-bmad-toeic_quest_rpg_hub/frontend/src/screens/PvpLobbyScreen.js)
- Backend: [pvp.js](file:///c:/CuongPH/02-bmad-toeic_quest_rpg_hub/backend/src/api/pvp.js)

## Dev Agent Record

### Agent Model Used

Antigravity (Claude Sonnet) — 2026-06-30

### Debug Log References

- REST API test: `npx jest backend/tests/pvp.test.js` (3/3 PASS)
- UI screenshots: `pvp_lobby_1782803304960.png`
