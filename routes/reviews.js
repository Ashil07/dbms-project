const express = require('express');
const router = express.Router();
const { getItemReviews, createReview } = require('../controllers/reviewController');
const { authenticate } = require('../middleware/auth');

// GET /api/reviews/item/:itemId - public
router.get('/item/:itemId', getItemReviews);

// POST /api/reviews - authenticated
router.post('/', authenticate, createReview);

module.exports = router;
