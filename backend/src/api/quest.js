const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');
const { getRankByKp } = require('../utils/rankSystem');

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
 * GET /api/quests/daily
 * Retrieves the daily quests for the authenticated user.
 * Generates quests and resets stamina if it's the first login of the day.
 */
router.get('/daily', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const todayStr = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD

    // 1. Check if daily quests already exist for today
    const selectQuery = `
      SELECT id, quest_type, title, target_count, current_count, is_completed, quest_date
      FROM user_quests
      WHERE user_id = $1 AND quest_date = $2
    `;
    let dbRes = await db.query(selectQuery, [userId, todayStr]);

    // 2. If no quests exist for today, generate them and reset user stamina
    if (dbRes.rows.length === 0) {
      // Begin transaction to ensure consistency
      await db.query('BEGIN');
      try {
        // Insert 3 default quests
        const insertQuery = `
          INSERT INTO user_quests (user_id, quest_type, title, target_count, quest_date)
          VALUES 
            ($1, 'vocab', 'Học 10 từ vựng Part 1', 10, $2),
            ($1, 'listening', 'Hoàn thành 1 bài nghe Part 2', 1, $2),
            ($1, 'pvp', 'Thắng 1 trận PvP Battle', 1, $2)
          RETURNING id, quest_type, title, target_count, current_count, is_completed, quest_date
        `;
        const insertRes = await db.query(insertQuery, [userId, todayStr]);

        // Reset user stamina back to max (15 for free)
        const updateStaminaQuery = `
          UPDATE users
          SET current_stamina = 15, last_stamina_reset = CURRENT_TIMESTAMP
          WHERE id = $1
        `;
        await db.query(updateStaminaQuery, [userId]);

        await db.query('COMMIT');
        dbRes = insertRes; // Use the newly created quests for response
      } catch (transactionErr) {
        await db.query('ROLLBACK');
        throw transactionErr;
      }
    }

    // 3. Fetch user's current stamina to return alongside the quests
    const userQuery = 'SELECT current_stamina FROM users WHERE id = $1';
    const userRes = await db.query(userQuery, [userId]);
    const currentStamina = userRes.rows.length ? userRes.rows[0].current_stamina : 15;

    return sendSuccess(res, {
      quests: dbRes.rows,
      stamina: currentStamina,
      maxStamina: 15
    });
  } catch (err) {
    console.error('Fetch daily quests error:', err);
    return sendError(res, 'INTERNAL_SERVER_ERROR', 'Failed to retrieve daily quests', 500);
  }
});

/**
 * GET /api/quests/:id
 * Retrieves detail for a specific daily quest.
 */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const questId = req.params.id;

    const questQuery = `
      SELECT id, quest_type, title, target_count, current_count, is_completed, quest_date
      FROM user_quests
      WHERE id = $1 AND user_id = $2
    `;
    const questRes = await db.query(questQuery, [questId, userId]);
    if (questRes.rows.length === 0) {
      return sendError(res, 'QUEST_NOT_FOUND', 'Quest not found or access denied', 404);
    }

    const quest = questRes.rows[0];
    
    // Add additional presentation details like description and rewards
    quest.description = `Hoàn thành nhiệm vụ ngày để nhận phần thưởng hấp dẫn. Chế độ học ${quest.quest_type === 'listening' ? 'Nghe Part 2' : 'Đọc Part 5'}.`;
    quest.reward_xp = quest.quest_type === 'pvp' ? 100 : 50;
    quest.reward_kp = quest.quest_type === 'pvp' ? 40 : 20;

    return sendSuccess(res, { quest });
  } catch (err) {
    console.error('Fetch quest detail error:', err);
    return sendError(res, 'INTERNAL_SERVER_ERROR', 'Failed to retrieve quest details', 500);
  }
});

/**
 * GET /api/quests/:id/questions
 * Retrieves the questions associated with a daily quest.
 * Uses quest_type to determine the part (Part 5 for vocab/grammar, Part 2 for listening).
 */
router.get('/:id/questions', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const questId = req.params.id;

    // 1. Get the user quest details to verify ownership and type
    const questQuery = `
      SELECT id, quest_type, target_count, user_id
      FROM user_quests
      WHERE id = $1 AND user_id = $2
    `;
    const questRes = await db.query(questQuery, [questId, userId]);
    if (questRes.rows.length === 0) {
      return sendError(res, 'QUEST_NOT_FOUND', 'Quest not found or access denied', 404);
    }

    const quest = questRes.rows[0];
    const part = quest.quest_type === 'listening' ? 2 : 5; // Part 2 for listening, Part 5 for grammar/vocab
    const limit = quest.target_count || 10;

    // 2. Fetch questions for the specified part along with layer1 explanation (translation/key)
    const questionsQuery = `
      SELECT q.id, q.part, q.question_content, q.option_a, q.option_b, q.option_c, q.option_d, q.correct_option,
             qe.layer1 as explanation_layer1
      FROM questions q
      LEFT JOIN questions_explanation qe ON q.id = qe.question_id
      WHERE q.part = $1 AND q.status = 'approved'
      ORDER BY q.id
      LIMIT $2
    `;
    const questionsRes = await db.query(questionsQuery, [part, limit]);

    return sendSuccess(res, {
      quest_id: quest.id,
      quest_type: quest.quest_type,
      questions: questionsRes.rows
    });
  } catch (err) {
    console.error('Fetch quest questions error:', err);
    return sendError(res, 'INTERNAL_SERVER_ERROR', 'Failed to retrieve quest questions', 500);
  }
});

/**
 * GET /api/quests/questions/:id/explanations
 * Lazy loads layer2 and layer3 explanations for a specific question.
 */
router.get('/questions/:id/explanations', authenticateToken, async (req, res) => {
  try {
    const questionId = req.params.id;

    const explanationQuery = `
      SELECT question_id, layer2, layer3
      FROM questions_explanation
      WHERE question_id = $1
    `;
    const explanationRes = await db.query(explanationQuery, [questionId]);

    if (explanationRes.rows.length === 0) {
      return sendError(res, 'EXPLANATION_NOT_FOUND', 'Explanations not found for the specified question', 404);
    }

    return sendSuccess(res, {
      explanation: explanationRes.rows[0]
    });
  } catch (err) {
    console.error('Fetch question explanations error:', err);
    return sendError(res, 'INTERNAL_SERVER_ERROR', 'Failed to retrieve explanations', 500);
  }
});

/**
 * POST /api/quests/session/submit
 * Submits the results of a quest session, updates user quest status, computes score/KP,
 * filters weak grammatical categories, and increments user's study Streak automatically.
 */
router.post('/session/submit', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { questId, answers } = req.body; // answers format: [{ questionId: 'q1', selectedOption: 'B' }]

    if (!questId || !Array.isArray(answers)) {
      return sendError(res, 'VALIDATION_FAILED', 'Missing questId or answers array');
    }

    // 1. Get quest details
    const questQuery = `
      SELECT id, quest_type, target_count, current_count, is_completed
      FROM user_quests
      WHERE id = $1 AND user_id = $2
    `;
    const questRes = await db.query(questQuery, [questId, userId]);
    if (questRes.rows.length === 0) {
      return sendError(res, 'QUEST_NOT_FOUND', 'Quest not found or access denied', 404);
    }

    const quest = questRes.rows[0];

    // 2. Fetch correct options from DB to grade answers
    const questionIds = answers.map(a => a.questionId);
    let correctCount = 0;
    let wrongCount = 0;
    const weakTopics = new Set();

    if (questionIds.length > 0) {
      const dbQuestionsRes = await db.query(
        'SELECT id, correct_option, question_content FROM questions WHERE id = ANY($1)',
        [questionIds]
      );

      // Create a map for quick lookup
      const questionsMap = {};
      dbQuestionsRes.rows.forEach(q => {
        questionsMap[q.id] = q;
      });

      // Grade each answer
      answers.forEach(ans => {
        const dbQ = questionsMap[ans.questionId];
        if (dbQ) {
          if (dbQ.correct_option === ans.selectedOption) {
            correctCount++;
          } else {
            wrongCount++;
            // Map questions to a weak topic categories for AI Mentor recommendation
            // In a real app we might look at tags. Here we simulate weak categories based on part and content keywords
            if (dbQ.question_content.toLowerCase().includes('before') || dbQ.question_content.toLowerCase().includes('after')) {
              weakTopics.add('Mệnh đề trạng ngữ chỉ thời gian (Gerund after prepositions)');
            } else if (dbQ.question_content.toLowerCase().includes('highly') || dbQ.question_content.toLowerCase().includes('quickly')) {
              weakTopics.add('Trạng từ chỉ mức độ và cách thức (Adverbs of degree/manner)');
            } else {
              weakTopics.add('Giới từ và Mạo từ trong tiếng Anh (Prepositions & Articles)');
            }
          }
        }
      });
    }

    // Limit to maximum 3 weak topics
    const recommendations = Array.from(weakTopics).slice(0, 3);
    if (recommendations.length === 0) {
      recommendations.push('Không có lỗi sai nghiêm trọng. Cú pháp của bạn rất vững chắc!');
    }

    // Calculate KP rewards: 20 KP per correct answer, +50 KP completion bonus
    const kpEarned = (correctCount * 20) + (quest.is_completed ? 0 : 50);

    // 3. Begin transaction to update DB tables safely
    await db.query('BEGIN');
    try {
      // A. Update user quest progress
      const newCount = Math.min(quest.target_count, quest.current_count + answers.length);
      const isNowCompleted = newCount >= quest.target_count;
      
      const updateQuestQuery = `
        UPDATE user_quests
        SET current_count = $1, is_completed = $2
        WHERE id = $3
      `;
      await db.query(updateQuestQuery, [newCount, isNowCompleted, questId]);

      // B. Update user's KP, Rank, and Streak logic
      const userQuery = 'SELECT total_kp, current_streak, longest_streak, last_active_date FROM users WHERE id = $1';
      const userRes = await db.query(userQuery, [userId]);
      const user = userRes.rows[0];

      let newStreak = user.current_streak || 0;
      const todayStr = new Date().toISOString().split('T')[0];

      if (!user.last_active_date) {
        newStreak = 1;
      } else {
        const lastActive = new Date(user.last_active_date);
        const today = new Date(todayStr);
        const diffTime = Math.abs(today - lastActive);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          // Continuous learning -> increment streak
          newStreak = (user.current_streak || 0) + 1;
        } else if (diffDays > 1) {
          // Gap occurred -> Reset streak to 1
          newStreak = 1;
        }
        // If diffDays === 0, keep same streak (already studied today)
      }

      const newLongestStreak = Math.max(user.longest_streak || 0, newStreak);
      const newTotalKp = (user.total_kp || 0) + kpEarned;

      // Nguồn chân lý duy nhất: rankSystem (6 hạng, ngưỡng theo BRD đã duyệt)
      const newRank = getRankByKp(newTotalKp);

      const updateUserQuery = `
        UPDATE users
        SET total_kp = $1, current_streak = $2, longest_streak = $3, last_active_date = $4, current_rank = $5
        WHERE id = $6
      `;
      await db.query(updateUserQuery, [newTotalKp, newStreak, newLongestStreak, todayStr, newRank, userId]);

      await db.query('COMMIT');

      return sendSuccess(res, {
        score: {
          totalQuestions: answers.length,
          correct: correctCount,
          wrong: wrongCount,
          kpEarned
        },
        recommendations,
        streak: {
          currentStreak: newStreak,
          longestStreak: newLongestStreak,
          wasIncremented: newStreak > (user.current_streak || 0)
        },
        rankUp: newRank > user.current_rank
      });
    } catch (transactionErr) {
      await db.query('ROLLBACK');
      throw transactionErr;
    }
  } catch (err) {
    console.error('Submit quest session error:', err);
    return sendError(res, 'INTERNAL_SERVER_ERROR', 'Failed to submit quest session', 500);
  }
});

module.exports = router;

