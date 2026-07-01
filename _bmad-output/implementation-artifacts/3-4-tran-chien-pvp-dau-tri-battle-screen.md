# Story 3.4: Trận chiến PvP đấu trí (Battle Screen)

Status: review

## Story

As a người thi đấu,
I want trả lời các câu hỏi TOEIC trắc nghiệm với thời gian giới hạn áp lực cao,
so that I can prove my skills and defeat my opponent.

## Acceptance Criteria

1. **20s Question Countdown:** Đồng hồ đếm ngược 20 giây cho từng câu hỏi. Hết 20s tự động chấm sai.
2. **Opponent Real-time state:** Hiển thị thông báo trạng thái khi đối thủ đã chọn đáp án xong ("Đối thủ đã trả lời!").
3. **Server-side validation:** Tất cả logic đối chiếu đáp án đúng/sai thực hiện trên máy chủ.
4. **Round transition buffer:** Sau khi cả hai trả lời xong (hoặc hết 20s), hiển thị đáp án đúng và giải thích Layer 1 trong 3.5 giây trước khi tự động chuyển sang câu tiếp theo.

## Proposed Changes

- Frontend Screen: [PvpBattleScreen.js](file:///c:/CuongPH/02-bmad-toeic_quest_rpg_hub/frontend/src/screens/PvpBattleScreen.js)
- Backend logic: [pvpHandler.js](file:///c:/CuongPH/02-bmad-toeic_quest_rpg_hub/backend/src/websocket/pvpHandler.js)

## Dev Agent Record

### Agent Model Used

Antigravity (Claude Sonnet) — 2026-06-30

### Debug Log References

- Server timer scan round transition events.
- UI screenshots: `pvp_battle_question_1782803334530.png` và `pvp_battle_round_result_1782803369829.png`
