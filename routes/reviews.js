const express = require('express');
const router = express.Router();
const { getItemReviews, createReview } = require('../controllers/reviewController');

// GET /api/reviews/item/:itemId
router.get('/item/:itemId', getItemReviews);

// POST /api/reviews
router.post('/', createReview);

module.exports = router;
