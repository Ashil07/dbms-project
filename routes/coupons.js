const express = require('express');
const router = express.Router();
const { getAllCoupons, createCoupon, validateCoupon } = require('../controllers/couponController');

// GET /api/coupons
router.get('/', getAllCoupons);

// POST /api/coupons
router.post('/', createCoupon);

// POST /api/coupons/validate
router.post('/validate', validateCoupon);

module.exports = router;
