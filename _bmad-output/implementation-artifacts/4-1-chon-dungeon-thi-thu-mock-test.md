# Story 4.1: Chọn Dungeon thi thử (Mock Test Selection)

Status: review

## Story

As a người học,
I want vào sảnh chọn bài thi thử Mock Test,
so that I can prepare for an official test simulation.

## Acceptance Criteria

1. **Test Mode Selection:** Cho phép chọn giữa Mini Mock Test (100 câu) hoặc Full Mock Test (200 câu).
2. **Resume Modal Prompt:** Nếu có bài thi dở dang trong 24 giờ qua, hiển thị Modal cho phép khôi phục tiến trình cũ.
3. **Warning & Strict Mode:** Báo trước về tính chất 2 giờ thi nghiêm túc, khoá thanh điều hướng và nút back sau khi bấm bắt đầu làm bài.

## Proposed Changes

- Frontend: [DungeonSelectionScreen.js](file:///c:/CuongPH/02-bmad-toeic_quest_rpg_hub/frontend/src/screens/DungeonSelectionScreen.js)
- Routing: [App.js](file:///c:/CuongPH/02-bmad-toeic_quest_rpg_hub/frontend/App.js)

## Dev Agent Record

### Agent Model Used

Antigravity (Claude Sonnet) — 2026-06-30

### Debug Log References

- UI verification screenshot: `dungeon_selection_2_1782805067819.png`
- Warning Modal overlay: `dungeon_warning_modal_2_1782805079629.png`
