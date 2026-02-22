const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getLoginHistory } = require('../controllers/profileController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.use(verifyToken); // All routes require login

router.get('/', getProfile);
router.put('/', updateProfile);
router.get('/history', getLoginHistory);

module.exports = router;
