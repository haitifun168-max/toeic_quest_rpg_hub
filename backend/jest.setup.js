/**
 * jest.setup.js
 * Nạp biến môi trường an toàn cho môi trường test TRƯỚC khi bất kỳ module nào
 * đọc process.env. Nhờ đó code production có thể fail-fast khi thiếu secret,
 * còn test suite vẫn chạy được với secret cố định dành riêng cho test.
 */

process.env.NODE_ENV = process.env.NODE_ENV || 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret_for_ci_only_not_used_in_prod';
process.env.ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'test_encryption_key_32_bytes_long!!';
process.env.ENCRYPTION_IV = process.env.ENCRYPTION_IV || 'test_iv_16bytes!!';
