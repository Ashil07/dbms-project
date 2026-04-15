const express = require('express');
const router = express.Router();
const { getAllCategories, createCategory, createClothType, getAllClothTypes } = require('../controllers/categoryController');

// GET /api/categories
router.get('/', getAllCategories);

// POST /api/categories
router.post('/', createCategory);

// GET /api/categories/cloth-types
router.get('/cloth-types', getAllClothTypes);

// POST /api/categories/cloth-types
router.post('/cloth-types', createClothType);

module.exports = router;
