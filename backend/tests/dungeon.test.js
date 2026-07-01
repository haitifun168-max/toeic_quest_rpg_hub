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
      end: jest.fn(),
      connect: jest.fn(() => ({
        query: jest.fn(),
        release: jest.fn()
      }))
    }
  };
});

describe('Dungeon & Mock Test REST API Tests', () => {
  let validToken;
  const mockUserId = '550e8400-e29b-41d4-a716-446655440000';

  beforeEach(() => {
    jest.clearAllMocks();
    validToken = jwt.sign({ id: mockUserId }, JWT_SECRET, { expiresIn: '1h' });
  });

  describe('POST /api/dungeons/start', () => {
    it('should fail if dungeonType is invalid', async () => {
      const res = await request(app)
        .post('/api/dungeons/start')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ dungeonType: 'mega' });

      expect(res.status).toBe(400);
      expect(res.body.ok).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_FAILED');
    });

    it('should start a new dungeon session if no active session exists', async () => {
      db.query.mockResolvedValueOnce({ rows: [] }); // 1. Check active session (empty)
      db.query.mockResolvedValueOnce({
        rows: [{ id: 'ds-1', dungeon_type: 'mini', started_at: new Date().toISOString() }]
      }); // 2. Insert session
      db.query.mockResolvedValueOnce({ rows: [] }); // 3. Get questions (empty fallback to mock)

      const res = await request(app)
        .post('/api/dungeons/start')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ dungeonType: 'mini' });

      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.data.dungeonSessionId).toBe('ds-1');
      expect(res.body.data.questions).toHaveLength(100);
    });
  });

  describe('POST /api/dungeons/checkpoint', () => {
    it('should successfully save draft answers inside a transaction', async () => {
      const mockClient = {
        query: jest.fn().mockResolvedValue({}),
        release: jest.fn()
      };
      db.pool.connect.mockResolvedValueOnce(mockClient);

      const res = await request(app)
        .post('/api/dungeons/checkpoint')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          dungeonSessionId: 'ds-1',
          answers: [
            { questionId: 'q1', selectedOption: 'A' },
            { questionId: 'q2', selectedOption: 'C' }
          ]
        });

      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.data.savedCount).toBe(2);

      expect(mockClient.query).toHaveBeenCalledWith('BEGIN');
      expect(mockClient.query).toHaveBeenCalledWith('COMMIT');
    });
  });

  describe('GET /api/dungeons/resume', () => {
    it('should return sessionActive = false if there is no active session', async () => {
      db.query.mockResolvedValueOnce({ rows: [] }); // Check session

      const res = await request(app)
        .get('/api/dungeons/resume')
        .set('Authorization', `Bearer ${validToken}`);

      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.data.sessionActive).toBe(false);
    });

    it('should load active session questions and saved drafts to resume', async () => {
      const mockSession = { id: 'ds-1', dungeon_type: 'mini', started_at: new Date().toISOString() };
      const mockDrafts = [{ question_id: 'q1', selected_option: 'B' }];

      db.query.mockResolvedValueOnce({ rows: [mockSession] }); // 1. Check session
      db.query.mockResolvedValueOnce({ rows: mockDrafts }); // 2. Get drafts
      db.query.mockResolvedValueOnce({ rows: [] }); // 3. Get questions (fallback)

      const res = await request(app)
        .get('/api/dungeons/resume')
        .set('Authorization', `Bearer ${validToken}`);

      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.data.sessionActive).toBe(true);
      expect(res.body.data.dungeonSessionId).toBe('ds-1');
      expect(res.body.data.drafts).toHaveLength(1);
      expect(res.body.data.drafts[0].selectedOption).toBe('B');
    });
  });

  describe('POST /api/dungeons/submit', () => {
    it('should calculate estimated TOEIC score and reward KP upon successful submit', async () => {
      const mockClient = {
        query: jest.fn(),
        release: jest.fn()
      };
      db.pool.connect.mockResolvedValueOnce(mockClient);

      // 1. Get session info
      mockClient.query.mockResolvedValueOnce({
        rows: [{ id: 'ds-1', dungeon_type: 'mini', is_submitted: false }]
      });
      // 2. BEGIN
      mockClient.query.mockResolvedValueOnce({});
      // 3. Get drafts for grading
      mockClient.query.mockResolvedValueOnce({
        rows: [
          { question_id: 'q1', selected_option: 'A', correct_option: 'A' }, // correct
          { question_id: 'q2', selected_option: 'B', correct_option: 'A' }  // incorrect
        ]
      });
      // 4. Update session
      mockClient.query.mockResolvedValueOnce({});
      // 5. Update user total_kp
      mockClient.query.mockResolvedValueOnce({});
      // 6. Delete drafts
      mockClient.query.mockResolvedValueOnce({});
      // 7. COMMIT
      mockClient.query.mockResolvedValueOnce({});

      const res = await request(app)
        .post('/api/dungeons/submit')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ dungeonSessionId: 'ds-1' });

      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.data.correctCount).toBe(1);
      expect(res.body.data.totalQuestions).toBe(100);
      
      // correctRate = 1/2 = 50%
      // rawScore = 0.5 * 980 + 10 = 500. estimatedScore is 500.
      expect(res.body.data.estimatedScore).toBe(500);
      expect(res.body.data.kpEarned).toBe(210); // 1 * 10 + 200 = 210
    });
  });
});
