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

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
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
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Cloth Rental API running at http://localhost:${PORT}`);
  console.log(`📦 API Base: http://localhost:${PORT}/api`);
  console.log(`🎨 React Frontend: http://localhost:5173 (run: cd client && npm run dev)\n`);
});
