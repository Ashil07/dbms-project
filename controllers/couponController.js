const prisma = require('../config/prisma');

const getAllCoupons = async (req, res, next) => {
    try {
        const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
        res.json({ success: true, data: coupons });
    } catch (error) {
        next(error);
    }
};

const createCoupon = async (req, res, next) => {
    try {
        const { code, discount, type, minAmount, maxUses, expiresAt } = req.body;
        if (!code || !discount) return res.status(400).json({ success: false, message: 'code and discount are required' });

        const coupon = await prisma.coupon.create({
            data: {
                code: code.toUpperCase(),
                discount: parseFloat(discount),
                type: type || 'percentage',
                minAmount: minAmount ? parseFloat(minAmount) : 0,
                maxUses: maxUses ? parseInt(maxUses) : 100,
                expiresAt: expiresAt ? new Date(expiresAt) : null,
            },
        });
        res.status(201).json({ success: true, message: 'Coupon created', data: coupon });
    } catch (error) {
        if (error.code === 'P2002') return res.status(409).json({ success: false, message: 'Coupon code already exists' });
        next(error);
    }
};

const validateCoupon = async (req, res, next) => {
    try {
        const { code, amount } = req.body;
        if (!code) return res.status(400).json({ success: false, message: 'Coupon code is required' });

        const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });
        if (!coupon) return res.status(404).json({ success: false, message: 'Invalid coupon code' });
        if (!coupon.isActive) return res.status(400).json({ success: false, message: 'Coupon is inactive' });
        if (coupon.expiresAt && new Date() > coupon.expiresAt) return res.status(400).json({ success: false, message: 'Coupon has expired' });
        if (coupon.usedCount >= coupon.maxUses) return res.status(400).json({ success: false, message: 'Coupon usage limit reached' });
        if (amount && parseFloat(amount) < coupon.minAmount) {
            return res.status(400).json({ success: false, message: `Minimum order amount is ₹${coupon.minAmount}` });
        }

        let discountAmount = 0;
        if (amount) {
            discountAmount = coupon.type === 'percentage' ? (parseFloat(amount) * coupon.discount) / 100 : coupon.discount;
        }

        res.json({ success: true, data: { ...coupon, discountAmount } });
    } catch (error) {
        next(error);
    }
};

module.exports = { getAllCoupons, createCoupon, validateCoupon };
