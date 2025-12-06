import User from "../models/User.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


// Token banane ka function
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

// ===== LOGIN =====
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Email and password check
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please enter email and password',
            });
        }

        // User dhundo + password include karo
        const user = await User.findOne({
            email: email.toLowerCase()
        }).select('+password');

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Account deactivate hai, admin sey baat karo',
            });
        }

        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// ===== REGISTER =====
// Register (sirf admin kar sakta hai)
export const register = async (req, res) => {
    try {
        const { fullName, email, password, role } = req.body;

        // Role is compulsory
        if (!role) {
            return res.status(400).json({
                success: false,
                message: 'Please enter role (admin, teacher, receptionist, student)',
            });
        }

        // Sirf admin he kisi ko bana sakta hai
        if (req.user?.user && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Sirf admin naye users bana sakta hai',
            });
        }

        // Email already hai?
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email is already registered.',
            });
        }

        // New user 
        const user = await User.create({
            fullName,
            email: email.toLowerCase(),
            password, // pre-save hook hash kar dega
            role,
        });

        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message.includes('duplicate')
                ? 'Email already taken'
                : err.message,
        });
    }
};

// ===== GET CURRENT USER (Logged in user ka data) =====
export const getMe = async (req, res) => {
    try {
        // req.user protect middleware se aya hai
        res.status(200).json({
            success: true,
            user: req.user,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};