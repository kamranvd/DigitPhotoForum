

const express = require('express');
const router = express.Router();
const {
    getQuestionsByCategory,
    getQuestionById,
    createQuestion
} = require('../controllers/questionController');
const { protect } = require('../middleware/authMiddleware'); // Import the protect middleware

// @desc    Get questions for a specific category
// @route   GET /api/questions/category/:categoryId
// @access  Public
router.get('/category/:categoryId', getQuestionsByCategory);

// @desc    Get a single question by ID with its answers
// @route   GET /api/questions/:id
// @access  Public
router.get('/:id', getQuestionById);

// @desc    Create a new question
// @route   POST /api/questions
// @access  Private
router.post('/', protect, createQuestion); // Protect this route with the auth middleware

module.exports = router;
