/**
 * approveQuestions.test.js
 * Unit test cho công cụ duyệt câu hỏi dành cho Admin.
 */

const db = require('../src/db');

// Giả lập db.query
jest.mock('../src/db', () => {
  return {
    query: jest.fn(),
    pool: {
      end: jest.fn()
    }
  };
});

const {
  listDraftQuestions,
  updateQuestionStatus,
  approveAllDrafts
} = require('../src/db/scripts/approveQuestions');

describe('TOEIC Question Approval Admin Tool Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('List Draft Questions', () => {
    it('should query and return list of questions in draft status', async () => {
      const mockDrafts = [
        { id: 'q1', question_content: 'Test content 1', status: 'draft' },
        { id: 'q2', question_content: 'Test content 2', status: 'draft' }
      ];
      db.query.mockResolvedValueOnce({ rows: mockDrafts });

      const result = await listDraftQuestions();
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('q1');
      expect(db.query).toHaveBeenCalledWith(expect.stringContaining("WHERE status = 'draft'"));
    });
  });

  describe('Update Question Status', () => {
    it('should successfully update status of a question and return updated row', async () => {
      const mockUpdated = { id: 'q1', question_content: 'Test content 1', status: 'approved' };
      db.query.mockResolvedValueOnce({ rows: [mockUpdated] });

      const result = await updateQuestionStatus('q1', 'approved');
      expect(result.status).toBe('approved');
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE questions'),
        ['approved', 'q1']
      );
    });

    it('should throw an error if invalid status is supplied', async () => {
      await expect(updateQuestionStatus('q1', 'invalid_status')).rejects.toThrow(
        'Trạng thái không hợp lệ: invalid_status'
      );
      expect(db.query).not.toHaveBeenCalled();
    });
  });

  describe('Approve All Drafts', () => {
    it('should bulk update all draft questions to approved and return count of updated rows', async () => {
      db.query.mockResolvedValueOnce({ rows: [{ id: 'q1' }, { id: 'q2' }] });

      const count = await approveAllDrafts();
      expect(count).toBe(2);
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining("WHERE status = 'draft'")
      );
    });
  });
});
