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

describe('User Profile API Tests', () => {
  let validToken;
  const mockUserId = '550e8400-e29b-41d4-a716-446655440000';

  beforeEach(() => {
    jest.clearAllMocks();
    validToken = jwt.sign({ id: mockUserId }, JWT_SECRET, { expiresIn: '1h' });
  });

  describe('PUT /api/users/character', () => {
    it('should return 401 Unauthorized if Authorization header is missing', async () => {
      const res = await request(app)
        .put('/api/users/character')
        .send({
          characterName: 'Kỵ Sĩ TOEIC',
          avatarId: 'knight'
        });

      expect(res.status).toBe(401);
      expect(res.body.ok).toBe(false);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
    });

    it('should return 400 Validation Failed if avatarId is invalid', async () => {
      const res = await request(app)
        .put('/api/users/character')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          characterName: 'Kỵ Sĩ TOEIC',
          avatarId: 'ninja' // 'ninja' is not in ['knight', 'mage', 'assassin', 'pilot', 'scholar', 'scout']
        });

      expect(res.status).toBe(400);
      expect(res.body.ok).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_FAILED');
      expect(res.body.error.message).toContain('Invalid avatar ID');
    });

    it('should return 400 Validation Failed if characterName is too short', async () => {
      const res = await request(app)
        .put('/api/users/character')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          characterName: 'A', // Too short, min 2 chars
          avatarId: 'knight'
        });

      expect(res.status).toBe(400);
      expect(res.body.ok).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_FAILED');
    });

    it('should return 400 Validation Failed if characterName is too long', async () => {
      const res = await request(app)
        .put('/api/users/character')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          characterName: 'A'.repeat(31), // 31 chars, max is 30
          avatarId: 'knight'
        });

      expect(res.status).toBe(400);
      expect(res.body.ok).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_FAILED');
    });

    it('should successfully update character information and save to DB', async () => {
      const mockDbUser = {
        id: mockUserId,
        display_name: 'Original Name',
        email: 'encrypted_email_string',
        character_name: 'Kỵ Sĩ TOEIC',
        avatar_id: 'knight'
      };

      db.query.mockResolvedValueOnce({ rows: [mockDbUser] });

      const res = await request(app)
        .put('/api/users/character')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          characterName: '  Kỵ Sĩ TOEIC  ', // Check trimming
          avatarId: 'knight'
        });

      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.data.user.character_name).toBe('Kỵ Sĩ TOEIC');
      expect(res.body.data.user.avatar_id).toBe('knight');

      // Verify db update query
      expect(db.query).toHaveBeenCalledTimes(1);
      const calledQuery = db.query.mock.calls[0][0];
      const calledParams = db.query.mock.calls[0][1];

      expect(calledQuery).toContain('UPDATE users');
      expect(calledQuery).toContain('SET character_name = $1, avatar_id = $2');
      expect(calledParams[0]).toBe('Kỵ Sĩ TOEIC'); // Trimmed
      expect(calledParams[1]).toBe('knight');
      expect(calledParams[2]).toBe(mockUserId);
    });

    it('should return 404 User Not Found if the user ID is not found in database', async () => {
      db.query.mockResolvedValueOnce({ rows: [] });

      const res = await request(app)
        .put('/api/users/character')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          characterName: 'Kỵ Sĩ TOEIC',
          avatarId: 'knight'
        });

      expect(res.status).toBe(404);
      expect(res.body.ok).toBe(false);
      expect(res.body.error.code).toBe('USER_NOT_FOUND');
    });
  });

  describe('GET /api/users/profile', () => {
    it('should return 401 Unauthorized if Authorization header is missing', async () => {
      const res = await request(app)
        .get('/api/users/profile');

      expect(res.status).toBe(401);
      expect(res.body.ok).toBe(false);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
    });

    it('should successfully retrieve user profile with simulated stats and achievements', async () => {
      const mockDbUser = {
        id: mockUserId,
        display_name: 'Original Name',
        email: 'encrypted_email_string',
        character_name: 'Kỵ Sĩ TOEIC',
        avatar_id: 'knight',
        current_rank: 2,
        total_kp: 8250,
        current_elo: 1100,
        current_stamina: 15
      };

      db.query
        .mockResolvedValueOnce({ rows: [mockDbUser] })
        .mockResolvedValueOnce({ rows: [{ count: '2' }] }); // returns pvp wins = 2

      const res = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${validToken}`);

      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.data.user.id).toBe(mockUserId);
      expect(res.body.data.user.character_name).toBe('Kỵ Sĩ TOEIC');
      
      // Check simulated stats are present
      expect(res.body.data.user).toHaveProperty('stats');
      expect(res.body.data.user.stats.grammar).toBeDefined();
      expect(res.body.data.user.stats.listening).toBeDefined();

      // Check simulated achievements are present
      expect(res.body.data.user).toHaveProperty('achievements');
      expect(res.body.data.user.achievements).toHaveLength(4);
      expect(res.body.data.user.achievements[0].id).toBe('streak_14');
      
      expect(db.query).toHaveBeenCalledTimes(2);
      expect(db.query.mock.calls[0][0]).toContain('SELECT * FROM users');
      expect(db.query.mock.calls[0][1][0]).toBe(mockUserId);
      expect(db.query.mock.calls[1][0]).toContain('SELECT COUNT(*) FROM battle_sessions');
      expect(db.query.mock.calls[1][1][0]).toBe(mockUserId);
    });

    it('should return 404 if user ID does not exist in DB during fetch', async () => {
      db.query.mockResolvedValueOnce({ rows: [] });

      const res = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${validToken}`);

      expect(res.status).toBe(404);
      expect(res.body.ok).toBe(false);
      expect(res.body.error.code).toBe('USER_NOT_FOUND');
    });
  });

  describe('POST /api/users/streak/freeze', () => {
    it('should fail to purchase streak freeze if user has less than 500 KP', async () => {
      const mockUser = {
        total_kp: 400, // < 500
        current_streak: 0,
        longest_streak: 5,
        streak_freeze_used_at: null
      };

      db.query.mockResolvedValueOnce({ rows: [mockUser] });

      const res = await request(app)
        .post('/api/users/streak/freeze')
        .set('Authorization', `Bearer ${validToken}`);

      expect(res.status).toBe(400);
      expect(res.body.ok).toBe(false);
      expect(res.body.error.code).toBe('INSUFFICIENT_KP');
      expect(res.body.error.message).toContain('at least 500 KP');
    });

    it('should fail to purchase streak freeze if used twice within 7 days', async () => {
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
      const mockUser = {
        total_kp: 1000,
        current_streak: 0,
        longest_streak: 5,
        streak_freeze_used_at: threeDaysAgo // less than 7 days!
      };

      db.query.mockResolvedValueOnce({ rows: [mockUser] });

      const res = await request(app)
        .post('/api/users/streak/freeze')
        .set('Authorization', `Bearer ${validToken}`);

      expect(res.status).toBe(400);
      expect(res.body.ok).toBe(false);
      expect(res.body.error.code).toBe('LIMIT_EXCEEDED');
    });

    it('should successfully buy freeze, deduct 500 KP, and restore streak to longest_streak', async () => {
      const mockUser = {
        total_kp: 800,
        current_streak: 0,
        longest_streak: 12,
        streak_freeze_used_at: null
      };

      const mockUpdatedUser = {
        id: mockUserId,
        display_name: 'Hero',
        email: 'encrypted_email_string',
        total_kp: 300, // 800 - 500
        current_streak: 12, // restored to longest_streak
        longest_streak: 12,
        last_active_date: new Date().toISOString().split('T')[0]
      };

      db.query.mockResolvedValueOnce({ rows: [mockUser] }); // 1. Check user
      db.query.mockResolvedValueOnce({}); // 2. BEGIN
      db.query.mockResolvedValueOnce({ rows: [mockUpdatedUser] }); // 3. UPDATE users
      db.query.mockResolvedValueOnce({}); // 4. COMMIT

      const res = await request(app)
        .post('/api/users/streak/freeze')
        .set('Authorization', `Bearer ${validToken}`);

      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.data.streakRestored).toBe(12);
      expect(res.body.data.user.total_kp).toBe(300);
    });
  });
});
