/**
 * migrate.js
 * Trình chạy migration tuần tự, idempotent (sequential migration runner).
 *
 * Thay cho phiên bản cũ vốn hardcode chạy đúng một file (09). Runner này:
 *   - Đọc mọi file .sql trong thư mục migrations, sắp xếp theo tên (tiền tố 01,02,...).
 *   - Ghi nhận migration đã chạy vào bảng schema_migrations.
 *   - Chỉ chạy các migration CHƯA áp dụng, mỗi file trong một transaction riêng.
 *   - Dừng ngay khi một migration lỗi (không chạy tiếp file sau để giữ đúng thứ tự).
 *
 * An toàn với DB đang chạy: mọi migration hiện có dùng IF NOT EXISTS / ON CONFLICT
 * nên việc runner chạy lại chúng là idempotent, không phá dữ liệu.
 */

const fs = require('fs');
const path = require('path');
const db = require('./index');

const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

async function ensureMigrationsTable() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      filename VARCHAR(255) PRIMARY KEY,
      applied_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
}

async function getAppliedMigrations() {
  const res = await db.query('SELECT filename FROM schema_migrations');
  return new Set(res.rows.map((r) => r.filename));
}

function getMigrationFiles() {
  return fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort(); // tiền tố zero-padded (01, 02, ...) => sắp xếp chuỗi cho đúng thứ tự
}

async function runMigrations() {
  await ensureMigrationsTable();
  const applied = await getAppliedMigrations();
  const files = getMigrationFiles();
  const pending = files.filter((f) => !applied.has(f));

  if (pending.length === 0) {
    console.log('Không có migration nào cần chạy. Database đã ở trạng thái mới nhất.');
    return;
  }

  console.log(`Tìm thấy ${pending.length} migration cần chạy: ${pending.join(', ')}`);

  const client = await db.pool.connect();
  try {
    for (const file of pending) {
      const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');
      console.log(`Đang áp dụng ${file} ...`);
      try {
        await client.query('BEGIN');
        await client.query(sql);
        await client.query('INSERT INTO schema_migrations (filename) VALUES ($1)', [file]);
        await client.query('COMMIT');
        console.log(`  OK: ${file}`);
      } catch (err) {
        await client.query('ROLLBACK');
        console.error(`  LỖI: ${file} — đã rollback:`, err.message);
        throw err; // dừng ngay, không chạy tiếp để tránh áp dụng sai thứ tự
      }
    }
    console.log('Đã áp dụng toàn bộ migration cần chạy.');
  } finally {
    client.release();
  }
}

if (require.main === module) {
  runMigrations()
    .then(() => db.pool.end())
    .catch((err) => {
      console.error('Quá trình migration bị hủy:', err.message);
      db.pool.end();
      process.exit(1);
    });
}

module.exports = { runMigrations };
