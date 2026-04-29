const prisma = require('../config/prisma');

const getItemReviews = async (req, res, next) => {
    try {
        const reviews = await prisma.review.findMany({
            where: { itemId: parseInt(req.params.itemId) },
            include: { user: { select: { id: true, name: true } } },
            orderBy: { createdAt: 'desc' },
        });
        res.json({ success: true, data: reviews });
    } catch (error) {
        next(error);
    }
};

const createReview = async (req, res, next) => {
    try {
        const { itemId, rating, comment } = req.body;
        const userId = req.user.id;

        if (!itemId || !rating)
            return res.status(400).json({ success: false, message: 'itemId and rating are required' });

        if (rating < 1 || rating > 5)
            return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });

        // Optionally verify the user has rented this item (skip for admins)
        if (req.user.role !== 'admin') {
            const rental = await prisma.rental.findFirst({
                where: { userId, itemId: parseInt(itemId), status: { not: 'cancelled' } },
            });
            if (!rental) {
                return res.status(403).json({ success: false, message: 'You can only review items you have rented.' });
            }
        }

        const review = await prisma.review.create({
            data: { userId, itemId: parseInt(itemId), rating: parseInt(rating), comment },
            include: { user: { select: { id: true, name: true } } },
        });
        res.status(201).json({ success: true, message: 'Review added', data: review });
    } catch (error) {
        next(error);
    }
};

module.exports = { getItemReviews, createReview };
