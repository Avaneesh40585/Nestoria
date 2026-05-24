const router = require('express').Router();
const { authenticate, requireHost } = require('../../middleware/auth');
const { properties, stats, bookings, earnings } = require('./controller');

router.use(authenticate, requireHost);
router.get('/properties', properties);
router.get('/stats',      stats);
router.get('/bookings',   bookings);
router.get('/earnings',   earnings);

module.exports = router;
