---
title: TOEIC Quest RPG Hub
created: 2026-06-23
updated: 2026-06-23
status: final
---

# PRD: TOEIC Quest RPG Hub

## 0. Document Purpose

Tài liệu PRD (Product Requirement Document) này định nghĩa chi tiết các yêu cầu sản phẩm cho ứng dụng **TOEIC Quest RPG Hub**. Tài liệu được xây dựng dành cho Đội phát triển (Developers), Nhà thiết kế UI/UX, Quản lý dự án (PM), Bộ phận Kiểm thử (QA), và các bên liên quan để làm căn cứ phát triển hệ thống cho Phase 1 MVP và định hướng Phase 2.

Tài liệu này kế thừa trực tiếp từ các tài liệu đầu vào:
*   Tài liệu yêu cầu nghiệp vụ: [BRD — Ứng Dụng Học TOEIC Gamification (All-in-One RPG Hub).md](file:///c:/CuongPH/02-bmad-toeic_quest_rpg_hub/input/BRD%20%E2%80%94%20%E1%BB%A8ng%20D%E1%BB%A5ng%20H%E1%BB%8Dc%20TOEIC%20Gamification%20%28All-in-One%20RPG%20Hub%29.md)
*   Tài liệu đặc tả UI: [UI Design Specification — TOEIC RPG Hub.md](file:///c:/CuongPH/02-bmad-toeic_quest_rpg_hub/input/UI%20Design%20Specification%20%E2%80%94%20TOEIC%20RPG%20Hub.md)
*   Bản thảo thỏa thuận: [prfaq-02-bmad-toeic_quest_rpg_hub.md](file:///c:/CuongPH/02-bmad-toeic_quest_rpg_hub/_bmad-output/planning-artifacts/prfaq-02-bmad-toeic_quest_rpg_hub.md)

---

## 1. Vision

**TOEIC Quest RPG Hub** là nền tảng học tiếng Anh chuẩn hóa lần đầu tiên biến hành trình luyện thi TOEIC từ một quy trình cày đề học thuật đơn điệu thành một cuộc phiêu lưu phát triển nghề nghiệp nhập vai (RPG). 

Thông qua tích hợp mô hình động lực học hành vi **Octalysis** và công nghệ học thích ứng AI (Adaptive Learning Engine), ứng dụng giải quyết triệt để vấn đề "dễ bỏ cuộc" của người tự học tiếng Anh bằng cách liên kết chặt chẽ tiến trình trong thế giới ảo với mục tiêu nghề nghiệp thực tế ngoài đời.

---

## 2. Target User

### 2.1 Jobs To Be Done
*   **Functional (Nhiệm vụ chính):** Đạt điểm thi TOEIC mục tiêu (Listening & Reading) để tốt nghiệp đại học hoặc đáp ứng tiêu chuẩn tuyển dụng/thăng tiến tại các doanh nghiệp quốc tế.
*   **Emotional (Cảm xúc):** Giảm bớt áp lực, lo lắng khi phải tự học và làm các đề thi thử dài 2 tiếng. Tìm thấy cảm giác vui vẻ, hào hứng hàng ngày.
*   **Social (Xã hội):** Kết nối với cộng đồng người cùng ôn luyện, so tài và khẳng định năng lực bản thân qua các thứ hạng (Rank) uy tín.
*   **Contextual (Bối cảnh):** Tận dụng tối đa các khoảng thời gian trống (khi đi xe bus, giờ nghỉ trưa) để học hiệu quả qua thiết bị di động cá nhân.

### 2.2 Non-Users (v1)
*   Người học có nhu cầu ôn luyện chuyên sâu kỹ năng Speaking và Writing (sẽ được phát triển ở Phase 3).
*   Người có nhu cầu học không sử dụng kết nối mạng internet (chế độ học ngoại tuyến hoàn toàn).

### 2.3 Key User Journeys

*   **UJ-1. Nam thực hiện Onboarding và kiểm tra trình độ đầu vào**
    *   **Persona + Context:** Nam (21 tuổi, sinh viên năm cuối, cần đạt 600 TOEIC để ra trường nhưng lười học lý thuyết khô khan).
    *   **Entry State:** Mở ứng dụng lần đầu tiên, chưa đăng ký tài khoản.
    *   **Path:** Nam nhìn thấy lời chào -> Đặt mục tiêu đạt 600 TOEIC trong 3 tháng -> Đăng ký tài khoản qua Google -> Bắt đầu làm bài kiểm tra đầu vào rút gọn 10 câu (5 phút) -> Hoàn thành bài kiểm tra và thấy màn hình hiển thị điểm ước tính ban đầu là ~350 TOEIC. Nam được cấp **Rank 2 (Nhân Viên Mới Vào Nghề)** -> Nam chọn avatar Chiến Binh để đại diện cho mình.
    *   **Climax:** Nhân vật của Nam xuất hiện kèm trang phục Rank 2 và hiệu ứng ánh sáng rực rỡ, thông báo Nam sẵn sàng bước vào hành trình.
    *   **Resolution:** Màn hình chuyển sang Home Dashboard và tự động kích hoạt Daily Quest đầu tiên cho Nam.

*   **UJ-2. Hoa thực hiện nhiệm vụ hàng ngày và xem giải thích câu hỏi**
    *   **Persona + Context:** Hoa (23 tuổi, nhân viên ngân hàng bận rộn, chỉ rảnh 15-20 phút giờ nghỉ trưa).
    *   **Entry State:** Đã đăng nhập, đang ở màn hình Home Dashboard.
    *   **Path:** Hoa chạm vào nút "Bắt đầu Daily Quest 1 - Từ Vựng" -> Trả lời câu hỏi số 1 -> Trả lời đúng, hệ thống hiển thị hiệu ứng Confetti màu xanh lá và cộng 50 KP trong vòng 1.5 giây -> Đến câu số 3 cô trả lời sai -> Hệ thống hiển thị nền màu đỏ và nút "Xem phân tích" -> Hoa bấm vào nút "Xem phân tích" (Tầng 2) để xem cấu trúc ngữ pháp của câu, sau đó bấm tiếp "Học sâu" (Tầng 3) để xem mẹo ghi nhớ từ vựng.
    *   **Climax:** Hoa hoàn thành 10 câu hỏi từ vựng, nhận màn hình Session Summary thông báo hoàn thành Quest 1, nhận 80 KP và được duy trì chuỗi Streak học 18 ngày liên tiếp.
    *   **Resolution:** Hoa tắt ứng dụng để quay lại làm việc, cảm thấy thoải mái vì không mất nhiều thời gian và hiểu ngay các lỗi sai của mình.

*   **UJ-3. Minh tham gia thi đấu đối kháng PvP real-time**
    *   **Persona + Context:** Minh (20 tuổi, thích thi đấu, muốn đo lường phản xạ tiếng Anh với người khác).
    *   **Entry State:** Authenticated, đang ở màn hình PvP Lobby.
    *   **Path:** Minh nhấn chọn "Ranked Mode" -> Hệ thống kích hoạt hoạt họa tìm đối thủ ELO-based trong vòng 5 giây -> Ghép trận thành công với "TranThiB" (Rank 3) -> Trận đấu gồm 10 câu hỏi trắc nghiệm, mỗi câu 20 giây. Minh chọn đáp án câu 1 tại giây thứ 5 và đúng -> Nhận 45 điểm -> Cửa sổ đối thủ hiển thị "Đối thủ đã trả lời!" -> Trận đấu tiếp tục đến hết 10 câu.
    *   **Climax:** Minh chiến thắng trận đấu với tỷ số 85 - 72, màn hình Victory hiện lên kèm phần thưởng +30 ELO, +300 KP và một vật phẩm bảo vệ chuỗi ngày học (Streak Freeze).
    *   **Resolution:** Minh quay lại PvP Lobby và có tùy chọn bấm nút "Tìm trận mới" hoặc "Tái đấu" đối thủ cũ.

*   **UJ-4. Linh chinh phục phó bản Dungeon thi thử toàn bộ**
    *   **Persona + Context:** Linh (25 tuổi, kỹ sư, cần chứng chỉ TOEIC 750+ gấp để nộp hồ sơ xin việc).
    *   **Entry State:** Authenticated, đang ở Skill Tree Map.
    *   **Path:** Linh chọn Node "Dungeon FULL-★ (Boss)" -> Popup cảnh báo hiện lên thông báo đây là bài thi thử 200 câu trong 120 phút và không được thoát ngang -> Linh bấm "Vào Dungeon" -> Giao diện thi thử hiện ra gồm 100 câu Listening và 100 câu Reading -> Đang làm đến câu 80 thì Linh có cuộc gọi khẩn, cô buộc phải khóa màn hình -> Sau 30 phút, cô mở lại app -> Hệ thống tự động khôi phục bài thi từ trạng thái lưu nháp ở câu 80.
    *   **Climax:** Linh hoàn thành toàn bộ 200 câu hỏi, hệ thống tính toán năng lực IRT và trả về Estimated Score là ~760 điểm cùng biểu đồ radar đánh giá điểm mạnh/yếu.
    *   **Resolution:** Linh được cộng 15,000 KP và được AI Mentor gợi ý bài học tập trung cải thiện kỹ năng Reading Part 7 Double Passage.

*   **UJ-5. Nam tham dự Lễ thăng hạng (Rank-up Ceremony)**
    *   **Persona + Context:** Nam (đang là Rank 2, vừa hoàn thành một Daily Quest và tích lũy đủ 8,000 KP).
    *   **Entry State:** Vừa kết thúc màn hình Session Summary của một phiên học.
    *   **Path:** Ngay sau khi bấm "Tiếp tục" tại Session Summary -> Màn hình đột ngột flash trắng -> Trình chiếu hoạt họa nhân vật thay đổi trang phục sang đồ công sở lịch sự hơn trong vòng 2 giây -> Một huy hiệu lớn **Rank 3 (Chuyên Viên)** xuất hiện ở trung tâm kèm hiệu ứng lấp lánh và nhạc thăng thăng.
    *   **Climax:** Hệ thống hiển thị dòng chữ: "Chúc mừng bạn đã đạt Rank Chuyên Viên! Tương đương trình độ TOEIC ~600 điểm. Bạn đã đủ điều kiện ứng tuyển vị trí Junior tại các công ty quốc tế!"
    *   **Resolution:** Nút "Chia sẻ" sáng lên để Nam đăng ảnh thăng hạng lên Facebook, sau đó Nam bấm "Tiếp tục" để quay lại Home Dashboard với giao diện các tính năng mới được mở khóa (Dungeon Mode).

---

## 3. Glossary

*   **KP (Knowledge Points):** Điểm kinh nghiệm tích lũy trong hệ thống khi người dùng hoàn thành các hoạt động học tập (Daily Quest, PvP, Dungeon), dùng để nâng cấp Rank nhân vật.
*   **Theta Score (Hệ số Theta):** Chỉ số biểu thị trình độ thực tế của người dùng được tính toán bởi thuật toán AI thích ứng dựa trên Lý thuyết ứng phó câu hỏi (Item Response Theory - IRT).
*   **Sim Score (Estimated TOEIC Score):** Điểm TOEIC ước tính thời gian thực (từ 10 đến 990) quy đổi từ hệ số Theta của người dùng.
*   **Daily Quest (Nhiệm vụ hàng ngày):** Bộ 3 nhiệm vụ học tập bắt buộc được cá nhân hóa mỗi ngày giúp người dùng duy trì Streak.
*   **Streak:** Số ngày học liên tiếp mà người dùng hoàn thành tối thiểu 1 Daily Quest core.
*   **Streak Freeze:** Vật phẩm mua bằng KP hoặc nhận qua phần thưởng, cho phép bảo lưu chuỗi Streak nếu người dùng bỏ lỡ 1 ngày không học.
*   **Insight Point:** Điểm thưởng tích lũy khi trả lời sai câu hỏi, dùng để đổi lấy lượt giải thích sâu của AI Mentor.
*   **Dungeon (Phó Bản):** Chế độ thi thử mô phỏng phòng thi thật (Mini Mock Test hoặc Full Mock Test 200 câu), có điều kiện mở khóa và áp dụng hình phạt nếu thoát giữa chừng.
*   **Rank (Bậc/Cấp bậc):** Hệ thống 6 cấp bậc nghề nghiệp của nhân vật RPG đại diện trực tiếp cho các mốc điểm TOEIC thi thật.
*   **WebSocket:** Giao thức kết nối mạng hai chiều giúp truyền nhận dữ liệu thời gian thực giữa máy chủ và ứng dụng cho tính năng PvP.

---

## 4. Features

### 4.1 Onboarding & Goal Setting
**Description:** Hướng dẫn người dùng thiết lập mục tiêu điểm số và hoàn thành bài kiểm tra đầu vào rút gọn để tạo nhân vật RPG tương ứng. Realizes UJ-1. Sử dụng thuật toán IRT để tính toán mức năng lực Theta khởi điểm.

**Functional Requirements:**

#### FR-1: Thiết lập mục tiêu ban đầu
Người dùng chưa đăng ký có thể chọn mục tiêu điểm TOEIC mong muốn (300/450/600/750/850/900+) và thời hạn hoàn thành (1/3/6/12 tháng).
*   **Consequences:**
    *   Hệ thống tính toán và hiển thị ngày thi dự kiến (Ví dụ: `Hôm nay + 3 tháng`).
    *   Hệ thống lưu trữ thông tin này vào cơ sở dữ liệu sau khi đăng ký tài khoản thành công.

#### FR-2: Placement Test rút gọn
Hệ thống hiển thị bài kiểm tra gồm 10 câu hỏi ngẫu nhiên được tối ưu hóa theo các phần thi Ngữ pháp, Từ vựng, và Nghe hiểu.
*   **Consequences:**
    *   Hệ thống bắt đầu bộ đếm thời gian ngược 5 phút. Nếu hết giờ, tự động submit các đáp án đã chọn.
    *   Nút "Quay lại" bị ẩn hoặc vô hiệu hóa để ngăn người dùng thoát bài thi giữa chừng.

#### FR-3: Xếp hạng và Chọn Avatar
Hệ thống tính toán hệ số Theta khởi điểm của người dùng dựa trên kết quả 10 câu Placement Test để gán Rank nhân vật và hiển thị 6 lựa chọn Avatar RPG.
*   **Consequences:**
    *   Gán Rank khởi đầu tương ứng theo bảng CEFR (Ví dụ: Đúng 7/10 câu -> Gán Rank 2 ~ 400 TOEIC).
    *   Cho phép người dùng đặt tên nhân vật và lưu trữ avatar đã chọn.
*   **Out of Scope:**
    *   Chưa cho phép tùy chỉnh sâu phụ kiện, trang phục của avatar ở Phase 1.

---

### 4.2 Daily Quest System & Quiz Engine
**Description:** Hệ thống lõi cung cấp 3 nhiệm vụ học tập hàng ngày để duy trì thói quen học và tính toán điểm kinh nghiệm (KP). Realizes UJ-2.

**Functional Requirements:**

#### FR-4: Tải danh sách Daily Quest
Hệ thống tải danh sách 3 nhiệm vụ hàng ngày được cá nhân hóa cho từng user dựa trên điểm yếu của học phần trước.
*   **Consequences:**
    *   3 Nhiệm vụ mặc định bao gồm: DQ-01 Từ vựng (15 phút), DQ-02 Nghe hiểu (10 phút), DQ-03 Ngữ pháp (5 phút).
    *   Hiển thị Progress bar cập nhật tỷ lệ hoàn thành (Ví dụ: 1/3 nhiệm vụ).

#### FR-5: Trình phát câu hỏi Quiz
Trình chiếu câu hỏi học tập trắc nghiệm bao gồm chữ, hình ảnh (nếu có) và trình phát âm thanh (cho bài Listening).
*   **Consequences:**
    *   Bài nghe Listening cho phép phát âm thanh tự động lần đầu, cho phép Replay tối đa 1 lần (Free) hoặc không giới hạn (Premium).
    *   Hệ thống ghi nhận thời gian phản xạ (giây) của người học cho mỗi câu hỏi.

#### FR-6: Duy trì Streak hàng ngày
Hệ thống tự động cộng 1 vào chuỗi Streak khi người dùng hoàn thành ít nhất 1 nhiệm vụ cốt lõi (Daily Core Quest) trong ngày (trước 24:00 giờ hệ thống).
*   **Consequences:**
    *   Gửi thông báo đẩy (Push Notification) nhắc nhở học vào lúc 20:00 nếu người dùng chưa học câu nào.

#### FR-7: Streak Freeze & Recovery
Người dùng có thể kích hoạt vật phẩm Streak Freeze để bảo vệ chuỗi ngày học khi không thể online, hoặc thực hiện nhiệm vụ hồi phục (Streak Recovery) trong vòng 24 giờ sau khi mất streak.
*   **Consequences:**
    *   Sử dụng Streak Freeze trừ đi 500 KP trong tài khoản người dùng (Giới hạn tối đa 1 lần/tuần).
    *   Streak Recovery yêu cầu hoàn thành gấp đôi số lượng bài học (2 Quest) trong ngày để khôi phục chuỗi.

---

### 4.3 Immediate Feedback Loop & 3-Layer Explanation
**Description:** Đưa ra phản hồi đúng/sai tức thì và hiển thị giải thích cấu trúc câu hỏi theo mô hình progressive disclosure. Realizes UJ-2.

**Functional Requirements:**

#### FR-8: Phản hồi siêu tốc (Micro-feedback)
Hiển thị kết quả đúng/sai cùng hiệu ứng âm thanh và hoạt họa trong thời gian tối đa 2 giây sau khi người dùng bấm chọn đáp án.
*   **Consequences:**
    *   **Đáp án đúng:** Hiển thị nền xanh lá, hiệu ứng confetti nhẹ, cộng KP vào tài khoản.
    *   **Đáp án sai:** Hiển thị nền đỏ, hiển thị đáp án đúng màu xanh lá, cộng 1 Insight Point. Không trừ KP.

#### FR-9: Giải thích 3 tầng (Expandable Explanation)
Cung cấp giải thích chi tiết đáp án câu hỏi dưới dạng thẻ thông tin có thể mở rộng tùy chọn.
*   **Consequences:**
    *   **Tầng 1 (Mặc định):** Hiển thị 1 câu tóm tắt quy tắc cốt lõi của đáp án.
    *   **Tầng 2 (Bấm nút mở rộng):** Phân tích chi tiết ngữ pháp, cấu trúc câu, từ vựng liên quan.
    *   **Tầng 3 (Bấm "Học sâu"):** Hiển thị mẹo học (Mnemonic), ví dụ mẫu thực tế ngoài đời.

#### FR-10: Session Summary
Tổng kết tiến trình học khi hoàn thành mỗi nhiệm vụ, bao gồm số KP nhận được, tỷ lệ trả lời đúng/sai và gợi ý chủ điểm cần ôn tập của AI Mentor.
*   **Consequences:**
    *   Hiển thị biểu đồ tiến trình lên Rank tiếp theo (Ví dụ: `4,250 / 8,000 KP`).

---

### 4.4 PvP Quiz Battle Mode (Phase 2)
**Description:** Tính năng thi đấu đối kháng real-time 1v1 dựa trên thuật toán so khớp ELO. Realizes UJ-3.

**Functional Requirements:**

#### FR-11: Matchmaking ELO-based
Ghép cặp tự động 2 người dùng có độ lệch điểm ELO không quá 100 điểm.
*   **Consequences:**
    *   Thời gian so khớp tối đa là 15 giây. Nếu sau 15 giây không tìm thấy đối thủ, hệ thống tự động ghép với BOT mô phỏng có ELO tương tự để tránh nghẽn.

#### FR-12: Đồng bộ trận đấu (WebSocket)
Broadcast các câu hỏi thi đấu đồng thời cho cả hai người chơi qua WebSocket và quản lý thời gian đếm ngược 20 giây cho mỗi câu.
*   **Consequences:**
    *   Hiển thị thông báo tức thì trên màn hình khi đối thủ đã bấm trả lời ("Đối thủ đã trả lời!").

#### FR-13: Chống gian lận PvP
Xác thực mọi lượt trả lời câu hỏi PvP trực tiếp trên Server thay vì ghi nhận điểm số từ Client.
*   **Consequences:**
    *   Client chỉ gửi `answer_code` và `timestamp`. Nếu thời gian gửi đáp án nhỏ hơn 1 giây cho câu hỏi nghe hiểu, server sẽ loại bỏ hoặc ghi nhận vi phạm.

#### FR-14: Trao thưởng & Consolation ELO
Hệ thống xử lý phân định thắng/thua, cập nhật ELO và cấp Consolation KP cho bên thua cuộc.
*   **Consequences:**
    *   **Thắng:** +30 ELO, +300 KP, có cơ hội nhận vật phẩm Streak Freeze.
    *   **Thua:** -10 ELO, cộng Consolation KP (+50 KP) và cộng 1 Insight Point để khuyến khích học tập.

---

### 4.5 Dungeon Mode (Mock Tests)
**Description:** Chế độ luyện đề thi thử toàn diện mô phỏng kỳ thi thật nhằm đánh giá chính xác Sim Score. Realizes UJ-4.

**Functional Requirements:**

#### FR-15: Cảnh báo vào Dungeon
Hiển thị popup cảnh báo điều kiện và quy định thi trước khi người dùng đồng ý vào Dungeon.
*   **Consequences:**
    *   Thông báo bài thi 200 câu trong 120 phút. Vô hiệu hóa nút thoát nhanh.

#### FR-16: Tự động lưu nháp (Auto-save draft)
Hệ thống tự động đồng bộ kết quả làm bài của người học lên máy chủ sau mỗi 10 câu hỏi được trả lời.
*   **Consequences:**
    *   Nếu mất kết nối hoặc tắt ứng dụng đột ngột, người dùng có thể khôi phục trạng thái làm bài trong vòng 24 giờ kể từ lúc bắt đầu thi.

#### FR-17: Tính toán Sim Score và Báo cáo năng lực
Sau khi hoàn thành Dungeon, hệ thống chạy mô hình IRT để cập nhật hệ số Theta, quy đổi Sim Score (TOEIC Score) mới và hiển thị biểu đồ radar năng lực.
*   **Consequences:**
    *   Cập nhật điểm Estimated TOEIC Score trên thanh thông tin chính của ứng dụng.
    *   Cộng 15,000 KP vào tài khoản người dùng khi hoàn thành bài thi Full-Mock Test.

---

### 4.6 Rank-up Ceremony & Career Milestones
**Description:** Hệ thống thăng cấp bậc nhân vật khi tích lũy đủ điểm kinh nghiệm (KP) và gắn liền với định hướng nghề nghiệp thực tế. Realizes UJ-5.

**Functional Requirements:**

#### FR-18: Kích hoạt Lễ thăng hạng (Rank-up Event)
Hệ thống tự động kích hoạt hoạt họa lễ thăng hạng toàn màn hình ngay khi điểm tích lũy KP của người dùng vượt qua ngưỡng của Rank tiếp theo.
*   **Consequences:**
    *   Chạy hoạt họa chuyển đổi ngoại trang của nhân vật trong 5 giây. Không cho phép bấm bỏ qua (skip) trong 5 giây đầu này.

#### FR-19: Thông điệp Career Milestone
Hiển thị thẻ thông tin liên kết cấp bậc Rank ảo với cơ hội nghề nghiệp thực tế ngoài đời dựa trên điểm TOEIC tương đương.
*   **Consequences:**
    *   Ví dụ: Đạt Rank 3 hiển thị thông báo: "Bạn đã đạt mức TOEIC ~600, đủ điều kiện ứng tuyển vị trí chuyên viên tại các công ty đa quốc gia!"

#### FR-20: Chia sẻ kết quả (Social Sharing)
Cung cấp nút chia sẻ tự động tạo hình ảnh chứng nhận thăng hạng của người dùng lên các nền tảng mạng xã hội (Facebook, Zalo).
*   **Consequences:**
    *   Tự động tải xuống tệp ảnh định dạng 1080x1080 chứa thông tin nhân vật, Rank mới và mã QR liên kết ứng dụng.

---

## 5. Non-Goals (Explicit)

*   **Không xây dựng hệ thống đối soát doanh thu đa cổng thanh toán trong v1:** Chỉ tích hợp mua gói Premium trực tiếp qua cơ chế thanh toán mặc định của App Store IAP và Google Play IAP.
*   **Không phát triển module Chatbot AI Voice Tutor ở MVP:** Tránh sự phức tạp về công nghệ nhận diện giọng nói (STT). AI Mentor chỉ cung cấp gợi ý và phân tích lỗi sai bằng văn bản/biểu đồ.
*   **Không hỗ trợ chế độ thi đấu PvP ngoại tuyến (Offline PvP):** Do yêu cầu đồng bộ thời gian thực và chống hack, PvP bắt buộc phải có kết nối mạng internet ổn định.

---

## 6. MVP Scope

### 6.1 In Scope (Phase 1 MVP)
*   Đăng ký, Đăng nhập qua tài khoản Google/Facebook/Email.
*   Placement Test rút gọn 10 câu khởi điểm + Khởi tạo nhân vật (6 Ranks).
*   Hệ thống Daily Quest cơ bản (3 quests mỗi ngày).
*   Trình phát câu hỏi Quiz với âm thanh Listening và hình ảnh Reading.
*   Micro-feedback phản hồi kết quả trong 2 giây + giải thích đáp án 3 tầng.
*   Tính năng Streak (Chuỗi ngày học) + mua Streak Freeze bằng điểm KP.
*   Bản đồ lộ trình học tập (Skill Tree Map) với 12 nodes cơ bản.
*   Lễ thăng hạng Rank-up Ceremony và thông điệp Career Milestones.

### 6.2 Out of Scope for MVP (Dành cho Phase 2 & 3)
*   Hệ thống đấu đối kháng PvP real-time 1v1 qua WebSocket. *(Phase 2)*
*   Hệ thống Bang hội (Guild Hub) kết nối 20 thành viên làm nhiệm vụ chung. *(Phase 2)*
*   Chế độ thi Dungeon (Full-Mock Test 200 câu và Mini-Mock Test). *(Phase 2)*
*   Thuật toán Adaptive Learning Engine hoàn chỉnh của AI. *(Phase 2)*
*   Học máy nâng cao chấm điểm phát âm tiếng Anh (AI Speaking Evaluation). *(Phase 3)*

---

## 7. Success Metrics

### Primary
*   **SM-1 (DAU/MAU Ratio):** Tỷ lệ Stickiness của ứng dụng đạt **> 0.4** vào tháng thứ 3 sau khi ra mắt. (Đo lường gián tiếp mức độ kích thích của cơ chế Gamification). *Kiểm chứng các tính năng FR-4, FR-5.*
*   **SM-2 (7-Day Streak Rate):** Tỉ lệ người dùng duy trì chuỗi streak liên tục ≥ 7 ngày đạt **> 25%** trên tổng số DAU. *Kiểm chứng tính năng FR-6, FR-7.*
*   **SM-3 (Premium Conversion Rate):** Tỷ lệ người dùng chuyển đổi mua gói Premium đạt **> 8%** trên tổng số MAU. *Kiểm chứng các tính năng Dungeon Mock Test.*

### Secondary
*   **SM-4 (Average Session Length):** Thời gian học trung bình mỗi phiên đạt từ **18 đến 25 phút**. (Quá thấp nghĩa là nội dung học chưa đủ cuốn hút; quá dài dẫn đến quá tải).
*   **SM-5 (Placement Test Completion Rate):** Tỷ lệ người dùng hoàn thành 10 câu Onboarding Test đạt **> 90%**. (Kiểm chứng UX rút gọn có hiệu quả giảm rụng hay không).

### Counter-metrics (Do không tối ưu quá đà)
*   **SM-C1 (PvP Daily Volume per User):** Giới hạn tối đa **15 trận PvP/ngày** cho mỗi người dùng.
    *   *Lý do:* Tránh việc người học chơi game đối kháng quá nhiều dẫn đến kiệt sức (burnout), cày điểm KP ảo mà bỏ quên các bài học lý thuyết chuyên sâu trên Skill Tree.

---

## 8. Open Questions

1.  **Cân bằng hệ số ELO và KP:** Cách thức chấm điểm thưởng PvP khi có sự chênh lệch lớn về tốc độ phản xạ giữa 2 người chơi (Ví dụ: Một người trả lời đúng ở giây thứ 2 và một người trả lời đúng ở giây thứ 19). Có nên cộng thêm điểm thưởng ELO cho người chơi có tốc độ nhanh vượt trội không?
2.  **Chính sách hoàn tiền (Refund Policy):** Tích hợp nút hoàn tiền Premium trong vòng 7 ngày trên CRM cho CSKH có gặp hạn chế gì từ chính sách hoàn tiền của App Store và Google Play IAP không?

---

## 9. Assumptions Index

*   **[ASSUMPTION-1] (từ §4.2):** Người học trên di động sẵn sàng cho phép ứng dụng gửi thông báo đẩy (Push Notification) để hệ thống nhắc nhở duy trì Streak học tập.
*   **[ASSUMPTION-2] (từ §4.1):** 10 câu hỏi trong bài Placement Test rút gọn đủ độ phân hóa để ước lượng sơ bộ hệ số Theta năng lực của người học mà không gây sai số quá lớn khi phân Rank.

---

## 10. Adapt-In Sections (Quy định & Chất lượng chéo)

### 10.1 Aesthetic and Tone (Mỹ thuật & Giao diện)
*   **Chủ đề hình ảnh:** Vũ trụ RPG tối, kết hợp công nghệ hiện đại học đường (Cyber Scholar RPG).
*   **Visual Style:** Sử dụng Glassmorphism (Thủy tinh mờ). Nền tối màu `#0F0F1A` kết hợp với các dải màu tím phát sáng gradient `#7C3AED` và màu vàng kim `#F59E0B` của KP.
*   **Font chữ:** Tiêu đề lớn Nunito (tạo cảm giác game thân thiện); nội dung câu hỏi và giải thích dùng Inter (rõ ràng, dễ đọc).

### 10.2 Information Architecture (Kiến trúc thông tin)
Ứng dụng di động bao gồm 5 màn hình chính điều hướng ở Bottom Navigation:
1.  **Trang Chủ (Home Dashboard):** Widget Streak, thẻ Daily Quest Core, Widget radar năng lực cá nhân, AI Mentor banner.
2.  **Đấu Trường (PvP Battle):** Lobby chọn chế độ Ranked/Casual, danh sách bảng xếp hạng Leaderboard tuần.
3.  **Lộ Trình (Skill Tree):** Bản đồ dạng cây phân nhánh Listening và Reading, các node Dungeon khóa/mở.
4.  **Bang Hội (Guild Hub):** Chat nhóm, danh sách nhiệm vụ chung của Guild, thanh tiến trình mở Rương Guild.
5.  **Hồ Sơ (Profile):** Chỉ số stats nhân vật, lịch sử học tập, nút cài đặt và nâng cấp Premium.

### 10.3 Platform Constraints
*   Ứng dụng phát triển trên nền tảng Cross-platform **React Native hoặc Flutter** để tối ưu hóa thời gian đưa sản phẩm ra thị trường (Time-to-market).
*   Hỗ trợ hệ điều hành tối thiểu: **iOS 14+ / Android 8.0+**.

### 10.4 Cross-Cutting NFRs (Yêu cầu phi chức năng hệ thống)
*   **Thời gian phản hồi API:** Trung bình ≤ 1 giây; riêng Micro-feedback phải trả kết quả trong ≤ 2 giây.
*   **Độ trễ truyền WebSocket:** Mạng ổn định phải đạt ≤ 500ms để đảm bảo tính đồng bộ của PvP Battle.
*   **Phân chia Cơ sở dữ liệu:**
    *   **PostgreSQL:** Đảm nhận vai trò lưu trữ lâu dài thông tin giao dịch, tài khoản, log tiến trình học và ngân hàng câu hỏi.
    *   **Redis:** Cache Sorted Sets để tính toán thứ hạng Leaderboard tức thì và quản lý phòng matchmaking.
