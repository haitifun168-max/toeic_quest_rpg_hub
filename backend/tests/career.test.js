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

describe('Career Milestones & Rank REST API Tests', () => {
  let validToken;
  const mockUserId = '550e8400-e29b-41d4-a716-446655440000';

  beforeEach(() => {
    jest.clearAllMocks();
    validToken = jwt.sign({ id: mockUserId }, JWT_SECRET, { expiresIn: '1h' });
  });

  describe('POST /api/users/check-rank', () => {
    it('should return rankUpTriggered: false if KP is below next rank threshold', async () => {
      db.query.mockResolvedValueOnce({
        rows: [{ total_kp: 400, rank: 1 }] // User has 400 KP (ngưỡng mới cho Rank 2 là 500 KP)
      });

      const res = await request(app)
        .post('/api/users/check-rank')
        .set('Authorization', `Bearer ${validToken}`);

      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.data.rankUpTriggered).toBe(false);
      expect(res.body.data.newRank).toBe(1);
    });

    it('should trigger rank-up and return newRank: 2 if user accumulates >= 500 KP', async () => {
      db.query.mockResolvedValueOnce({
        rows: [{ total_kp: 600, rank: 1 }] // User has 600 KP (lớn hơn 500 => thăng hạng)
      });
      db.query.mockResolvedValueOnce({
        rows: [{ id: mockUserId, total_kp: 800, rank: 2 }] // Updated user return
      });

      const res = await request(app)
        .post('/api/users/check-rank')
        .set('Authorization', `Bearer ${validToken}`);

      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.data.rankUpTriggered).toBe(true);
      expect(res.body.data.oldRank).toBe(1);
      expect(res.body.data.newRank).toBe(2);
      expect(res.body.data.kpEarned).toBe(200);
    });
  });

  describe('GET /api/users/career-jobs', () => {
    it('should recommend correct jobs based on estimated TOEIC score', async () => {
      // 1. Mock select estimated_score (e.g. 700)
      db.query.mockResolvedValueOnce({
        rows: [{ max_score: 700 }]
      });
      // 2. Mock select career_jobs matching required_toeic <= 700
      db.query.mockResolvedValueOnce({
        rows: [
          { id: '1', job_title: 'Thực tập sinh Marketing', company_name: 'VNG Group', required_toeic: 450, salary_range: '5-8M', description: 'desc' },
          { id: '2', job_title: 'Trợ lý Giám đốc', company_name: 'Shopee Vietnam', required_toeic: 650, salary_range: '12-18M', description: 'desc' }
        ]
      });

      const res = await request(app)
        .get('/api/users/career-jobs')
        .set('Authorization', `Bearer ${validToken}`);

      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.data.estimatedScore).toBe(700);
      expect(res.body.data.jobs).toHaveLength(2);
      expect(res.body.data.jobs[0].jobTitle).toBe('Thực tập sinh Marketing');
    });
  });
});
