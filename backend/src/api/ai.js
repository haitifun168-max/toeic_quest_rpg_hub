const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { generateDiagnosticReport, explainQuestion } = require('../services/aiService');

/**
 * POST /api/ai/diagnostic
 * Generate RPG Diagnostic Report based on test stats
 */
router.post('/diagnostic', authenticateToken, async (req, res, next) => {
  try {
    const { score, targetScore, partStats, incorrectSummary } = req.body;

    const reportText = await generateDiagnosticReport({
      score,
      targetScore,
      partStats,
      incorrectSummary
    });

    return res.json({
      ok: true,
      data: {
        report: reportText
      },
      error: null
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/ai/explain
 * Get NPC Tutor explanation for a specific TOEIC question
 */
router.post('/explain', authenticateToken, async (req, res, next) => {
  try {
    const { questionText, options, correctAnswer, userSelection, part } = req.body;

    if (!questionText || !correctAnswer) {
      return res.status(400).json({
        ok: false,
        data: null,
        error: {
          code: 'BAD_REQUEST',
          message: 'questionText and correctAnswer are required'
        }
      });
    }

    const explanation = await explainQuestion({
      questionText,
      options,
      correctAnswer,
      userSelection,
      part
    });

    return res.json({
      ok: true,
      data: {
        explanation
      },
      error: null
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
