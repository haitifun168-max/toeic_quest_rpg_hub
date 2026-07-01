const crypto = require('crypto');

const ALGORITHM = 'aes-256-cbc';

// In production, ENCRYPTION_KEY must be exactly 32 bytes and ENCRYPTION_IV must be exactly 16 bytes.
const KEY_STRING = process.env.ENCRYPTION_KEY || 'default_secret_key_32_bytes_long_!'; // 32 bytes fallback
const IV_STRING = process.env.ENCRYPTION_IV || 'default_iv_16byte'; // 16 bytes fallback

const KEY = Buffer.from(KEY_STRING.substring(0, 32), 'utf-8');
const IV = Buffer.from(IV_STRING.substring(0, 16), 'utf-8');

/**
 * Encrypts cleartext using AES-256-CBC
 * @param {string} text 
 * @returns {string} hex encrypted ciphertext
 */
function encrypt(text) {
    if (!text) return null;
    const cipher = crypto.createCipheriv(ALGORITHM, KEY, IV);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

/**
 * Decrypts hex ciphertext back to cleartext
 * @param {string} ciphertext 
 * @returns {string} decrypted cleartext
 */
function decrypt(ciphertext) {
    if (!ciphertext) return null;
    // If it's not a hex string, it is already cleartext
    if (!/^[0-9a-fA-F]+$/.test(ciphertext)) {
        return ciphertext;
    }
    try {
        const decipher = crypto.createDecipheriv(ALGORITHM, KEY, IV);
        let decrypted = decipher.update(ciphertext, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (err) {
        // Fallback to original text if decryption fails
        return ciphertext;
    }
}

module.exports = {
    encrypt,
    decrypt
};
