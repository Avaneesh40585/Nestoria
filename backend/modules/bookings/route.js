const router = require('express').Router();
const { authenticate, requireCustomer } = require('../../middleware/auth');
const { create, myBookings, detail, cancel } = require('./controller');

router.use(authenticate);
router.post('/',           requireCustomer, create);
router.get ('/my',         requireCustomer, myBookings);
router.get ('/:id',        detail);
router.put ('/:id/cancel', requireCustomer, cancel);

module.exports = router;
