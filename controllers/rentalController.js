const prisma = require('../config/prisma');

// GET /api/rentals
const getAllRentals = async (req, res, next) => {
    try {
        const { status, userId } = req.query;
        const where = {};
        if (status) where.status = status;

        // Normal users can only see their own rentals
        if (req.user.role !== 'admin') {
            where.userId = req.user.id;
        } else if (userId) {
            where.userId = parseInt(userId);
        }

        const rentals = await prisma.rental.findMany({
            where,
            include: {
                user: { select: { id: true, name: true, email: true } },
                item: { select: { id: true, name: true, imageUrl: true, rentalPrice: true } },
                payment: true,
                coupon: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json({ success: true, data: rentals });
    } catch (error) {
        next(error);
    }
};

// GET /api/rentals/:id
const getRentalById = async (req, res, next) => {
    try {
        const rental = await prisma.rental.findUnique({
            where: { id: parseInt(req.params.id) },
            include: {
                user: { select: { id: true, name: true, email: true, phone: true } },
                item: true,
                payment: true,
                returnItem: true,
                coupon: true,
            },
        });
        if (!rental) return res.status(404).json({ success: false, message: 'Rental not found' });

        // Users can only access their own rentals; admins can access any
        if (req.user.role !== 'admin' && rental.userId !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Access denied. You can only view your own rentals.' });
        }

        res.json({ success: true, data: rental });
    } catch (error) {
        next(error);
    }
};

// POST /api/rentals - create rental
const createRental = async (req, res, next) => {
    try {
        const { itemId, startDate, endDate, couponCode } = req.body;
        const userId = req.user.id;

        if (!itemId || !startDate || !endDate) {
            return res.status(400).json({ success: false, message: 'itemId, startDate, and endDate are required' });
        }

        const item = await prisma.clothingItem.findUnique({ where: { id: parseInt(itemId) } });
        if (!item) return res.status(404).json({ success: false, message: 'Clothing item not found' });
        if (!item.isAvailable) return res.status(400).json({ success: false, message: 'Item is not available for rent' });

        const start = new Date(startDate);
        const end = new Date(endDate);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        if (days <= 0) return res.status(400).json({ success: false, message: 'endDate must be after startDate' });

        let totalAmount = item.rentalPrice * days;
        let couponId = null;

        if (couponCode) {
            const coupon = await prisma.coupon.findFirst({
                where: { code: couponCode, isActive: true, usedCount: { lt: prisma.coupon.fields.maxUses } },
            });
            if (coupon && totalAmount >= coupon.minAmount) {
                if (coupon.type === 'percentage') totalAmount -= (totalAmount * coupon.discount) / 100;
                else totalAmount -= coupon.discount;
                totalAmount = Math.max(0, totalAmount);
                couponId = coupon.id;
                await prisma.coupon.update({ where: { id: coupon.id }, data: { usedCount: { increment: 1 } } });
            }
        }

        const [rental] = await prisma.$transaction([
            prisma.rental.create({
                data: {
                    userId: parseInt(userId),
                    itemId: parseInt(itemId),
                    startDate: start,
                    endDate: end,
                    totalAmount,
                    couponId,
                },
                include: {
                    user: { select: { id: true, name: true, email: true } },
                    item: { select: { id: true, name: true, imageUrl: true } },
                },
            }),
            prisma.clothingItem.update({
                where: { id: parseInt(itemId) },
                data: { isAvailable: false },
            }),
        ]);

        res.status(201).json({ success: true, message: 'Rental created successfully', data: rental });
    } catch (error) {
        next(error);
    }
};

// PATCH /api/rentals/:id/return - process return
const returnRental = async (req, res, next) => {
    try {
        const { condition = 'Good', remarks } = req.body;
        const rentalId = parseInt(req.params.id);

        const rental = await prisma.rental.findUnique({ where: { id: rentalId }, include: { item: true } });
        if (!rental) return res.status(404).json({ success: false, message: 'Rental not found' });
        if (rental.status === 'returned') return res.status(400).json({ success: false, message: 'Already returned' });

        // Only the rental owner or an admin can return an item
        if (req.user.role !== 'admin' && rental.userId !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Access denied. You can only return items you rented.' });
        }

        const returnDate = new Date();
        let lateFee = 0;
        if (returnDate > rental.endDate) {
            const lateDays = Math.ceil((returnDate - rental.endDate) / (1000 * 60 * 60 * 24));
            lateFee = lateDays * rental.item.rentalPrice * 0.5; // 50% extra per late day
        }

        const [returnItem] = await prisma.$transaction([
            prisma.returnItem.create({
                data: { rentalId, itemId: rental.itemId, returnDate, condition, lateFee, remarks },
            }),
            prisma.rental.update({ where: { id: rentalId }, data: { status: 'returned' } }),
            prisma.clothingItem.update({ where: { id: rental.itemId }, data: { isAvailable: true } }),
        ]);

        res.json({ success: true, message: 'Item returned successfully', data: returnItem });
    } catch (error) {
        next(error);
    }
};

module.exports = { getAllRentals, getRentalById, createRental, returnRental };
