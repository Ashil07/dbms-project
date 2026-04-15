const express = require('express');
const router = express.Router();
const { getAllUsers, createUser, getUserById } = require('../controllers/userController');

// GET /api/users
router.get('/', getAllUsers);

// GET /api/users/:id
router.get('/:id', getUserById);

// POST /api/users
router.post('/', createUser);

module.exports = router;
