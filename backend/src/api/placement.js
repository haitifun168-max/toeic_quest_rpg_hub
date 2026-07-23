const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');
const { capPlacementRank } = require('../utils/rankSystem');

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

const PLACEMENT_TEST_SIZE = 10;

const DIFFICULTY_WEIGHTS = {
  easy: 0.8,
  medium: 1.0,
  hard: 1.25
};

function getDifficultyWeight(difficulty) {
  return DIFFICULTY_WEIGHTS[String(difficulty || 'medium').toLowerCase()] || DIFFICULTY_WEIGHTS.medium;
}

function mapWeightedRatioToPlacement(ratio) {
  if (ratio >= 0.95) return { simScore: 900, rank: 6, elo: 1500 };
  if (ratio >= 0.85) return { simScore: 850, rank: 5, elo: 1400 };
  if (ratio >= 0.70) return { simScore: 750, rank: 4, elo: 1300 };
  if (ratio >= 0.50) return { simScore: 600, rank: 3, elo: 1200 };
  if (ratio >= 0.30) return { simScore: 450, rank: 2, elo: 1100 };
  return { simScore: 300, rank: 1, elo: 1000 };
}

/**
 * GET /api/placement/questions
 * Fetches 10 random placement test questions without disclosing the correct answer
 */
router.get('/questions', async (req, res) => {
  try {
    const query = `
      SELECT id, part, question_content, option_a, option_b, option_c, option_d 
      FROM questions 
      WHERE status = 'approved'
      ORDER BY RANDOM() 
      LIMIT 10
    `;
    const dbRes = await db.query(query);

    return sendSuccess(res, {
      questions: dbRes.rows
    });
  } catch (err) {
    console.error('Fetch placement questions error:', err);
    return sendError(res, 'INTERNAL_SERVER_ERROR', 'Failed to retrieve placement questions', 500);
  }
});

/**
 * POST /api/placement/submit
 * Submits client answers, scores them on server, and updates the user rank and ELO
 */
router.post('/submit', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { answers } = req.body; // Expect format: [{ questionId: '...', answer: 'A' }]

    if (!Array.isArray(answers)) {
      return sendError(res, 'VALIDATION_FAILED', 'Answers must be a valid array');
    }

    // Filter out invalid items in answers array safely to avoid TypeError
    const validAnswers = answers.filter(a => 
      a && 
      typeof a === 'object' && 
      typeof a.questionId === 'string' && 
      a.questionId.trim() !== '' &&
      a.answer !== undefined &&
      a.answer !== null
    );

    if (validAnswers.length === 0) {
      return sendError(res, 'VALIDATION_FAILED', 'No valid answers provided');
    }

    // Deduplicate answers by questionId to prevent scoring exploits
    const uniqueAnswersMap = new Map();
    validAnswers.forEach(item => {
      if (!uniqueAnswersMap.has(item.questionId)) {
        uniqueAnswersMap.set(item.questionId, item);
      }
    });

    const uniqueAnswers = Array.from(uniqueAnswersMap.values());
    const questionIds = uniqueAnswers.map(a => a.questionId);

    // Fetch the correct options + difficulty from the database
    const query = `
      SELECT id, correct_option, difficulty 
      FROM questions 
      WHERE id = ANY($1)
    `;
    const dbRes = await db.query(query, [questionIds]);

    // Create a lookup map of correct options + difficulty
    const correctMap = {};
    dbRes.rows.forEach(q => {
      correctMap[q.id] = { correct_option: q.correct_option, difficulty: q.difficulty };
    });

    // Score user answers using deduplicated list.
    // FR-3: weighted scoring — mỗi câu đúng cộng điểm theo độ khó (easy 0.8 / medium 1.0 / hard 1.25).
    let correctCount = 0;
    let weightedScore = 0;
    uniqueAnswers.forEach(item => {
      const q = correctMap[item.questionId];
      if (q && q.correct_option && String(item.answer).trim().toUpperCase() === q.correct_option) {
        correctCount++;
        weightedScore += getDifficultyWeight(q.difficulty);
      }
    });

    // Mẫu số cố định theo thiết kế bài test (10 câu, chuẩn medium) để tỷ lệ ổn định,
    // không phụ thuộc số câu trả về. Test toàn câu khó đúng -> ratio > 1 (được đôn hạng);
    // test toàn câu dễ đúng -> ratio thấp hơn (phản ánh độ khó thật).
    const maxWeightedScore = PLACEMENT_TEST_SIZE * DIFFICULTY_WEIGHTS.medium;
    const ratio = maxWeightedScore > 0 ? weightedScore / maxWeightedScore : 0;

    const placement = mapWeightedRatioToPlacement(ratio);
    const simScore = placement.simScore;
    const elo = placement.elo;

    // Chặn đường tắt (quyết định 2b): bài test 10 câu chỉ gán tối đa Rank 3.
    // simScore (điểm ước lượng) và elo giữ nguyên; chỉ trần hạng khởi điểm.
    const rank = capPlacementRank(placement.rank);

    // Update user's rank and ELO in database
    const updateQuery = `
      UPDATE users 
      SET current_rank = $1, current_elo = $2
      WHERE id = $3
      RETURNING id, current_rank, current_elo
    `;
    const updateRes = await db.query(updateQuery, [rank, elo, userId]);

    if (!updateRes.rows.length) {
      return sendError(res, 'USER_NOT_FOUND', 'User record not found', 404);
    }

    return sendSuccess(res, {
      correctCount,
      weightedScore: Math.round(weightedScore * 100) / 100,
      maxWeightedScore,
      simScore,
      rank,
      elo
    });
  } catch (err) {
    console.error('Submit placement answers error:', err);
    return sendError(res, 'INTERNAL_SERVER_ERROR', 'Failed to submit placement test answers', 500);
  }
});

module.exports = router;
