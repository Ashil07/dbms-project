const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');
const { getAllItems, getItemById, createItem, updateItem, deleteItem } = require('../controllers/itemController');

// GET /api/items
router.get('/', getAllItems);

// GET /api/items/:id
router.get('/:id', getItemById);

// POST /api/items (with optional image upload)
router.post('/', upload.single('image'), createItem);

// PUT /api/items/:id (with optional image update)
router.put('/:id', upload.single('image'), updateItem);

// DELETE /api/items/:id
router.delete('/:id', deleteItem);

module.exports = router;
