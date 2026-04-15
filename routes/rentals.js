const express = require('express');
const router = express.Router();
const { getAllRentals, getRentalById, createRental, returnRental } = require('../controllers/rentalController');

// GET /api/rentals
router.get('/', getAllRentals);

// GET /api/rentals/:id
router.get('/:id', getRentalById);

// POST /api/rentals
router.post('/', createRental);

// PATCH /api/rentals/:id/return
router.patch('/:id/return', returnRental);

module.exports = router;
