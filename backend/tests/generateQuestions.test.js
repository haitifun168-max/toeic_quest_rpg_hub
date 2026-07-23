/**
 * generateQuestions.test.js
 * Unit test cho script generator câu hỏi TOEIC Part 5.
 *
 * Kiểm tra các cơ chế cốt lõi mà không gọi API Claude thật:
 *   1. Trích xuất JSON array từ text thô (bỏ văn bản rác xung quanh).
 *   2. Bỏ qua câu hỏi trùng (checkQuestionExists).
 *   3. Giao dịch DB ghi đồng thời vào bảng questions và questions_explanation.
 */

const db = require('../src/db');

// Giả lập db.query
jest.mock('../src/db', () => {
  const mRows = [];
  return {
    query: jest.fn((sql, params) => {
      // Giả lập check trùng
      if (sql.includes('SELECT id FROM questions WHERE question_content')) {
        const content = params[0];
        const exists = mRows.some((r) => r.question_content === content);
        return Promise.resolve({ rows: exists ? [{ id: 'mock-id' }] : [] });
      }
      // Giả lập insert
      if (sql.includes('INSERT INTO questions (part')) {
        const newId = `mock-uuid-${Date.now()}`;
        mRows.push({ id: newId, question_content: params[1] });
        return Promise.resolve({ rows: [{ id: newId }] });
      }
      return Promise.resolve({ rows: [] });
    }),
    pool: {
      end: jest.fn(),
      connect: jest.fn(() => ({
        query: jest.fn((sql, params) => {
          if (sql.includes('INSERT INTO questions (part')) {
            return Promise.resolve({ rows: [{ id: 'mock-uuid-conn' }] });
          }
          return Promise.resolve({ rows: [] });
        }),
        release: jest.fn()
      }))
    }
  };
});

// Mock aiService
jest.mock('../src/services/aiService', () => ({
  callClaude: jest.fn()
}));

const { extractJsonArray, checkQuestionExists, insertQuestion } = require('../src/db/scripts/generateQuestions');

describe('TOEIC Question Generator Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('JSON Extraction Utility', () => {
    it('should successfully extract JSON array and discard leading/trailing text', () => {
      const llmOutput = `Dưới đây là câu hỏi bạn yêu cầu:
      [
        {
          "question_content": "Test text"
        }
      ]
      Hy vọng nó giúp ích!`;

      const result = extractJsonArray(llmOutput);
      expect(result).toBe(`[\n        {\n          "question_content": "Test text"\n        }\n      ]`);
      expect(() => JSON.parse(result)).not.toThrow();
    });

    it('should throw an error if brackets are missing or mismatched', () => {
      const badOutput = 'This output has no JSON array brackets';
      expect(() => extractJsonArray(badOutput)).toThrow('Could not find JSON array brackets');
    });
  });

  describe('Database Duplicate Check', () => {
    it('should check db and identify if question content already exists', async () => {
      // Mock db.query return empty -> not exists
      db.query.mockResolvedValueOnce({ rows: [] });
      const res1 = await checkQuestionExists('Some new question content');
      expect(res1).toBe(false);

      // Mock db.query return row -> exists
      db.query.mockResolvedValueOnce({ rows: [{ id: 'some-id' }] });
      const res2 = await checkQuestionExists('Duplicate content');
      expect(res2).toBe(true);
    });
  });

  describe('Transactional Database Insertion', () => {
    it('should insert into both questions and questions_explanation tables within client session', async () => {
      const mockClient = {
        query: jest.fn()
      };
      mockClient.query.mockResolvedValueOnce({ rows: [{ id: 'q-uuid-test' }] }); // Insert questions return id
      mockClient.query.mockResolvedValueOnce({ rows: [] }); // Insert explanation

      const mockQuestion = {
        question_content: 'Supervisor requested...',
        option_a: 'carefully',
        option_b: 'careful',
        option_c: 'carefulness',
        option_d: 'more careful',
        correct_option: 'A',
        difficulty: 'medium',
        explanation_layer1: 'L1',
        explanation_layer2: 'L2',
        explanation_layer3: 'L3'
      };

      const newId = await insertQuestion(mockClient, mockQuestion);
      expect(newId).toBe('q-uuid-test');
      expect(mockClient.query).toHaveBeenCalledTimes(2);

      // Verify first insert questions
      const firstCall = mockClient.query.mock.calls[0];
      expect(firstCall[0]).toContain('INSERT INTO questions');
      expect(firstCall[1][1]).toBe('Supervisor requested...');

      // Verify second insert explanation linked with correct question ID
      const secondCall = mockClient.query.mock.calls[1];
      expect(secondCall[0]).toContain('INSERT INTO questions_explanation');
      expect(secondCall[1][0]).toBe('q-uuid-test');
      expect(secondCall[1][1]).toBe('L1');
    });
  });
});
