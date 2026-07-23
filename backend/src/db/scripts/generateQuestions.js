const fs = require('fs');
const path = require('path');
const db = require('../index');
const config = require('../../config');
const { callClaude } = require('../../services/aiService');

const DEFAULT_COUNT = 50;
const BATCH_SIZE = 10;
const COOLDOWN_MS = 2000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function extractJsonArray(text) {
  const start = text.indexOf('[');
  const end = text.lastIndexOf(']');
  if (start === -1 || end === -1 || end < start) {
    throw new Error('Could not find JSON array brackets in LLM response');
  }
  return text.substring(start, end + 1);
}

async function checkQuestionExists(content) {
  const res = await db.query(
    'SELECT id FROM questions WHERE question_content = $1',
    [content]
  );
  return res.rows.length > 0;
}

async function insertQuestion(client, question) {
  const qRes = await client.query(
    `INSERT INTO questions (part, question_content, option_a, option_b, option_c, option_d, correct_option, source, status, difficulty)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING id`,
    [
      5,
      question.question_content,
      question.option_a,
      question.option_b,
      question.option_c,
      question.option_d,
      question.correct_option,
      'ai_generated',
      'draft',
      question.difficulty || 'medium'
    ]
  );

  const questionId = qRes.rows[0].id;

  await client.query(
    `INSERT INTO questions_explanation (question_id, layer1, layer2, layer3)
     VALUES ($1, $2, $3, $4)`,
    [
      questionId,
      question.explanation_layer1,
      question.explanation_layer2,
      question.explanation_layer3
    ]
  );

  return questionId;
}

async function generateBatch(batchNum, size) {
  const prompt = `Bạn là chuyên gia soạn đề thi TOEIC. Hãy soạn đúng ${size} câu hỏi trắc nghiệm tiếng Anh phần TOEIC Part 5 (Grammar & Vocabulary).
Yêu cầu định dạng trả về duy nhất một mảng JSON (không có văn bản dẫn nhập hay kết luận) có cấu trúc như sau:
[
  {
    "question_content": "The supervisor requested that the assistants check the documents _______.",
    "option_a": "carefully",
    "option_b": "careful",
    "option_c": "carefulness",
    "option_d": "more careful",
    "correct_option": "A",
    "difficulty": "medium",
    "explanation_layer1": "Dịch: Người giám sát yêu cầu các trợ lý kiểm tra tài liệu một cách cẩn thận...",
    "explanation_layer2": "Trạng từ chỉ thể cách: Cần trạng từ 'carefully' để bổ nghĩa cho động từ 'check'...",
    "explanation_layer3": "Từ vựng: supervisor (n) - người giám sát, assistant (n) - trợ lý..."
  }
]
Đảm bảo các câu hỏi có chất lượng cao, đúng định dạng ngữ pháp TOEIC, và có độ khó phân bố từ easy, medium đến hard.`;

  const messages = [{ role: 'user', content: prompt }];
  const responseText = await callClaude(messages, 4000);
  const cleanJson = extractJsonArray(responseText);
  return JSON.parse(cleanJson);
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  
  let count = DEFAULT_COUNT;
  const countArgIdx = args.indexOf('--count');
  if (countArgIdx !== -1 && args[countArgIdx + 1]) {
    count = parseInt(args[countArgIdx + 1], 10) || DEFAULT_COUNT;
  }

  console.log(`=== BẮT ĐẦU GENERATOR TOEIC PART 5 ===`);
  console.log(`- Mục tiêu: Sinh ${count} câu hỏi`);
  console.log(`- Dry-run: ${dryRun ? 'BẬT (không ghi vào DB)' : 'TẮT (ghi trực tiếp DB)'}`);

  if (!dryRun) {
    config.validateEnv();
  }

  const totalBatches = Math.ceil(count / BATCH_SIZE);
  let successCount = 0;
  let skippedCount = 0;

  for (let i = 0; i < totalBatches; i++) {
    const currentBatchSize = Math.min(BATCH_SIZE, count - i * BATCH_SIZE);
    console.log(`\n[Batch ${i + 1}/${totalBatches}] Đang yêu cầu AI sinh ${currentBatchSize} câu hỏi...`);

    try {
      const questions = await generateBatch(i + 1, currentBatchSize);
      console.log(`  Đã nhận ${questions.length} câu hỏi từ AI. Tiến hành xử lý...`);

      if (dryRun) {
        questions.forEach((q, idx) => {
          console.log(`  [Dry-run Item ${idx + 1}] Content: ${q.question_content} | Key: ${q.correct_option}`);
        });
        successCount += questions.length;
      } else {
        const client = await db.pool.connect();
        try {
          for (const q of questions) {
            const exists = await checkQuestionExists(q.question_content);
            if (exists) {
              console.log(`  - Bỏ qua (đã tồn tại): ${q.question_content.substring(0, 40)}...`);
              skippedCount++;
              continue;
            }

            await client.query('BEGIN');
            await insertQuestion(client, q);
            await client.query('COMMIT');
            successCount++;
          }
        } catch (batchErr) {
          console.error(`  Lỗi khi lưu batch vào DB:`, batchErr.message);
        } finally {
          client.release();
        }
      }
    } catch (err) {
      console.error(`  Lỗi xử lý Batch ${i + 1}:`, err.message || err);
    }

    if (i < totalBatches - 1) {
      console.log(`  Chờ ${COOLDOWN_MS / 1000} giây trước batch tiếp theo để tránh rate limit...`);
      await sleep(COOLDOWN_MS);
    }
  }

  console.log(`\n=== TỔNG KẾT TIẾN TRÌNH ===`);
  console.log(`- Tổng số câu xử lý thành công: ${successCount}`);
  console.log(`- Tổng số câu bị bỏ qua (trùng): ${skippedCount}`);
  console.log(`- Môi trường chạy: ${dryRun ? 'Dry-run' : 'Production DB'}`);
  
  db.pool.end();
}

if (require.main === module) {
  main().catch((err) => {
    console.error('Lỗi nghiêm trọng trong generator:', err.message);
    db.pool.end();
    process.exit(1);
  });
} else {
  // Export các helper phục vụ unit test độc lập
  module.exports = {
    extractJsonArray,
    checkQuestionExists,
    insertQuestion,
    generateBatch
  };
}
