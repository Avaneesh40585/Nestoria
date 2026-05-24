const router = require('express').Router();
const { authenticate, requireHost } = require('../../middleware/auth');
const { detail, availability, create, update, remove } = require('./controller');

router.get('/:id',              detail);
router.get('/:id/availability', availability);

router.post  ('/',    authenticate, requireHost, create);
router.put   ('/:id', authenticate, requireHost, update);
router.delete('/:id', authenticate, requireHost, remove);

module.exports = router;
