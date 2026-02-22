const express = require('express');
const { register, login, sendOtp, verifyOtp, verifyIdentity } = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware');
const router = express.Router();

// OTP Auth
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);

// Identity
router.post('/verify-identity', verifyToken, verifyIdentity);

// Legacy (Admin)
router.post('/login', login);
router.post('/register', register);

module.exports = router;
