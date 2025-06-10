

const express = require('express');
const router = express.Router();
const { getCategories } = require('../controllers/categoryController');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
router.get('/', getCategories);

module.exports = router;
