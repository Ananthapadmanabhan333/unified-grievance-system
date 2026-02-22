const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

router.get('/governance', verifyToken, analyticsController.getGovernanceStats);
router.get('/ai-dashboard', verifyToken, analyticsController.getAIDashboardData);
router.get('/command-center', verifyToken, checkRole(['SuperAdmin', 'StateAdmin']), analyticsController.getCommandCenterData);

module.exports = router;
