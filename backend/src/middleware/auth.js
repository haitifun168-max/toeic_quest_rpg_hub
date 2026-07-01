const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret_key_change_me_in_prod';

/**
 * Middleware to verify user JWT token
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  // Expect format "Bearer <token>"
  const token = authHeader && authHeader.match(/^Bearer\s+(.+)$/i)?.[1];

  if (!token) {
    return res.status(401).json({
      ok: false,
      data: null,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Access token is required'
      }
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Contains { id: userId }
    next();
  } catch (err) {
    return res.status(401).json({
      ok: false,
      data: null,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Invalid or expired access token'
      }
    });
  }
}

module.exports = { authenticateToken };
