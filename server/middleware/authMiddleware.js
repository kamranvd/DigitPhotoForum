

const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Import User model

const protect = async (req, res, next) => {
    let token;

    // Check if token is in headers (Authorization: Bearer TOKEN)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token payload (excluding password)
            req.user = await User.findByPk(decoded.id, {
                attributes: { exclude: ['password'] } // Exclude password from the user object
            });

            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found.' });
            }

            next(); // Proceed to the next middleware/route handler
        } catch (error) {
            console.error('Error verifying token:', error);
            res.status(401).json({ message: 'Not authorized, token failed.' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token.' });
    }
};

module.exports = { protect };
