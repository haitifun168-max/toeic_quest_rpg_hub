# ⚔️ TÀI LIỆU PRFAQ CHÍNH THỨC — TOEIC QUEST RPG HUB
**Mã tài liệu:** PRFAQ_TOEIC_RPG_v1.0  
**Phiên bản:** 1.0  
**Ngày phê duyệt:** 23/06/2026  
**Trạng thái:** Đã chốt qua hội thảo nhóm (Party Mode)

---

## 1. THÔNG CÁO BÁO CHÍ (PRESS RELEASE)

### TIÊU ĐỀ: RA MẮT "TOEIC QUEST RPG HUB" — BIẾN ĐIỂM SỐ TOEIC THÀNH SỰ NGHIỆP TRONG THẾ GIỚI NHẬP VAI
*Hà Nội, Ngày 31/03/2027* — Ban Sản phẩm & Công nghệ chính thức ra mắt **TOEIC Quest RPG Hub**, ứng dụng học tiếng Anh đầu tiên kết hợp khung Gamification Octalysis và hệ thống phát triển nhân vật RPG thực tế tại Việt Nam.

#### Vấn đề (The Problem):
Hơn 80% người tự học TOEIC bỏ cuộc sau 2-4 tuần vì việc ôn luyện lý thuyết và đề thi thử vô cùng tẻ nhạt. Họ không thấy được sự tiến bộ hàng ngày và thiếu động lực để duy trì thói quen học tập bền vững.

#### Giải pháp (The Solution):
**TOEIC Quest RPG Hub** chuyển hóa hành trình học từ *"chuỗi bài tập nhàm chán"* thành *"cuộc phiêu lưu thăng tiến sự nghiệp"*. 
Người dùng sẽ nhập vai vào nhân vật RPG có các chỉ số năng lực thực tế. Điểm số TOEIC ước tính (Sim Score) sẽ tương đương với Rank nhân vật trong game (từ Thực Tập Sinh đến Giám Đốc). Người dùng sẽ thăng tiến thông qua hoàn thành nhiệm vụ hàng ngày (Daily Quest), thi đấu đối kháng ELO (PvP Battle 1v1) và chinh phục phó bản (Dungeon Mock Test).

---

## 2. CÂU HỎI THƯỜNG GẶP TỪ KHÁCH HÀNG (CUSTOMER FAQ)

### Q1: Tôi có bắt đầu bằng bài thi thử dài dòng ngay khi cài app không?
**Trả lời:** Không. Chúng tôi hiểu sự mệt mỏi của các bài test dài. Khi bắt đầu, bạn chỉ cần trải qua một bài kiểm tra nhanh **10 câu (5 phút)** để xếp Rank tạm thời và mở khóa nhân vật. **10 câu đánh giá năng lực còn lại** sẽ được lồng ghép ngầm vào 3 Daily Quests đầu tiên trong ngày học thứ nhất và thứ hai của bạn để hệ thống định hình lộ trình học chính xác mà không gây cảm giác quá tải lúc bắt đầu.

### Q2: Chế độ PvP Battle hoạt động thế nào? Thua có bị phạt nặng không?
**Trả lời:** PvP Battle là đấu trường 1v1 diễn ra trong thời gian thực. Bạn và đối thủ cùng trình độ (ELO ±100) sẽ giải 10 câu hỏi ngữ pháp/từ vựng áp lực cao (20 giây/câu).
*   **Nếu thắng:** Bạn được cộng ELO, nhận rương vật phẩm và điểm kinh nghiệm (KP) lớn.
*   **Nếu thua:** Điểm ELO của bạn sẽ giảm nhẹ nhưng Rank nhân vật và điểm KP tích lũy không bao giờ bị tụt. Bạn vẫn nhận được **Consolation KP (+50 KP)** và **1 Insight Point** để xem giải thích chi tiết câu sai từ AI Mentor.

### Q3: Giải thích 3 tầng (Progressive Disclosure) là gì?
**Trả lời:** Khi trả lời xong mỗi câu hỏi, bạn nhận phản hồi đúng/sai ngay lập tức (≤ 2 giây). Bạn có thể xem giải thích theo 3 mức độ:
*   **Tầng 1 (Luôn hiển thị):** 1 dòng quy tắc cốt lõi để bạn nắm nhanh bản chất.
*   **Tầng 2 (Bấm "Xem phân tích"):** Phân tích cấu trúc ngữ pháp và bảng so sánh đáp án.
*   **Tầng 3 (Bấm "Học sâu"):** Mẹo ghi nhớ (Mnemonics), ví dụ thực tế và liên kết bài học chuyên sâu.

---

## 3. CÂU HỎI KỸ THUẬT VÀ VẬN HÀNH NỘI BỘ (INTERNAL FAQ)

### Q1: Làm thế nào để đảm bảo độ trễ PvP Battle ≤ 500ms dưới tải lượng lớn?
**Trả lời:** Hệ thống sử dụng cơ chế **WebSocket** chạy trên cụm Node.js tách biệt để giữ kết nối thời gian thực. Quá trình ghép cặp (Matchmaking) và lưu trữ session hoạt động trên bộ nhớ đệm **Redis (Sorted Sets)** giúp giảm tải tối đa cho PostgreSQL. Việc tính điểm số được đẩy vào hàng đợi bất đồng bộ xử lý phía sau (Worker backend).

### Q2: Làm thế nào để ngăn chặn gian lận (cheat) trong PvP và Dungeon?
**Trả lời:** Tất cả các hành động chọn đáp án đều sử dụng **Server-side validation**. Client chỉ gửi mã đáp án và timestamp (thời gian phản xạ). Server sẽ đối chiếu với thời gian broadcast câu hỏi để tính điểm chính xác và ngăn ngừa các công cụ hack can thiệp client.

### Q3: Cơ sở dữ liệu được phân chia như thế nào giữa PostgreSQL và Redis?
**Trả lời:**
*   **PostgreSQL:** Đóng vai trò là Source of Truth lưu trữ thông tin tài khoản, lịch sử giao dịch Premium, ngân hàng câu hỏi, và tiến trình cây kỹ năng (Skill Tree).
*   **Redis:** Đảm nhận vai trò cache hiệu suất cao cho hàng đợi matchmaking PvP, Leaderboard tuần cập nhật thời gian thực, và session hoạt động tạm thời của game.
