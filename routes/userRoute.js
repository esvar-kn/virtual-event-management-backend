const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// The `express.json()` middleware should be in the main app.js file, not here.
// But for this file to work independently, we can keep it here.
router.use(express.json());

// Route to register a new user
router.post('/register', userController.register);

// Route to login a user
router.post('/login', userController.login);

module.exports = router;