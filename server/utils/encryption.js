const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';
// Use environment variable or fallback for dev (In prod this must be strictly env)
const SECRET_KEY = process.env.ENCRYPTION_KEY || 'govtech_secure_key_must_be_32b!'; // 32 chars
const IV_LENGTH = 16;

const encrypt = (text) => {
    if (!text) return null;
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(SECRET_KEY), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex') + ':' + cipher.getAuthTag().toString('hex');
};

const decrypt = (text) => {
    if (!text) return null;
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.shift(), 'hex');
    const authTag = Buffer.from(textParts.shift(), 'hex');

    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(SECRET_KEY), iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
};

const maskAadhaar = (aadhaar) => {
    if (!aadhaar || aadhaar.length < 12) return aadhaar;
    return 'XXXX-XXXX-' + aadhaar.slice(-4);
};

module.exports = { encrypt, decrypt, maskAadhaar };
