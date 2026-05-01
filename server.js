require('dotenv').config();
const express = require('express');
const cors = require('cors');

const itemRoutes = require('./routes/items');
const rentalRoutes = require('./routes/rentals');
const paymentRoutes = require('./routes/payments');
const categoryRoutes = require('./routes/categories');
const userRoutes = require('./routes/users');
const couponRoutes = require('./routes/coupons');
const reviewRoutes = require('./routes/reviews');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS — allow localhost for dev, any *.vercel.app domain, and any explicitly
// configured CLIENT_URL (set this in Vercel env vars to your custom domain).
const explicitOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (server-to-server, curl, Postman)
      if (!origin) return callback(null, true);
      // Always allow localhost in any port (development)
      if (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
        return callback(null, true);
      }
      // Allow any Vercel deployment URL (previews + production)
      if (origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }
      // Allow any explicitly configured origins
      if (explicitOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/rentals', rentalRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/reviews', reviewRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Cloth Rental API is running!', timestamp: new Date() });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Only start the HTTP server when this file is run directly (local dev).
// When imported by api/index.js (Vercel), we just export the app.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n🚀 Cloth Rental API running at http://localhost:${PORT}`);
    console.log(`📦 API Base: http://localhost:${PORT}/api`);
    console.log(`🎨 React Frontend: http://localhost:5173 (run: cd client && npm run dev)\n`);
  });
}

module.exports = app;

