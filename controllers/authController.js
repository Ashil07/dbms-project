const prisma = require('../config/prisma');
const bcrypt = require('bcrypt');
const { generateToken } = require('../middleware/auth');

// POST /api/auth/login - login for both users and admins
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        // Try to find as User first
        let user = await prisma.user.findUnique({ where: { email } });
        let role = 'user';
        let type = 'user';

        if (!user) {
            // Try to find as Admin
            user = await prisma.admin.findUnique({ where: { email } });
            if (user) {
                role = user.role || 'admin';
                type = 'admin';
            }
        }

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        // Compare password
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const token = generateToken({ id: user.id, email: user.email, role, type });

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role,
                    type,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

// GET /api/auth/me - get current authenticated user info
const me = async (req, res, next) => {
    try {
        const { id, type, role } = req.user;

        if (type === 'admin') {
            const admin = await prisma.admin.findUnique({
                where: { id },
                select: { id: true, name: true, email: true, role: true, createdAt: true },
            });
            if (!admin) return res.status(404).json({ success: false, message: 'User not found' });
            return res.json({ success: true, data: { ...admin, type: 'admin', role: admin.role || 'admin' } });
        }

        const user = await prisma.user.findUnique({
            where: { id },
            select: { id: true, name: true, email: true, phone: true, address: true, createdAt: true },
        });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        return res.json({ success: true, data: { ...user, type: 'user', role } });
    } catch (error) {
        next(error);
    }
};

module.exports = { login, me };
