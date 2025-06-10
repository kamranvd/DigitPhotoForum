

const express = require('express');
const router = express.Router();
const { createAnswer } = require('../controllers/answerController');
const { protect } = require('../middleware/authMiddleware'); // Import the protect middleware

// @desc    Create a new answer
// @route   POST /api/answers
// @access  Private
router.post('/', protect, createAnswer); // Protect this route with the auth middleware

module.exports = router;
