const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/profile', authenticateToken, customerController.getProfile);
router.put('/profile', authenticateToken, customerController.updateProfile);
router.put('/change-password', authenticateToken, customerController.changePassword);

module.exports = router;
