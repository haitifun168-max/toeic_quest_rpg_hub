-- Migration 10: Mở rộng ngân hàng câu hỏi cho Reading Part 5-7 (additive, không phá schema cũ)
--
-- Nguyên tắc:
--   - CHỈ thêm bảng/cột mới. Không đổi tên, không xóa cột cũ (8 query hiện có phụ thuộc
--     vào id, part, question_content, option_a-d, correct_option).
--   - Part 5: câu đơn, passage_id = NULL.
--   - Part 6/7: nhiều câu hỏi cùng tham chiếu một đoạn văn qua passage_id.
--   - Cổng chất lượng: cột status. Câu chưa duyệt (draft) không được phục vụ cho người học;
--     mọi query phía user phải lọc status = 'approved'.

-- 1. Bảng đoạn văn cho Part 6/7 (một passage -> nhiều câu hỏi)
CREATE TABLE IF NOT EXISTS passages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    part INTEGER NOT NULL CHECK (part IN (6, 7)),
    title TEXT,
    content TEXT NOT NULL,
    source VARCHAR(20) NOT NULL DEFAULT 'manual',   -- 'manual' | 'ai_generated'
    status VARCHAR(20) NOT NULL DEFAULT 'draft',     -- 'draft' | 'approved' | 'rejected'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Cột mới cho bảng questions (nullable => an toàn với 10 câu seed cũ)
ALTER TABLE questions ADD COLUMN IF NOT EXISTS passage_id UUID REFERENCES passages(id) ON DELETE CASCADE;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS source VARCHAR(20) NOT NULL DEFAULT 'manual';       -- 'manual' | 'ai_generated'
ALTER TABLE questions ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'approved';     -- seed cũ coi như đã duyệt
ALTER TABLE questions ADD COLUMN IF NOT EXISTS difficulty VARCHAR(10) NOT NULL DEFAULT 'medium';   -- 'easy' | 'medium' | 'hard'
ALTER TABLE questions ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- 3. Index phục vụ truy vấn theo Part + trạng thái (Daily Quest, Placement, Dungeon)
CREATE INDEX IF NOT EXISTS idx_questions_part_status ON questions(part, status);
CREATE INDEX IF NOT EXISTS idx_questions_passage_id ON questions(passage_id);
CREATE INDEX IF NOT EXISTS idx_passages_part_status ON passages(part, status);
