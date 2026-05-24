const router = require('express').Router();
const { authenticate } = require('../../middleware/auth');
const { register, login, googleAuth, me } = require('./controller');

router.post('/register', register);
router.post('/login',    login);
router.post('/google',   googleAuth);
router.get ('/me',       authenticate, me);

module.exports = router;
