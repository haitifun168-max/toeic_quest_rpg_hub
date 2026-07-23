/**
 * config.js
 * Trung tâm cấu hình & xác thực biến môi trường (centralized env config).
 *
 * Nguyên tắc bảo mật: KHÔNG có giá trị secret mặc định (fallback). Nếu thiếu
 * biến môi trường bắt buộc, ứng dụng phải DỪNG ngay khi khởi động (fail-fast)
 * thay vì âm thầm chạy bằng secret công khai.
 */

const path = require('path');

// Nạp biến môi trường từ backend/.env (không phải root .env).
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

// Các biến bắt buộc phải có — thiếu bất kỳ biến nào => từ chối khởi động.
const REQUIRED_SECRETS = ['JWT_SECRET', 'ENCRYPTION_KEY', 'ENCRYPTION_IV'];

/**
 * Kiểm tra toàn bộ biến môi trường bắt buộc. Ném lỗi nếu thiếu hoặc không hợp lệ.
 * Gọi hàm này ở điểm khởi động (server.js) trước khi phục vụ request.
 */
function validateEnv() {
  const missing = REQUIRED_SECRETS.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `FATAL: Thiếu biến môi trường bắt buộc: ${missing.join(', ')}. ` +
      `Từ chối khởi động với secret mặc định không an toàn. ` +
      `Hãy đặt các biến này trong backend/.env hoặc trên môi trường triển khai.`
    );
  }

  const key = process.env.ENCRYPTION_KEY;
  if (Buffer.byteLength(key, 'utf-8') < 32) {
    throw new Error('FATAL: ENCRYPTION_KEY phải dài tối thiểu 32 byte (AES-256).');
  }

  const iv = process.env.ENCRYPTION_IV;
  if (Buffer.byteLength(iv, 'utf-8') < 16) {
    throw new Error('FATAL: ENCRYPTION_IV phải dài tối thiểu 16 byte (AES-CBC).');
  }
}

module.exports = {
  validateEnv,
  // Getter đọc trực tiếp process.env tại thời điểm sử dụng (không capture cứng).
  get JWT_SECRET() {
    return process.env.JWT_SECRET;
  },
  get ENCRYPTION_KEY() {
    return process.env.ENCRYPTION_KEY;
  },
  get ENCRYPTION_IV() {
    return process.env.ENCRYPTION_IV;
  },
};
