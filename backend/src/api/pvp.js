const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

function sendSuccess(res, data, status = 200) {
  return res.status(status).json({
    ok: true,
    data,
    error: null
  });
}

function sendError(res, code, message, status = 400) {
  return res.status(status).json({
    ok: false,
    data: null,
    error: {
      code,
      message
    }
  });
}

/**
 * GET /api/pvp/lobby
 * Trả về thông tin sảnh chờ PvP: ELO hiện tại, số trận thắng/thua, lịch sử đấu.
 */
router.get('/lobby', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Fetch user data (ELO, Rank, Stamina)
    const userQuery = 'SELECT id, current_elo, current_rank, current_stamina FROM users WHERE id = $1';
    const userRes = await db.query(userQuery, [userId]);

    if (userRes.rows.length === 0) {
      return sendError(res, 'USER_NOT_FOUND', 'Không tìm thấy thông tin người dùng', 404);
    }

    const user = userRes.rows[0];

    // 2. Validate Rank
    if (user.current_rank < 2) {
      return sendError(res, 'RANK_TOO_LOW', 'Bạn cần đạt tối thiểu Rank 2 (Học việc) để tham gia PvP Ranked.');
    }

    // 3. Query matchmaking stats & history
    const historyQuery = `
      SELECT bs.*, 
             ua.display_name as player_a_name, 
             ub.display_name as player_b_name
      FROM battle_sessions bs
      LEFT JOIN users ua ON bs.player_a_id = ua.id
      LEFT JOIN users ub ON bs.player_b_id = ub.id
      WHERE bs.player_a_id = $1 OR bs.player_b_id = $1
      ORDER BY bs.played_at DESC
      LIMIT 10
    `;
    const historyRes = await db.query(historyQuery, [userId]);
    const matches = historyRes.rows;

    // Calculate wins and losses
    let wins = 0;
    let losses = 0;

    matches.forEach(m => {
      const isPlayerA = m.player_a_id === userId;
      const playerScore = isPlayerA ? m.score_a : m.score_b;
      const opponentScore = isPlayerA ? m.score_b : m.score_a;

      if (playerScore > opponentScore) {
        wins++;
      } else if (playerScore < opponentScore) {
        losses++;
      }
    });

    return sendSuccess(res, {
      elo: user.current_elo,
      stamina: user.current_stamina,
      wins,
      losses,
      history: matches.slice(0, 3) // Return last 3 matches for quick UI render
    });
  } catch (err) {
    console.error('Lobby fetch error:', err);
    return sendError(res, 'INTERNAL_SERVER_ERROR', 'Không thể tải thông tin sảnh PvP', 500);
  }
});

module.exports = router;
