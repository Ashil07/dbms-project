const express = require('express');
const router = express.Router();
const { getAllPayments, getPaymentById, createPayment, refundPayment } = require('../controllers/paymentController');

// GET /api/payments
router.get('/', getAllPayments);

// GET /api/payments/:id
router.get('/:id', getPaymentById);

// POST /api/payments
router.post('/', createPayment);

// PATCH /api/payments/:id/refund
router.patch('/:id/refund', refundPayment);

module.exports = router;
