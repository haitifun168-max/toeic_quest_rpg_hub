/**
 * rankSystem.js — NGUỒN CHÂN LÝ DUY NHẤT cho hệ thống Rank (backend).
 *
 * Trước đây định nghĩa rank bị rải ở 5 nơi với ngưỡng/tên khác nhau
 * (user.js, quest.js, và 3 file frontend), gây mâu thuẫn: cùng số KP ra rank
 * khác nhau tùy endpoint. Module này gom về một chỗ.
 *
 * Cơ sở: BRD mục C (Mapping Rank — Điểm TOEIC — Career Milestone) — giữ 6 hạng,
 * danh hiệu và icon theo BRD; ngưỡng KP được hạ xuống đường cong dễ chơi hơn
 * (đã được duyệt): 0 / 500 / 2.000 / 5.000 / 12.000 / 30.000.
 *
 * LƯU Ý ĐỒNG BỘ: frontend có bản hiển thị tương ứng tại
 * frontend/src/constants/ranks.js — nếu đổi tên/icon, đổi cả hai nơi.
 */

// Thứ tự tăng dần theo ngưỡng KP. rank = chỉ số 1..6.
const RANKS = [
  { rank: 1, name: 'Thực Tập Sinh',        icon: '🌱', kpThreshold: 0 },
  { rank: 2, name: 'Nhân Viên Mới Vào Nghề', icon: '📋', kpThreshold: 500 },
  { rank: 3, name: 'Chuyên Viên',          icon: '💼', kpThreshold: 2000 },
  { rank: 4, name: 'Chuyên Viên Cấp Cao',  icon: '🏆', kpThreshold: 5000 },
  { rank: 5, name: 'Quản Lý',              icon: '⭐', kpThreshold: 12000 },
  { rank: 6, name: 'Giám Đốc',             icon: '👑', kpThreshold: 30000 },
];

const MAX_RANK = RANKS.length; // 6

// Placement Test (10 câu) chỉ được gán tối đa hạng này. Rank 4-6 bắt buộc tích lũy KP.
const PLACEMENT_MAX_RANK = 3;

// Thưởng KP khi thăng hạng (giữ như hành vi cũ).
const RANK_UP_KP_REWARD = 200;

/**
 * Trả về số rank (1..6) tương ứng với tổng KP tích lũy.
 */
function getRankByKp(totalKp) {
  const kp = Number(totalKp) || 0;
  let result = 1;
  for (const r of RANKS) {
    if (kp >= r.kpThreshold) {
      result = r.rank;
    } else {
      break;
    }
  }
  return result;
}

/**
 * Áp trần Placement: không cho bài test 10 câu gán rank cao hơn PLACEMENT_MAX_RANK.
 */
function capPlacementRank(rank) {
  return Math.min(rank, PLACEMENT_MAX_RANK);
}

/**
 * Thông tin đầy đủ của một rank (name, icon, kpThreshold). An toàn với rank ngoài phạm vi.
 */
function getRankInfo(rank) {
  return RANKS.find((r) => r.rank === rank) || RANKS[0];
}

module.exports = {
  RANKS,
  MAX_RANK,
  PLACEMENT_MAX_RANK,
  RANK_UP_KP_REWARD,
  getRankByKp,
  capPlacementRank,
  getRankInfo,
};
