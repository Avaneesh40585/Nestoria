const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register/customer', authController.registerCustomer);
router.post('/register/host', authController.registerHost);
router.post('/login/customer', authController.loginCustomer);
router.post('/login/host', authController.loginHost);

module.exports = router;
