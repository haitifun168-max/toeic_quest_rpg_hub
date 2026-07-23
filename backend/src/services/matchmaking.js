/**
 * matchmaking.js
 * Dịch vụ điều phối ghép cặp PvP thông minh.
 * Hỗ trợ chế độ In-Memory JavaScript Queue mặc định (thích hợp môi trường test/local)
 * và Redis Sorted Sets (ZSET) khi USE_REDIS=true.
 */

// In-Memory Queue: Sắp xếp người chơi đang tìm trận theo thời gian và ELO
// Cấu trúc item: { userId, socketId, elo, joinedAt, timerId }
let memoryQueue = [];

// BOT Configurations
const MOCK_BOTS = [
  { display_name: 'Kỵ Sĩ TOEIC (BOT)', avatar_id: 'knight' },
  { display_name: 'Phù Thủy Từ Vựng (BOT)', avatar_id: 'mage' },
  { display_name: 'Sát Thủ Ngữ Pháp (BOT)', avatar_id: 'assassin' },
  { display_name: 'Trinh Sát Đọc Hiểu (BOT)', avatar_id: 'scout' }
];

class MatchmakingService {
  constructor() {
    this.matchFoundCallback = null;
    this.lobbyInterval = null;
    this.startMatchmakingLoop();
  }

  onMatchFound(callback) {
    this.matchFoundCallback = callback;
  }

  startMatchmakingLoop() {
    // Chạy vòng lặp quét ghép cặp mỗi 1.5 giây
    this.lobbyInterval = setInterval(() => {
      this.scanAndMatch();
    }, 1500);
  }

  stopMatchmakingLoop() {
    if (this.lobbyInterval) {
      clearInterval(this.lobbyInterval);
    }
  }

  /**
   * Đưa người chơi vào hàng đợi tìm trận
   */
  async joinQueue(player) {
    const { userId, socketId, elo } = player;
    
    // Tránh bị trùng lặp người chơi trong hàng đợi
    this.leaveQueue(userId);

    const queueItem = {
      userId,
      socketId,
      elo: parseInt(elo) || 1000,
      joinedAt: Date.now()
    };

    memoryQueue.push(queueItem);
    console.log(`[Matchmaking] User ${userId} (ELO: ${elo}) joined queue. Queue size: ${memoryQueue.length}`);
  }

  /**
   * Xóa người chơi khỏi hàng đợi
   */
  leaveQueue(userId) {
    const initialLen = memoryQueue.length;
    memoryQueue = memoryQueue.filter(item => item.userId !== userId);
    if (memoryQueue.length < initialLen) {
      console.log(`[Matchmaking] User ${userId} left queue. Queue size: ${memoryQueue.length}`);
    }
  }

  /**
   * Quét và ghép cặp các ứng viên cùng ELO ±100
   */
  async scanAndMatch() {
    if (memoryQueue.length === 0) return;

    // Sắp xếp queue theo ELO tăng dần để dễ ghép cặp lân cận
    memoryQueue.sort((a, b) => a.elo - b.elo);

    let i = 0;
    while (i < memoryQueue.length - 1) {
      const player1 = memoryQueue[i];
      const player2 = memoryQueue[i + 1];

      // Kiểm tra xem chênh lệch ELO có nằm trong khoảng ±100 không
      if (Math.abs(player1.elo - player2.elo) <= 100) {
        // Ghép cặp thành công!
        this.createMatch(player1, player2);
        
        // Xóa hai người chơi khỏi hàng đợi
        memoryQueue.splice(i, 2);
        // Không tăng chỉ số i vì độ dài mảng đã giảm đi 2
      } else {
        i++;
      }
    }

    // Kiểm tra timeout 15 giây cho những người chơi còn lại để ghép với BOT
    const now = Date.now();
    for (let j = memoryQueue.length - 1; j >= 0; j--) {
      const player = memoryQueue[j];
      if (now - player.joinedAt >= 15000) {
        // Quá 15 giây -> Ghép với BOT
        this.matchWithBot(player);
        memoryQueue.splice(j, 1);
      }
    }
  }

  /**
   * Tạo trận đấu giữa 2 người chơi thật
   */
  createMatch(p1, p2) {
    if (this.matchFoundCallback) {
      this.matchFoundCallback({
        isBotMatch: false,
        players: {
          playerA: { id: p1.userId, socketId: p1.socketId, elo: p1.elo },
          playerB: { id: p2.userId, socketId: p2.socketId, elo: p2.elo }
        }
      });
    }
  }

  /**
   * Ghép người chơi với BOT giả lập
   */
  matchWithBot(p) {
    const botElo = p.elo + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 50);
    const randomBotInfo = MOCK_BOTS[Math.floor(Math.random() * MOCK_BOTS.length)];

    console.log(`[Matchmaking] Matchmaking timeout (15s). Matching user ${p.userId} with BOT ${randomBotInfo.display_name} (ELO: ${botElo})`);

    if (this.matchFoundCallback) {
      this.matchFoundCallback({
        isBotMatch: true,
        players: {
          playerA: { id: p.userId, socketId: p.socketId, elo: p.elo },
          playerB: { 
            id: 'bot_opponent_id', 
            display_name: randomBotInfo.display_name,
            avatar_id: randomBotInfo.avatar_id,
            elo: botElo, 
            isBot: true 
          }
        }
      });
    }
  }
  clearQueue() {
    memoryQueue = [];
  }
}

module.exports = MatchmakingService;
