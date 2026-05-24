const router = require('express').Router();
const { authenticate, requireHost } = require('../../middleware/auth');
const { upload, uploadImage } = require('./controller');

router.use(authenticate, requireHost);
router.post('/hotel-image', upload.single('image'), uploadImage('hotels'));
router.post('/room-image',  upload.single('image'), uploadImage('rooms'));

module.exports = router;
