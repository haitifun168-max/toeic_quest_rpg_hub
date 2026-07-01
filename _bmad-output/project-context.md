---
project_name: '02-bmad-toeic_quest_rpg_hub'
user_name: 'kevin pham'
date: '2026-07-01'
sections_completed: ['technology_stack', 'language_rules']
existing_patterns_found: 12
---

# Bối cảnh Dự án dành cho AI Agents (Project Context for AI Agents)

_Tài liệu này chứa các quy tắc và mẫu thiết kế quan trọng mà AI agents phải tuân theo khi triển khai mã nguồn trong dự án này. Tập trung vào các chi tiết không hiển nhiên mà agents có thể bỏ sót._

---

## Công nghệ & Phiên bản (Technology Stack & Versions)

- **Backend API Gateway:** Node.js `v20.x LTS` (Express `^5.2.1`)
- **Mobile Client:** React Native `v0.85.3` (Expo `^56.0.12`)
- **AI Engine:** FastAPI `v0.110.x`
- **Primary Database:** PostgreSQL `v16.x` (Node client `pg ^8.22.0`)
- **In-Memory Datastore:** Redis `v7.x`
- **Real-Time Communication:** Socket.io / Socket.io-client `v4.7.x`
- **Security:** bcryptjs `^3.0.3`, jsonwebtoken `^9.0.3`
- **Testing:** Jest `^30.4.2`, Supertest `^7.2.2`

## Quy tắc Triển khai Quan trọng (Critical Implementation Rules)

### Quy tắc Ngôn ngữ (Language-Specific Rules)

- **Hệ thống Module (Module Systems):**
  - **Backend (Node.js/Express):** Bắt buộc dùng cú pháp **CommonJS** (`require()` và `module.exports = ...`).
  - **Frontend (React Native/Expo):** Bắt buộc dùng cú pháp **ES Modules** (`import ... from ...` và `export default ...`).
- **Thao tác Bất đồng bộ (Asynchronous Operations):**
  - Luôn sử dụng `async/await` cho các tác vụ tương tác cơ sở dữ liệu (PostgreSQL/Redis), gọi API, và lưu trữ bộ nhớ (SecureStore/localStorage).
  - Phải bọc các tác vụ bất đồng bộ trong các khối `try/catch` để xử lý lỗi triệt để.
- **Xử lý Lỗi (Error Handling):**
  - Các hàm API Gateway (Express controllers) phải bắt toàn bộ Exception và trả về kết cấu phản hồi JSON chuẩn (không được để rò rỉ stack trace thô của hệ thống ra ngoài client).

### Quy tắc Framework (Framework-Specific Rules)

_Sẽ được tài liệu hóa ở bước tiếp theo_
