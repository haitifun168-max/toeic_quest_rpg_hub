---
baseline_commit: NO_VCS
---

# Story 2.2: Chọn nhiệm vụ học tập (Quest Selection)

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a người học,
I want mở danh sách nhiệm vụ chi tiết để chọn học phần phù hợp,
so that I can focus on the most relevant daily quests.

## Acceptance Criteria

1. **Bottom Sheet UI (Giao diện Bottom Sheet):** Khi người dùng nhấn widget "NHIỆM VỤ HÔM NAY" hoặc vùng nhiệm vụ trên Home Dashboard, một Bottom Sheet trượt lên hiển thị 3 nhiệm vụ cốt lõi của ngày. (AC: #1)
2. **Quest Details (Thông tin chi tiết nhiệm vụ):** Mỗi thẻ nhiệm vụ trong Bottom Sheet hiển thị tiêu đề, thời gian ước lượng (ví dụ: "15 phút") và KP thưởng tương ứng (ví dụ: "+100 KP"). (AC: #2)
3. **Selection Interaction (Tương tác lựa chọn):** Nhấn vào một thẻ nhiệm vụ trong Bottom Sheet sẽ làm nổi bật nó và tự động điều hướng sang màn hình chi tiết nhiệm vụ `QuestDetailScreen` tương ứng (hoặc đóng sheet và chuyển hướng). (AC: #3)
4. **Design (Thiết kế):** Giao diện phải tuân thủ phong cách Glassmorphism nền tối cao cấp HSL khớp với mockup tại `input/stitch_toeic_quest_rpg_hub/daily_quest_selection` và `quest_selection_sheet`. (AC: #4)
5. **Cross-Platform Integration:** Component Bottom Sheet cần hoạt động mượt mà, hỗ trợ Safe Area và responsive trên cả iOS, Android và trình duyệt Web. (AC: #5)
6. **No Backend Change (Không thay đổi Backend):** Dữ liệu nhiệm vụ được kế thừa từ API hiện có `/api/quests/daily`. (AC: #6)

## Tasks / Subtasks

- [x] **Task 1: Xây dựng Component Bottom Sheet lựa chọn nhiệm vụ (QuestSelectionSheet)** (AC: #1, #2, #4)
  - [x] Thiết kế Bottom Sheet dạng modal trượt từ dưới lên sử dụng `react-native-modal` hoặc React Native `Modal` tiêu chuẩn (đảm bảo hoạt động tốt trên Web).
  - [x] Lập trình các item hiển thị tiêu đề, thời gian ước lượng và KP thưởng của từng Quest.
  - [x] Áp dụng style Glassmorphism (nền mờ rgba, viền mờ, chữ sáng trên nền tối).
- [x] **Task 2: Tích hợp sự kiện tương tác và điều hướng** (AC: #3)
  - [x] Khi click vào widget "ΝHIỆM VỤ HÔM NAY" ở `HomeDashboardScreen`, gọi hàm mở Bottom Sheet.
  - [x] Khi click vào một Quest Item trong Bottom Sheet, gọi prop `onSelect` truyền thông tin Quest để chuyển sang màn hình `QuestDetailScreen` với tham số `questId`.
- [x] **Task 3: Kiểm thử thủ công trên môi trường Web** (AC: #5)
  - [x] Chạy server phát triển và kiểm tra việc đóng/mở Bottom Sheet mượt mà trên Chrome/Edge.
  - [x] Xác nhận giao diện hiển thị đúng chữ, không lỗi lệch vị trí trên kích cỡ màn hình khác nhau.

## Dev Notes

- **Mockup UI nguồn:**
  - Thiết kế nằm tại: [daily_quest_selection](file:///c:/CuongPH/02-bmad-toeic_quest_rpg_hub/input/stitch_toeic_quest_rpg_hub/daily_quest_selection) và [quest_selection_sheet](file:///c:/CuongPH/02-bmad-toeic_quest_rpg_hub/input/stitch_toeic_quest_rpg_hub/quest_selection_sheet)
- **Cấu trúc source code:**
  - Component sẽ được khai báo tại file mới hoặc cập nhật file hiện tại: `frontend/src/components/QuestSelectionSheet.js` (nếu đã có) hoặc tích hợp trực tiếp.
  - Điều hướng: `App.js` đã hỗ trợ định nghĩa màn hình `QuestDetailScreen`.
  - API dữ liệu: Không cần viết endpoint mới. Component sẽ nhận dữ liệu `quests` truyền trực tiếp từ state `quests` của `HomeDashboardScreen.js` (dữ liệu được lấy từ `/api/quests/daily`).

### Project Structure Notes

- Giao diện và logic của Client React Native đặt hoàn toàn trong thư mục `frontend/`.
- Quản lý các file component tái sử dụng trong `frontend/src/components/`.

### References

- [Source: epics-and-stories.md#2-2-chon-nhiem-vu-hoc-tap-quest-selection](file:///c:/CuongPH/02-bmad-toeic_quest_rpg_hub/_bmad-output/planning-artifacts/epics-and-stories.md#L61)
- [Source: HomeDashboardScreen.js](file:///c:/CuongPH/02-bmad-toeic_quest_rpg_hub/frontend/src/screens/HomeDashboardScreen.js)

## Dev Agent Record

### Agent Model Used

Antigravity (Claude Sonnet) — 2026-06-29

### Debug Log References

- Static analysis: 15/15 patterns verified PASS
- Unit tests: 17/17 PASS (`npx jest frontend/src/components/QuestSelectionSheet.test.js`)
- Regression: 36/36 backend tests PASS (`npx jest backend/tests/`)
- Manual Web test: Bottom Sheet opens, Glassmorphism style đúng, empty state hoạt động, 0 JS errors

### Completion Notes List

- ✅ Task 1 (AC#1, #2, #4): Nâng cấp `QuestSelectionSheet.js` — Glassmorphism HSL `hsl(240,20%,11%)`, drag handle, close button, accent color theo quest type, highlight state, empty state, accessibility labels, Safe Area insets. **Chuyển từ `react-native-modal` sang React Native built-in `Modal` + `Animated.timing` tự làm để tương thích React 19 (fix `element.ref` error).** Platform-aware shadow/boxShadow.
- ✅ Task 2 (AC#3, #5): Cập nhật `App.js` với `NavigationContainer` + `createNativeStackNavigator`, thêm screen `QuestDetail` để `navigation.navigate('QuestDetail', {questId})` hoạt động. Fix bug `Platform` chưa import trong `QuestDetailScreen.js`.
- ✅ Task 3 (AC#5): Web test thành công trên Expo dev server http://localhost:8081 — Bottom Sheet mở/đóng mượt, giao diện đúng design.
- ✅ AC#6: Không tạo endpoint mới — `QuestSelectionSheet` nhận `quests` qua props từ `HomeDashboardScreen` state (dữ liệu từ `/api/quests/daily`).

### File List

```
frontend/src/components/QuestSelectionSheet.js   [MODIFIED] — Nâng cấp toàn diện Glassmorphism + Safe Area
frontend/src/components/QuestSelectionSheet.test.js  [NEW] — 17 unit tests
frontend/App.js  [MODIFIED] — NavigationContainer + NativeStack với QuestDetail screen
frontend/src/screens/QuestDetailScreen.js  [MODIFIED] — Fix Platform import bug
```
