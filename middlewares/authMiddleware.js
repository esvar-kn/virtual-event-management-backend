const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

// Middleware to protect routes by verifying JWT token
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token payload and attach to request object
            req.user = await userModel.findById(decoded.id);
            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found.' });
            }

            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed.' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token.' });
    }
};

// Middleware to restrict access based on user role
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'You do not have permission to perform this action.' });
        }
        next();
    };
};

module.exports = {
    protect,
    restrictTo
};