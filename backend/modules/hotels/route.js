const router = require('express').Router();
const { authenticate, requireHost } = require('../../middleware/auth');
const { search, destinations, detail, create, update, remove } = require('./controller');

router.get('/destinations', destinations);
router.get('/',             search);
router.get('/:slug',        detail);

router.post  ('/',   authenticate, requireHost, create);
router.put   ('/:id', authenticate, requireHost, update);
router.delete('/:id', authenticate, requireHost, remove);

module.exports = router;
