const express = require('express');
const router = express.Router();
const { getAllUsers, createUser, getUserById } = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');

// POST /api/users - public signup endpoint
router.post('/', createUser);

// Protected routes below
router.use(authenticate);

// GET /api/users
router.get('/', getAllUsers);

// GET /api/users/:id
router.get('/:id', getUserById);

module.exports = router;
