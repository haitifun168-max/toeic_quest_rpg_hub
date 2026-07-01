const request = require('supertest');
const app = require('../src/app');
const db = require('../src/db');
const cryptoUtils = require('../src/utils/crypto');
const bcrypt = require('bcryptjs');

// Mock the database client
jest.mock('../src/db', () => {
  return {
    query: jest.fn(),
    pool: {
      end: jest.fn()
    }
  };
});

describe('Authentication and Cryptography Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Crypto Utilities', () => {
    it('should encrypt and decrypt email deterministically', () => {
      const email = 'test.user@example.com';
      const encrypted1 = cryptoUtils.encrypt(email);
      const encrypted2 = cryptoUtils.encrypt(email);
      
      expect(encrypted1).toBe(encrypted2); // Deterministic encryption
      
      const decrypted = cryptoUtils.decrypt(encrypted1);
      expect(decrypted).toBe(email);
    });

    it('should return null for empty inputs', () => {
      expect(cryptoUtils.encrypt(null)).toBeNull();
      expect(cryptoUtils.decrypt(null)).toBeNull();
    });
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully with correct fields and standard response format', async () => {
      // Mock db.query for findByEmail (return no users found)
      db.query.mockResolvedValueOnce({ rows: [] });

      // Mock db.query for INSERT returning user
      const mockDbUser = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        display_name: 'Hero Learner',
        email: cryptoUtils.encrypt('hero@example.com'),
        password_hash: await bcrypt.hash('P@ssword123', 10),
        current_rank: 1,
        total_kp: 0,
        current_elo: 1000,
        current_stamina: 15
      };
      db.query.mockResolvedValueOnce({ rows: [mockDbUser] });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          displayName: 'Hero Learner',
          email: 'hero@example.com',
          password: 'P@ssword123'
        });

      expect(res.status).toBe(201);
      expect(res.body.ok).toBe(true);
      expect(res.body.data.user.email).toBe('hero@example.com');
      expect(res.body.data.user.password_hash).toBeUndefined(); // Sensitive data stripped
      expect(res.body.data.user.current_elo).toBe(1000);
      expect(res.body.data.user.current_stamina).toBe(15);
      expect(res.body.data.token).toBeDefined();
    });

    it('should fail if password does not meet complexity requirements (AC 2)', async () => {
      // Password must contain at least 8 characters, 1 uppercase, 1 special character
      const weakPasswords = [
        'short',           // Too short
        'lowercaseonly1!', // No uppercase
        'UPPERCASEONLY1!', // No lowercase
        'NoSpecialChar12', // No special character
      ];

      for (const password of weakPasswords) {
        // Mock findByEmail to return empty rows
        db.query.mockResolvedValueOnce({ rows: [] });

        const res = await request(app)
          .post('/api/auth/register')
          .send({
            displayName: 'Weak User',
            email: 'weak@example.com',
            password
          });

        expect(res.status).toBe(400);
        expect(res.body.ok).toBe(false);
        expect(res.body.error.code).toBe('VALIDATION_FAILED');
      }
    });

    it('should fail if email is already registered', async () => {
      // Mock db.query for findByEmail (return existing user)
      db.query.mockResolvedValueOnce({
        rows: [{
          id: '550e8400-e29b-41d4-a716-446655440000',
          email: cryptoUtils.encrypt('existing@example.com')
        }]
      });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          displayName: 'New User',
          email: 'existing@example.com',
          password: 'P@ssword123'
        });

      expect(res.status).toBe(400);
      expect(res.body.ok).toBe(false);
      expect(res.body.error.code).toBe('EMAIL_EXISTS');
    });

    it('should fail if email format is invalid', async () => {
      const invalidEmails = [
        'plainaddress',
        '#@%^%#$@#$@#.com',
        '@example.com',
        'Joe Smith <email@example.com>',
        'email.example.com',
      ];

      for (const email of invalidEmails) {
        db.query.mockResolvedValueOnce({ rows: [] });

        const res = await request(app)
          .post('/api/auth/register')
          .send({
            displayName: 'Invalid Email User',
            email,
            password: 'P@ssword123'
          });

        expect(res.status).toBe(400);
        expect(res.body.ok).toBe(false);
        expect(res.body.error.code).toBe('VALIDATION_FAILED');
        expect(res.body.error.message).toBe('Invalid email format');
      }
    });

    it('should handle database level duplicate email error gracefully (unique constraint violation)', async () => {
      db.query.mockResolvedValueOnce({ rows: [] }); // findByEmail check passes (simulate race condition)

      const dbError = new Error('duplicate key value violates unique constraint "users_email_key"');
      dbError.code = '23505';
      db.query.mockRejectedValueOnce(dbError); // INSERT throws unique key violation

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          displayName: 'Conflict User',
          email: 'conflict@example.com',
          password: 'P@ssword123'
        });

      expect(res.status).toBe(400);
      expect(res.body.ok).toBe(false);
      expect(res.body.error.code).toBe('EMAIL_EXISTS');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should log in successfully with correct credentials', async () => {
      const plainPassword = 'P@ssword123';
      const hash = await bcrypt.hash(plainPassword, 10);
      
      db.query.mockResolvedValueOnce({
        rows: [{
          id: '550e8400-e29b-41d4-a716-446655440000',
          display_name: 'Logged In User',
          email: cryptoUtils.encrypt('user@example.com'),
          password_hash: hash,
          current_rank: 1,
          total_kp: 0,
          current_elo: 1000,
          current_stamina: 15
        }]
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'user@example.com',
          password: plainPassword
        });

      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.data.user.email).toBe('user@example.com');
      expect(res.body.data.user.password_hash).toBeUndefined();
      expect(res.body.data.token).toBeDefined();
    });

    it('should fail to log in with incorrect password', async () => {
      const hash = await bcrypt.hash('CorrectPassword123!', 10);
      
      db.query.mockResolvedValueOnce({
        rows: [{
          id: '550e8400-e29b-41d4-a716-446655440000',
          email: cryptoUtils.encrypt('user@example.com'),
          password_hash: hash
        }]
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'user@example.com',
          password: 'WrongPassword!!!'
        });

      expect(res.status).toBe(400);
      expect(res.body.ok).toBe(false);
      expect(res.body.error.code).toBe('INVALID_CREDENTIALS');
    });
  });

  describe('POST /api/auth/oauth', () => {
    it('should sign up and login an OAuth user', async () => {
      // 1. Mock finding user (no user found)
      db.query.mockResolvedValueOnce({ rows: [] });

      // 2. Mock inserting user
      const mockOauthUser = {
        id: '660e8400-e29b-41d4-a716-446655441111',
        display_name: 'Google User',
        email: cryptoUtils.encrypt('google.user@gmail.com'),
        password_hash: null,
        current_rank: 1,
        total_kp: 0,
        current_elo: 1000,
        current_stamina: 15
      };
      db.query.mockResolvedValueOnce({ rows: [mockOauthUser] });

      const res = await request(app)
        .post('/api/auth/oauth')
        .send({
          email: 'google.user@gmail.com',
          displayName: 'Google User',
          provider: 'google'
        });

      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.data.user.email).toBe('google.user@gmail.com');
      expect(res.body.data.user.password_hash).toBeUndefined();
      expect(res.body.data.token).toBeDefined();
    });
  });
});
