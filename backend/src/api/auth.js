const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fetch = require('node-fetch');
const { User } = require('../models/user');
const config = require('../config');

/**
 * Helper to verify Google ID token
 */
async function verifyGoogleToken(token) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(token)}`, {
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (!response.ok) {
      throw new Error(`Google token validation failed with status ${response.status}`);
    }
    const data = await response.json();
    if (!data.email) {
      throw new Error('Email is missing in Google token validation response');
    }
    return {
      email: data.email,
      displayName: data.name || 'Google User'
    };
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
}

/**
 * Helper to verify Facebook Access token
 */
async function verifyFacebookToken(token) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const response = await fetch(`https://graph.facebook.com/me?access_token=${encodeURIComponent(token)}&fields=id,name,email`, {
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (!response.ok) {
      throw new Error(`Facebook token validation failed with status ${response.status}`);
    }
    const data = await response.json();
    if (!data.email) {
      throw new Error('Email is missing in Facebook token validation response');
    }
    return {
      email: data.email,
      displayName: data.name || 'Facebook User'
    };
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
}

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
    const token = jwt.sign({ id: newUser.id }, config.JWT_SECRET, { expiresIn: '7d' });

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
    const token = jwt.sign({ id: user.id }, config.JWT_SECRET, { expiresIn: '7d' });

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
    const { provider, token } = req.body;

    if (!provider || !token) {
      return sendError(res, 'MISSING_FIELDS', 'Provider and token are required');
    }

    let profile;
    // Dev/Test Mock bypass:
    if (process.env.NODE_ENV === 'test' || token.startsWith('mock-')) {
      if (provider === 'google') {
        profile = { email: 'google.user@gmail.com', displayName: 'Google User' };
      } else if (provider === 'facebook') {
        profile = { email: 'facebook.user@gmail.com', displayName: 'Facebook User' };
      } else {
        profile = { email: 'oauth2.user@gmail.com', displayName: 'OAuth2 User' };
      }
    } else {
      if (provider === 'google') {
        profile = await verifyGoogleToken(token);
      } else if (provider === 'facebook') {
        profile = await verifyFacebookToken(token);
      } else {
        return sendError(res, 'INVALID_PROVIDER', 'Unsupported OAuth provider');
      }
    }

    // Find or create the user record
    const user = await User.findOrCreateOAuthUser({
      displayName: profile.displayName,
      email: profile.email
    });

    // Sign JWT
    const jwtToken = jwt.sign({ id: user.id }, config.JWT_SECRET, { expiresIn: '7d' });

    return sendSuccess(res, {
      user,
      token: jwtToken,
      provider
    });
  } catch (err) {
    console.error('OAuth API Error:', err);
    return sendError(res, 'INVALID_TOKEN', err.message || 'An error occurred during OAuth validation', 400);
  }
});

module.exports = router;
