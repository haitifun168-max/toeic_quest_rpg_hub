/**
 * rateLimiter.js
 * Custom lightweight in-memory rate limiting middleware.
 * Prevents API route abuse (brute force, spam) without external dependencies.
 */

function rateLimiter({ windowMs = 60 * 1000, max = 10 } = {}) {
  // Map to store IP hit records: ip -> { count, resetTime }
  const recordMap = new Map();

  // Periodic cleanup of expired entries to prevent memory leaks
  const intervalId = setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of recordMap.entries()) {
      if (now > record.resetTime) {
        recordMap.delete(ip);
      }
    }
  }, windowMs);

  // Unref the interval so it doesn't prevent Node process from exiting in tests/scripts
  if (intervalId && typeof intervalId.unref === 'function') {
    intervalId.unref();
  }

  const middleware = (req, res, next) => {
    // Resolve client IP address supporting reverse proxies
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip;
    const now = Date.now();

    let record = recordMap.get(ip);

    if (!record || now > record.resetTime) {
      // First request or window expired: reset record
      record = {
        count: 1,
        resetTime: now + windowMs
      };
      recordMap.set(ip, record);
      return next();
    }

    if (record.count >= max) {
      return res.status(429).json({
        ok: false,
        data: null,
        error: {
          code: 'TOO_MANY_REQUESTS',
          message: 'Too many requests, please try again later.'
        }
      });
    }

    record.count++;
    next();
  };

  // Expose recordMap and clean interval for test/debugging verification
  middleware.recordMap = recordMap;
  middleware.cleanup = () => {
    clearInterval(intervalId);
    recordMap.clear();
  };

  return middleware;
}

module.exports = rateLimiter;
