const express = require('express');
const { createGrievance, getAllGrievances, updateStatus, predictCategory } = require('../controllers/grievanceController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/predict', verifyToken, predictCategory); // New AI prediction route
router.post('/', verifyToken, createGrievance);
router.get('/', verifyToken, getAllGrievances);
router.patch('/:id/status', verifyToken, checkRole(['Department Officer', 'Department Head', 'Admin']), updateStatus);

module.exports = router;
