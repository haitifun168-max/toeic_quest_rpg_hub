const db = require('../db');
const cryptoUtils = require('../utils/crypto');
const bcrypt = require('bcryptjs');

class User {
  /**
   * Helper to format user record from DB (decrypt email)
   */
  static formatUser(rawUser) {
    if (!rawUser) return null;
    const formatted = { ...rawUser };
    if (formatted.email) {
      formatted.email = cryptoUtils.decrypt(formatted.email);
    }
    // Delete password hash from output for security
    delete formatted.password_hash;
    return formatted;
  }

  /**
   * Find user by id
   */
  static async findById(id) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const res = await db.query(query, [id]);
    return res.rows.length ? this.formatUser(res.rows[0]) : null;
  }

  /**
   * Find user by email (using encrypted email)
   */
  static async findByEmail(email) {
    if (!email) return null;
    const encryptedEmail = cryptoUtils.encrypt(email.toLowerCase().trim());
    const query = 'SELECT * FROM users WHERE email = $1';
    const res = await db.query(query, [encryptedEmail]);
    return res.rows.length ? res.rows[0] : null;
  }

  /**
   * Create new email user
   */
  static async create({ displayName, email, password }) {
    if (!displayName || !email || !password) {
      throw new Error('Missing required user registration fields');
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    // Password validation: minimum 8 characters, at least 1 uppercase, 1 special character
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!passwordRegex.test(password)) {
      throw new Error('Password must be at least 8 characters, contain 1 uppercase letter and 1 special character');
    }

    // Encrypt email and hash password
    const encryptedEmail = cryptoUtils.encrypt(email.toLowerCase().trim());
    const passwordHash = await bcrypt.hash(password, 10); // using standard 10 salt rounds

    const query = `
      INSERT INTO users (display_name, email, password_hash, current_rank, total_kp, current_elo, current_stamina)
      VALUES ($1, $2, $3, 1, 0, 1000, 15)
      RETURNING *
    `;

    const res = await db.query(query, [displayName, encryptedEmail, passwordHash]);
    return this.formatUser(res.rows[0]);
  }

  /**
   * Create or find OAuth2 user (Google/Facebook)
   */
  static async findOrCreateOAuthUser({ displayName, email }) {
    if (!email) {
      throw new Error('Email is required for OAuth user registration');
    }

    // Check if user already exists
    const existing = await this.findByEmail(email);
    if (existing) {
      return this.formatUser(existing);
    }

    const encryptedEmail = cryptoUtils.encrypt(email.toLowerCase().trim());
    const query = `
      INSERT INTO users (display_name, email, password_hash, current_rank, total_kp, current_elo, current_stamina)
      VALUES ($1, $2, null, 1, 0, 1000, 15)
      RETURNING *
    `;

    const res = await db.query(query, [displayName || 'Player', encryptedEmail]);
    return this.formatUser(res.rows[0]);
  }
}

module.exports = { User };
