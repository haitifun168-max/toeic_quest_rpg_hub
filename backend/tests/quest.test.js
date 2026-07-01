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

describe('Daily Quests API Tests', () => {
  let validToken;
  const mockUserId = '550e8400-e29b-41d4-a716-446655440000';

  beforeEach(() => {
    jest.clearAllMocks();
    validToken = jwt.sign({ id: mockUserId }, JWT_SECRET, { expiresIn: '1h' });
  });

  describe('GET /api/quests/daily', () => {
    it('should return 401 Unauthorized if Authorization header is missing', async () => {
      const res = await request(app)
        .get('/api/quests/daily');

      expect(res.status).toBe(401);
      expect(res.body.ok).toBe(false);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
    });

    it('should successfully retrieve daily quests if they already exist for today', async () => {
      const mockQuests = [
        { id: 'q1', quest_type: 'vocab', title: 'Học 10 từ vựng Part 1', target_count: 10, current_count: 7, is_completed: false, quest_date: new Date().toISOString() },
        { id: 'q2', quest_type: 'listening', title: 'Hoàn thành 1 bài nghe Part 2', target_count: 1, current_count: 0, is_completed: false, quest_date: new Date().toISOString() },
        { id: 'q3', quest_type: 'pvp', title: 'Thắng 1 trận PvP Battle', target_count: 1, current_count: 1, is_completed: true, quest_date: new Date().toISOString() }
      ];

      // Mock database SELECT for quests
      db.query.mockResolvedValueOnce({ rows: mockQuests });
      
      // Mock database SELECT for user stamina
      db.query.mockResolvedValueOnce({ rows: [{ current_stamina: 12 }] });

      const res = await request(app)
        .get('/api/quests/daily')
        .set('Authorization', `Bearer ${validToken}`);

      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.data.quests).toHaveLength(3);
      expect(res.body.data.quests[0].quest_type).toBe('vocab');
      expect(res.body.data.quests[0].current_count).toBe(7);
      expect(res.body.data.stamina).toBe(12);

      expect(db.query).toHaveBeenCalledTimes(2);
      expect(db.query.mock.calls[0][0]).toContain('SELECT id, quest_type, title');
      expect(db.query.mock.calls[1][0]).toContain('SELECT current_stamina FROM users');
    });

    it('should automatically generate default quests and reset user stamina if no quests exist for today', async () => {
      // 1. Mock SELECT returning empty rows (no quests for today)
      db.query.mockResolvedValueOnce({ rows: [] });
      
      // Mock transaction BEGIN
      db.query.mockResolvedValueOnce({});
      
      // Mock INSERT returning new quests
      const mockQuests = [
        { id: 'q1', quest_type: 'vocab', title: 'Học 10 từ vựng Part 1', target_count: 10, current_count: 0, is_completed: false, quest_date: new Date().toISOString() },
        { id: 'q2', quest_type: 'listening', title: 'Hoàn thành 1 bài nghe Part 2', target_count: 1, current_count: 0, is_completed: false, quest_date: new Date().toISOString() },
        { id: 'q3', quest_type: 'pvp', title: 'Thắng 1 trận PvP Battle', target_count: 1, current_count: 0, is_completed: false, quest_date: new Date().toISOString() }
      ];
      db.query.mockResolvedValueOnce({ rows: mockQuests });

      // Mock UPDATE stamina
      db.query.mockResolvedValueOnce({ rows: [] });

      // Mock transaction COMMIT
      db.query.mockResolvedValueOnce({});

      // 2. Mock SELECT stamina for response
      db.query.mockResolvedValueOnce({ rows: [{ current_stamina: 15 }] });

      const res = await request(app)
        .get('/api/quests/daily')
        .set('Authorization', `Bearer ${validToken}`);

      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.data.quests).toHaveLength(3);
      expect(res.body.data.quests[0].current_count).toBe(0);
      expect(res.body.data.stamina).toBe(15);

      // Check database update calls
      expect(db.query).toHaveBeenCalledTimes(6);
      expect(db.query.mock.calls[2][0]).toContain('INSERT INTO user_quests');
      expect(db.query.mock.calls[3][0]).toContain('UPDATE users');
    });
  });

  describe('GET /api/quests/:id', () => {
    const mockQuestId = '550e8400-e29b-41d4-a716-446655440002';

    it('should return 404 if the quest is not found', async () => {
      db.query.mockResolvedValueOnce({ rows: [] });

      const res = await request(app)
        .get(`/api/quests/${mockQuestId}`)
        .set('Authorization', `Bearer ${validToken}`);

      expect(res.status).toBe(404);
      expect(res.body.ok).toBe(false);
      expect(res.body.error.code).toBe('QUEST_NOT_FOUND');
    });

    it('should return quest details for a valid quest', async () => {
      const mockQuest = {
        id: mockQuestId,
        quest_type: 'vocab',
        title: 'Học 10 từ vựng Part 1',
        target_count: 10,
        current_count: 5,
        is_completed: false,
        quest_date: new Date().toISOString()
      };

      db.query.mockResolvedValueOnce({ rows: [mockQuest] });

      const res = await request(app)
        .get(`/api/quests/${mockQuestId}`)
        .set('Authorization', `Bearer ${validToken}`);

      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.data.quest.id).toBe(mockQuestId);
      expect(res.body.data.quest.description).toBeDefined();
      expect(res.body.data.quest.reward_xp).toBe(50);
      expect(res.body.data.quest.reward_kp).toBe(20);
    });
  });

  describe('GET /api/quests/:id/questions', () => {
    const mockQuestId = '550e8400-e29b-41d4-a716-446655440002';

    it('should return 404 if the quest is not found or does not belong to the user', async () => {
      // Mock user quest check returning empty
      db.query.mockResolvedValueOnce({ rows: [] });

      const res = await request(app)
        .get(`/api/quests/${mockQuestId}/questions`)
        .set('Authorization', `Bearer ${validToken}`);

      expect(res.status).toBe(404);
      expect(res.body.ok).toBe(false);
      expect(res.body.error.code).toBe('QUEST_NOT_FOUND');
    });

    it('should return questions list with layer1 explanations for a valid quest', async () => {
      const mockQuest = {
        id: mockQuestId,
        quest_type: 'vocab',
        target_count: 5,
        user_id: mockUserId
      };

      const mockQuestions = [
        { id: 'q1', part: 5, question_content: 'Q1 content', option_a: 'A', option_b: 'B', option_c: 'C', option_d: 'D', correct_option: 'A', explanation_layer1: 'Layer 1 explanation for Q1' },
        { id: 'q2', part: 5, question_content: 'Q2 content', option_a: 'A', option_b: 'B', option_c: 'C', option_d: 'D', correct_option: 'B', explanation_layer1: 'Layer 1 explanation for Q2' }
      ];

      // 1. Mock user quest query
      db.query.mockResolvedValueOnce({ rows: [mockQuest] });
      // 2. Mock questions query
      db.query.mockResolvedValueOnce({ rows: mockQuestions });

      const res = await request(app)
        .get(`/api/quests/${mockQuestId}/questions`)
        .set('Authorization', `Bearer ${validToken}`);

      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.data.quest_id).toBe(mockQuestId);
      expect(res.body.data.questions).toHaveLength(2);
      expect(res.body.data.questions[0].explanation_layer1).toBe('Layer 1 explanation for Q1');

      expect(db.query).toHaveBeenCalledTimes(2);
      expect(db.query.mock.calls[0][0]).toContain('SELECT id, quest_type, target_count');
      expect(db.query.mock.calls[1][0]).toContain('SELECT q.id, q.part, q.question_content');
    });
  });

  describe('GET /api/quests/questions/:id/explanations', () => {
    const mockQuestionId = 'q1';

    it('should return 404 if the explanation is not found', async () => {
      db.query.mockResolvedValueOnce({ rows: [] });

      const res = await request(app)
        .get(`/api/quests/questions/${mockQuestionId}/explanations`)
        .set('Authorization', `Bearer ${validToken}`);

      expect(res.status).toBe(404);
      expect(res.body.ok).toBe(false);
      expect(res.body.error.code).toBe('EXPLANATION_NOT_FOUND');
    });

    it('should return layer2 and layer3 explanations for a valid question', async () => {
      const mockExplanation = {
        question_id: mockQuestionId,
        layer2: 'Grammar breakdown',
        layer3: 'AI Tips & Vocabulary'
      };

      db.query.mockResolvedValueOnce({ rows: [mockExplanation] });

      const res = await request(app)
        .get(`/api/quests/questions/${mockQuestionId}/explanations`)
        .set('Authorization', `Bearer ${validToken}`);

      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.data.explanation.layer2).toBe('Grammar breakdown');
      expect(res.body.data.explanation.layer3).toBe('AI Tips & Vocabulary');

      expect(db.query).toHaveBeenCalledTimes(1);
      expect(db.query.mock.calls[0][0]).toContain('SELECT question_id, layer2, layer3');
    });
  });

  describe('POST /api/quests/session/submit', () => {
    const mockQuestId = '550e8400-e29b-41d4-a716-446655440003';

    it('should successfully submit session, increment streak if continuous, and reward KP', async () => {
      const mockQuest = {
        id: mockQuestId,
        quest_type: 'vocab',
        target_count: 5,
        current_count: 3,
        is_completed: false
      };

      const mockQuestions = [
        { id: 'q1', correct_option: 'B', question_content: 'Before _______ the office...' }
      ];

      const yesterdayStr = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const mockUser = {
        total_kp: 100,
        current_streak: 5,
        longest_streak: 5,
        last_active_date: yesterdayStr,
        current_rank: 1
      };

      // Set up sequential mocks
      db.query.mockResolvedValueOnce({ rows: [mockQuest] }); // 1. Get Quest
      db.query.mockResolvedValueOnce({ rows: mockQuestions }); // 2. Get Questions
      db.query.mockResolvedValueOnce({}); // 3. BEGIN
      db.query.mockResolvedValueOnce({}); // 4. UPDATE user_quests
      db.query.mockResolvedValueOnce({ rows: [mockUser] }); // 5. SELECT User
      db.query.mockResolvedValueOnce({}); // 6. UPDATE users
      db.query.mockResolvedValueOnce({}); // 7. COMMIT

      const res = await request(app)
        .post('/api/quests/session/submit')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          questId: mockQuestId,
          answers: [{ questionId: 'q1', selectedOption: 'B' }]
        });

      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.data.score.correct).toBe(1);
      expect(res.body.data.streak.currentStreak).toBe(6); // 5 + 1 = 6 (continuous)
      expect(res.body.data.streak.longestStreak).toBe(6);
      expect(res.body.data.recommendations).toHaveLength(1);
    });

    it('should reset streak to 1 if there was a learning gap', async () => {
      const mockQuest = {
        id: mockQuestId,
        quest_type: 'vocab',
        target_count: 5,
        current_count: 0,
        is_completed: false
      };

      const mockQuestions = [
        { id: 'q1', correct_option: 'B', question_content: 'highly successful...' }
      ];

      // 3 days ago (gap!)
      const gapDateStr = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const mockUser = {
        total_kp: 100,
        current_streak: 5,
        longest_streak: 5,
        last_active_date: gapDateStr,
        current_rank: 1
      };

      // Set up sequential mocks
      db.query.mockResolvedValueOnce({ rows: [mockQuest] });
      db.query.mockResolvedValueOnce({ rows: mockQuestions });
      db.query.mockResolvedValueOnce({}); // BEGIN
      db.query.mockResolvedValueOnce({}); // UPDATE user_quests
      db.query.mockResolvedValueOnce({ rows: [mockUser] }); // SELECT User
      db.query.mockResolvedValueOnce({}); // UPDATE users
      db.query.mockResolvedValueOnce({}); // COMMIT

      const res = await request(app)
        .post('/api/quests/session/submit')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          questId: mockQuestId,
          answers: [{ questionId: 'q1', selectedOption: 'A' }] // incorrect
        });

      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(true);
      expect(res.body.data.score.correct).toBe(0);
      expect(res.body.data.streak.currentStreak).toBe(1); // reset to 1 due to gap
      expect(res.body.data.recommendations).toContain('Trạng từ chỉ mức độ và cách thức (Adverbs of degree/manner)');
    });
  });
});
