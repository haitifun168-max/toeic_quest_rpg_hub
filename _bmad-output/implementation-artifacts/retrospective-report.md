# BIÊN BẢN RÚT KINH NGHIỆM DỰ ÁN (RETROSPECTIVE REPORT)
**Mã tài liệu:** RETRO_TOEIC_RPG_v1.0  
**Dự án:** TOEIC Quest RPG Hub  
**Ngày họp:** 23/06/2026  
**Người ghi chép:** Paige (Technical Writer)

---

## 1. TỔNG KẾT THÀNH TỰU (WHAT WENT WELL)
*   **Sự đồng thuận đa vai trò:** Buổi họp nhóm (Party Mode) đã xử lý tốt các xung đột giữa thiết kế UX và hạn chế kỹ thuật của AI thuật toán (giảm Placement Test xuống 10 câu).
*   **Đầu ra tài liệu chất lượng:** Hoàn thành bộ tài liệu PRD, Architecture Spine, danh sách 20 User Stories kèm Acceptance Criteria chi tiết, và phân bổ 3 Sprints rõ ràng.
*   **Định vị công nghệ rõ nét:** Phương án phân tách PostgreSQL/Redis và import giải thích offline được xác lập sớm, giảm thiểu rủi ro trễ tiến độ.

---

## 2. BÀI HỌC RÚT RA (LESSONS LEARNED)
*   **Tránh bẫy Pointsification & Burnout:** Cơ chế giới hạn Stamina PvP hàng ngày là cần thiết để giữ người học tập trung vào Skill Tree.
*   **Tối ưu hóa tài nguyên qua Cash & Offline data:** Gọi API LLM thời gian thực cho giải thích câu hỏi là không khả thi cho quy mô 100k CCU. Tiền sinh dữ liệu offline là hướng đi đúng đắn.
*   **Lưu checkpoint thông minh:** Dungeon Mock Test cần lưu nháp sau mỗi 10 câu thay vì lưu liên tục để bảo vệ I/O cho PostgreSQL.

---

## 3. HÀNH ĐỘNG TỐI ƯU CHO GIAI ĐOẠN TIẾP THEO (ACTION ITEMS FOR OPTIMIZATION)

| STT | Hành động tối ưu (Action Item) | Người chịu trách nhiệm | Hạn hoàn thành | Áp dụng tại |
| --- | --- | --- | --- | --- |
| 1 | Viết và chạy script `import_explanations.py` để nạp 10,000 câu giải thích vào PostgreSQL trước khi code màn hình Quiz. | Amelia (Dev) | Ngày 2 của Sprint 1 | Sprint 1 |
| 2 | Thiết kế UI Popup cảnh báo hết Stamina và thông điệp khích lệ người chơi quay lại Skill Tree. | Sally (UX) | Ngày 3 của Sprint 1 | Sprint 1 |
| 3 | Chi tiết hóa API contracts và cấu trúc WebSocket Socket.io cho phần ghép cặp PvP. | Winston (Arch) | Trước khi bắt đầu Sprint 2 | Sprint 2 |
| 4 | Cấu hình Redis Pub/Sub và viết test load giả lập CCU để đo đạc độ trễ matching. | Amelia (Dev) | Ngày 1 của Sprint 2 | Sprint 2 |
| 5 | Tự động hóa việc đồng bộ checkpoint Dungeon sau mỗi 10 câu lên DB. | Amelia (Dev) | Ngày 2 của Sprint 3 | Sprint 3 |
