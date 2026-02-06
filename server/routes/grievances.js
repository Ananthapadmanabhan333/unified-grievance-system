const express = require('express');
const { createGrievance, getAllGrievances, updateStatus } = require('../controllers/grievanceController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', verifyToken, createGrievance);
router.get('/', verifyToken, getAllGrievances);
router.patch('/:id/status', verifyToken, checkRole(['Department Officer', 'Department Head', 'Admin']), updateStatus);

module.exports = router;
