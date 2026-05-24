const router = require('express').Router();
const { authenticate, requireCustomer } = require('../../middleware/auth');
const { create, byBooking } = require('./controller');

router.post('/',              authenticate, requireCustomer, create);
router.get ('/booking/:id',   authenticate, byBooking);

module.exports = router;
