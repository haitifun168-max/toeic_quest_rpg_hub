# BRD — Ứng Dụng Học TOEIC Gamification (All-in-One RPG Hub)

> **Mã tài liệu:** BRD_TOEIC_GAM_v1.0  
> **Phiên bản:** 1.0  
> **Ngày tạo:** 22/06/2026  
> **Mức độ ưu tiên:** Cao (P0 — Xây mới)  
> **Ngày đề xuất GoLive:** 31/03/2027 (Phase 1 MVP)

***

## 1. THÔNG TIN PHỐI HỢP (STAKEHOLDERS)

| Vai trò | Thông tin |
|---|---|
| **Đơn vị yêu cầu** | Ban Sản phẩm & Công nghệ — Bộ phận EdTech |
| **Người yêu cầu** | Product Team (TOEIC Gamification) |
| **Chức danh** | Product Owner |
| **Tờ trình** | Tờ trình xây dựng Ứng dụng TOEIC Gamification RPG Hub |
| **Mức độ ưu tiên** | Cao — Xây mới |
| **Người xây dựng BRD** | Product Owner — Mobile Learning Division |
| **CX Review** | Bổ sung khi có nhân sự CX review |
| **CSKH** | Bổ sung khi CSKH gửi yêu cầu công cụ |
| **Đối soát** | Bổ sung khi Đối soát gửi yêu cầu công cụ |
| **Ngày đề xuất GoLive** | 31/03/2027 (Phase 1) / 30/09/2027 (Phase 2) |

***

## 2. BẢNG TỔNG HỢP THAY ĐỔI

| STT | Thời gian | Phiên bản | Nguồn gốc thay đổi | Căn cứ | Nội dung cũ | Nội dung mới |
|---|---|---|---|---|---|---|
| 1 | 22/06/2026 | 1.0 | Khởi tạo | PRD Gamification TOEIC v1.0 — Product Team | Không có | Khởi tạo tài liệu BRD từ PRD phân tích Gamification TOEIC All-in-One RPG Hub |

***

## 1 — TÀI LIỆU BRD

### 1.1 Phân Loại

| Hạng mục | Nội dung |
|---|---|
| **Đối tượng tác động** | ✅ Dịch vụ &nbsp; ✅ Tính năng &nbsp; ☐ Chiến dịch &nbsp; ☐ Công cụ nội bộ &nbsp; ✅ Nền tảng/hệ thống backend |
| **Hình thức tác động** | ✅ Xây mới &nbsp; ☐ Nâng cấp bổ sung chức năng &nbsp; ☐ Nâng cấp luồng trải nghiệm lớn &nbsp; ☐ Nâng cấp luồng trải nghiệm nhỏ &nbsp; ☐ Nâng cấp thay đổi chính sách |

***

### 1.2 Mục Tiêu (Objective)

#### 1.2.1 Thực Trạng

Thị trường ứng dụng học TOEIC tại Việt Nam hiện tại được cung cấp bởi nhiều nền tảng như Duolingo, ELSA Speak, các app nội địa (TOEIC Pro, Prep.vn) nhưng đều thiết kế theo tư duy **function-first** — tức tập trung vào nội dung học thuần túy mà thiếu cơ chế duy trì động lực dài hạn. Người học thường bỏ cuộc sau 2–4 tuần do:[^1]

- Thiếu cảm giác tiến bộ rõ ràng và tức thì
- Không có vòng phản hồi (feedback loop) sau mỗi câu trả lời
- Chưa kết nối được điểm TOEIC luyện tập với mục tiêu nghề nghiệp cá nhân
- Thiếu tính cộng đồng và cạnh tranh lành mạnh giữa người học

Thực tế chứng minh: Duolingo đã tăng retention rate từ 47% lên 55% bằng cách chia nhỏ việc học thành các mục tiêu ngắn có thể đạt được trong một phiên học. Người dùng có streak 7+ ngày có retention rate cao hơn 30% so với nhóm không có streak.[^1]

#### 1.2.2 Nghiên Cứu Thị Trường & Đối Thủ

Khung **Octalysis** của Yu-kai Chou — được trích dẫn trong hơn 3.700 nghiên cứu khoa học — phân tích hành vi người dùng qua 8 Core Drive (Động lực Cốt lõi), thay vì chỉ tập trung vào chức năng kỹ thuật. Các đối thủ quốc tế tiêu biểu như Duolingo và Memrise đã ứng dụng thành công mô hình này. Tuy nhiên, thị trường Việt Nam chưa có sản phẩm EdTech nào kết hợp:[^1]

- **Gamification chuẩn Octalysis** (8 Core Drive đầy đủ)
- **Hệ thống nhân vật RPG** gắn liền với mốc điểm TOEIC thực tế
- **Adaptive Learning Engine** dựa trên IRT (Item Response Theory)

Nguy cơ "Pointsification" — khi người học chỉ tập trung vào điểm thưởng bề mặt mà không tiếp thu kiến thức thực sự — là bài học quan trọng rút ra từ các nghiên cứu học thuật. Thiết kế cần áp dụng chiến lược **3-Phase Motivation Bridge** để chuyển hóa động lực từ ngoại vi sang nội tại.[^1]

#### 1.2.3 Nội Dung Triển Khai Tổng Quan

Xây dựng ứng dụng học TOEIC tích hợp cơ chế Gamification theo khung Octalysis và hệ thống quản lý nhân vật nhập vai (RPG Character System). Chiến lược cốt lõi: chuyển hóa hành trình học từ **"chuỗi bài tập nhàm chán"** thành **"cuộc phiêu lưu phát triển nghề nghiệp"**, trong đó mỗi điểm TOEIC tăng lên tương ứng với cấp bậc nhân vật thăng tiến rõ ràng.[^1]

#### 1.2.4 Mục Tiêu

| STT | Mục tiêu | Chỉ số đo lường | Timeline |
|---|---|---|---|
| 1 | Tạo thói quen học hàng ngày bền vững | Streak 7-day Rate > 25%; DAU/MAU > 0.4 | Tháng 3 sau launch |
| 2 | Cải thiện kết quả học thực sự | Sim Score tăng ≥ 50 điểm TOEIC trong 60 ngày | Tháng 2 sau launch |
| 3 | Xây dựng cộng đồng học tập | Guild active > 500 nhóm; PvP match/ngày > 10,000 | Tháng 6 sau launch |
| 4 | Đạt doanh thu bền vững | Premium conversion > 8%; Churn < 5%/tháng | Tháng 6 sau launch |

#### 1.2.5 Lợi Ích Triển Khai

**Lợi ích cho người học:**
- Trải nghiệm học TOEIC gắn kết, có ý nghĩa — không còn cảm giác "học để thi"
- Thấy rõ tiến bộ thực sự qua Estimated TOEIC Score được tính từ dữ liệu học
- Cộng đồng hỗ trợ lẫn nhau (Guild, PvP, Mentor System)

**Lợi ích cho doanh nghiệp:**
- Mô hình freemium có tiềm năng monetize cao (Premium 99K–249K VNĐ/tháng)
- Data học tập phong phú phục vụ phát triển Adaptive Learning Engine
- Nền tảng mở rộng sang TOEIC 4 Skills (Phase 3) và B2B Corporate

***

### 1.3 Tiêu Chí Thành Công (Success Criteria)

#### 1.3.1 Chỉ Số Đánh Giá Hiệu Quả (Metrics to Measure Success)

| KPI | Định Nghĩa | Target (M6 sau Launch) | Công thức |
|---|---|---|---|
| DAU | Người dùng hoạt động/ngày | > 40% of registered | Firebase DAU |
| MAU | Người dùng hoạt động/tháng | > 70% of registered | Firebase MAU |
| DAU/MAU Ratio | Chỉ số "Stickiness" | > 0.4 | DAU ÷ MAU[^1] |
| Streak 7-Day Rate | % user duy trì streak ≥ 7 ngày | > 25% | Custom event |
| Day-1 Retention | % user quay lại ngày 2 | > 55% | Users_Day2 / Users_Day1[^1] |
| Day-7 Retention | % user quay lại ngày 8 | > 35% | Users_Day8 / Users_Day1[^1] |
| Day-30 Retention | % user quay lại ngày 31 | > 20% | Users_Day31 / Users_Day1[^1] |
| Premium Conversion | % chuyển từ Free sang Premium | > 8% | Premium_Users / Total_Users |
| Churn Rate | % user hủy premium/tháng | < 5% | Churned / Active_Premium |

#### 1.3.2 Chỉ Số Vận Hành (Metrics to Monitor)

| KPI | Định Nghĩa | Ý Nghĩa Vận Hành |
|---|---|---|
| Session Length | Thời gian trung bình/phiên | Target: 18–25 phút — dưới mức này cần xem lại nội dung[^1] |
| Daily Quest Completion Rate | % hoàn thành 3 quest/ngày | Target: > 55% — chỉ báo engagement chất lượng |
| Quiz Accuracy per Part | % đúng theo Part 1–7 | Nhận diện điểm yếu cá nhân để điều chỉnh nội dung |
| Sim Score Progression | Thay đổi Estimated TOEIC Score/tháng | Chỉ báo hiệu quả học thực sự |
| Skill Tree Completion Rate | % node đã mở khóa / tổng node | Tiến độ lộ trình học |
| Error Rate by Grammar Topic | % sai theo từng chủ điểm ngữ pháp | Input cho AI gợi ý bài học tiếp theo |

#### 1.3.3 Chỉ Số Chất Lượng Dịch Vụ (KPI)

Các chỉ số chất lượng dịch vụ KPI cần được đảm bảo tối thiểu theo Bộ tiêu chuẩn chất lượng dịch vụ VDS. Các chỉ số bổ sung thêm:

| Chỉ số | Ngưỡng tối thiểu |
|---|---|
| Thời gian phản hồi Micro Feedback | ≤ 2 giây sau khi bấm đáp án |
| Uptime hệ thống | ≥ 99.5%/tháng |
| Thời gian tải màn hình chính | ≤ 3 giây (4G) |
| Độ trễ PvP Real-time | ≤ 500ms (WebSocket) |
| Tỷ lệ crash | < 0.1% sessions |

***

### 1.4 Yêu Cầu Sản Phẩm (Product Specification)

#### 1.4.1 Tổng Quan

| Hạng mục | Nội dung |
|---|---|
| **Đối tượng sử dụng** | Người học TOEIC Listening & Reading, từ 18–35 tuổi, sinh viên đại học và nhân viên đi làm cần chứng chỉ TOEIC cho mục đích xin việc/thăng tiến; không giới hạn trình độ ban đầu |
| **Kênh sử dụng** | App Mobile (iOS + Android), thiết kế mobile-first |
| **Điều kiện** | Smartphone hoặc tablet có kết nối Internet (3G/4G/WiFi); không yêu cầu điều kiện KYC hoặc tài khoản ngân hàng (trừ tính năng Premium payment) |
| **Chính sách** | Free Tier: truy cập 70% nội dung Skill Tree, Daily Quest cơ bản, Leaderboard xem; Premium (99,000 VNĐ/tháng): full content, Unlimited PvP, Full Mock Tests, AI suggestions, No Ads; Premium+ (249,000 VNĐ/tháng): + 1:1 AI Tutor, báo cáo phân tích chuyên sâu, Exam Voucher discount[^1] |

#### 1.4.2 Yêu Cầu Chức Năng

##### Biểu Đồ Mô Tả Luồng Chính

```mermaid
sequenceDiagram
    actor User
    participant App as Mobile App
    participant BE as Backend API
    participant AI as AI Engine
    participant DB as Database

    User->>App: Mở ứng dụng
    App->>BE: GET /user/profile
    BE->>DB: Query user stats
    DB-->>BE: User data + KP + Streak
    BE-->>App: Trả về Dashboard

    User->>App: Chọn Daily Quest
    App->>BE: GET /quest/daily/{userId}
    BE->>AI: Request personalized quest
    AI-->>BE: Quest được cá nhân hóa (IRT)
    BE-->>App: Hiển thị Quest

    User->>App: Trả lời câu hỏi
    App->>BE: POST /quiz/answer {questionId, answer, timeSpent}
    BE->>AI: Evaluate + Calculate KP
    AI-->>BE: KP = Base × Difficulty × Speed × Streak
    BE->>DB: Update user progress
    BE-->>App: Immediate Feedback (≤ 2 giây)
    App->>User: Micro Feedback Animation + Explanation

    alt KP đạt ngưỡng Rank-up
        BE-->>App: Rank-up event
        App->>User: Full-screen Rank-up Ceremony Animation
    end
```

***

##### Bảng Hành Trình Khách Hàng (User Story Map)

| Chặng | User Story | Use Case | Mô Tả Hành Trình |
|---|---|---|---|
| **Chặng 1: Nhận thức** | US-01: Phát hiện app | UC-01 | Người dùng tìm kiếm app học TOEIC trên Store, thấy app với cơ chế RPG độc đáo |
| **Chặng 2: Tìm hiểu** | US-02: Xem giới thiệu | UC-02 | Xem demo nhân vật, đọc reviews, hiểu cơ chế KP & Level-up |
| **Chặng 3: Onboarding** | US-03: Cài đặt & Đặt mục tiêu | UC-03 | Đặt mục tiêu điểm TOEIC + deadline; làm Placement Test 20 câu (15 phút) |
| **Chặng 3: Onboarding** | US-04: Tạo nhân vật | UC-04 | Chọn avatar, đặt tên, nhận Rank tương ứng điểm Placement; xem 6 Stat |
| **Chặng 4: Sử dụng** | US-05: Daily Quest hàng ngày | UC-05 | Hoàn thành 3 Daily Core Quest (30 phút): Từ vựng + Nghe + Ngữ pháp |
| **Chặng 4: Sử dụng** | US-06: Quiz & Feedback | UC-06 | Trả lời câu hỏi, nhận Micro Feedback tức thì + giải thích 3 tầng |
| **Chặng 4: Sử dụng** | US-07: Skill Tree | UC-07 | Mở khóa node kỹ năng theo lộ trình cá nhân hóa từ Placement Test |
| **Chặng 4: Sử dụng** | US-08: PvP Battle | UC-08 | Thách đấu 1v1 với người học cùng trình độ (ELO-based matchmaking) |
| **Chặng 4: Sử dụng** | US-09: Guild | UC-09 | Tạo/tham gia nhóm học, hoàn thành Guild Quest, chat & chia sẻ tip |
| **Chặng 4: Sử dụng** | US-10: Streak & Phần thưởng | UC-10 | Duy trì streak học liên tiếp, nhận milestone rewards (Rương Đồng/Bạc/Vàng) |
| **Chặng 4: Sử dụng** | US-11: Full Mock Test (Dungeon) | UC-11 | Vào Dungeon thi thử toàn bộ (không thoát giữa chừng), nhận báo cáo chi tiết |
| **Chặng 4: Sử dụng** | US-12: Rank-up Ceremony | UC-12 | Tích lũy đủ KP → Rank-up animation → Nhân vật thay trang phục mới |
| **Chặng 5: Xử lý lỗi** | US-13: CSKH & báo lỗi câu hỏi | UC-13 | Báo cáo câu hỏi sai, liên hệ hỗ trợ qua in-app chat |
| **Chặng 6: Gắn bó/Rời bỏ** | US-14: Nâng cấp Premium | UC-14 | Trigger sau Streak 14 ngày hoặc sau Full Mock Test → pop-up Premium |
| **Chặng 7: Kết nối** | US-15: Chia sẻ tiến độ | UC-15 | Chia sẻ Rank-up lên mạng xã hội; mời bạn vào Guild |

***

##### Đặc Tả Chi Tiết Theo User Story

***

**US-03: Placement Test & Onboarding**

| User Story | Mô Tả | Mockup | Note |
|---|---|---|---|
| US-03 — B1 | Người dùng mở app lần đầu, thấy màn hình "Hành Trình TOEIC của bạn bắt đầu!" với 2 CTA: Đặt mục tiêu điểm TOEIC + Deadline | Màn hình Splash → Onboarding Goal Setting | Input: Target score (300/450/600/750/850/900+), Deadline (1/3/6/12 tháng) |
| US-03 — B2 | Placement Test 20 câu, 15 phút: 8 câu Part 5 Grammar, 6 câu Part 7 Reading, 6 câu Part 1–2 Listening | Màn hình quiz chuẩn, timer countdown | Kết thúc: Hiển thị "Trình độ hiện tại: ~[X] TOEIC" |
| US-03 — B3 | Phân tích kết quả Placement Test → tự động gợi ý Rank khởi đầu + lộ trình học cá nhân hóa | Màn hình Result + Character unlock | IRT scoring engine tính điểm theo độ khó câu hỏi[^1] |

***

**US-05 & US-06: Daily Quest & Immediate Feedback Loop**

| User Story | Mô Tả | Mockup | Note |
|---|---|---|---|
| US-05 — B1 | Home Dashboard hiển thị: Streak hiện tại, Daily Quest 3 nhiệm vụ (progress bar), Estimated TOEIC Score hôm nay | Home Dashboard | Daily Core Quest: DQ-01 Từ Vựng (15p/+80KP), DQ-02 Nghe Part 1–2 (10p/+60KP), DQ-03 Flash Quiz Ngữ Pháp (5p/+40KP)[^1] |
| US-05 — B2 | Người dùng chọn Daily Quest → bắt đầu phiên học | Quest Selection Screen | Daily Challenge mở sau khi hoàn thành Core (DC-01 Boss Battle +150KP, DC-02 Sniper Listening +150KP, DC-03 PvP +200KP)[^1] |
| US-06 — B1 | Người dùng chọn đáp án → **Micro Feedback ≤ 2 giây**: ✅ CHÍNH XÁC (+KP, confetti, âm thanh) hoặc ❌ CHƯA ĐÚNG (+1 Insight Point, không mất KP) | Quiz Screen + Feedback overlay | KP = Base_KP × Difficulty_Multiplier × Speed_Bonus × Streak_Multiplier[^1] |
| US-06 — B2 | Mở rộng xem giải thích 3 tầng: Tầng 1 (Quy tắc 1 dòng, luôn hiển thị) → Tầng 2 (Phân tích cấu trúc, nhấn "Xem thêm") → Tầng 3 (Mnemonics + ví dụ, nhấn "Học sâu") | Explanation Card expandable | Progressive Disclosure — tránh information overload[^1] |
| US-06 — B3 | Session Summary cuối phiên: Tổng KP, Tỷ lệ đúng/sai theo skill, Top 3 điểm yếu AI gợi ý, Tiến độ Level-up | Session Summary Screen | Nếu đủ KP → auto trigger US-12 Rank-up Ceremony |

***

**US-07: Skill Tree**

| User Story | Mô Tả | Mockup | Note |
|---|---|---|---|
| US-07 — B1 | Người dùng vào Skill Tree, thấy toàn bộ lộ trình từ Điểm Xuất Phát → TOEIC Mastery 905+ với 2 nhánh: Listening (L-01→L-★) và Reading (R-01→R-★) | Skill Tree Map Screen | Node đã hoàn thành: màu vàng sáng; Node đang mở: màu xanh; Node khóa: màu xám[^1] |
| US-07 — B2 | Nhấn vào node → Hiển thị: Tên kỹ năng, KP nhận được, Điều kiện mở khóa, Nội dung học | Node Detail Popup | Ví dụ: L-03 Short Conversations — cần hoàn thành L-02 + Grammar Power ≥ 30[^1] |
| US-07 — B3 | Node Dungeon (L-★, R-★, FULL-★): Khi vào không thể thoát giữa chừng — tạo cảm giác "boss fight" có trọng lượng như thi thật | Dungeon Entry Warning Screen | FULL-★: Full TOEIC Mock Test 200 câu, +15,000 KP[^1] |

***

**US-08: PvP Quiz Battle**

| User Story | Mô Tả | Mockup | Note |
|---|---|---|---|
| US-08 — B1 | Vào PvP Mode, chọn loại: Ranked / Casual / Challenge Friend | PvP Lobby | Yêu cầu: Rank ≥ Học Việc (≥ 2,000 KP) để vào Ranked[^1] |
| US-08 — B2 | Matchmaking ELO-based (±100 Elo), pre-match countdown 5 giây | Matchmaking Screen | ELO mặc định: 1,000; Win vs mạnh hơn: +30 ELO[^1] |
| US-08 — B3 | Battle: 10 câu, mỗi câu 20 giây. Cả 2 người cùng thấy câu hỏi. Trả lời nhanh + đúng = nhiều điểm hơn. Real-time: "Đối thủ đã trả lời!" | Battle Screen real-time | Backend: WebSocket cho real-time PvP[^1] |
| US-08 — B4 | Kết quả: Win (+ELO, +300 KP, có thể drop item) / Lose (-ELO nhỏ, +50 KP consolation) / Rematch option | Result Screen | Consolation KP tránh churn sau thua[^1] |

***

**US-10: Streak System**

| User Story | Mô Tả | Mockup | Note |
|---|---|---|---|
| US-10 — B1 | Streak Counter hiển thị prominent trên Home, widget ngoài màn hình. Mỗi ngày hoàn thành ≥ 1 Daily Core Quest = +1 ngày streak | Home Dashboard — Streak Widget | |
| US-10 — B2 | Streak Freeze: Mua bằng 500 KP/lần để bảo vệ streak 1 ngày; nhận tự động khi đạt milestone | Streak Freeze Purchase Screen | Thiếu cơ chế này là lý do phổ biến nhất gây churn khi người dùng lỡ 1 ngày[^1] |
| US-10 — B3 | Streak Recovery: Trong 24h sau khi mất streak, hoàn thành 2× daily quest để khôi phục | Recovery Prompt Notification | Push notification nhắc nhở sau 20 giờ không học[^1] |
| US-10 — B4 | Milestone rewards: 3 ngày → Badge + 200 KP; 7 ngày → Streak Freeze + 500 KP; 14 ngày → Rương Đồng; 30 ngày → Rương Vàng; 100 ngày → Avatar Frame độc quyền | Milestone Celebration Screen | [^1] |

***

**US-12: Rank-up Ceremony & Character System**

| User Story | Mô Tả | Mockup | Note |
|---|---|---|---|
| US-12 — B1 | KP tích lũy đạt ngưỡng Rank mới → Full-screen animation: nhân vật thay trang phục, hoan hô + nhạc ấn tượng | Rank-up Full-screen Animation | 6 Rank từ 🌱 Thực Tập Sinh (0 KP) → 👑 Giám Đốc (100,000 KP)[^1] |
| US-12 — B2 | Thông báo Career milestone: "Bạn đã đạt Rank [Tên]! Tương đương TOEIC ~[điểm]. Bạn đủ điều kiện ứng tuyển vị trí [X] tại các công ty quốc tế!" | Career Milestone Card | Kết nối điểm TOEIC với mục tiêu nghề nghiệp thực tế[^1] |
| US-12 — B3 | Character Profile hiển thị 6 Stat: 🛡️ Grammar Power, 📖 Reading Speed, 👂 Listening Reflex, 📝 Vocabulary Bank, 🧩 Error Pattern IQ, ⚡ Stamina — tính từ dữ liệu học thực tế | Character Stat Sheet | Estimated TOEIC Score = f(Listening Reflex, Grammar Power, Reading Speed, Vocabulary Bank)[^1] |

***

#### 1.4.3 Yêu Cầu Phi Chức Năng

| Hạng mục | Yêu cầu |
|---|---|
| **Performance** | Micro Feedback ≤ 2 giây; Màn hình chính load ≤ 3 giây trên 4G; PvP latency ≤ 500ms |
| **Scalability** | Hỗ trợ ≥ 100,000 concurrent users; Leaderboard real-time cập nhật ≤ 5 giây |
| **Security** | Mã hóa dữ liệu người dùng (AES-256); OAuth2 authentication; Chống gian lận PvP (server-side validation) |
| **Platform** | iOS 14+ / Android 8+; React Native hoặc Flutter (cross-platform)[^1] |
| **Accessibility** | Hỗ trợ font size điều chỉnh; High contrast mode; Audio descriptions cho Listening questions |
| **Offline** | Daily Quest core có thể làm offline; tự động sync khi có Internet |
| **Analytics** | Firebase Analytics + Mixpanel cho event tracking; Push notification qua FCM[^1] |

***

### 1.5 Yêu Cầu Đặt Event Tracking

✅ Đặt event tracking trên hệ thống **EVT**  
✅ Đặt event tracking trên hệ thống **Adjust**  
☐ Không đặt event tracking

*(Chi tiết event sẽ hoàn thiện khi Design được chốt final và PO đã transfer bài toán đầy đủ cho team phát triển)*

| STT | Event_name | Event_type | Hệ thống | Mô tả |
|---|---|---|---|---|
| 1 | `toeic_app_open` | Session | EVT + Adjust | Mở app — ghi nhận DAU |
| 2 | `placement_test_complete` | Onboarding | EVT + Adjust | Hoàn thành Placement Test; attribute: {estimated_score, rank_assigned} |
| 3 | `character_created` | Onboarding | EVT + Adjust | Tạo nhân vật thành công |
| 4 | `daily_quest_start` | Engagement | EVT | Bắt đầu daily quest; attribute: {quest_id, quest_type} |
| 5 | `daily_quest_complete` | Engagement | EVT + Adjust | Hoàn thành daily quest; attribute: {kp_earned, accuracy_rate} |
| 6 | `quiz_answer_submit` | Learning | EVT | Trả lời câu hỏi; attribute: {question_id, part, is_correct, time_spent} |
| 7 | `streak_updated` | Retention | EVT + Adjust | Cập nhật streak; attribute: {streak_days, streak_freeze_used} |
| 8 | `rank_up` | Milestone | EVT + Adjust | Thăng hạng; attribute: {new_rank, kp_total, estimated_toeic_score} |
| 9 | `pvp_match_complete` | Social | EVT + Adjust | Kết thúc PvP; attribute: {result: win/lose/draw, elo_change} |
| 10 | `guild_joined` | Social | EVT | Tham gia Guild |
| 11 | `premium_purchase_initiated` | Revenue | EVT + Adjust | Bắt đầu luồng mua Premium |
| 12 | `premium_purchase_success` | Revenue | EVT + Adjust | Mua Premium thành công; attribute: {tier, price, trigger_source} |
| 13 | `streak_broken` | Churn Signal | EVT + Adjust | Mất streak — trigger re-engagement campaign |
| 14 | `dungeon_entered` | Engagement | EVT | Vào Dungeon (Mock Test) |
| 15 | `dungeon_completed` | Milestone | EVT + Adjust | Hoàn thành Dungeon; attribute: {dungeon_type, score_result} |

***

## 2 — YÊU CẦU CÔNG CỤ / BÁO CÁO / VẬN HÀNH

### 2.1 Yêu Cầu Báo Cáo/Công Cụ Vận Hành Cho Bộ Phận Kinh Doanh

**Báo cáo kinh doanh cần bao gồm:**

| Trường thông tin | Định nghĩa | Tần suất | Kênh nhận |
|---|---|---|---|
| Tổng MAU / DAU | Người dùng hoạt động tháng/ngày | Daily | Dashboard tự động |
| Premium Revenue | Doanh thu từ tất cả gói Premium (VNĐ) | Daily + Monthly | Email + Dashboard |
| New Registrations | Số tài khoản mới trong ngày/tuần/tháng | Daily | Dashboard |
| Premium Conversion Rate | % Free → Premium | Weekly | Dashboard |
| Churn Rate | % hủy Premium/tháng | Monthly | Email |
| LTV (Lifetime Value) | Doanh thu trung bình/user từ khi đăng ký | Monthly (sau 6 tháng đủ data) | Dashboard |
| Revenue by Channel | Doanh thu theo kênh acquisition | Monthly | Email |

**Công cụ vận hành kinh doanh:**
- Dashboard Business: Tham khảo mẫu BM 02.2.1. Mẫu dashboard kinh doanh
- Phân quyền: Chỉ nhân viên kinh doanh được xem dữ liệu doanh thu; không được xem dữ liệu học cá nhân của user
- Kênh: Web dashboard tại hệ thống báo cáo nội bộ

### 2.2 Yêu Cầu Báo Cáo/Công Cụ Vận Hành Cho Bộ Phận Sản Phẩm

**Báo cáo sản phẩm cần bao gồm:**

| Trường thông tin | Định nghĩa | Tần suất |
|---|---|---|
| Retention D1 / D7 / D30 | % user quay lại sau 1/7/30 ngày | Weekly cohort |
| Streak 7-day Rate | % user duy trì streak ≥ 7 ngày | Daily |
| Daily Quest Completion Rate | % hoàn thành 3 quest/ngày | Daily |
| Skill Tree Node Completion | % node đã mở khóa theo từng nhóm user | Weekly |
| Sim Score Progression | Thay đổi Estimated TOEIC Score trung bình/tháng | Monthly |
| PvP Match Volume | Số trận PvP/ngày + Win rate theo Rank | Daily |
| Content Error Rate | Số báo cáo lỗi câu hỏi / tổng câu | Weekly |
| Feature Adoption | % user sử dụng từng tính năng mới trong 7 ngày đầu | Post-release |

**Công cụ vận hành sản phẩm:**
- Dashboard Experience: Tham khảo mẫu BM 02.2.2. Mẫu dashboard trải nghiệm hành trình KH
- Mixpanel Funnel Analysis cho Onboarding funnel (Cài app → Placement Test → Quest 1 → Day 3)
- Firebase Crashlytics để theo dõi crash rate

### 2.3 Yêu Cầu Công Cụ CSKH

| Chức năng | Mô tả | Phân quyền |
|---|---|---|
| Tra cứu tài khoản user | Tìm kiếm theo email/phone/userId | CSKH Level 1+ |
| Xem lịch sử học | Xem streak, KP, Rank, Sim Score của user | CSKH Level 1+ |
| Reset Streak | Khôi phục streak khi user phản ánh lỗi hệ thống (không phải lỗi người dùng) | CSKH Level 2 |
| Refund Premium | Hoàn tiền gói Premium trong vòng 7 ngày theo chính sách | CSKH Level 2 |
| Báo lỗi câu hỏi | Escalate lỗi câu hỏi đến Content Team | CSKH Level 1+ |
| Tra cứu lịch sử thanh toán | Xem giao dịch mua Premium | CSKH Level 1+ |

**Kênh triển khai:** CRM nội bộ + tích hợp in-app Help Center

### 2.4 Yêu Cầu Đối Soát

| Hạng mục | Nội dung |
|---|---|
| Đối soát doanh thu Premium | So khớp giao dịch thanh toán (App Store / Google Play / MoMo / ZaloPay) với dữ liệu hệ thống |
| Tần suất | Hàng ngày (T+1) |
| Phân quyền | Bộ phận Đối soát Tài chính |
| Kênh | Web portal đối soát nội bộ |
| Điều kiện xử lý chênh lệch | Chênh lệch > 0 VNĐ cần tạo ticket xử lý trong vòng 24h |

### 2.5 Yêu Cầu Vận Hành KSCL

Báo cáo chất lượng dịch vụ cần xây dựng tại hệ thống báo cáo nội bộ theo Mẫu BM 02.05. Mẫu báo cáo chất lượng dịch vụ, bao gồm:

| Chỉ số KSCL | Ngưỡng cảnh báo | Ngưỡng vi phạm |
|---|---|---|
| API Response Time trung bình | > 1 giây | > 3 giây |
| PvP Latency (WebSocket) | > 300ms | > 500ms |
| App Crash Rate | > 0.05% sessions | > 0.1% sessions |
| Uptime | < 99.9% | < 99.5% |
| Thời gian Micro Feedback | > 1 giây | > 2 giây |
| Push Notification Delivery Rate | < 90% | < 85% |

***

## 3 — YÊU CẦU ĐẶT EVENT TRACKING (Chi Tiết)

*(Xem mục 1.5 — bảng Event Tracking đã được định nghĩa đầy đủ. Nội dung chi tiết hình ảnh sẽ bổ sung sau khi Design được chốt final.)*

***

## 4 — NỘI DUNG THÔNG BÁO

### Bảng Yêu Cầu Chi Tiết Nội Dung Thông Báo

| TT | Mã thông báo | Tên thông báo | Nội dung thông báo | Hình thức | Note |
|---|---|---|---|---|---|
| 1 | TOEIC_220626_001 | Nhắc học hàng ngày | "🎯 [Tên nhân vật], streak [X] ngày của bạn đang chờ! Hoàn thành Daily Quest hôm nay trong 30 phút." | Push Notification | Gửi lúc 20:00 nếu user chưa học trong ngày |
| 2 | TOEIC_220626_002 | Cảnh báo mất streak | "⚠️ Streak [X] ngày của bạn sẽ mất sau 4 tiếng nữa! Dùng Streak Freeze hoặc học ngay." | Push Notification | Gửi khi còn < 4h trong ngày chưa học |
| 3 | TOEIC_220626_003 | Streak Recovery | "💪 Streak [X] ngày của bạn vừa mất. Nhưng bạn có 24h để hồi phục! Hoàn thành 2 quest ngay hôm nay." | Push Notification + In-app | Gửi ngay sau khi streak bị mất |
| 4 | TOEIC_220626_004 | Rank-up thành công | "🎉 Chúc mừng! Bạn đã đạt Rank [Tên Rank]! Tương đương TOEIC ~[Điểm] điểm. Nhân vật của bạn đã tiến hóa!" | Push Notification + In-app popup | Gửi ngay khi KP đạt ngưỡng |
| 5 | TOEIC_220626_005 | Milestone streak | "🔥 Tuyệt vời! Streak [X] ngày! Bạn vừa nhận được [Phần thưởng]. Tiếp tục phá kỷ lục nào!" | Push Notification + In-app | Gửi khi đạt milestone 3/7/14/30/60/100 ngày |
| 6 | TOEIC_220626_006 | PvP Challenge từ bạn | "⚔️ [Tên bạn] đã thách đấu bạn! Chấp nhận và bảo vệ ELO của mình." | Push Notification | Gửi khi nhận thách đấu |
| 7 | TOEIC_220626_007 | Guild Quest sắp hết hạn | "🏰 Guild của bạn còn [X] giờ để hoàn thành Guild Quest! Đóng góp ngay." | Push Notification | Gửi 6h trước deadline Guild Quest |
| 8 | TOEIC_220626_008 | Trigger Premium (sau 14 ngày streak) | "⭐ Bạn đang học rất tốt với streak  ngày! Nâng cấp Premium để mở Full Mock Test và AI Tutor không giới hạn." | In-app popup | Chỉ hiển thị 1 lần, không spam |
| 9 | TOEIC_220626_009 | Premium sắp hết hạn | "📅 Gói Premium của bạn hết hạn sau [X] ngày. Gia hạn để không bị gián đoạn hành trình TOEIC." | Push Notification + Email | Gửi 7 ngày và 3 ngày trước khi hết hạn |
| 10 | TOEIC_220626_010 | Double XP Weekend | "🎊 DOUBLE XP WEEKEND! Mọi hoạt động học hôm nay được nhân 2 KP. Đừng bỏ lỡ!" | Push Notification + In-app banner | Gửi vào thứ 6 tối trước sự kiện |

***

## 5 — ROADMAP TRIỂN KHAI

### Phase 1 — MVP (Tháng 1–3): TOEIC L&R Core

| Feature | Priority | Effort | GoLive |
|---|---|---|---|
| Placement Test + Character creation | P0 | M | T1 |
| Daily Quest system (3 quests core) | P0 | M | T1 |
| Immediate Feedback 3 layers | P0 | M | T1 |
| KP & Level system (6 Ranks) | P0 | S | T1 |
| Skill Tree (L&R — cơ bản 12 nodes) | P0 | L | T2 |
| Streak system (Counter + Freeze + Recovery) | P1 | S | T2 |
| Leaderboard (weekly, league-based) | P1 | M | T3 |
| Event Tracking (EVT + Adjust) | P0 | S | T1 |
| Premium subscription (basic tier) | P1 | M | T3 |

### Phase 2 — Growth (Tháng 4–6): Social & Retention

| Feature | Priority | Effort | GoLive |
|---|---|---|---|
| PvP Quiz Battle 1v1 (ELO + WebSocket) | P0 | XL | T4 |
| Guild system (20 members/guild) | P1 | L | T5 |
| Full Mock Test — Dungeon (L-★, R-★, FULL-★) | P0 | M | T4 |
| AI Adaptive Learning Engine v1 (IRT + Spaced Repetition) | P1 | XL | T5 |
| Streak Wager (cam kết streak) | P1 | S | T4 |
| Premium+ tier | P1 | M | T6 |
| Special Events (Double XP, Grammar Challenge Week) | P2 | S | T5 |

### Phase 3 — Scale (Tháng 7–12): Full 4 Skills & B2B

| Feature | Priority | Effort |
|---|---|---|
| TOEIC Speaking integration | P1 | XL |
| TOEIC Writing integration | P1 | XL |
| AI Speaking Evaluation (STT + scoring) | P1 | XL |
| Advanced Analytics Dashboard | P2 | L |
| Corporate B2B Portal | P2 | XL |

***

## 6 — PHỤ LỤC

### A. Kiến Trúc Kỹ Thuật Đề Xuất

| Layer | Công nghệ | Lý do |
|---|---|---|
| Mobile Frontend | React Native / Flutter | Cross-platform iOS + Android[^1] |
| Backend API | Node.js + FastAPI | Real-time PvP cần WebSocket[^1] |
| Database | PostgreSQL + Redis | PostgreSQL cho user data; Redis cho session/leaderboard real-time[^1] |
| AI/ML | Python (scikit-learn / TF Lite) | Adaptive learning, IRT scoring[^1] |
| Analytics | Mixpanel + Firebase | Event tracking, funnel analysis[^1] |
| Notification | Firebase Cloud Messaging | Push notification cho streak reminder[^1] |
| Content CMS | Contentful / Strapi | Quản lý đề thi, từ vựng linh hoạt[^1] |
| Payments | App Store IAP + Google Play IAP | Native in-app purchase |

### B. Bảng Tổng Hợp Thiết Kế Gamification

| Cơ Chế | Octalysis Core Drive | Loại Động Lực | Risk Level | Mitigation |
|---|---|---|---|---|
| KP & Level System | CD2 — Phát triển & Thành tựu | Ngoại vi → Nội tại | Trung bình | Gắn KP với Sim Score thực[^1] |
| Daily Quest | CD2 — Phát triển & Thành tựu | Ngoại vi → Nội tại | Thấp | Quest có giá trị học thực[^1] |
| Immediate Feedback | CD3 — Sáng tạo & Phản hồi | Nội tại | Rất thấp | Luôn có giải thích 3 tầng[^1] |
| Character & Skill Tree | CD4 — Sở hữu & Tài sản | Ngoại vi + Nội tại | Thấp | Unlock = mở nội dung học[^1] |
| PvP & Leaderboard | CD5 — Ảnh hưởng Xã hội | Ngoại vi | Cao | League-based, không global ranking[^1] |
| Streak System | CD8 — Mất mát & Né tránh (Dark) | Ngoại vi | Cao | Streak Freeze + Recovery bắt buộc[^1] |
| Guild & Mentorship | CD5 — Ảnh hưởng Xã hội | Nội tại | Thấp | Community = intrinsic value[^1] |

### C. Mapping Rank — Điểm TOEIC — Career Milestone

| Cấp Bậc | Điểm TOEIC | CEFR | Danh Hiệu | KP Cần Đạt |
|---|---|---|---|---|
| 🌱 Rank 1 | 10–250 | A1 | Thực Tập Sinh | 0 |
| 📋 Rank 2 | 255–400 | A2 | Nhân Viên Mới Vào Nghề | 2,000 KP |
| 💼 Rank 3 | 405–600 | B1 | Chuyên Viên | 8,000 KP |
| 🏆 Rank 4 | 605–780 | B1–B2 | Chuyên Viên Cấp Cao | 20,000 KP |
| ⭐ Rank 5 | 785–900 | B2 | Quản Lý / Team Lead | 45,000 KP |
| 👑 Rank 6 | 905–990 | C1 | Giám Đốc / Chuyên Gia Quốc Tế | 100,000 KP |

*(Tham chiếu: Thang điểm TOEIC L&R chính thức 10–990; CEFR C1 ≥ 945, B2: 785–944, B1: 550–784)*[^1]

### D. Glossary (Thuật Ngữ)

| Thuật Ngữ | Định Nghĩa |
|---|---|
| KP (Knowledge Points) | Điểm kinh nghiệm trong ứng dụng, tương đương XP trong game RPG |
| Octalysis | Khung gamification 8 động lực cốt lõi của Yu-kai Chou[^1] |
| IRT | Item Response Theory — lý thuyết đo lường năng lực dựa trên độ khó câu hỏi |
| ELO | Hệ thống xếp hạng cạnh tranh trong PvP matchmaking |
| Dungeon | Phó bản — nội dung thử thách cao cấp có điều kiện mở khóa, không thể thoát giữa chừng |
| Streak | Chuỗi ngày học liên tục không bỏ lỡ |
| Spaced Repetition | Kỹ thuật ôn tập theo chu kỳ tăng dần dựa trên đường cong quên lãng |
| Sim Score | Estimated TOEIC Score — Điểm TOEIC ước tính từ kết quả luyện tập[^1] |
| Core Drive (CD) | Một trong 8 động lực cốt lõi trong khung Octalysis |
| DAU/MAU | Daily/Monthly Active Users — chỉ số đo lường tương tác ứng dụng[^1] |
| Streak Freeze | Vật phẩm bảo vệ streak 1 ngày khi người dùng lỡ học |
| League | Nhóm 30 người cùng Rank trong Leaderboard tuần (phân nhóm tránh gap lớn)[^1] |
| 3-Phase Motivation Bridge | Chiến lược chuyển hóa: Hook (Tuần 1–2) → Bridge (Tháng 1–2) → Internalize (Tháng 3+)[^1] |

---

## References

1. [PRD-Bao-Cao-Phan-Tich-Gamification-Ung-Dung-Hoc-TOEIC-All-in-One-RPG-Hub.md](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/159685550/790b193c-5323-4585-acb6-d2d92733588a/PRD-Bao-Cao-Phan-Tich-Gamification-Ung-Dung-Hoc-TOEIC-All-in-One-RPG-Hub.md?AWSAccessKeyId=ASIA2F3EMEYES6J6QVYC&Signature=XkOkATMhVTc6SJ1xs3ZU4cq9jpc%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEDMaCXVzLWVhc3QtMSJGMEQCICoV7SmfivGYiDaZU1uj99DNDj4gczCCQoE26igrTToAAiA8VtU18InUlJUNbtrqCijv6kKWoktcR8hDHYwHtZZliir8BAj7%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAEaDDY5OTc1MzMwOTcwNSIML0G4u03yosytBMZIKtAEX0DgxppU5ykGMZgrdTN9FXbBsCWFxq6US5LbBjtHbGD2o4suf0JydSkPlPJ1e6f8XmFJxmuRHEIXZHuduaXknnVDYr9lQfSUMBMbmcwxJHcDh2HooY9eXYjn6SABOvXrvV6wC6x3Y097p%2BB9G%2BvY4M8x6SlvK8QXquYNsjaH81pR25AHogN%2BtrO3Pjh8ml0fqLwjXQ3h0Q%2BEzB%2FsUTy1dXbbKKBDikFhod1%2BTUNeOcQB2NIBrUhrSzbouGAOB%2FH7erZpSQyN%2BZZrPElby2zuc4nH842gmCpmfYH0mYA6AiDxl%2FNneLgq9OS5eXptH%2B0PWdQ8e8DINSFJXvcVuU2beGfCOKbbmkahJF7nz%2FKEL%2BbZG%2F%2Fit9RL8QIec1QVkygA6fej1WCu0HJQi4QQUJv%2BTMC46dGmokL2aWXNXuuT5629157M9UxZON7oTy4F7%2F4OpzyWpG%2F74NWbn08%2Fm98P7fQaLdXG%2FsYsbJSMPNhO4Z8icTQvVUjWFxoyfVpNQ%2FsvNdb9USCwuRjGGH%2BNE%2B0pClCJB%2FeV6DVpGFRBREUCvW5urW22yMfxiNwjg2DVHtJcV1t1C%2BptMJy8O3QFiJjmo3eLCoysZWmSrWfKhMsS5cMh3DM6PR6OfvpUXY7J8sSpqRPuNQ%2BFL5RG%2BaqVAoz79U0mg0TJuj2gGDWIz5M7LfGYnlT4r3RzuhamQuGwvFpovQseHNTnLc49LDb3BMX6g%2B4MQk6LhDqIzUYAfNL1U2Jyn3V9ogCAHnsvrCuOJp39XYyiO7GxWrDS9hjYyn7f4zCRtuLRBjqZATgTL01kMcpnzNdFSb%2F5FvYbzN0ddt%2FmyeFWvWvxQlMjZzrRdk2owk7wAqrL5k7wapRqYpX8%2F5AD9lZdvBdHIu2JAEPLQj2Q03NxuYbWm0mXh%2Bu7CAFLJV5ykWgwzQjjeiYcvdIh0SEZJG8B90E%2FQ5EvZo%2Fbgt3rKmkoZ0m%2FXHCAJmGtMp7BNdQBYRc5e1ljP%2BjPE0qf%2B6DLNw%3D%3D&Expires=1782098148) - # PRD & Báo Cáo Phân Tích Gamification — Ứng Dụng Học TOEIC (All-in-One RPG Hub)

> **Phiên bản:** 1...

