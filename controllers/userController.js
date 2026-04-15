const prisma = require('../config/prisma');
const bcrypt = require('bcrypt');

const getAllUsers = async (req, res, next) => {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, name: true, email: true, phone: true, address: true, createdAt: true },
            orderBy: { createdAt: 'desc' },
        });
        res.json({ success: true, data: users });
    } catch (error) {
        next(error);
    }
};

const createUser = async (req, res, next) => {
    try {
        const { name, email, phone, address, password } = req.body;
        if (!name || !email || !password)
            return res.status(400).json({ success: false, message: 'name, email, and password are required' });

        const hashed = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { name, email, phone, address, password: hashed },
            select: { id: true, name: true, email: true, phone: true, address: true, createdAt: true },
        });
        res.status(201).json({ success: true, message: 'User created', data: user });
    } catch (error) {
        if (error.code === 'P2002') return res.status(409).json({ success: false, message: 'Email already in use' });
        next(error);
    }
};

const getUserById = async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(req.params.id) },
            select: { id: true, name: true, email: true, phone: true, address: true, createdAt: true },
        });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

module.exports = { getAllUsers, createUser, getUserById };
