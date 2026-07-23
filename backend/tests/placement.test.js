const request = require('supertest');
const app = require('../src/app');
const db = require('../src/db');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret_key_change_me_in_prod';

// Mock the database client
jest.mock('../src/db', () => {
  return {
    query: jest.fn(),
    pool: {
      end: jest.fn()
    }
  };
});

describe('Placement Test API Tests', () => {
  let validToken;
  const mockUserId = '550e8400-e29b-41d4-a716-446655440000';

  beforeEach(() => {
    jest.clearAllMocks();
    validToken = jwt.sign({ id: mockUserId }, JWT_SECRET, { expiresIn: '1h' });
  });

  describe('GET /api/placement/questions', () => {
    it('should retrieve exactly 10 random questions and omit the correct_option field', async () => {
      const mockQuestions = Array.from({ length: 10 }, (_, i) => ({
        id: `question-uuid-${i}`,
        part: 5,
        question_content: `Question ${i} content _______`,
        option_a: 'Option A',
        option_b: 'Option B',
        option_c: 'Option C',
        option_d: 'Option D',
        correct_option: 'A' // Should be filtered out by DB select query in controller
      }));

      // Simulate SELECT returning filtered columns (correct_option deleted in SELECT projection)
      const sanitizedQuestions = mockQuestions.map(({ correct_option, ...rest }) => rest);
      db.query.mockResolvedValueOnce({ rows: sanitizedQuestions });

      const res = await request(app)
        .get('/api/placement/questions');

      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.data.questions).toHaveLength(10);
      
      // Ensure correct_option is not exposed
      res.body.data.questions.forEach(q => {
        expect(q.correct_option).toBeUndefined();
        expect(q).toHaveProperty('id');
        expect(q).toHaveProperty('question_content');
      });

      expect(db.query).toHaveBeenCalledTimes(1);
      expect(db.query.mock.calls[0][0]).toContain('SELECT id, part, question_content');
      expect(db.query.mock.calls[0][0]).not.toContain('correct_option');
    });
  });

  describe('POST /api/placement/submit', () => {
    it('should return 401 Unauthorized if authorization token is missing', async () => {
      const res = await request(app)
        .post('/api/placement/submit')
        .send({
          answers: [{ questionId: 'q1', answer: 'A' }]
        });

      expect(res.status).toBe(401);
      expect(res.body.ok).toBe(false);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
    });

    it('should return 400 if answers payload is not an array', async () => {
      const res = await request(app)
        .post('/api/placement/submit')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          answers: 'not_an_array'
        });

      expect(res.status).toBe(400);
      expect(res.body.ok).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_FAILED');
    });

    it('should successfully score answers and update user rank and ELO in DB', async () => {
      // Mock 10 correct answers in DB
      const mockDbQuestions = Array.from({ length: 10 }, (_, i) => ({
        id: `q-uuid-${i}`,
        correct_option: i % 2 === 0 ? 'A' : 'B' // Alternating correct answers
      }));

      // User answers: 8 correct and 2 incorrect
      const userAnswers = mockDbQuestions.map((q, i) => {
        let answer = q.correct_option;
        if (i >= 8) {
          // Make these incorrect
          answer = q.correct_option === 'A' ? 'B' : 'A';
        }
        return {
          questionId: q.id,
          answer
        };
      });

      // DB mock return for SELECT
      db.query.mockResolvedValueOnce({ rows: mockDbQuestions });
      
      // DB mock return for UPDATE
      db.query.mockResolvedValueOnce({ 
        rows: [{ id: mockUserId, current_rank: 4, current_elo: 1300 }] 
      });

      const res = await request(app)
        .post('/api/placement/submit')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ answers: userAnswers });

      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.data.correctCount).toBe(8);
      expect(res.body.data.simScore).toBe(750); // 8 correct -> 750 (đáng lẽ Rank 4, nhưng cap trần Rank 3)
      expect(res.body.data.rank).toBe(3);
      expect(res.body.data.elo).toBe(1300);

      // Check database calls
      expect(db.query).toHaveBeenCalledTimes(2);

      // First query to fetch correct answers
      const selectQuery = db.query.mock.calls[0][0];
      expect(selectQuery).toContain('correct_option');
      expect(selectQuery).toContain('questions');

      // Second query to update users table ELO and Rank
      const updateQuery = db.query.mock.calls[1][0];
      const updateParams = db.query.mock.calls[1][1];
      expect(updateQuery).toContain('UPDATE users');
      expect(updateQuery).toContain('SET current_rank = $1, current_elo = $2');
      expect(updateParams[0]).toBe(3); // Capped at Rank 3
      expect(updateParams[1]).toBe(1300); // ELO 1300
      expect(updateParams[2]).toBe(mockUserId);
    });

    it('should return 404 if user ID does not exist in DB during update', async () => {
      // Mock questions select
      db.query.mockResolvedValueOnce({ rows: [{ id: 'q1', correct_option: 'A' }] });
      // Mock update users returning empty row
      db.query.mockResolvedValueOnce({ rows: [] });

      const res = await request(app)
        .post('/api/placement/submit')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          answers: [{ questionId: 'q1', answer: 'A' }]
        });

      expect(res.status).toBe(404);
      expect(res.body.ok).toBe(false);
      expect(res.body.error.code).toBe('USER_NOT_FOUND');
    });

    it('should ignore duplicate questionIds in the submit payload to prevent score inflation', async () => {
      db.query.mockResolvedValueOnce({ rows: [{ id: 'q1', correct_option: 'A' }] });
      db.query.mockResolvedValueOnce({ 
        rows: [{ id: mockUserId, current_rank: 1, current_elo: 1000 }] 
      });

      const res = await request(app)
        .post('/api/placement/submit')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          answers: [
            { questionId: 'q1', answer: 'A' },
            { questionId: 'q1', answer: 'A' },
            { questionId: 'q1', answer: 'A' }
          ]
        });

      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.data.correctCount).toBe(1);
      expect(res.body.data.rank).toBe(1);
    });

    it('should handle fragile answers payload by filtering out invalid objects and scoring the remaining valid ones', async () => {
      db.query.mockResolvedValueOnce({ rows: [{ id: 'q1', correct_option: 'A' }] });
      db.query.mockResolvedValueOnce({ 
        rows: [{ id: mockUserId, current_rank: 1, current_elo: 1000 }] 
      });

      const res = await request(app)
        .post('/api/placement/submit')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          answers: [
            null,
            "string-item",
            { wrongKey: 'val' },
            { questionId: 'q1', answer: 'A' },
            { questionId: 'q2', answer: null },
            { questionId: '', answer: 'B' }
          ]
        });

      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.data.correctCount).toBe(1);
    });

    it('should return 400 if all answers in the array are invalid or empty', async () => {
      const res = await request(app)
        .post('/api/placement/submit')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          answers: [
            null,
            "string-item",
            { wrongKey: 'val' }
          ]
        });

      expect(res.status).toBe(400);
      expect(res.body.ok).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_FAILED');
    });
  });
});
