const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUsers } = require('../controllers/userController');

// Route for fetching all users generally used for testing
router.get('/', getUsers);

// Route for registering a new user
router.post('/register', registerUser);

// Route for authenticating a user
router.post('/login', loginUser);

module.exports = router;
