const jwt = require("jsonwebtoken");
const User = require("../models/user-model");

const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check required fields
        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Username, email, and password are required."
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "A user with this email already exists."
            });
        }

        // Create user
        const newUser = await User.create({
            username,
            email,
            password
        });

        // Return user data without password
        res.status(201).json({
            message: "User created successfully.",
            user: {
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
                createdAt: newUser.createdAt,
                updatedAt: newUser.updatedAt
            }
        });
    } catch (error) {
        console.error(error);

        res.status(400).json({
            message: error.message
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required."
            });
        }

        // Include password because the schema uses select: false
        const user = await User.findOne({ email }).select("+password");

        // Generic error for security
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password."
            });
        }

        // Compare password
        const correctPassword = await user.isCorrectPassword(password);

        if (!correctPassword) {
            return res.status(400).json({
                message: "Incorrect email or password."
            });
        }

        // JWT payload
        const payload = {
            _id: user._id,
            username: user.username
        };

        // Create JWT
        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        // Return token and user data
        res.status(200).json({
            message: "Login successful.",
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error(error);

        res.status(400).json({
            message: error.message
        });
    }
};

module.exports = {
    registerUser,
    loginUser
};