/**
 * approveQuestions.js
 * Công cụ quản lý và duyệt câu hỏi dành cho Admin (John & Yui).
 *
 * Chạy dưới dạng lệnh CLI:
 *   - Liệt kê câu hỏi nháp: node approveQuestions.js --list
 *   - Duyệt một câu:       node approveQuestions.js --approve <uuid>
 *   - Loại bỏ một câu:     node approveQuestions.js --reject <uuid>
 *   - Duyệt nhanh tất cả:  node approveQuestions.js --approve-all
 *
 * Hoạt động trực tiếp trên DB production (Supabase) hoặc local qua DATABASE_URL.
 */

const db = require('../index');
const config = require('../../config');

async function listDraftQuestions() {
  const res = await db.query(
    `SELECT id, part, question_content, difficulty, source, created_at 
     FROM questions 
     WHERE status = 'draft' 
     ORDER BY created_at ASC`
  );
  return res.rows;
}

async function updateQuestionStatus(id, newStatus) {
  if (!['approved', 'rejected', 'draft'].includes(newStatus)) {
    throw new Error(`Trạng thái không hợp lệ: ${newStatus}`);
  }

  const res = await db.query(
    `UPDATE questions 
     SET status = $1, created_at = NOW() 
     WHERE id = $2 
     RETURNING id, question_content, status`,
    [newStatus, id]
  );
  return res.rows[0];
}

async function approveAllDrafts() {
  const res = await db.query(
    `UPDATE questions 
     SET status = 'approved', created_at = NOW() 
     WHERE status = 'draft' 
     RETURNING id`
  );
  return res.rows.length;
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--list')) {
    config.validateEnv();
    const drafts = await listDraftQuestions();
    console.log(`=== DANH SÁCH CÂU HỎI CHỜ DUYỆT (Tổng số: ${drafts.length}) ===`);
    drafts.forEach((q, idx) => {
      console.log(`[${idx + 1}] ID: ${q.id} | Part: ${q.part} | Độ khó: ${q.difficulty}`);
      console.log(`    Nội dung: ${q.question_content}`);
      console.log(`    Nguồn: ${q.source} | Ngày tạo: ${q.created_at}`);
      console.log(`--------------------------------------------------`);
    });
    return;
  }

  if (args.includes('--approve-all')) {
    config.validateEnv();
    console.log('Đang duyệt nhanh toàn bộ câu hỏi draft...');
    const count = await approveAllDrafts();
    console.log(`Thành công: Đã chuyển ${count} câu hỏi sang trạng thái approved.`);
    return;
  }

  const approveIdx = args.indexOf('--approve');
  if (approveIdx !== -1 && args[approveIdx + 1]) {
    config.validateEnv();
    const id = args[approveIdx + 1];
    const updated = await updateQuestionStatus(id, 'approved');
    if (!updated) {
      console.log(`Không tìm thấy câu hỏi với ID: ${id}`);
    } else {
      console.log(`Đã DUYỆT câu hỏi thành công!`);
      console.log(`- ID: ${updated.id}`);
      console.log(`- Nội dung: ${updated.question_content}`);
    }
    return;
  }

  const rejectIdx = args.indexOf('--reject');
  if (rejectIdx !== -1 && args[rejectIdx + 1]) {
    config.validateEnv();
    const id = args[rejectIdx + 1];
    const updated = await updateQuestionStatus(id, 'rejected');
    if (!updated) {
      console.log(`Không tìm thấy câu hỏi với ID: ${id}`);
    } else {
      console.log(`Đã LOẠI BỎ câu hỏi thành công!`);
      console.log(`- ID: ${updated.id}`);
      console.log(`- Nội dung: ${updated.question_content}`);
    }
    return;
  }

  // Hướng dẫn sử dụng mặc định
  console.log(`=== HƯỚNG DẪN CÔNG CỤ DUYỆT CÂU HỎI ===`);
  console.log(`1. Xem danh sách nháp: node approveQuestions.js --list`);
  console.log(`2. Duyệt 1 câu:       node approveQuestions.js --approve <id>`);
  console.log(`3. Loại bỏ 1 câu:     node approveQuestions.js --reject <id>`);
  console.log(`4. Duyệt toàn bộ:     node approveQuestions.js --approve-all`);
}

if (require.main === module) {
  main()
    .then(() => db.pool.end())
    .catch((err) => {
      console.error('Lỗi thực thi:', err.message);
      db.pool.end();
      process.exit(1);
    });
}

module.exports = {
  listDraftQuestions,
  updateQuestionStatus,
  approveAllDrafts
};
