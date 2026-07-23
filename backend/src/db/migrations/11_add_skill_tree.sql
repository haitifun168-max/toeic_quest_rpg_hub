-- Migration 11: Skill Tree Map (Lộ Trình Kỹ Năng) — dữ liệu động cho FR (IA §10.2)
--
-- Quyết định (Kevin chốt):
--   - 12-node mockup thực chất là 10 node: điểm xuất phát, 2 nhánh Listening/Reading
--     (mỗi nhánh 3 tầng), 2 mini-boss, 1 final boss.
--   - Nguồn dữ liệu: ĐỘNG từ backend (bảng này), không hardcode client.
--   - Tiêu chí mở khóa: theo RANK người dùng (tái dùng rankSystem 6 hạng).
--
-- Trạng thái node KHÔNG lưu ở đây; nó được suy ra lúc query bằng cách so
-- current_rank của user với unlock_rank:
--   unlock_rank <  user_rank  -> 'completed'
--   unlock_rank == user_rank  -> 'active'
--   unlock_rank >  user_rank  -> 'locked'
--
-- Additive, idempotent. Không đụng bảng cũ.

CREATE TABLE IF NOT EXISTS skill_nodes (
    id VARCHAR(20) PRIMARY KEY,                 -- 'START', 'R-01', 'L-STAR', 'BOSS', ...
    label VARCHAR(80) NOT NULL,                 -- nhãn hiển thị tiếng Việt
    branch VARCHAR(20) NOT NULL,                -- 'core' | 'reading' | 'listening'
    tier INTEGER NOT NULL,                       -- tầng dọc: 0 (xuất phát) .. 5 (final boss)
    node_type VARCHAR(20) NOT NULL DEFAULT 'skill',  -- 'start' | 'skill' | 'boss' | 'final_boss'
    icon VARCHAR(30) NOT NULL DEFAULT 'school',  -- tên Material Symbol
    unlock_rank INTEGER NOT NULL DEFAULT 1,      -- rank tối thiểu để mở (1..6)
    sort_order INTEGER NOT NULL DEFAULT 0        -- thứ tự vẽ từ dưới lên
);

-- Seed 10 node theo mockup skill_tree_map. ON CONFLICT DO NOTHING => idempotent.
INSERT INTO skill_nodes (id, label, branch, tier, node_type, icon, unlock_rank, sort_order) VALUES
    ('START',  'Điểm Xuất Phát',   'core',      0, 'start',      'flag',         1, 0),
    ('R-01',   'R-01 Ngữ Pháp',    'reading',   1, 'skill',      'menu_book',    1, 10),
    ('L-01',   'L-01 Nền Tảng',    'listening', 1, 'skill',      'hearing',      1, 11),
    ('R-02',   'R-02 Từ Vựng',     'reading',   2, 'skill',      'spellcheck',   2, 20),
    ('L-02',   'L-02 Câu Hỏi',     'listening', 2, 'skill',      'quiz',         2, 21),
    ('R-03',   'R-03 Đoạn Văn',    'reading',   3, 'skill',      'article',      3, 30),
    ('L-03',   'L-03 Hội Thoại',   'listening', 3, 'skill',      'forum',        3, 31),
    ('R-STAR', 'R-Star Trial',     'reading',   4, 'boss',       'swords',       4, 40),
    ('L-STAR', 'L-Star Trial',     'listening', 4, 'boss',       'swords',       4, 41),
    ('BOSS',   'TOEIC Champion',   'core',      5, 'final_boss', 'star',         6, 50)
ON CONFLICT (id) DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_skill_nodes_sort ON skill_nodes(sort_order);
