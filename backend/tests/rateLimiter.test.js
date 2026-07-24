const rateLimiter = require('../src/middleware/rateLimiter');

describe('Rate Limiter Middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      headers: {},
      socket: { remoteAddress: '127.0.0.1' },
      ip: '127.0.0.1'
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should allow requests within limit', () => {
    const limiter = rateLimiter({ windowMs: 1000, max: 2 });

    limiter(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();

    limiter(req, res, next);
    expect(next).toHaveBeenCalledTimes(2);
    expect(res.status).not.toHaveBeenCalled();

    limiter.cleanup();
  });

  it('should block requests exceeding limit', () => {
    const limiter = rateLimiter({ windowMs: 1000, max: 2 });

    limiter(req, res, next);
    limiter(req, res, next);
    limiter(req, res, next);

    expect(next).toHaveBeenCalledTimes(2);
    expect(res.status).toHaveBeenCalledWith(429);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      data: null,
      error: {
        code: 'TOO_MANY_REQUESTS',
        message: 'Too many requests, please try again later.'
      }
    });

    limiter.cleanup();
  });

  it('should reset count after window expires', () => {
    const limiter = rateLimiter({ windowMs: 1000, max: 2 });

    limiter(req, res, next);
    limiter(req, res, next);
    limiter(req, res, next); // Blocked

    expect(next).toHaveBeenCalledTimes(2);

    // Fast-forward time
    jest.advanceTimersByTime(1001);

    limiter(req, res, next); // Allowed
    expect(next).toHaveBeenCalledTimes(3);

    limiter.cleanup();
  });

  it('should ignore spoofed X-Forwarded-For header values', () => {
    const limiter = rateLimiter({ windowMs: 1000, max: 1 });
    
    req.headers['x-forwarded-for'] = '192.168.1.1';
    limiter(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);

    const req2 = {
      headers: { 'x-forwarded-for': '192.168.1.2' },
      socket: { remoteAddress: '127.0.0.1' },
      ip: '127.0.0.1'
    };
    limiter(req2, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(429);

    limiter.cleanup();
  });
});
