# 📊 Báo Cáo Nghiên Cứu Đối Thủ & Định Nghĩa Chỉ Số KPI
**Người thực hiện:** Mary (Business Analyst)  
**Dự án:** TOEIC Quest RPG Hub  
**Ngày lập:** 23/06/2026  
**Mã tài liệu:** BAREPORT_TOEIC_RPG_v1.0  

---

## I. Tóm Tắt Chiến Lược (Strategic Executive Summary)

Hành trình học TOEIC truyền thống đang gặp lỗ hổng lớn về **duy trì động lực người học (Retention)**. Qua phân tích, chúng tôi nhận thấy các đối thủ hiện tại chủ yếu tập trung vào chức năng học thuật (function-first) mà bỏ quên yếu tố tâm lý học hành vi. 

Áp dụng mô hình **Porter's Five Forces** và nguyên lý **Minto's Pyramid Principle**, chúng tôi đề xuất chiến lược phát triển sản phẩm dựa trên **Gamification chuẩn Octalysis** nhằm tối ưu hóa 3 chỉ số cốt lõi: **Stickiness (DAU/MAU)**, **7-Day Streak Rate**, và **Premium Conversion**.

---

## II. Phân Tích Đối Thủ Cạnh Tranh (Competitor Analysis)

### 1. Duolingo (Đối thủ toàn cầu - Mô hình chuẩn Gamification)
*   **Mô hình:** Freemium + Ad-supported.
*   **Điểm mạnh:**
    *   **Core Drive 8 (Né tránh tổn thất):** Cơ chế Streak cực kỳ mạnh mẽ. Người dùng có Streak 7+ ngày có tỷ lệ Retention cao hơn 30%.
    *   **Core Drive 2 (Phát triển & Thành tựu):** Phân chia cấp độ League (30 người học/nhóm) tạo cảm giác cạnh tranh vừa sức, tránh quá tải.
*   **Điểm yếu:** Chưa cá nhân hóa sâu theo mục tiêu nghề nghiệp thực tế; nội dung học TOEIC chưa chuyên sâu tại Việt Nam.

### 2. Prep.vn & TOEIC Pro (Đối thủ nội địa - Tập trung chức năng học thuật)
*   **Mô hình:** Khóa học trả phí trọn gói (Prep.vn) hoặc Freemium cơ bản (TOEIC Pro).
*   **Điểm mạnh:** Nội dung bám sát cấu trúc đề thi TOEIC thật tại Việt Nam; có ngân hàng câu hỏi phong phú.
*   **Điểm yếu:** Thiếu hoàn toàn vòng phản hồi micro-feedback tức thì; tỷ lệ rụng (churn) cao sau 2-4 tuần do cảm giác học đơn điệu, thiếu kết nối cộng đồng.

---

## III. Thiết Lập Hệ Thống Chỉ Số Cốt Lõi (Key Performance Indicators)

Dựa trên phân tích tài liệu BRD, chúng tôi thống nhất bộ chỉ số KPI đo lường thành công cho Phase 1 MVP và Phase 2 như sau:

### 1. Chỉ số Tương tác & Giữ chân (Engagement & Retention Metrics)
*   **DAU/MAU Ratio (Stickiness):** Target **> 0.4**. (Chỉ số đo lường độ gắn kết hàng ngày của người học).
*   **7-Day Streak Rate:** Target **> 25%** tổng người dùng hoạt động.
*   **Retention Rate:**
    *   **Day-1 Retention:** > 55%
    *   **Day-7 Retention:** > 35%
    *   **Day-30 Retention:** > 20%

### 2. Chỉ số Doanh thu & Chuyển đổi (Monetization Metrics)
*   **Premium Conversion Rate:** Target **> 8%** (Free-to-Paid thông qua 3 mức giá: Free, Premium 99K/tháng, Premium+ 249K/tháng).
*   **Churn Rate (Premium):** Target **< 5%/tháng** để đảm bảo vòng đời khách hàng (LTV) bền vững.

### 3. Chỉ số Vận hành & Trải nghiệm (Operational Excellence KPIs)
*   **Micro Feedback Time:** **≤ 2 giây** sau khi người dùng chọn đáp án (đây là nút thắt tâm lý học để duy trì Core Drive 3 - Sáng tạo & Phản hồi).
*   **Độ trễ PvP Real-time:** **≤ 500ms** thông qua WebSocket.
*   **Tỷ lệ lỗi app (Crash Rate):** **< 0.1%** trên tổng số session.

---

## IV. Đề Xuất Giảm Thiểu Rủi Ro (Pointsification Risk Mitigation)

> [!WARNING]
> **Nguy cơ Pointsification (Lạm dụng điểm thưởng bề nổi):**  
> Người học có thể chỉ tập trung vào việc cày điểm KP (Knowledge Points) hoặc duy trì Streak bằng các câu hỏi quá dễ mà không tiếp thu kiến thức thực tế.

**Giải pháp của BA:**
1.  **Gắn chặt KP với Sim Score (Estimated TOEIC Score):** Hệ số nhân KP sẽ phụ thuộc vào độ khó câu hỏi (IRT) chứ không chỉ số lượng câu hỏi làm được.
2.  **Giới hạn số lần Streak Freeze:** Tối đa mua 1 lần/tuần bằng điểm KP để tránh việc người dùng lạm dụng vật phẩm mà không học thực tế.
