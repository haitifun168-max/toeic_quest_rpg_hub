# Story 4.3: Kết quả Dungeon & Phân tích IRT (Simulated TOEIC Score)

Status: review

## Story

As a người thi,
I want xem điểm TOEIC quy đổi ước lượng và biểu đồ phân tích năng lực chi tiết sau khi nộp bài,
so that I can understand my strengths and weaknesses.

## Acceptance Criteria

1. **Estimated TOEIC Score:** Tính toán điểm số từ 10 đến 990 làm tròn chia hết cho 5 tương tự thang điểm thi thật.
2. **AI Mentor Insights:** Trả về danh sách gợi ý ôn luyện chi tiết dựa trên những chủ điểm ngữ pháp bị làm sai nhiều nhất.
3. **Stamina & KP rewards:** Cộng điểm thưởng KP lớn dựa trên tổng số câu đúng (`correct_count * 10 + 200 KP`).

## Proposed Changes

- Frontend: [DungeonResultScreen.js](file:///c:/CuongPH/02-bmad-toeic_quest_rpg_hub/frontend/src/screens/DungeonResultScreen.js)
- Backend logic: [dungeon.js](file:///c:/CuongPH/02-bmad-toeic_quest_rpg_hub/backend/src/api/dungeon.js)

## Dev Agent Record

### Agent Model Used

Antigravity (Claude Sonnet) — 2026-06-30

### Debug Log References

- REST submission grading test suite PASS.
