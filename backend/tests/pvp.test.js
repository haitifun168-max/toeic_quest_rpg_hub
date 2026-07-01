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

describe('PvP REST API Tests', () => {
  let validToken;
  const mockUserId = '550e8400-e29b-41d4-a716-446655440000';

  beforeEach(() => {
    jest.clearAllMocks();
    validToken = jwt.sign({ id: mockUserId }, JWT_SECRET, { expiresIn: '1h' });
  });

  describe('GET /api/pvp/lobby', () => {
    it('should return 401 Unauthorized if Authorization header is missing', async () => {
      const res = await request(app).get('/api/pvp/lobby');
      expect(res.status).toBe(401);
      expect(res.body.ok).toBe(false);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
    });

    it('should return 400 RANK_TOO_LOW if user current_rank is less than 2', async () => {
      const mockUser = {
        id: mockUserId,
        current_elo: 1000,
        current_rank: 1, // Rank 1: Trainee -> Too low!
        current_stamina: 15
      };

      db.query.mockResolvedValueOnce({ rows: [mockUser] }); // 1. Get user profile

      const res = await request(app)
        .get('/api/pvp/lobby')
        .set('Authorization', `Bearer ${validToken}`);

      expect(res.status).toBe(400);
      expect(res.body.ok).toBe(false);
      expect(res.body.error.code).toBe('RANK_TOO_LOW');
      expect(res.body.error.message).toContain('Rank 2');
    });

    it('should successfully load ELO, stamina and history of matches for valid user', async () => {
      const mockUser = {
        id: mockUserId,
        current_elo: 1050,
        current_rank: 2, // Rank 2 -> Valid
        current_stamina: 12
      };

      const mockMatches = [
        {
          id: 'b1',
          player_a_id: mockUserId,
          player_b_id: 'bot_opponent_id',
          score_a: 8,
          score_b: 6,
          elo_change_a: 15,
          elo_change_b: -5,
          is_bot_match: true,
          player_a_name: 'Hero',
          player_b_name: 'BOT'
        }
      ];

      db.query.mockResolvedValueOnce({ rows: [mockUser] }); // 1. Get user profile
      db.query.mockResolvedValueOnce({ rows: mockMatches }); // 2. Get matches history

      const res = await request(app)
        .get('/api/pvp/lobby')
        .set('Authorization', `Bearer ${validToken}`);

      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.data.elo).toBe(1050);
      expect(res.body.data.stamina).toBe(12);
      expect(res.body.data.wins).toBe(1); // 8 > 6
      expect(res.body.data.losses).toBe(0);
      expect(res.body.data.history).toHaveLength(1);
    });
  });
});
