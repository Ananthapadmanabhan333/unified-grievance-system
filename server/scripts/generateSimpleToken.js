const jwt = require('jsonwebtoken');

const generate = () => {
    // ID 1 usually exists if any login happened
    const payload = {
        user: {
            id: 1,
            role: 'Citizen'
        }
    };

    // Hardcoded secret or env
    // In server/config/config.js or authMiddleware I used process.env.JWT_SECRET
    // If undefined, it might default to something?
    // Let's assume 'secret' or if I can read .env...
    // I can't read .env easily.
    // I'll try to require .env
    require('dotenv').config();
    const secret = process.env.JWT_SECRET || 'secret';

    const token = jwt.sign(payload, secret, { expiresIn: '1h' });
    const fs = require('fs');
    fs.writeFileSync('token.txt', token);
    console.log('Token written to token.txt');
};

generate();
