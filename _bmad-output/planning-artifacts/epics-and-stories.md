# DANH SÁCH EPICS VÀ USER STORIES — TOEIC QUEST RPG HUB

Tài liệu này phân rã các yêu cầu sản phẩm từ [prd.md](file:///c:/CuongPH/02-bmad-toeic_quest_rpg_hub/_bmad-output/planning-artifacts/prds/prd-02-bmad-toeic_quest_rpg_hub-2026-06-23/prd.md) và các ràng buộc kỹ thuật của [ARCHITECTURE-SPINE.md](file:///c:/CuongPH/02-bmad-toeic_quest_rpg_hub/_bmad-output/planning-artifacts/architecture/architecture-02-bmad-toeic_quest_rpg_hub-2026-06-23/ARCHITECTURE-SPINE.md) thành 5 Epics và 20 User Stories chi tiết theo chuẩn BMad.

---

## 🗺️ Epic 1: Onboarding, Authentication & Profile (🌱)

### 1-1-dang-ky-dang-nhap-tai-khoan-oauth2-bcrypt
*   **Mô tả:** Là một người học mới, tôi muốn đăng ký tài khoản nhanh chóng qua Google/Facebook/Email để lưu trữ tiến trình học lâu dài.
*   **Liên kết UI:** [input/stitch_toeic_quest_rpg_hub/auth_screen](file:///c:/CuongPH/02-bmad-toeic_quest_rpg_hub/input/stitch_toeic_quest_rpg_hub/auth_screen)
*   **Ràng buộc:** `AD-8 (OAuth2 & Mã hóa mật khẩu bcrypt)`
*   **Acceptance Criteria (AC):**
    1.  Cho phép bấm nút liên kết OAuth2 của Google/Facebook.
    2.  Nếu đăng ký qua Email, mật khẩu bắt buộc có tối thiểu 8 ký tự, 1 chữ hoa, 1 ký tự đặc biệt. Mật khẩu phải được băm qua bcrypt trước khi lưu vào PostgreSQL.

### 1-2-dat-muc-tieu-hoc-tap-goal-setting
*   **Mô tả:** Là một người học mới, tôi muốn chọn mức điểm TOEIC đích và thời hạn hoàn thành để cá nhân hóa lộ trình.
*   **Liên kết UI:** [input/stitch_toeic_quest_rpg_hub/goal_setting_1](file:///c:/CuongPH/02-bmad-toeic_quest_rpg_hub/input/stitch_toeic_quest_rpg_hub/goal_setting_1) và [goal_setting_2](file:///c:/CuongPH/02-bmad-toeic_quest_rpg_hub/input/stitch_toeic_quest_rpg_hub/goal_setting_2)
*   **Ràng buộc:** `FR-1`
*   **Acceptance Criteria (AC):**
    1.  Cung cấp 6 thẻ lựa chọn điểm số (300/450/600/750/850/900+).
    2.  Hiển thị đúng ngày thi dự kiến tương ứng khi chọn thời gian (1/3/6/12 tháng).

### 1-3-lam-bai-kiem-tra-dau-vao-placement-test
*   **Mô tả:** Là một người học mới, tôi muốn làm bài kiểm tra nhanh 10 câu để xác định trình độ xuất phát điểm.
*   **Liên kết UI:** [input/stitch_toeic_quest_rpg_hub/placement_test_quiz](file:///c:/CuongPH/02-bmad-toeic_quest_rpg_hub/input/stitch_toeic_quest_rpg_hub/placement_test_quiz)
*   **Ràng buộc:** `FR-2`, `AD-3 (Server-side validation)`
*   **Acceptance Criteria (AC):**
    1.  Hiển thị bộ đếm thời gian ngược 5 phút. Khi hết giờ tự động nộp bài.
    2.  Mọi đáp án chọn của người học phải được gửi lên server xác thực, không lưu logic chấm điểm ở client.

### 1-4-xep-rank-ban-dau-chon-avatar
*   **Mô tả:** Là một người học mới, tôi muốn xem điểm số TOEIC ước tính của mình, Rank ban đầu được cấp và chọn Avatar đại diện.
*   **Liên kết UI:** [input/stitch_toeic_quest_rpg_hub/placement_result_character](file:///c:/CuongPH/02-bmad-toeic_quest_rpg_hub/input/stitch_toeic_quest_rpg_hub/placement_result_character)
*   **Ràng buộc:** `FR-3`, `AD-1 (PostgreSQL DB)`
*   **Acceptance Criteria (AC):**
    1.  Hiển thị Sim Score quy đổi từ Theta score của 10 câu Placement Test.
    2.  Hiển thị 6 lựa chọn hình ảnh Avatar RPG và cho phép đặt tên nhân vật.

### 1-5-ho-so-nhan-vat-character-profile
*   **Mô tả:** Là một người học, tôi muốn xem hồ sơ nhân vật của mình hiển thị 6 chỉ số Stats năng lực thực tế.
*   **Liên kết UI:** [input/stitch_toeic_quest_rpg_hub/character_profile](file:///c:/CuongPH/02-bmad-toeic_quest_rpg_hub/input/stitch_toeic_quest_rpg_hub/character_profile)
*   **Ràng buộc:** `FR-20`
*   **Acceptance Criteria (AC):**
    1.  Hiển thị 6 chỉ số: *Grammar Power, Reading Speed, Listening Reflex, Vocabulary Bank, Error Pattern IQ, Stamina*.
    2.  Hiển thị Rank Badge hiện tại và số lượng KP tích lũy.

---

## 📖 Epic 2: Daily Quest & Learning Engine (📖)

### 2-1-dashboard-nhiem-vu-hang-ngay-daily-quest
*   **Mô tả:** Là một người học, tôi muốn truy cập Home Dashboard để thấy danh sách 3 nhiệm vụ học tập hôm nay.
*   **Liên kết UI:** [input/stitch_toeic_quest_rpg_hub/home_dashboard](file:///c:/CuongPH/02-bmad-toeic_quest_rpg_hub/input/stitch_toeic_quest_rpg_hub/home_dashboard)
*   **Ràng buộc:** `FR-4`, `AD-6 (Daily Stamina limit)`
*   **Acceptance Criteria (AC):**
    1.  Tải đúng 3 nhiệm vụ được cá nhân hóa từ PostgreSQL.
    2.  Hiển thị thanh chỉ số Stamina hiện tại của người dùng. Nếu Stamina = 0, hiển thị thông báo khóa nút PvP.

### 2-2-chon-nhiem-vu-hoc-tap-quest-selection
*   **Mô tả:** Là một người học, tôi muốn mở danh sách nhiệm vụ chi tiết để chọn học phần phù hợp.
*   **Liên kết UI:** [input/stitch_toeic_quest_rpg_hub/daily_quest_selection](file:///c:/CuongPH/02-bmad-toeic_quest_rpg_hub/input/stitch_toeic_quest_rpg_hub/daily_quest_selection) và [quest_selection_sheet](file:///c:/CuongPH/02-bmad-toeic_quest_rpg_hub/input/stitch_toeic_quest_rpg_hub/quest_selection_sheet)
*   **Ràng buộc:** `FR-4`
*   **Acceptance Criteria (AC):**
    1.  Màn hình Bottom Sheet trượt lên hiển thị thông tin 3 quest cốt lõi.
    2.  Hiển thị ước lượng thời gian và số KP thưởng cho mỗi quest.

### 2-3-giao-dien-hoc-quiz-giai-thich-3-tang
*   **Mô tả:** Là một người học, tôi muốn trả lời câu hỏi trắc nghiệm, nhận phản hồi đúng/sai tức thì và xem giải thích 3 tầng tương ứng.
*   **Liên kết UI:** [input/stitch_toeic_quest_rpg_hub/quiz_screen_grammar](file:///c:/CuongPH/02-bmad-toeic_quest_rpg_hub/input/stitch_toeic_quest_rpg_hub/quiz_screen_grammar), [micro_feedback_correct_1](file:///c:/CuongPH/02-bmad-toeic_quest_rpg_hub/input/stitch_toeic_quest_rpg_hub/micro_feedback_correct_1), [micro_feedback_incorrect](file:///c:/CuongPH/02-bmad-toeic_quest_rpg_hub/input/stitch_toeic_quest_rpg_hub/micro_feedback_incorrect)
*   **Ràng buộc:** `FR-8`, `FR-9`, `AD-5 (Pre-generated explanation)`
*   **Acceptance Criteria (AC):**
    1.  Micro-feedback phải phản hồi trong thời gian ≤ 2 giây (Hiệu ứng Confetti/Nền xanh khi Đúng, Nền đỏ khi Sai).
    2.  Giải thích 3 tầng hiển thị dạng Accordion mượt mà, chỉ tải thông tin Tầng 2 & 3 khi có tương tác người dùng.

### 2-4-tong-ket-phien-hoc-session-summary
*   **Mô tả:** Là một người học, tôi muốn xem bảng tổng kết sau khi hoàn thành một Quest để kiểm tra số KP nhận được và phân tích lỗi sai của AI.
*   **Liên kết UI:** [input/stitch_toeic_quest_rpg_hub/session_summary_1](file:///c:/CuongPH/02-bmad-toeic_quest_rpg_hub/input/stitch_toeic_quest_rpg_hub/session_summary_1) và [session_summary_2](file:///c:/CuongPH/02-bmad-toeic_quest_rpg_hub/input/stitch_toeic_quest_rpg_hub/session_summary_2)
*   **Ràng buộc:** `FR-10`
*   **Acceptance Criteria (AC):**
    1.  Hiển thị tỷ lệ trả lời đúng/sai và tổng số KP nhận được.
    2.  Hiển thị 3 lỗi sai/chủ điểm ngữ pháp yếu được AI Mentor lọc ra.

### 2-5-he-thong-duy-tri-streak-hoc-tap
*   **Mô tả:** Là một người học, tôi muốn theo dõi chuỗi ngày học Streak của mình và dùng vật phẩm bảo vệ hoặc khôi phục Streak.
*   **Liên kết UI:** [input/stitch_toeic_quest_rpg_hub/home_dashboard](file:///c:/CuongPH/02-bmad-toeic_quest_rpg_hub/input/stitch_toeic_quest_rpg_hub/home_dashboard)
*   **Ràng buộc:** `FR-6`, `FR-7`
*   **Acceptance Criteria (AC):**
    1.  Cộng 1 vào Streak khi hoàn thành ít nhất 1 Quest trong ngày (trước 24h).
    2.  Cho phép dùng 500 KP để kích hoạt Streak Freeze khi lỡ ngày học (Giới hạn tối đa 1 lần/tuần).

---

## ⚔️ Epic 3: PvP Battle Mode (⚔️)

### 3-1-sanh-cho-pvp-lobby-elo
*   **Mô tả:** Là một người học, tôi muốn truy cập sảnh PvP để xem điểm ELO hiện tại và chọn chế độ thi đấu.
*   **Liên kết UI:** [input/stitch_toeic_quest_rpg_hub/pvp_battle_lobby](file:///c:/CuongPH/02-bmad-toeic_quest_rpg_hub/input/stitch_toeic_quest_rpg_hub/pvp_battle_lobby)
*   **Ràng buộc:** `FR-11`
*   **Acceptance Criteria (AC):**
    1.  Hiển thị điểm ELO xếp hạng hiện tại và thống kê lịch sử 3 trận đấu gần nhất.
    2.  Chỉ cho phép người dùng có Rank ≥ 2 (Học việc) tham gia đấu Ranked.

### 3-2-ghep-cap-doi-thu-matchmaking-redis
*   **Mô tả:** Là một người học, tôi muốn ghép cặp thi đấu PvP tự động với đối thủ cùng trình độ.
*   **Liên kết UI:** [input/stitch_toeic_quest_rpg_hub/matchmaking_search](file:///c:/CuongPH/02-bmad-toeic_quest_rpg_hub/input/stitch_toeic_quest_rpg_hub/matchmaking_search)
*   **Ràng buộc:** `FR-11`, `AD-4 (Redis queue matchmaking)`
*   **Acceptance Criteria (AC):**
    1.  Hệ thống tìm kiếm đối thủ trong phạm vi ELO ±100 thông qua Redis ZSET.
    2.  Giới hạn thời gian tìm trận tối đa 15 giây, sau 15 giây tự động ghép với BOT mô phỏng.

### 3-3-ket-noi-phong-dau-pvp-websocket
*   **Mô tả:** Là một người thi đấu, tôi muốn tham gia vào phòng đấu thời gian thực có kết nối đồng bộ giữa hai người chơi.
*   **Liên kết UI:** [input/stitch_toeic_quest_rpg_hub/real_time_battle_vs](file:///c:/CuongPH/02-bmad-toeic_quest_rpg_hub/input/stitch_toeic_quest_rpg_hub/real_time_battle_vs)
*   **Ràng buộc:** `FR-12`, `AD-2 (WebSocket scale-out)`
*   **Acceptance Criteria (AC):**
    1.  Hiển thị hoạt họa countdown 5 giây pre-match giới thiệu thông tin hai người chơi.
    2.  Xử lý lỗi kết nối WebSocket: nếu mất kết nối dưới 15 giây, cho phép tự động reconnect và tiếp tục trận đấu.

### 3-4-tran-chien-pvp-dau-tri-battle-screen
*   **Mô tả:** Là một người thi đấu, tôi muốn trả lời 10 câu hỏi thi đấu áp lực cao để giành điểm số chiến thắng trước đối thủ.
*   **Liên kết UI:** [input/stitch_toeic_quest_rpg_hub/real_time_battle_vs](file:///c:/CuongPH/02-bmad-toeic_quest_rpg_hub/input/stitch_toeic_quest_rpg_hub/real_time_battle_vs)
*   **Ràng buộc:** `FR-13`, `AD-3 (Server validation)`
*   **Acceptance Criteria (AC):**
    1.  Hệ thống chạy đồng hồ countdown 20 giây cho mỗi câu hỏi. Hết 20s tự động chấm sai.
    2.  Hiển thị trạng thái phản hồi thời gian thực của đối thủ ("Đối thủ đã trả lời!").
    3.  Tất cả logic tính điểm và kiểm tra đáp án phải thực hiện trên server.

### 3-5-bang-ket-qua-pvp-victory-consolation
*   **Mô tả:** Là một người thi đấu, tôi muốn xem kết quả thắng/thua, số ELO nhận/mất và điểm khuyến khích động lực.
*   **Liên kết UI:** [input/stitch_toeic_quest_rpg_hub/battle_victory_result](file:///c:/CuongPH/02-bmad-toeic_quest_rpg_hub/input/stitch_toeic_quest_rpg_hub/battle_victory_result)
*   **Ràng buộc:** `FR-14`
*   **Acceptance Criteria (AC):**
    1.  **Nếu Thắng:** Cộng ELO (ví dụ: +30 ELO), +300 KP và cơ hội rơi vật phẩm.
    2.  **Nếu Thua:** Trừ nhẹ ELO (ví dụ: -10 ELO), nhưng vẫn cộng Consolation KP (+50 KP) và 1 Insight Point. Không trừ KP chính.

---

## 🏰 Epic 4: Dungeon & Mock Tests (🏰)

### 4-1-chon-dungeon-thi-thu-mock-test
*   **Mô tả:** Là một người học, tôi muốn chọn Dungeon (Mini Mock Test hoặc Full Mock Test 200 câu) và nhận cảnh báo điều kiện phòng thi.
*   **Liên kết UI:** [input/stitch_toeic_quest_rpg_hub/dungeon_entry_warning](file:///c:/CuongPH/02-bmad-toeic_quest_rpg_hub/input/stitch_toeic_quest_rpg_hub/dungeon_entry_warning)
*   **Ràng buộc:** `FR-15`
*   **Acceptance Criteria (AC):**
    1.  Hiển thị cảnh báo: *"Bài thi dài 2 tiếng, không được thoát ngang. Bạn có chắc chắn muốn vào?"*
    2.  Ẩn/vô hiệu hóa nút thoát nhanh trên thiết bị khi đã bấm xác nhận vào Dungeon.

### 4-2-thi-dungeon-tu-dong-luu-nhap-checkpoint
*   **Mô tả:** Là một người thi thử, tôi muốn làm bài thi thử ổn định và không sợ mất tiến trình khi có sự cố mạng.
*   **Liên kết UI:** [input/stitch_toeic_quest_rpg_hub/dungeon_entry_warning](file:///c:/CuongPH/02-bmad-toeic_quest_rpg_hub/input/stitch_toeic_quest_rpg_hub/dungeon_entry_warning)
*   **Ràng buộc:** `FR-16`, `AD-7 (Dungeon Checkpoint)`
*   **Acceptance Criteria (AC):**
    1.  Đồng bộ và lưu trữ (Checkpoint) toàn bộ đáp án đã làm lên PostgreSQL sau mỗi **10 câu hỏi**.
    2.  Nếu người dùng thoát app đột ngột, khi mở lại trong vòng 24 giờ, hệ thống khôi phục bài làm từ checkpoint gần nhất. Quá 24 giờ tự động nộp bài và tính điểm phần đã làm.

### 4-3-ket-qua-dungeon-phan-tich-irt-sim-score
*   **Mô tả:** Là một người học, tôi muốn xem kết quả thi thử TOEIC quy đổi, bảng radar stats cập nhật và phân tích điểm yếu từ AI.
*   **Liên kết UI:** [input/stitch_toeic_quest_rpg_hub/dungeon_result](file:///c:/CuongPH/02-bmad-toeic_quest_rpg_hub/input/stitch_toeic_quest_rpg_hub/dungeon_result)
*   **Ràng buộc:** `FR-17`, `AD-1 (PostgreSQL DB)`
*   **Acceptance Criteria (AC):**
    1.  Chạy thuật toán FastAPI IRT Engine cập nhật hệ số Theta để quy đổi ra điểm Estimated TOEIC Score trên thanh thông tin chính.
    2.  Hiển thị radar 6 stats năng lực được cập nhật mới.

---

## 👑 Epic 5: Rank-up Ceremony & Career Milestones (👑)

### 5-1-hoat-hoa-le-thang-hang-rank-up-ceremony
*   **Mô tả:** Là một người học, tôi muốn trải nghiệm hoạt họa thăng hạng toàn màn hình ấn tượng khi tích lũy đủ điểm KP.
*   **Liên kết UI:** [input/stitch_toeic_quest_rpg_hub/rank_up_ceremony_1](file:///c:/CuongPH/02-bmad-toeic_quest_rpg_hub/input/stitch_toeic_quest_rpg_hub/rank_up_ceremony_1) và [rank_up_ceremony_2](file:///c:/CuongPH/02-bmad-toeic_quest_rpg_hub/input/stitch_toeic_quest_rpg_hub/rank_up_ceremony_2)
*   **Ràng buộc:** `FR-18`
*   **Acceptance Criteria (AC):**
    1.  Tự động kích hoạt hoạt họa lễ thăng cấp dài 5 giây ngay khi điểm KP vượt ngưỡng Rank mới.
    2.  Vô hiệu hóa nút đóng (close/skip) trong 5 giây đầu tiên của hoạt họa.

### 5-2-career-milestone-dinh-huong-nghe-nghiep
*   **Mô tả:** Là một người học, tôi muốn nhận thông điệp Career Milestone thực tế và chia sẻ huy hiệu nhân vật của mình lên mạng xã hội.
*   **Liên kết UI:** [input/stitch_toeic_quest_rpg_hub/rank_up_ceremony_1](file:///c:/CuongPH/02-bmad-toeic_quest_rpg_hub/input/stitch_toeic_quest_rpg_hub/rank_up_ceremony_1)
*   **Ràng buộc:** `FR-19`, `FR-20`
*   **Acceptance Criteria (AC):**
    1.  Hiển thị dòng Career Milestone tương ứng (Ví dụ: Rank 3 tương ứng TOEIC ~600, đủ điều kiện làm Chuyên viên).
    2.  Cung cấp nút bấm tự động kết xuất ảnh 1080x1080 chứa thông tin nhân vật, Rank mới và mã QR liên kết tải app để chia sẻ lên Facebook/Zalo.
