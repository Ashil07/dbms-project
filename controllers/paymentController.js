const prisma = require('../config/prisma');

// GET /api/payments
const getAllPayments = async (req, res, next) => {
    try {
        const { status, rentalId } = req.query;
        const where = {};
        if (status) where.status = status;
        if (rentalId) where.rentalId = parseInt(rentalId);

        const payments = await prisma.payment.findMany({
            where,
            include: {
                rental: {
                    include: {
                        user: { select: { id: true, name: true, email: true } },
                        item: { select: { id: true, name: true } },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json({ success: true, data: payments });
    } catch (error) {
        next(error);
    }
};

// GET /api/payments/:id
const getPaymentById = async (req, res, next) => {
    try {
        const payment = await prisma.payment.findUnique({
            where: { id: parseInt(req.params.id) },
            include: { rental: { include: { user: true, item: true } } },
        });
        if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
        res.json({ success: true, data: payment });
    } catch (error) {
        next(error);
    }
};

// POST /api/payments - create payment for a rental
const createPayment = async (req, res, next) => {
    try {
        const { rentalId, amount, method, transactionId } = req.body;

        if (!rentalId || !amount || !method) {
            return res.status(400).json({ success: false, message: 'rentalId, amount, and method are required' });
        }

        const rental = await prisma.rental.findUnique({ where: { id: parseInt(rentalId) } });
        if (!rental) return res.status(404).json({ success: false, message: 'Rental not found' });

        const existing = await prisma.payment.findUnique({ where: { rentalId: parseInt(rentalId) } });
        if (existing) return res.status(400).json({ success: false, message: 'Payment already exists for this rental' });

        const validMethods = ['cash', 'card', 'upi', 'online'];
        if (!validMethods.includes(method)) {
            return res.status(400).json({ success: false, message: `Method must be one of: ${validMethods.join(', ')}` });
        }

        const payment = await prisma.payment.create({
            data: {
                rentalId: parseInt(rentalId),
                amount: parseFloat(amount),
                method,
                transactionId,
                status: 'completed',
                paidAt: new Date(),
            },
            include: {
                rental: {
                    include: {
                        user: { select: { id: true, name: true } },
                        item: { select: { id: true, name: true } },
                    },
                },
            },
        });

        res.status(201).json({ success: true, message: 'Payment recorded successfully', data: payment });
    } catch (error) {
        next(error);
    }
};

// PATCH /api/payments/:id/refund
const refundPayment = async (req, res, next) => {
    try {
        const payment = await prisma.payment.findUnique({ where: { id: parseInt(req.params.id) } });
        if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
        if (payment.status === 'refunded') return res.status(400).json({ success: false, message: 'Already refunded' });

        const updated = await prisma.payment.update({
            where: { id: parseInt(req.params.id) },
            data: { status: 'refunded' },
        });
        res.json({ success: true, message: 'Payment refunded', data: updated });
    } catch (error) {
        next(error);
    }
};

module.exports = { getAllPayments, getPaymentById, createPayment, refundPayment };
