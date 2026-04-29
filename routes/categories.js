const express = require('express');
const router = express.Router();
const { getAllCategories, createCategory, createClothType, getAllClothTypes } = require('../controllers/categoryController');
const { authenticate, authorize } = require('../middleware/auth');

// GET /api/categories - public
router.get('/', getAllCategories);

// GET /api/categories/cloth-types - public
router.get('/cloth-types', getAllClothTypes);

// Protected write routes - admin only
router.use(authenticate, authorize('admin'));

// POST /api/categories
router.post('/', createCategory);

// POST /api/categories/cloth-types
router.post('/cloth-types', createClothType);

module.exports = router;
