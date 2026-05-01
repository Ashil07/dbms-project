const { PrismaClient } = require('@prisma/client');

// Singleton pattern — prevents new PrismaClient instances on every
// serverless function cold-start (Vercel) or hot-reload (local dev).
const globalForPrisma = global;

const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

module.exports = prisma;
