const express = require('express');
const router = express.Router();
const db = require('../db');
const { User } = require('../models/user');
const { authenticateToken } = require('../middleware/auth');

/**
 * REST API standard response helpers
 */
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
 * PUT /api/users/goal
 * Sets target score and computes deadline for the authenticated user
 */
router.put('/goal', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { targetScore, durationMonths } = req.body;

    // Validate inputs
    const validScores = [300, 450, 600, 750, 850, 900];
    if (!validScores.includes(Number(targetScore))) {
      return sendError(res, 'VALIDATION_FAILED', 'Invalid target score. Must be one of 300, 450, 600, 750, 850, 900.');
    }

    const validDurations = [1, 3, 6, 12];
    if (!validDurations.includes(Number(durationMonths))) {
      return sendError(res, 'VALIDATION_FAILED', 'Invalid duration. Must be 1, 3, 6, or 12 months.');
    }

    // Calculate deadline timestamp with day-clamping to prevent month boundary overflow
    const deadline = new Date();
    const currentDay = deadline.getDate();
    deadline.setDate(1); // Set to 1st to prevent overflow during month transition
    deadline.setMonth(deadline.getMonth() + Number(durationMonths));
    const maxDaysInTargetMonth = new Date(deadline.getFullYear(), deadline.getMonth() + 1, 0).getDate();
    deadline.setDate(Math.min(currentDay, maxDaysInTargetMonth));

    // Update in database
    const query = `
      UPDATE users 
      SET target_score = $1, target_deadline = $2
      WHERE id = $3
      RETURNING *
    `;

    const dbRes = await db.query(query, [Number(targetScore), deadline.toISOString(), userId]);

    if (!dbRes.rows.length) {
      return sendError(res, 'USER_NOT_FOUND', 'User record not found', 404);
    }

    const formattedUser = User.formatUser(dbRes.rows[0]);

    return sendSuccess(res, {
      user: formattedUser
    });
  } catch (err) {
    console.error('Goal Setting API Error:', err);
    return sendError(res, 'INTERNAL_SERVER_ERROR', 'An error occurred while saving study goals', 500);
  }
});

/**
 * PUT /api/users/character
 * Updates the user's RPG character name and avatar ID
 */
router.put('/character', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { characterName, avatarId } = req.body;

    // Validate avatar ID
    const validAvatars = ['knight', 'mage', 'assassin', 'pilot', 'scholar', 'scout'];
    if (!avatarId || !validAvatars.includes(avatarId)) {
      return sendError(res, 'VALIDATION_FAILED', 'Invalid avatar ID. Must be one of: knight, mage, assassin, pilot, scholar, scout.');
    }

    // Validate character name
    if (!characterName || typeof characterName !== 'string' || characterName.trim().length < 2 || characterName.trim().length > 30) {
      return sendError(res, 'VALIDATION_FAILED', 'Invalid character name. Must be between 2 and 30 characters.');
    }

    // Sanitize character name
    const sanitizedName = characterName.trim();

    // Update in database
    const query = `
      UPDATE users 
      SET character_name = $1, avatar_id = $2
      WHERE id = $3
      RETURNING *
    `;

    const dbRes = await db.query(query, [sanitizedName, avatarId, userId]);

    if (!dbRes.rows.length) {
      return sendError(res, 'USER_NOT_FOUND', 'User record not found', 404);
    }

    const formattedUser = User.formatUser(dbRes.rows[0]);

    return sendSuccess(res, {
      user: formattedUser
    });
  } catch (err) {
    console.error('Character Setup API Error:', err);
    return sendError(res, 'INTERNAL_SERVER_ERROR', 'An error occurred while saving character configuration', 500);
  }
});

/**
 * GET /api/users/profile
 * Retrieves the profile of the authenticated user, including RPG attributes and achievements
 */
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch user from DB
    const query = `
      SELECT * FROM users 
      WHERE id = $1
    `;
    const dbRes = await db.query(query, [userId]);

    if (!dbRes.rows.length) {
      return sendError(res, 'USER_NOT_FOUND', 'User record not found', 404);
    }

    const rawUser = dbRes.rows[0];
    const formattedUser = User.formatUser(rawUser);

    // Estimate correctCount equivalent from current_rank to generate simulated stats
    const rank = formattedUser.current_rank || 1;
    let correctCount = 0;
    if (rank === 2) correctCount = 3;
    else if (rank === 3) correctCount = 5;
    else if (rank === 4) correctCount = 7;
    else if (rank === 5) correctCount = 9;
    else if (rank === 6) correctCount = 10;

    // Simulated RPG attributes/stats
    const stats = {
      grammar: Math.min(100, correctCount * 8 + 20),
      vocab: Math.min(100, correctCount * 7 + 25),
      listening: Math.min(100, correctCount * 6 + 15),
      reading: Math.min(100, correctCount * 7 + 20),
      pronunciation: Math.min(100, correctCount * 5 + 30),
      speed: Math.min(100, correctCount * 8 + 10),
    };

    // Query PvP wins dynamically from the database
    let pvpWins = 0;
    try {
      const pvpWinsRes = await db.query(
        `SELECT COUNT(*) FROM battle_sessions 
         WHERE (player_a_id = $1 AND score_a > score_b) 
            OR (player_b_id = $1 AND score_b > score_a)`,
        [userId]
      );
      pvpWins = parseInt(pvpWinsRes.rows[0].count || 0);
    } catch (e) {
      console.log('Query pvp wins failed:', e.message);
    }

    // Compute achievements list dynamically
    const achievements = [
      { 
        id: 'streak_14', 
        name: '14-Day Streak', 
        desc: 'Master of Consistency', 
        unlocked: (formattedUser.current_streak || 0) >= 14 
      },
      { 
        id: 'pvp_10', 
        name: '10 PvP Wins', 
        desc: 'Dungeon Conqueror', 
        unlocked: pvpWins >= 10 
      },
      { 
        id: 'grammar_sage', 
        name: 'Grammar Sage', 
        desc: '100 Perfect Tests', 
        unlocked: false 
      },
      { 
        id: 'speed_reader', 
        name: 'Speed Reader', 
        desc: '50,000 Words Read', 
        unlocked: false 
      }
    ];

    return sendSuccess(res, {
      user: {
        ...formattedUser,
        stats,
        achievements
      }
    });
  } catch (err) {
    console.error('Fetch Profile API Error:', err);
    return sendError(res, 'INTERNAL_SERVER_ERROR', 'An error occurred while fetching user profile', 500);
  }
});

/**
 * POST /api/users/streak/freeze
 * Purchases a Streak Freeze using 500 KP.
 * Restores current_streak to longest_streak (or default backup) and sets last_active_date to today
 * to keep the streak alive. Limit: Once per 7 days.
 */
router.post('/streak/freeze', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch user details
    const selectQuery = 'SELECT total_kp, current_streak, longest_streak, streak_freeze_used_at FROM users WHERE id = $1';
    const dbRes = await db.query(selectQuery, [userId]);

    if (dbRes.rows.length === 0) {
      return sendError(res, 'USER_NOT_FOUND', 'User record not found', 404);
    }

    const user = dbRes.rows[0];

    // 1. Check if user has enough KP (500 KP required)
    if ((user.total_kp || 0) < 500) {
      return sendError(res, 'INSUFFICIENT_KP', 'You need at least 500 KP to purchase a Streak Freeze.');
    }

    // 2. Check weekly limit (1 purchase per 7 days)
    if (user.streak_freeze_used_at) {
      const lastUsed = new Date(user.streak_freeze_used_at);
      const now = new Date();
      const diffTime = Math.abs(now - lastUsed);
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      if (diffDays < 7) {
        return sendError(res, 'LIMIT_EXCEEDED', 'You can only use a Streak Freeze once every 7 days.');
      }
    }

    // 3. Perform purchase and restore streak
    const newTotalKp = user.total_kp - 500;
    
    // Restore current_streak back to longest_streak to "revive" it, or keep it if it is active.
    let restoredStreak = user.current_streak || 0;
    if (restoredStreak === 0) {
      restoredStreak = Math.max(1, user.longest_streak || 1);
    }

    const todayStr = new Date().toISOString().split('T')[0];

    await db.query('BEGIN');
    try {
      const updateQuery = `
        UPDATE users
        SET total_kp = $1, current_streak = $2, last_active_date = $3, streak_freeze_used_at = CURRENT_TIMESTAMP
        WHERE id = $4
        RETURNING *
      `;
      const updateRes = await db.query(updateQuery, [newTotalKp, restoredStreak, todayStr, userId]);
      await db.query('COMMIT');

      const formattedUser = User.formatUser(updateRes.rows[0]);

      return sendSuccess(res, {
        user: formattedUser,
        streakRestored: restoredStreak
      });
    } catch (transactionErr) {
      await db.query('ROLLBACK');
      throw transactionErr;
    }
  } catch (err) {
    console.error('Streak Freeze Purchase Error:', err);
    return sendError(res, 'INTERNAL_SERVER_ERROR', 'An error occurred while purchasing Streak Freeze', 500);
  }
});

/**
 * POST /api/users/check-rank
 * Kiểm tra và thực hiện thăng hạng user dựa trên KP tích lũy
 */
router.post('/check-rank', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const userQuery = 'SELECT total_kp, rank FROM users WHERE id = $1';
    const userRes = await db.query(userQuery, [userId]);
    if (userRes.rows.length === 0) {
      return sendError(res, 'USER_NOT_FOUND', 'User record not found', 404);
    }
    
    const user = userRes.rows[0];
    const kp = user.total_kp || 0;
    const currentRankVal = user.rank || 1; // 1: Novice, 2: Apprentice, 3: Specialist, 4: Knight

    let calculatedRank = 1;
    if (kp >= 5000) {
      calculatedRank = 4;
    } else if (kp >= 2500) {
      calculatedRank = 3;
    } else if (kp >= 1000) {
      calculatedRank = 2;
    }

    if (calculatedRank > currentRankVal) {
      const kpReward = 200; // Thưởng nóng 200 KP khi thăng hạng
      const updateQuery = `
        UPDATE users 
        SET rank = $1, total_kp = total_kp + $2 
        WHERE id = $3 
        RETURNING *
      `;
      const updateRes = await db.query(updateQuery, [calculatedRank, kpReward, userId]);
      const updatedUser = User.formatUser(updateRes.rows[0]);
      
      return sendSuccess(res, {
        rankUpTriggered: true,
        oldRank: currentRankVal,
        newRank: calculatedRank,
        kpEarned: kpReward,
        user: updatedUser
      });
    }

    return sendSuccess(res, {
      rankUpTriggered: false,
      oldRank: currentRankVal,
      newRank: currentRankVal
    });
  } catch (err) {
    console.error('Check Rank Error:', err);
    return sendError(res, 'INTERNAL_SERVER_ERROR', 'An error occurred while updating rank status', 500);
  }
});

/**
 * GET /api/users/career-jobs
 * Đề xuất việc làm dựa trên điểm Estimated TOEIC score của học viên
 */
router.get('/career-jobs', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Tìm điểm thi thử lớn nhất
    let estimatedScore = 450; // Mặc định từ bài test xếp lớp đầu vào
    try {
      const maxScoreQuery = `
        SELECT MAX(estimated_score) as max_score FROM dungeon_sessions 
        WHERE user_id = $1 AND is_submitted = TRUE
      `;
      const scoreRes = await db.query(maxScoreQuery, [userId]);
      if (scoreRes.rows.length > 0 && scoreRes.rows[0].max_score !== null) {
        estimatedScore = scoreRes.rows[0].max_score;
      }
    } catch (e) {
      console.log('Query estimated score failed, using default');
    }

    // 2. Tìm danh sách công việc phù hợp
    let jobs = [];
    try {
      const jobsQuery = 'SELECT * FROM career_jobs WHERE required_toeic <= $1 ORDER BY required_toeic DESC';
      const jobsRes = await db.query(jobsQuery, [estimatedScore]);
      jobs = jobsRes.rows.map(j => ({
        id: j.id,
        jobTitle: j.job_title,
        companyName: j.company_name,
        requiredToeic: j.required_toeic,
        salaryRange: j.salary_range,
        description: j.description
      }));
    } catch (e) {
      console.log('Query jobs failed, using mock jobs fallback instead');
    }

    // 3. Fallback mock jobs để phục vụ visual test
    if (jobs.length === 0) {
      const allMockJobs = [
        { id: '1', jobTitle: 'Thực tập sinh Marketing', companyName: 'VNG Group', requiredToeic: 450, salaryRange: '5,000,000 - 8,000,000 VND', description: 'Yêu cầu TOEIC 450+. Hỗ trợ xây dựng chiến dịch truyền thông thương hiệu và viết bài PR.' },
        { id: '2', jobTitle: 'Trợ lý Giám đốc Vận hành', companyName: 'Shopee Vietnam', requiredToeic: 650, salaryRange: '12,000,000 - 18,000,000 VND', description: 'Yêu cầu TOEIC 650+. Hỗ trợ điều phối các hoạt động kinh doanh, chuẩn bị báo cáo vận hành quốc tế.' },
        { id: '3', jobTitle: 'Quản lý Dự án Công nghệ', companyName: 'FPT Software', requiredToeic: 800, salaryRange: '25,000,000 - 35,000,000 VND', description: 'Yêu cầu TOEIC 800+. Giao tiếp trực tiếp với khách hàng quốc tế US/Europe và quản lý nhóm phát triển.' },
        { id: '4', jobTitle: 'Quản trị viên Tập sự (Management Trainee)', companyName: 'Unilever Vietnam', requiredToeic: 850, salaryRange: '30,000,000 - 45,000,000 VND', description: 'Yêu cầu TOEIC 850+. Chương trình đào tạo luân chuyển qua các phòng ban cốt lõi để phát triển thành Leader tương lai.' }
      ];
      jobs = allMockJobs.filter(j => j.requiredToeic <= estimatedScore);
    }

    return sendSuccess(res, {
      estimatedScore,
      jobs
    });

  } catch (err) {
    console.error('Get Career Jobs Error:', err);
    return sendError(res, 'INTERNAL_SERVER_ERROR', 'An error occurred while retrieving job opportunities', 500);
  }
});

module.exports = router;
