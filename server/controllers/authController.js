// server/controllers/authController.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Import the User model

// Helper function to generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { username, password } = req.body;

    // Server-side validation for empty fields
    if (!username || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    // Password validation: at least 8 characters long and contains a number
    if (password.length < 8 || !/\d/.test(password)) {
        return res.status(400).json({
            message: 'Invalid password. Enter a password that is at least 8 characters long and contains a number.'
        });
    }

    try {
        // Check if user already exists
        const userExists = await User.findOne({ where: { username: username } });

        if (userExists) {
            return res.status(400).json({ message: 'Username already exists.' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            username,
            password: hashedPassword,
        });

        if (user) {
            res.status(201).json({
                id: user.id,
                username: user.username,
                token: generateToken(user.id),
                message: 'User registered successfully'
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Server error during registration.' });
    }
};

// @desc    Authenticate user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { username, password } = req.body;

    // Server-side validation for empty fields
    if (!username || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    try {
        // Check for user by username
        const user = await User.findOne({ where: { username: username } });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                id: user.id,
                username: user.username,
                token: generateToken(user.id),
                message: 'Login successful'
            });
        } else {
            res.status(401).json({ message: 'Invalid username or password.' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error during login.' });
    }
};

module.exports = {
    registerUser,
    loginUser,
};
