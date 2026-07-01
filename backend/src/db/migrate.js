const fs = require('fs');
const path = require('path');
const db = require('./index');

async function runMigration() {
  const migrationPath = path.join(__dirname, 'migrations', '09_add_career_milestones.sql');
  const sql = fs.readFileSync(migrationPath, 'utf8');
  
  console.log('Running migration: 09_add_career_milestones.sql...');
  try {
    await db.query(sql);
    console.log('Migration successfully applied.');
  } catch (err) {
    console.error('Error applying migration:', err);
  } finally {
    await db.pool.end();
  }
}

runMigration();
