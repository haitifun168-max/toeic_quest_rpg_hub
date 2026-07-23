const express = require('express');
const cors = require('cors');
const rateLimiter = require('./middleware/rateLimiter');
const authRouter = require('./api/auth');
const userRouter = require('./api/user');
const placementRouter = require('./api/placement');
const questRouter = require('./api/quest');
const pvpRouter = require('./api/pvp');
const dungeonRouter = require('./api/dungeon');
const leaderboardRouter = require('./api/leaderboard');
const aiRouter = require('./api/ai');

const app = express();

// Trust proxy for rate limiting behind reverse proxies (like Render, AWS ALB, Nginx)
app.set('trust proxy', true);

// CORS middleware — cho phép Expo web và các client khác gọi API
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Request logging middleware — ghi log mọi request từ client
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  if (req.body && Object.keys(req.body).length > 0) {
    // Log body nhưng che password
    const logBody = { ...req.body };
    if (logBody.password) logBody.password = '***';
    console.log(`  Body: ${JSON.stringify(logBody)}`);
  }
  next();
});

// Configure Rate Limiters (disabled in test environment to prevent test suite 429 blockages)
const authLimiter = process.env.NODE_ENV === 'test'
  ? (req, res, next) => next()
  : rateLimiter({ windowMs: 60 * 1000, max: 10 });

const aiLimiter = process.env.NODE_ENV === 'test'
  ? (req, res, next) => next()
  : rateLimiter({ windowMs: 60 * 1000, max: 5 });

// Routes
app.use('/api/auth', authLimiter, authRouter);
app.use('/api/users', userRouter);
app.use('/api/placement', placementRouter);
app.use('/api/quests', questRouter);
app.use('/api/pvp', pvpRouter);
app.use('/api/dungeons', dungeonRouter);
app.use('/api/leaderboard', leaderboardRouter);
app.use('/api/ai', aiLimiter, aiRouter);

// Root path check
app.get('/', (req, res) => {
  res.json({
    ok: true,
    message: "TOEIC Quest RPG Hub API is running successfully!"
  });
});

// Standard 404 handler
app.use((req, res) => {
  res.status(404).json({
    ok: false,
    data: null,
    error: {
      code: 'NOT_FOUND',
      message: 'Resource not found'
    }
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    ok: false,
    data: null,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: err.message || 'An unexpected error occurred'
    }
  });
});

module.exports = app;
