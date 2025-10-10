const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticateToken, authorizeHost } = require('../middleware/authMiddleware');

// Customer routes
router.post('/', authenticateToken, bookingController.createBooking);
router.get('/my-bookings', authenticateToken, bookingController.getCustomerBookings);
router.get('/:id', authenticateToken, bookingController.getBookingDetails);
router.put('/:id/cancel', authenticateToken, bookingController.cancelBooking);

// Host routes
router.get('/host/all-bookings', authenticateToken, authorizeHost, bookingController.getHostBookings);

module.exports = router;
