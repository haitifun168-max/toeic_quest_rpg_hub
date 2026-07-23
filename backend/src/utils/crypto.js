const crypto = require('crypto');
const config = require('../config');

const ALGORITHM = 'aes-256-cbc';

// KEY/IV được đọc tại thời điểm sử dụng (không capture cứng lúc load module),
// đảm bảo lấy đúng giá trị đã được validateEnv() xác thực. Không còn fallback:
// nếu thiếu secret, ứng dụng đã fail-fast từ trước khi tới đây.
function getKey() {
    return Buffer.from(config.ENCRYPTION_KEY.substring(0, 32), 'utf-8');
}

function getIv() {
    return Buffer.from(config.ENCRYPTION_IV.substring(0, 16), 'utf-8');
}

/**
 * Encrypts cleartext using AES-256-CBC
 * @param {string} text 
 * @returns {string} hex encrypted ciphertext
 */
function encrypt(text) {
    if (!text) return null;
    const cipher = crypto.createCipheriv(ALGORITHM, getKey(), getIv());
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
        const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), getIv());
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
