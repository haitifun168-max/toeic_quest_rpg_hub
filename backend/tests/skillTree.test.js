const request = require('supertest');
const app = require('../src/app');
const db = require('../src/db');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret_key_change_me_in_prod';

// Mock the database client
jest.mock('../src/db', () => {
  return {
    query: jest.fn(),
    pool: { end: jest.fn() }
  };
});

// Bộ node mẫu bám seed migration 11 (10 node, unlock_rank tăng dần).
const MOCK_NODES = [
  { id: 'START', label: 'Điểm Xuất Phát', branch: 'core', tier: 0, node_type: 'start', icon: 'flag', unlock_rank: 1, sort_order: 0 },
  { id: 'R-01', label: 'R-01 Ngữ Pháp', branch: 'reading', tier: 1, node_type: 'skill', icon: 'menu_book', unlock_rank: 1, sort_order: 10 },
  { id: 'L-01', label: 'L-01 Nền Tảng', branch: 'listening', tier: 1, node_type: 'skill', icon: 'hearing', unlock_rank: 1, sort_order: 11 },
  { id: 'R-02', label: 'R-02 Từ Vựng', branch: 'reading', tier: 2, node_type: 'skill', icon: 'spellcheck', unlock_rank: 2, sort_order: 20 },
  { id: 'L-02', label: 'L-02 Câu Hỏi', branch: 'listening', tier: 2, node_type: 'skill', icon: 'quiz', unlock_rank: 2, sort_order: 21 },
  { id: 'R-03', label: 'R-03 Đoạn Văn', branch: 'reading', tier: 3, node_type: 'skill', icon: 'article', unlock_rank: 3, sort_order: 30 },
  { id: 'L-03', label: 'L-03 Hội Thoại', branch: 'listening', tier: 3, node_type: 'skill', icon: 'forum', unlock_rank: 3, sort_order: 31 },
  { id: 'R-STAR', label: 'R-Star Trial', branch: 'reading', tier: 4, node_type: 'boss', icon: 'swords', unlock_rank: 4, sort_order: 40 },
  { id: 'L-STAR', label: 'L-Star Trial', branch: 'listening', tier: 4, node_type: 'boss', icon: 'swords', unlock_rank: 4, sort_order: 41 },
  { id: 'BOSS', label: 'TOEIC Champion', branch: 'core', tier: 5, node_type: 'final_boss', icon: 'star', unlock_rank: 6, sort_order: 50 }
];

describe('Skill Tree API Tests', () => {
  let validToken;
  const mockUserId = '550e8400-e29b-41d4-a716-446655440000';

  beforeEach(() => {
    jest.clearAllMocks();
    validToken = jwt.sign({ id: mockUserId }, JWT_SECRET, { expiresIn: '1h' });
  });

  describe('GET /api/skill-tree', () => {
    it('should return 401 Unauthorized if authorization token is missing', async () => {
      const res = await request(app).get('/api/skill-tree');
      expect(res.status).toBe(401);
      expect(res.body.ok).toBe(false);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
    });

    it('should return 404 if user record not found', async () => {
      db.query.mockResolvedValueOnce({ rows: [] }); // user lookup empty

      const res = await request(app)
        .get('/api/skill-tree')
        .set('Authorization', `Bearer ${validToken}`);

      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe('USER_NOT_FOUND');
    });

    it('[Rank 1 user] returns all 10 nodes with correct derived statuses', async () => {
      // total_kp 0 -> rank 1
      db.query.mockResolvedValueOnce({ rows: [{ total_kp: 0, current_rank: 1 }] });
      db.query.mockResolvedValueOnce({ rows: MOCK_NODES });

      const res = await request(app)
        .get('/api/skill-tree')
        .set('Authorization', `Bearer ${validToken}`);

      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.data.userRank).toBe(1);
      expect(res.body.data.rankName).toBe('Thực Tập Sinh');
      expect(res.body.data.nodes).toHaveLength(10);

      const byId = Object.fromEntries(res.body.data.nodes.map(n => [n.id, n]));
      // unlock_rank == userRank(1) -> active
      expect(byId['START'].status).toBe('active');
      expect(byId['R-01'].status).toBe('active');
      expect(byId['L-01'].status).toBe('active');
      // unlock_rank > userRank -> locked
      expect(byId['R-02'].status).toBe('locked');
      expect(byId['BOSS'].status).toBe('locked');
    });

    it('[Rank 3 user] earlier-tier nodes complete, current-rank node active, higher locked', async () => {
      // total_kp 2000 -> rank 3
      db.query.mockResolvedValueOnce({ rows: [{ total_kp: 2000, current_rank: 3 }] });
      db.query.mockResolvedValueOnce({ rows: MOCK_NODES });

      const res = await request(app)
        .get('/api/skill-tree')
        .set('Authorization', `Bearer ${validToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.userRank).toBe(3);

      const byId = Object.fromEntries(res.body.data.nodes.map(n => [n.id, n]));
      expect(byId['START'].status).toBe('completed'); // unlock 1 < 3
      expect(byId['R-01'].status).toBe('completed');  // unlock 1 < 3
      expect(byId['R-02'].status).toBe('completed');  // unlock 2 < 3
      expect(byId['R-03'].status).toBe('active');     // unlock 3 == 3
      expect(byId['L-03'].status).toBe('active');     // unlock 3 == 3
      expect(byId['R-STAR'].status).toBe('locked');   // unlock 4 > 3
      expect(byId['BOSS'].status).toBe('locked');     // unlock 6 > 3
    });

    it('nodes are returned in ascending sort_order and expose camelCase contract', async () => {
      db.query.mockResolvedValueOnce({ rows: [{ total_kp: 0, current_rank: 1 }] });
      db.query.mockResolvedValueOnce({ rows: MOCK_NODES });

      const res = await request(app)
        .get('/api/skill-tree')
        .set('Authorization', `Bearer ${validToken}`);

      const orders = res.body.data.nodes.map(n => n.sortOrder);
      const sorted = [...orders].sort((a, b) => a - b);
      expect(orders).toEqual(sorted);

      const first = res.body.data.nodes[0];
      expect(first).toHaveProperty('nodeType');
      expect(first).toHaveProperty('unlockRank');
      expect(first).toHaveProperty('status');
    });
  });
});
