

const Answer = require('../models/answer');
const Question = require('../models/question'); // To ensure the question exists
const User = require('../models/user'); // To fetch user details for response

// @desc    Create a new answer for a question
// @route   POST /api/answers
// @access  Private (requires authentication)
const createAnswer = async (req, res) => {
    const { content, questionId } = req.body;
    const userId = req.user.id; // User ID from the authenticated request (set by auth middleware)

    // Server-side validation for empty content
    if (!content || content.trim() === '') {
        return res.status(400).json({ message: 'Answer content cannot be empty.' });
    }
    if (!questionId) {
        return res.status(400).json({ message: 'Question ID is required for the answer.' });
    }

    try {
        // Verify if the question exists
        const questionExists = await Question.findByPk(questionId);
        if (!questionExists) {
            return res.status(404).json({ message: 'Question not found.' });
        }

        // Create the answer
        const answer = await Answer.create({
            content,
            question_id: questionId,
            user_id: userId
        });

        // Fetch the created answer with user details for the response
        const createdAnswer = await Answer.findByPk(answer.id, {
            include: {
                model: User,
                as: 'user',
                attributes: ['id', 'username'] // Only include necessary user fields
            }
        });

        res.status(201).json(createdAnswer);
    } catch (error) {
        console.error('Error creating answer:', error);
        res.status(500).json({ message: 'Server error while creating answer.' });
    }
};

module.exports = {
    createAnswer
};
