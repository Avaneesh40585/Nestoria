const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authenticateToken, isCustomer } = require('../middleware/authMiddleware');

// Add review (customers only)
router.post('/', authenticateToken, isCustomer, reviewController.addReview);

// Get existing review for a booking (customers only)
router.get('/booking/:booking_id', authenticateToken, isCustomer, reviewController.getBookingReview);

module.exports = router;
