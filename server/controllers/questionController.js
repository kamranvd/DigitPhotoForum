

const Question = require('../models/question');
const User = require('../models/user');
const Category = require('../models/category');
const Answer = require('../models/answer'); // We'll need this for question details

// @desc    Get all questions for a specific category
// @route   GET /api/questions/category/:categoryId
// @access  Public
const getQuestionsByCategory = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;

        // Verify if category exists
        const category = await Category.findByPk(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found.' });
        }

        // Find questions belonging to the category, ordered by creation date (chronological)
        // Include associated user and category details
        const questions = await Question.findAll({
            where: { category_id: categoryId },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'username'] // Only include necessary user fields
                },
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name'] // Only include necessary category fields
                }
            ],
            order: [['created_at', 'ASC']] // Chronological order
        });

        res.status(200).json(questions);
    } catch (error) {
        console.error('Error fetching questions by category:', error);
        res.status(500).json({ message: 'Server error while fetching questions.' });
    }
};

// @desc    Get a single question by ID with its answers
// @route   GET /api/questions/:id
// @access  Public
const getQuestionById = async (req, res) => {
    try {
        const questionId = req.params.id;

        const question = await Question.findByPk(questionId, {
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'username']
                },
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name']
                },
                {
                    model: Answer,
                    as: 'answers', // As defined in Answer model association
                    include: {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'username']
                    },
                    order: [['created_at', 'ASC']] // Order answers chronologically
                }
            ]
        });

        if (!question) {
            return res.status(404).json({ message: 'Question not found.' });
        }

        res.status(200).json(question);
    } catch (error) {
        console.error('Error fetching single question:', error);
        res.status(500).json({ message: 'Server error while fetching question details.' });
    }
};


// @desc    Create a new question
// @route   POST /api/questions
// @access  Private (requires authentication)
const createQuestion = async (req, res) => {
    const { title, content, categoryId } = req.body; // Use categoryId to match client-side convention
    const userId = req.user.id; // User ID from the authenticated request (set by auth middleware)

    // Server-side validation for empty content and ending with question mark
    if (!content) {
        return res.status(400).json({ message: 'Question content cannot be empty.' });
    }
    if (!content.trim().endsWith('?')) {
        return res.status(400).json({ message: 'Question content must end with a question mark.' });
    }
    if (!categoryId) {
        return res.status(400).json({ message: 'Category is required for the question.' });
    }

    try {
        // Verify if category exists
        const categoryExists = await Category.findByPk(categoryId);
        if (!categoryExists) {
            return res.status(400).json({ message: 'Invalid category selected.' });
        }

        const question = await Question.create({
            title: title || null, // Allow title to be null if not provided
            content,
            category_id: categoryId,
            user_id: userId
        });

        // Fetch the created question with user and category details for the response
        const createdQuestion = await Question.findByPk(question.id, {
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'username']
                },
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name']
                }
            ]
        });

        res.status(201).json(createdQuestion);
    } catch (error) {
        console.error('Error creating question:', error);
        res.status(500).json({ message: 'Server error while creating question.' });
    }
};

module.exports = {
    getQuestionsByCategory,
    getQuestionById,
    createQuestion
};
