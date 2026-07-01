const express = require('express');
const cors = require('cors');
const authRouter = require('./api/auth');
const userRouter = require('./api/user');
const placementRouter = require('./api/placement');
const questRouter = require('./api/quest');
const pvpRouter = require('./api/pvp');
const dungeonRouter = require('./api/dungeon');

const app = express();

// CORS middleware — cho phép Expo web và các client khác gọi API
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/placement', placementRouter);
app.use('/api/quests', questRouter);
app.use('/api/pvp', pvpRouter);
app.use('/api/dungeons', dungeonRouter);

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
