const express = require('express');
const router = express.Router();
const db = require('../db');
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

    // Fetch the correct options from the database
    const query = `
      SELECT id, correct_option 
      FROM questions 
      WHERE id = ANY($1)
    `;
    const dbRes = await db.query(query, [questionIds]);

    // Create a lookup map of correct options
    const correctMap = {};
    dbRes.rows.forEach(q => {
      correctMap[q.id] = q.correct_option;
    });

    // Score user answers using deduplicated list
    let correctCount = 0;
    uniqueAnswers.forEach(item => {
      const correctAns = correctMap[item.questionId];
      if (correctAns && String(item.answer).trim().toUpperCase() === correctAns) {
        correctCount++;
      }
    });

    // Calculate score, rank, and ELO estimate mapping based on correct answers
    let simScore = 300;
    let rank = 1;
    let elo = 1000;

    if (correctCount >= 3 && correctCount <= 4) {
      simScore = 450;
      rank = 2;
      elo = 1100;
    } else if (correctCount >= 5 && correctCount <= 6) {
      simScore = 600;
      rank = 3;
      elo = 1200;
    } else if (correctCount >= 7 && correctCount <= 8) {
      simScore = 750;
      rank = 4;
      elo = 1300;
    } else if (correctCount === 9) {
      simScore = 850;
      rank = 5;
      elo = 1400;
    } else if (correctCount === 10) {
      simScore = 900;
      rank = 6;
      elo = 1500;
    }

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
