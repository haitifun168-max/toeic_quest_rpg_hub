const request = require('supertest');
const app = require('../src/app');
const db = require('../src/db');

jest.mock('../src/db', () => {
  return {
    query: jest.fn(),
    pool: { end: jest.fn() }
  };
});

describe('Leaderboard API Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET /api/leaderboard should return top players ranked by ELO by default', async () => {
    db.query.mockResolvedValueOnce({
      rows: [
        { id: 'u1', display_name: 'Player1', avatar: 'a1', elo_rating: 2000, kp_score: 10000, streak: 10 },
        { id: 'u2', display_name: 'Player2', avatar: 'a2', elo_rating: 1900, kp_score: 8000, streak: 5 }
      ]
    });

    const res = await request(app).get('/api/leaderboard');
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.data.type).toBe('elo');
    expect(res.body.data.leaderboard).toHaveLength(2);
    expect(res.body.data.leaderboard[0].rank).toBe(1);
    expect(res.body.data.leaderboard[0].elo_rating).toBe(2000);
  });

  it('GET /api/leaderboard?type=kp should return leaderboard sorted by KP score', async () => {
    db.query.mockResolvedValueOnce({
      rows: [
        { id: 'u2', display_name: 'Player2', avatar: 'a2', elo_rating: 1900, kp_score: 15000, streak: 5 },
        { id: 'u1', display_name: 'Player1', avatar: 'a1', elo_rating: 2000, kp_score: 10000, streak: 10 }
      ]
    });

    const res = await request(app).get('/api/leaderboard?type=kp');
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.data.type).toBe('kp');
    expect(res.body.data.leaderboard[0].kp_score).toBe(15000);
  });
});
