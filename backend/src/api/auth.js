const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models/user');

const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret_key_change_me_in_prod';

/**
 * REST API standard response helper for success
 */
function sendSuccess(res, data, status = 200) {
  return res.status(status).json({
    ok: true,
    data,
    error: null
  });
}

/**
 * REST API standard response helper for error
 */
function sendError(res, code, message, status = 400) {
  return res.status(status).json({
    ok: false,
    data: null,
    error: {
      code,
      message
    }
  });
}

/**
 * POST /api/auth/register
 * Register with Email
 */
router.post('/register', async (req, res) => {
  try {
    const { displayName, email, password } = req.body;

    if (!displayName || !email || !password) {
      return sendError(res, 'MISSING_FIELDS', 'Display name, email, and password are required');
    }

    // Check if email already registered
    const existing = await User.findByEmail(email);
    if (existing) {
      return sendError(res, 'EMAIL_EXISTS', 'Email is already registered');
    }

    // Create user (User.create does password strength validation internally)
    let newUser;
    try {
      newUser = await User.create({ displayName, email, password });
    } catch (err) {
      if (err.code === '23505') {
        return sendError(res, 'EMAIL_EXISTS', 'Email is already registered');
      }
      if (err.code) {
        throw err; // Rethrow other database/system errors to outer catch handler
      }
      return sendError(res, 'VALIDATION_FAILED', err.message);
    }

    // Sign JWT
    const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: '7d' });

    return sendSuccess(res, {
      user: newUser,
      token
    }, 201);
  } catch (err) {
    console.error('Registration API Error:', err);
    if (err.code === '23505') {
      return sendError(res, 'EMAIL_EXISTS', 'Email is already registered');
    }
    return sendError(res, 'INTERNAL_SERVER_ERROR', 'An error occurred during registration', 500);
  }
});

/**
 * POST /api/auth/login
 * Login with Email
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 'MISSING_FIELDS', 'Email and password are required');
    }

    const user = await User.findByEmail(email);
    if (!user || !user.password_hash) {
      console.error(`Login failed: User not found for email ${email}`);
      return sendError(res, 'INVALID_CREDENTIALS', 'Invalid email or password');
    }

    // Compare bcrypt passwords
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      console.error(`Login failed: Password mismatch for email ${email}`);
      return sendError(res, 'INVALID_CREDENTIALS', 'Invalid email or password');
    }

    // Sign JWT
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });

    // Format user (removes password_hash)
    const formattedUser = User.formatUser(user);

    return sendSuccess(res, {
      user: formattedUser,
      token
    });
  } catch (err) {
    console.error('Login API Error:', err);
    return sendError(res, 'INTERNAL_SERVER_ERROR', 'An error occurred during login', 500);
  }
});

/**
 * POST /api/auth/oauth
 * OAuth2 endpoint to login or register with Google/Facebook on mobile client.
 * Mobile handles Google/FB login locally and passes credentials/details to the backend.
 */
router.post('/oauth', async (req, res) => {
  try {
    const { email, displayName, provider } = req.body;

    if (!email) {
      return sendError(res, 'MISSING_FIELDS', 'Email is required for OAuth login');
    }

    // Find or create the user record
    const user = await User.findOrCreateOAuthUser({
      displayName,
      email
    });

    // Sign JWT
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });

    return sendSuccess(res, {
      user,
      token,
      provider: provider || 'oauth2'
    });
  } catch (err) {
    console.error('OAuth API Error:', err);
    return sendError(res, 'INTERNAL_SERVER_ERROR', 'An error occurred during OAuth validation', 500);
  }
});

module.exports = router;
