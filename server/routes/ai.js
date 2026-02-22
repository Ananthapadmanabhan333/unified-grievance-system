const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Public chat (some features might need auth provided in body or optional middleware)
// For now, allow public access but client sends token if available? 
// Or better, make it optional auth. 
// Let's use a wrapper or just trust the client context for MVP? 
// Better: Use verifyToken simply to attach user to req, but don't block if missing?
// For simplicity, we'll keep it open and let controller handle 'req.user' if middleware added it.
// Actually, let's make it protected for full context, or loose.
// Implementation: We will use a "Optional Auth" middleware approach if we had one.
// For now, let's assume the client sends the token in headers if logged in.
// We'll use verifyToken but we need a version that doesn't 401. 
// "softVerify" middleware?

// Let's just make it a POST. If client puts token, standard middleware processes it.
// If not, it fails? No, FAQs should be public.
// We'll skip middleware here and rely on frontend sending context, or create a specific 'soft' middleware.
// Logic: simpler to just receive context from body for MVP.
router.post('/chat', aiController.chat);
router.get('/history', verifyToken, aiController.getHistory);

module.exports = router;
