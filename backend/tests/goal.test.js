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

describe('Goal Setting API Tests', () => {
  let validToken;
  const mockUserId = '550e8400-e29b-41d4-a716-446655440000';

  beforeEach(() => {
    jest.clearAllMocks();
    validToken = jwt.sign({ id: mockUserId }, JWT_SECRET, { expiresIn: '1h' });
  });

  describe('PUT /api/users/goal', () => {
    it('should return 401 Unauthorized if Authorization header is missing', async () => {
      const res = await request(app)
        .put('/api/users/goal')
        .send({
          targetScore: 600,
          durationMonths: 3
        });

      expect(res.status).toBe(401);
      expect(res.body.ok).toBe(false);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
    });

    it('should return 401 Unauthorized if token is invalid', async () => {
      const res = await request(app)
        .put('/api/users/goal')
        .set('Authorization', 'Bearer invalid_token_here')
        .send({
          targetScore: 600,
          durationMonths: 3
        });

      expect(res.status).toBe(401);
      expect(res.body.ok).toBe(false);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
    });

    it('should return 400 if target score is invalid', async () => {
      const res = await request(app)
        .put('/api/users/goal')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          targetScore: 500, // 500 is not in the valid scores list
          durationMonths: 3
        });

      expect(res.status).toBe(400);
      expect(res.body.ok).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_FAILED');
    });

    it('should return 400 if duration months value is invalid', async () => {
      const res = await request(app)
        .put('/api/users/goal')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          targetScore: 600,
          durationMonths: 5 // 5 is not in the valid months list [1, 3, 6, 12]
        });

      expect(res.status).toBe(400);
      expect(res.body.ok).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_FAILED');
    });

    it('should successfully update goal and calculate target deadline date', async () => {
      // Mock today + 3 months
      const expectedDeadline = new Date();
      expectedDeadline.setMonth(expectedDeadline.getMonth() + 3);

      const mockDbUser = {
        id: mockUserId,
        display_name: 'Goal Getter',
        email: 'encrypted_email_string',
        target_score: 600,
        target_deadline: expectedDeadline.toISOString()
      };

      db.query.mockResolvedValueOnce({ rows: [mockDbUser] });

      const res = await request(app)
        .put('/api/users/goal')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          targetScore: 600,
          durationMonths: 3
        });

      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.data.user.target_score).toBe(600);
      expect(res.body.data.user.target_deadline).toBe(expectedDeadline.toISOString());
      
      // Verify database update call
      expect(db.query).toHaveBeenCalledTimes(1);
      const calledQuery = db.query.mock.calls[0][0];
      const calledParams = db.query.mock.calls[0][1];
      
      expect(calledQuery).toContain('UPDATE users');
      expect(calledQuery).toContain('SET target_score = $1, target_deadline = $2');
      expect(calledParams[0]).toBe(600);
      // Verify parsed date is close to computed expected date (within 5 seconds)
      const parsedDate = new Date(calledParams[1]);
      expect(Math.abs(parsedDate - expectedDeadline)).toBeLessThan(5000);
      expect(calledParams[2]).toBe(mockUserId);
    });

    it('should clamp the deadline day on a month boundary (e.g. August 31st + 1 month = September 30th)', async () => {
      // Mock System Date to August 31st, 2026
      const mockDate = new Date('2026-08-31T12:00:00.000Z');
      const originalDate = global.Date;
      
      // Temporary class override to force Date instantiated with no args to return mockDate
      global.Date = class extends originalDate {
        constructor(...args) {
          if (args.length === 0) {
            return new originalDate(mockDate);
          }
          return new originalDate(...args);
        }
        static now() {
          return mockDate.getTime();
        }
      };

      // Generate token in this Date context so expiration verification doesn't fail
      const tokenForMockDate = jwt.sign({ id: mockUserId }, JWT_SECRET, { expiresIn: '1h' });
      const expectedDeadline = new Date('2026-09-30T12:00:00.000Z');

      const mockDbUser = {
        id: mockUserId,
        display_name: 'Goal Getter',
        email: 'encrypted_email_string',
        target_score: 600,
        target_deadline: expectedDeadline.toISOString()
      };

      // Reset db mock to make sure there's no spillover
      jest.clearAllMocks();
      db.query.mockResolvedValueOnce({ rows: [mockDbUser] });

      try {
        const res = await request(app)
          .put('/api/users/goal')
          .set('Authorization', `Bearer ${tokenForMockDate}`)
          .send({
            targetScore: 600,
            durationMonths: 1
          });

        expect(res.status).toBe(200);
        expect(res.body.ok).toBe(true);
        
        const calledParams = db.query.mock.calls[0][1];
        const parsedDate = new Date(calledParams[1]);
        expect(parsedDate.getUTCMonth()).toBe(8); // September (0-indexed = 8)
        expect(parsedDate.getUTCDate()).toBe(30);  // Clamped to 30th
      } finally {
        global.Date = originalDate;
      }
    });

    it('should return 404 if user ID does not exist in DB during update', async () => {
      db.query.mockResolvedValueOnce({ rows: [] }); // User not found in DB

      const res = await request(app)
        .put('/api/users/goal')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          targetScore: 600,
          durationMonths: 3
        });

      expect(res.status).toBe(404);
      expect(res.body.ok).toBe(false);
      expect(res.body.error.code).toBe('USER_NOT_FOUND');
    });
  });
});
