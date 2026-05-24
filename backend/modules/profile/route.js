const router = require('express').Router();
const { authenticate } = require('../../middleware/auth');
const { get, update, changePassword } = require('./controller');

router.use(authenticate);
router.get('/',                 get);
router.put('/',                 update);
router.put('/change-password',  changePassword);

module.exports = router;
