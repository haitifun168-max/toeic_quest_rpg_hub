const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');
const { getRankByKp, getRankInfo } = require('../utils/rankSystem');

/**
 * REST API standard response helpers
 */
function sendSuccess(res, data, status = 200) {
  return res.status(status).json({ ok: true, data, error: null });
}

function sendError(res, code, message, status = 400) {
  return res.status(status).json({ ok: false, data: null, error: { code, message } });
}

/**
 * Suy trạng thái một node từ rank người dùng (mở khóa theo RANK — quyết định của Kevin).
 *   unlock_rank <  userRank -> 'completed'
 *   unlock_rank == userRank -> 'active'
 *   unlock_rank >  userRank -> 'locked'
 */
function deriveNodeStatus(unlockRank, userRank) {
  if (unlockRank < userRank) return 'completed';
  if (unlockRank === userRank) return 'active';
  return 'locked';
}

/**
 * GET /api/skill-tree
 * Trả toàn bộ node của Lộ Trình Kỹ Năng kèm trạng thái tính theo rank hiện tại của user.
 * Node là dữ liệu động (bảng skill_nodes); trạng thái suy lúc query, không lưu sẵn.
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const userRes = await db.query('SELECT total_kp, current_rank FROM users WHERE id = $1', [userId]);
    if (!userRes.rows.length) {
      return sendError(res, 'USER_NOT_FOUND', 'User record not found', 404);
    }

    const user = userRes.rows[0];
    // Rank hiển thị bám tổng KP (nguồn chân lý), fallback về current_rank rồi 1.
    const userRank = getRankByKp(user.total_kp) || user.current_rank || 1;
    const rankInfo = getRankInfo(userRank);

    const nodesRes = await db.query(
      `SELECT id, label, branch, tier, node_type, icon, unlock_rank, sort_order
       FROM skill_nodes
       ORDER BY sort_order ASC`
    );

    const nodes = nodesRes.rows.map((n) => ({
      id: n.id,
      label: n.label,
      branch: n.branch,
      tier: n.tier,
      nodeType: n.node_type,
      icon: n.icon,
      unlockRank: n.unlock_rank,
      sortOrder: n.sort_order,
      status: deriveNodeStatus(n.unlock_rank, userRank),
    }));

    return sendSuccess(res, {
      userRank,
      rankName: rankInfo.name,
      rankIcon: rankInfo.icon,
      totalKp: user.total_kp || 0,
      nodes,
    });
  } catch (err) {
    console.error('Fetch skill tree error:', err);
    return sendError(res, 'INTERNAL_SERVER_ERROR', 'Failed to retrieve skill tree', 500);
  }
});

module.exports = router;
