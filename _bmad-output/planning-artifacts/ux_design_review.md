# 🎨 Báo Cáo Đánh Giá Trải Nghiệm Người Dùng (UX/UI Design Review)
**Người thực hiện:** Sally (UX Designer)  
**Dự án:** TOEIC Quest RPG Hub  
**Ngày lập:** 23/06/2026  
**Mã tài liệu:** UXREPORT_TOEIC_RPG_v1.0  

---

## I. Tầm Nhìn Trải Nghiệm: "Hành Trình Anh Hùng" (The Hero's Journey)

Chúng ta không thiết kế một ứng dụng học tập; chúng ta đang vẽ nên một **bộ phim tương tác**, nơi người dùng đóng vai một chiến binh đi từ xuất phát điểm thấp nhất (Thực Tập Sinh) chinh phục đỉnh cao sự nghiệp (Giám Đốc). Giao diện tối (Dark Mode) với chiều sâu không gian (Spatial Design) và hiệu ứng thủy tinh (Glassmorphism) phải mang lại cảm giác huyền bí, kích thích sự tò mò.

---

## II. Đánh Giá Các Điểm Chạm Giao Diện (Core Screen Analysis)

Dựa trên cấu trúc phân nhóm màn hình tại [toeic_quest_grouping_guide_v2.md](file:///c:/CuongPH/02-bmad-toeic_quest_rpg_hub/input/stitch_toeic_quest_rpg_hub/toeic_quest_grouping_guide_v2.md), tôi đã thực hiện đánh giá các cấu phần:

### 1. Luồng Onboarding & Goal Setting
*   **Mục tiêu trải nghiệm:** Giảm thiểu ma sát (friction) ban đầu để người dùng nhanh chóng chạm được giá trị cốt lõi (Aha! Moment).
*   **Đánh giá:**
    *   *Slide 1-3:* Hiệu ứng nhân vật RPG tiến hóa qua các Rank rất tốt, tạo kỳ vọng cao cho người dùng.
    *   *Goal Setting (SCR-04):* Chia nhỏ thành 2 bước (Chọn mục tiêu điểm -> Chọn Deadline) giúp giảm tải nhận thức.

### 2. Trận Chiến Học Thuật (Quiz & Micro Feedback)
*   **Mục tiêu trải nghiệm:** Tạo vòng phản hồi cực nhanh, lặp lại hành vi tích cực.
*   **Đánh giá:**
    *   *Micro Feedback (SCR-11):* Đây là trung tâm của trải nghiệm học. Nền màu xanh lá (Đúng) / Đỏ (Sai) hiển thị trong vòng ≤ 2 giây mang tính trực quan cao.
    *   *Giải thích 3 tầng (Progressive Disclosure):* Tuyệt vời. Người dùng bình thường chỉ cần đọc Tầng 1 (1 dòng cốt lõi). Học sinh muốn đi sâu mới cần bấm "Xem thêm" và "Học sâu". Tránh được hiện tượng "ngập lụt thông tin".

### 3. Đấu Trường PvP Battle 1v1
*   **Mục tiêu trải nghiệm:** Kích thích động lực xã hội (Core Drive 5) nhưng không gây ức chế.
*   **Đánh giá:**
    *   *Matchmaking (SCR-18):* Hoạt họa tìm đối thủ dạng vòng tròn đồng tâm tạo cảm giác hồi hộp giống các tựa game Esport.
    *   *Battle Screen (SCR-19):* Chia nửa màn hình (Bạn ở dưới, Đối thủ ở trên) cho phép theo dõi thời gian thực tiến độ của đối thủ ("Đối thủ đã trả lời!"), tăng tính cấp bách.

---

## III. Các Điểm Ma Sát UX Cần Tối Ưu Hóa (Friction Points & Recommendations)

> [!CAUTION]
> **Điểm ma sát 1: Độ dài bài thi Placement Test (20 câu - 15 phút)**
> Bắt người dùng làm bài kiểm tra 15 phút ngay sau khi tải app có thể làm rụng (churn) tới 30% người dùng.
> *   *Đề xuất:* Cho phép người dùng chọn **"Nhận Rank Tập Sự ngay"** và bỏ qua test (sẽ cập nhật trình độ sau qua Daily Quest), hoặc giảm Placement Test xuống còn 10 câu nhanh (5 phút).

> [!WARNING]
> **Điểm ma sát 2: Tâm lý lo sợ thất bại khi PvP (PvP Anxiety)**
> Việc trừ ELO và mất cảm giác tiến bộ khi thua PvP dễ khiến người học nản chí.
> *   *Đề xuất:* Đảm bảo khi thua, người dùng vẫn nhận được **Consolation KP (+50 KP)** và điểm **Insight Points (để ôn lại câu sai)**. Không bao giờ trừ điểm KP tích lũy của người dùng khi thua.

> [!IMPORTANT]
> **Điểm ma sát 3: Khóa Dungeon (Mock Test) không được thoát**
> Quy định "không được thoát giữa chừng" khi làm Mock Test 200 câu (2 tiếng) là quá khắc nghiệt đối với người dùng di động dễ bị ngắt quãng (cuộc gọi, mất mạng).
> *   *Đề xuất:* Cho phép lưu bản nháp tự động (Auto-save draft) và tiếp tục làm bài trong vòng 24 giờ. Tuy nhiên, thời gian làm bài vẫn sẽ tiếp tục chạy ngầm để đảm bảo tính công bằng của kỳ thi thử.
