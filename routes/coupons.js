const express = require('express');
const router = express.Router();
const { getAllCoupons, createCoupon, validateCoupon } = require('../controllers/couponController');
const { authenticate, authorize } = require('../middleware/auth');

// GET /api/coupons - public
router.get('/', getAllCoupons);

// POST /api/coupons/validate - public
router.post('/validate', validateCoupon);

// Protected write routes - admin only
router.use(authenticate, authorize('admin'));

// POST /api/coupons
router.post('/', createCoupon);

module.exports = router;
