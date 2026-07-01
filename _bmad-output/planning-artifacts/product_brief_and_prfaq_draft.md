# 📋 Bản Thảo Product Brief & PRFAQ (Working Backwards Draft)
**Người thực hiện:** John (Product Manager)  
**Dự án:** TOEIC Quest RPG Hub  
**Ngày lập:** 23/06/2026  
**Mã tài liệu:** PMDRAFT_TOEIC_RPG_v1.0  

---

## Part I: Thông Cáo Báo Chí (Draft Press Release)

### TIÊU ĐỀ: RA MẮT "TOEIC QUEST RPG HUB" — BIẾN ĐIỂM SỐ TOEIC THÀNH SỰ NGHIỆP TRONG THẾ GIỚI NHẬP VAI
*Hà Nội, Ngày 31/03/2027* — Bộ phận EdTech thuộc Ban Sản phẩm & Công nghệ chính thức công bố ra mắt **TOEIC Quest RPG Hub**, ứng dụng học tiếng Anh đột phá lần đầu tiên kết hợp khung Gamification Octalysis và hệ thống phát triển sự nghiệp RPG thực tế tại Việt Nam. 

#### Vấn đề của khách hàng (The Pain Point):
Hơn 80% người tự học TOEIC bỏ cuộc sau 2-4 tuần. Tại sao? Vì việc cày đề thi thử vô cùng tẻ nhạt. Họ không nhìn thấy sự tiến bộ hàng ngày và thiếu một động lực liên tục đủ mạnh để duy trì việc học. Học để đối phó với kỳ thi không bao giờ tạo ra thói quen bền vững.

#### Giải pháp (The Solution):
**TOEIC Quest RPG Hub** chuyển hóa hành trình học từ *"chuỗi bài tập nhàm chán"* thành *"cuộc phiêu lưu thăng tiến sự nghiệp"*. 
Mỗi người học sẽ khởi tạo một nhân vật RPG. Điểm số TOEIC thực tế của bạn sẽ tương đương với Rank nhân vật trong game (từ Thực Tập Sinh đến Giám Đốc). Để thăng hạng, bạn phải vượt qua các phó bản (Dungeon - Mock Test), đấu trường trí tuệ (PvP Battle 1v1) và hoàn thành các nhiệm vụ hàng ngày (Daily Quest).

> "Chúng tôi không tạo ra một ứng dụng tích điểm hời hợt (Pointsification). Chúng tôi xây dựng một chiếc cầu nối động lực — biến điểm số tiếng Anh khô khan thành Career Milestone thực tế trong thế giới game, phản ánh trực tiếp năng lực làm việc quốc tế của người học."  
> — *John, Product Manager đại diện dự án.*

---

## Part II: Câu Hỏi Thường Gặp (Frequently Asked Questions - FAQ)

### 👥 Customer FAQ (Câu hỏi từ người học)

#### 1. Ứng dụng này có phải chỉ là một clone tích điểm của Duolingo không?
**Trả lời:** Không. Duolingo tập trung vào động lực duy trì chuỗi ngày (Streak) và điểm số ảo. TOEIC Quest RPG Hub liên kết trực tiếp tiến trình trong game với năng lực TOEIC thực tế. Nhân vật của bạn có 6 chỉ số (Stat): *Grammar Power, Reading Speed, Listening Reflex, Vocabulary Bank, Error Pattern IQ, Stamina* — được tính toán thời gian thực từ độ chính xác và tốc độ trả lời của bạn. Ranks của bạn tương đương với mức điểm thi thật (Ví dụ: Rank 3 - Chuyên viên tương đương ~600 TOEIC), giúp bạn biết chính xác mình đang ở đâu trên thị trường lao động.

#### 2. Việc chơi game PvP có làm loãng kiến thức học không?
**Trả lời:** Hoàn toàn ngược lại. Chế độ PvP Battle 1v1 ELO-based ghép cặp bạn với đối thủ cùng trình độ để giải 10 câu hỏi ngữ pháp/từ vựng áp lực cao (20 giây/câu). Đây là cách tối ưu để rèn luyện phản xạ nhanh dưới áp lực phòng thi thật.

---

### 💼 Internal FAQ (Câu hỏi từ Ban điều hành & Đội phát triển)

#### 1. Làm thế nào để giải quyết rủi ro gian lận (cheat) trong chế độ PvP hoặc Dungeon?
**Trả lời:** Tất cả các lượt trả lời câu hỏi và chấm điểm đều phải được xác thực phía Server (Server-side validation). Ứng dụng client chỉ hiển thị giao diện và ghi nhận thời gian bấm chọn. Việc tính toán KP và kết quả thắng/thua được xử lý tập trung để chống can thiệp Client.

#### 2. Tại sao lại dùng chiến lược "3-Phase Motivation Bridge"?
**Trả lời:** 
*   **Phase 1 - Hook (Tuần 1-2):** Dùng động lực ngoại vi như Rương quà, Streak, Rank-up để kéo user mở app.
*   **Phase 2 - Bridge (Tháng 1-2):** Đưa user vào Guild và chế độ PvP để tạo áp lực xã hội tích cực (Core Drive 5).
*   **Phase 3 - Internalize (Tháng 3+):** User thấy điểm Sim Score tăng thực tế, tự tin giao tiếp và nhận ra giá trị học tập nội tại của bản thân.
