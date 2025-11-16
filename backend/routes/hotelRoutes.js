const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotelController');
const { authenticateToken, authorizeHost } = require('../middleware/authMiddleware');

router.get('/search', hotelController.searchHotels);
router.get('/all', hotelController.getAllHotels);
router.get('/stats/platform', hotelController.getPlatformStats);
router.get('/:id', hotelController.getHotelDetails);

// Protected routes (Host only)
router.get('/host/my-hotels', authenticateToken, authorizeHost, hotelController.getHostHotels);
router.post('/', authenticateToken, authorizeHost, hotelController.createHotel);
router.put('/:id', authenticateToken, authorizeHost, hotelController.updateHotel);
router.delete('/:id', authenticateToken, authorizeHost, hotelController.deleteHotel);

module.exports = router;
