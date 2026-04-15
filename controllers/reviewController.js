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
        const { userId, itemId, rating, comment } = req.body;
        if (!userId || !itemId || !rating)
            return res.status(400).json({ success: false, message: 'userId, itemId, and rating are required' });

        if (rating < 1 || rating > 5)
            return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });

        const review = await prisma.review.create({
            data: { userId: parseInt(userId), itemId: parseInt(itemId), rating: parseInt(rating), comment },
            include: { user: { select: { id: true, name: true } } },
        });
        res.status(201).json({ success: true, message: 'Review added', data: review });
    } catch (error) {
        next(error);
    }
};

module.exports = { getItemReviews, createReview };
