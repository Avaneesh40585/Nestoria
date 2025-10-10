const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const { authenticateToken, authorizeHost } = require('../middleware/authMiddleware');

router.get('/:id', roomController.getRoomDetails);
router.get('/:id/availability', roomController.checkAvailability);
router.get('/hotel/:hotelId', roomController.getRoomsByHotel);

// Protected routes (Host only)
router.post('/', authenticateToken, authorizeHost, roomController.createRoom);
router.put('/:id', authenticateToken, authorizeHost, roomController.updateRoom);
router.delete('/:id', authenticateToken, authorizeHost, roomController.deleteRoom);

module.exports = router;
