

const Category = require('../models/category'); // Import the Category model

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public (no authentication needed to list categories)
const getCategories = async (req, res) => {
    try {
        // Find all categories, order them by name
        const categories = await Category.findAll({
            order: [['name', 'ASC']]
        });
        res.status(200).json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Server error while fetching categories.' });
    }
};

module.exports = {
    getCategories
};
