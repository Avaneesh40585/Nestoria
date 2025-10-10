const express = require('express');
const router = express.Router();
const hostController = require('../controllers/hostController');
const { authenticateToken, authorizeHost } = require('../middleware/authMiddleware');

router.get('/profile', authenticateToken, authorizeHost, hostController.getProfile);
router.put('/profile', authenticateToken, authorizeHost, hostController.updateProfile);
router.get('/dashboard/stats', authenticateToken, authorizeHost, hostController.getDashboardStats);

module.exports = router;
