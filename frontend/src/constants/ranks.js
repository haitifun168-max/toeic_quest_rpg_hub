/**
 * ranks.js — Bản hiển thị Rank cho frontend (tên + icon + màu).
 *
 * NGUỒN CHÂN LÝ tính toán rank nằm ở backend (backend/src/utils/rankSystem.js).
 * File này chỉ phục vụ hiển thị. Backend và frontend là hai module system khác nhau
 * (CommonJS vs ES Module, không có build chung) nên không share được một file —
 * nếu đổi tên/icon, phải đổi khớp cả hai nơi.
 *
 * Danh hiệu theo BRD mục C. Chỉ số mảng = số rank (1..6); phần tử 0 là placeholder
 * để RANK_NAMES[rank] tra trực tiếp không lệch.
 */

export const RANK_NAMES = [
  'Không xác định',
  'Thực Tập Sinh',
  'Nhân Viên Mới Vào Nghề',
  'Chuyên Viên',
  'Chuyên Viên Cấp Cao',
  'Quản Lý',
  'Giám Đốc',
];

export const RANK_ICONS = [
  '❔',
  '🌱',
  '📋',
  '💼',
  '🏆',
  '⭐',
  '👑',
];

export const RANK_COLORS = [
  '#94a3b8',
  '#94a3b8', // Rank 1 - Slate
  '#34d399', // Rank 2 - Emerald
  '#60a5fa', // Rank 3 - Blue
  '#f59e0b', // Rank 4 - Amber
  '#a78bfa', // Rank 5 - Violet
  '#f472b6', // Rank 6 - Pink/Gold
];

export const MAX_RANK = 6;
