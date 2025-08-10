const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register a new user
const register = async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "Name, email, and password are required." });
    }

    try {
        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists with this email." });
        }
        
        // Hash the password and create the user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await userModel.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'attendee' // Default role is 'attendee'
        });
        
        // Asynchronous email sending (placeholder)
        // await emailService.sendRegistrationEmail(newUser.email);
        
        const userResponse = {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role
        };
        
        res.status(201).json({ message: "User created successfully.", user: userResponse });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error.", error: error.message });
    }
};

// Login a user
const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    try {
        // Find the user
        const user = await userModel.findOne({ email });
        
        // Check if user exists and password is a match
        const isMatch = user && await bcrypt.compare(password, user.password);
        
        // Use a generic error message for security
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials." });
        }
        
        // Generate JWT token with secure payload (user ID and role only)
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION }
        );

        res.status(200).json({
            message: "User logged in successfully.",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error.", error: error.message });
    }
};

module.exports = { register, login };