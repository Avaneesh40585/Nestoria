const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Traditional authentication
router.post('/register/customer', authController.registerCustomer);
router.post('/register/host', authController.registerHost);
router.post('/login/customer', authController.loginCustomer);
router.post('/login/host', authController.loginHost);

// Google authentication
router.post('/google/customer', authController.googleAuthCustomer);
router.post('/google/host', authController.googleAuthHost);

module.exports = router;
