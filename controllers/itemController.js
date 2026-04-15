const prisma = require('../config/prisma');
const { upload, uploadToCloudinary } = require('../config/cloudinary');

// GET /api/items - list all clothing items
const getAllItems = async (req, res, next) => {
    try {
        const { category, available, search, page = 1, limit = 20 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const where = {};
        if (available !== undefined) where.isAvailable = available === 'true';
        if (search) where.name = { contains: search, mode: 'insensitive' };
        if (category) {
            where.clothType = { category: { name: { contains: category, mode: 'insensitive' } } };
        }

        const [items, total] = await Promise.all([
            prisma.clothingItem.findMany({
                where,
                include: {
                    clothType: { include: { category: true } },
                    reviews: { select: { rating: true } },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: parseInt(limit),
            }),
            prisma.clothingItem.count({ where }),
        ]);

        const itemsWithRating = items.map((item) => {
            const avgRating =
                item.reviews.length > 0
                    ? item.reviews.reduce((sum, r) => sum + r.rating, 0) / item.reviews.length
                    : null;
            return { ...item, avgRating: avgRating ? parseFloat(avgRating.toFixed(1)) : null };
        });

        res.json({
            success: true,
            data: itemsWithRating,
            pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) },
        });
    } catch (error) {
        next(error);
    }
};

// GET /api/items/:id - get single item
const getItemById = async (req, res, next) => {
    try {
        const item = await prisma.clothingItem.findUnique({
            where: { id: parseInt(req.params.id) },
            include: {
                clothType: { include: { category: true } },
                reviews: { include: { user: { select: { id: true, name: true } } } },
            },
        });
        if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
        res.json({ success: true, data: item });
    } catch (error) {
        next(error);
    }
};

// POST /api/items - create item with image upload
const createItem = async (req, res, next) => {
    try {
        const { name, description, rentalPrice, size, color, brand, condition, clothTypeId } = req.body;

        if (!name || !rentalPrice || !clothTypeId) {
            return res.status(400).json({ success: false, message: 'name, rentalPrice, and clothTypeId are required' });
        }

        let imageUrl = null;
        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer, 'cloth-rental/items');
            imageUrl = result.secure_url;
        }

        const item = await prisma.clothingItem.create({
            data: {
                name,
                description,
                imageUrl,
                rentalPrice: parseFloat(rentalPrice),
                size,
                color,
                brand,
                condition: condition || 'Good',
                clothTypeId: parseInt(clothTypeId),
            },
            include: { clothType: { include: { category: true } } },
        });

        res.status(201).json({ success: true, message: 'Item created successfully', data: item });
    } catch (error) {
        next(error);
    }
};

// PUT /api/items/:id - update item
const updateItem = async (req, res, next) => {
    try {
        const { name, description, rentalPrice, size, color, brand, condition, isAvailable, clothTypeId } = req.body;

        const existingItem = await prisma.clothingItem.findUnique({ where: { id: parseInt(req.params.id) } });
        if (!existingItem) return res.status(404).json({ success: false, message: 'Item not found' });

        let imageUrl = existingItem.imageUrl;
        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer, 'cloth-rental/items');
            imageUrl = result.secure_url;
        }

        const updated = await prisma.clothingItem.update({
            where: { id: parseInt(req.params.id) },
            data: {
                ...(name && { name }),
                ...(description !== undefined && { description }),
                imageUrl,
                ...(rentalPrice && { rentalPrice: parseFloat(rentalPrice) }),
                ...(size !== undefined && { size }),
                ...(color !== undefined && { color }),
                ...(brand !== undefined && { brand }),
                ...(condition && { condition }),
                ...(isAvailable !== undefined && { isAvailable: isAvailable === 'true' || isAvailable === true }),
                ...(clothTypeId && { clothTypeId: parseInt(clothTypeId) }),
            },
            include: { clothType: { include: { category: true } } },
        });

        res.json({ success: true, message: 'Item updated successfully', data: updated });
    } catch (error) {
        next(error);
    }
};

// DELETE /api/items/:id
const deleteItem = async (req, res, next) => {
    try {
        const item = await prisma.clothingItem.findUnique({ where: { id: parseInt(req.params.id) } });
        if (!item) return res.status(404).json({ success: false, message: 'Item not found' });

        await prisma.clothingItem.delete({ where: { id: parseInt(req.params.id) } });
        res.json({ success: true, message: 'Item deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = { getAllItems, getItemById, createItem, updateItem, deleteItem };
