# Hướng dẫn Triển khai (Deployment Guide) - TOEIC Quest RPG Hub

Tài liệu này hướng dẫn các bước cần thiết để đưa dự án từ môi trường phát triển lên môi trường Production.

## 1. Hạ tầng Backend (Production Infrastructure)

Chúng ta sử dụng **Supabase** cho cơ sở dữ liệu PostgreSQL và **Upstash** cho Redis Cache.

### 1.1 Cấu hình Supabase (PostgreSQL)
1. Đăng ký/Đăng nhập tại [Supabase](https://supabase.com).
2. Tạo dự án mới (New Project).
3. Lấy chuỗi kết nối (Connection String) trong mục `Settings -> Database -> Connection string -> URI`.
   - Lưu ý: Đảm bảo thêm `?pgbouncer=true` ở cuối chuỗi nếu bạn dùng Serverless / Vercel / Render để kết nối ổn định.
4. Chạy các file migrations (nếu có) hoặc dùng Prisma/Sequelize sync để tạo các bảng.

### 1.2 Cấu hình Upstash (Redis)
1. Đăng ký tại [Upstash](https://upstash.com).
2. Tạo database Redis mới.
3. Trong giao diện quản lý, copy chuỗi **Redis URL** (ví dụ: `rediss://...`).

### 1.3 Triển khai Backend (Ví dụ trên Render/Fly.io)
1. Tạo một Web Service mới trỏ tới repository GitHub của bạn.
2. Root Directory: `backend/`
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Khai báo các **Environment Variables**:
   - `DATABASE_URL`: (Supabase Connection String)
   - `REDIS_URL`: (Upstash URL)
   - `JWT_SECRET`: (Một chuỗi bảo mật tạo ngẫu nhiên)
   - `PORT`: (Mặc định được nhà cung cấp cấp)
   - `CLIENT_URL`: URL của app hoặc web client của bạn.

---

## 2. CI/CD Backend (GitHub Actions)

Mã nguồn đã được tích hợp file `.github/workflows/backend.yml`. 
- Mỗi khi có code đẩy lên nhánh `main`, hệ thống sẽ tự động chạy `npm test`.
- Nếu test pass, có thể cấu hình thêm bước webhook hoặc lệnh SSH để server tự động lấy code mới và restart.

---

## 3. Triển khai Mobile App (Frontend)

Chúng ta sử dụng **Expo EAS** để build file APK (Android) / IPA (iOS).

### Cài đặt EAS CLI
```bash
npm install -g eas-cli
eas login
eas build:configure
```

### Build cho môi trường Development/Preview
Để test trên máy tính hoặc gửi cho đội QA (Sally):
```bash
eas build --profile preview --platform android
```

### Build cho Production (Go-Live)
Để nộp lên Google Play / App Store (Cấu hình `autoIncrement: true` đã được bật để tự động tăng version).
```bash
eas build --profile production --platform all
```

---

## 4. Analytics (PostHog)

Ứng dụng đã được tích hợp **PostHog** để theo dõi (tracking) các hành vi quan trọng của người dùng.
1. Đăng ký tại [PostHog](https://posthog.com).
2. Tạo project và lấy **Project API Key** & **Instance URL**.
3. Cài đặt các biến môi trường cho EAS Build bằng cách tạo file `.env` ở thư mục `frontend/`:
   ```env
   EXPO_PUBLIC_POSTHOG_API_KEY=phc_...
   EXPO_PUBLIC_POSTHOG_HOST=https://app.posthog.com
   ```
4. Khi build với EAS, Expo sẽ tự động đóng gói các biến có tiền tố `EXPO_PUBLIC_` vào app.
