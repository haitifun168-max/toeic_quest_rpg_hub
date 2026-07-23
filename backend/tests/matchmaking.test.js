const MatchmakingService = require('../src/services/matchmaking');

describe('MatchmakingService Callback Interface Tests', () => {
  let service;
  let matchFoundCallback;

  beforeEach(() => {
    jest.useFakeTimers();
    matchFoundCallback = jest.fn();
    service = new MatchmakingService();
    service.clearQueue();
    service.onMatchFound(matchFoundCallback);
  });

  afterEach(() => {
    service.stopMatchmakingLoop();
    jest.useRealTimers();
  });

  it('should allow players to join and leave the queue', async () => {
    const player = { userId: 'u1', socketId: 's1', elo: 1000 };
    await service.joinQueue(player);

    // Queue item exists, check by calling leave
    service.leaveQueue('u1');
    // Ensure callback not triggered since player left
    jest.advanceTimersByTime(1500);
    expect(matchFoundCallback).not.toHaveBeenCalled();
  });

  it('should match two players with close ELO (within ±100)', async () => {
    const p1 = { userId: 'u1', socketId: 's1', elo: 1000 };
    const p2 = { userId: 'u2', socketId: 's2', elo: 1050 };

    await service.joinQueue(p1);
    await service.joinQueue(p2);

    // Advance time to run matchmaking scan loop
    jest.advanceTimersByTime(1500);

    expect(matchFoundCallback).toHaveBeenCalledTimes(1);
    expect(matchFoundCallback).toHaveBeenCalledWith({
      isBotMatch: false,
      players: {
        playerA: { id: 'u1', socketId: 's1', elo: 1000 },
        playerB: { id: 'u2', socketId: 's2', elo: 1050 }
      }
    });
  });

  it('should not match two players with ELO difference > 100', async () => {
    const p1 = { userId: 'u1', socketId: 's1', elo: 1000 };
    const p2 = { userId: 'u2', socketId: 's2', elo: 1200 }; // ELO gap of 200

    await service.joinQueue(p1);
    await service.joinQueue(p2);

    jest.advanceTimersByTime(1500);

    // Callback should not be called immediately because ELO is too far
    expect(matchFoundCallback).not.toHaveBeenCalled();
  });

  it('should match a player with a BOT after 15 seconds wait time', async () => {
    const player = { userId: 'u1', socketId: 's1', elo: 1000 };
    await service.joinQueue(player);

    // Advance by 14 seconds (no bot match yet)
    jest.advanceTimersByTime(14000);
    expect(matchFoundCallback).not.toHaveBeenCalled();

    // Advance to 15 seconds total wait time
    jest.advanceTimersByTime(1500);

    expect(matchFoundCallback).toHaveBeenCalledTimes(1);
    const callArg = matchFoundCallback.mock.calls[0][0];
    expect(callArg.isBotMatch).toBe(true);
    expect(callArg.players.playerA).toEqual({ id: 'u1', socketId: 's1', elo: 1000 });
    expect(callArg.players.playerB.isBot).toBe(true);
    expect(callArg.players.playerB.id).toBe('bot_opponent_id');
  });
});
