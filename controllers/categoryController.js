const prisma = require('../config/prisma');

const getAllCategories = async (req, res, next) => {
    try {
        const categories = await prisma.category.findMany({
            include: { clothTypes: true },
            orderBy: { name: 'asc' },
        });
        res.json({ success: true, data: categories });
    } catch (error) {
        next(error);
    }
};

const createCategory = async (req, res, next) => {
    try {
        const { name, description } = req.body;
        if (!name) return res.status(400).json({ success: false, message: 'Category name is required' });

        const category = await prisma.category.create({ data: { name, description } });
        res.status(201).json({ success: true, message: 'Category created', data: category });
    } catch (error) {
        if (error.code === 'P2002') return res.status(409).json({ success: false, message: 'Category already exists' });
        next(error);
    }
};

const createClothType = async (req, res, next) => {
    try {
        const { name, description, categoryId } = req.body;
        if (!name || !categoryId) return res.status(400).json({ success: false, message: 'name and categoryId are required' });

        const clothType = await prisma.clothType.create({
            data: { name, description, categoryId: parseInt(categoryId) },
            include: { category: true },
        });
        res.status(201).json({ success: true, message: 'Cloth type created', data: clothType });
    } catch (error) {
        next(error);
    }
};

const getAllClothTypes = async (req, res, next) => {
    try {
        const { categoryId } = req.query;
        const where = categoryId ? { categoryId: parseInt(categoryId) } : {};
        const clothTypes = await prisma.clothType.findMany({
            where,
            include: { category: true },
            orderBy: { name: 'asc' },
        });
        res.json({ success: true, data: clothTypes });
    } catch (error) {
        next(error);
    }
};

module.exports = { getAllCategories, createCategory, createClothType, getAllClothTypes };
