import UserModel from "../models/User.model.js";
import StudentProfile from "../models/StudentProfile.model.js";
import TeacherProfile from "../models/TeacherProfile.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


export const register = async (req, res) => {
    const { fullName, email, password, role } = req.body;

    // Basic validation
    if (!fullName || !email || !password || !role) {
        
        return res.status(400).json({ msg: "Please provide all required fields: fullName, email, password, role." });
    }

    try {
        const encryptedPassword = await bcrypt.hash(password, 10);

        const newUser = new UserModel({
            fullName,
            email,
            password: encryptedPassword,
            role
            // isActive is true by default
        });

        await newUser.save();

        res.status(201).json({
            msg: `User '${newUser.fullName}' registered successfully.`,
            user: {
                id: newUser._id,
                role: newUser.role
            }
        });

    } catch (error) {
        console.error("Registration Error:", error);
        if (error.code === 11000) { // Duplicate key error
            return res.status(409).json({ msg: "Email already exists." });
        }
        res.status(500).json({ msg: "An error occurred during registration." });
    }
}

// Login

export const login = async (req, res) => {
    const { email, identifier, password } = req.body;

    if (!(email || identifier) || !password) {
        return res.status(400).json({ message: "Please provide login credentials (email or identifier) and password." });
    }

    try {
        let user;
        let profile = null;
        let profileType = '';

        // 1. Try to find as Student or Teacher via identifier
        if (identifier) {
            const upperIdentifier = identifier.toUpperCase();
            const studentProfile = await StudentProfile.findOne({ rollNo: upperIdentifier });
            if (studentProfile) {
                user = await UserModel.findById(studentProfile.userId).select('+password');
                if (user) {
                    profile = studentProfile;
                    profileType = 'student';
                }
            } else {
                const teacherProfile = await TeacherProfile.findOne({ teacherRegId: upperIdentifier });
                if (teacherProfile) {
                    user = await UserModel.findById(teacherProfile.userId).select('+password');
                    profile = teacherProfile;
                    profileType = 'teacher';
                }
            }
        }

        // 2. If not found via identifier, try as Admin/Receptionist via email
        if (!user) {
            if (!email) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            user = await UserModel.findOne({
                email: email.toLowerCase(),
                role: { $in: ['admin', 'receptionist'] }
            }).select('+password');

            if (user) {
                profileType = user.role;
                // Create a synthetic profile for admin/receptionist for a consistent response structure
                profile = {
                    fullName: user.fullName,
                    email: user.email,
                };
            }
        }

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.fullName,
                role: user.role,
                profileType: profileType,
                profile: profile
            }
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "An internal server error occurred." });
    }
}
