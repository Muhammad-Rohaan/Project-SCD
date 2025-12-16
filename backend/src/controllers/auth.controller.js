import UserModel from "../models/User.model.js";
import StudentProfile from "../models/StudentProfile.model.js";
import TeacherProfile from "../models/TeacherProfile.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

/*
        OLD BUT WORKING WITHOUT TRANSACTIONS
export const register = async (req, res, helperData) => {
    // _________________________________

    const session = await mongoose.startSession();
    session.startTransaction();
    // _________________________________

    try {
        // This allows the function to be used as a route handler (req, res)
        // or as a helper function by passing data in the third argument.
        const isRouteHandler = req && req.body;
        const userData = isRouteHandler ? req.body : helperData;
        const { fullName, email, password, role } = userData;

        // Basic validation
        if (!fullName || !email || !password || !role) {
            const message = "Please provide all required fields: fullName, email, password, role.";
            return isRouteHandler ? res.status(400).json({ msg: message }) : Promise.reject(new Error(message));
        }

        const encryptedPassword = await bcrypt.hash(password, 10);

        const newUser = new UserModel({
            fullName,
            email,
            password: encryptedPassword,
            role,
            // _________________________________
        }, { session });
        // _________________________________


        await newUser.save();

        // _________________________________
        await session.commitTransaction();
        session.endSession();
        // _________________________________


        if (isRouteHandler) {
            return res.status(201).json({
                msg: `User '${newUser.fullName}' registered successfully.`,
                user: { id: newUser._id, role: newUser.role }
            });
        }

        // If used as a helper, return the new user
        return newUser;

    } catch (error) {
        console.error("Registration Error:", error);
        const isRouteHandler = res && typeof res.status === 'function';

        if (error.code === 11000) { // Duplicate key error
            if (isRouteHandler) return res.status(409).json({ msg: "Email already exists." });
            throw error; // Re-throw for the calling controller to handle
        }

        if (isRouteHandler) return res.status(500).json({ msg: "An error occurred during registration." });
        throw error; // Re-throw for the calling controller to handle
    }
}
*/


/**
 * ONE MORE REGISTER STUDENT NEEDED 
 * WHERE EMAIL NOT REQUIRE FOR STUDENTS ONLY 
 */



export const register = async (req, res, helperData) => {
    const isRouteHandler = req && req.body;

    try {
        
        const userData = isRouteHandler ? req.body : helperData;
        const { fullName, email, password, role } = userData;

        if (!fullName || !email || !password || !role) {
            throw new Error("Please provide all required fields: fullName, email, password, role.");
        }

        // Hash password
        const encryptedPassword = await bcrypt.hash(password, 10);

        // Yeh sahi tareeka hai transaction mein
        const [newUser] = await UserModel.create([{
            fullName,
            email: email.toLowerCase(),
            password: encryptedPassword,
            role: role.toLowerCase(),
        }]);

        if (isRouteHandler) {
            return res.status(201).json({
                message: `${role} registered successfully`,
                user: { id: newUser._id, name: newUser.fullName, role: newUser.role }
            });
        }

        return newUser; 

    } catch (error) {
        console.error("Registration Error:", error);

        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return isRouteHandler
                ? res.status(409).json({ message: `${field} already exists` })
                : Promise.reject(error);
        }

        const msg = error.message || "Registration failed";
        return isRouteHandler
            ? res.status(500).json({ message: msg })
            : Promise.reject(error);
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

        // JWT_COOKIE_EXPIRES_IN ko days se milliseconds mein convert karna
        const cookieExpiresInDays = parseInt(process.env.JWT_COOKIE_EXPIRES_IN, 10);

        // NAYA COOKIE CODE:
        const options = {
            expires: new Date(Date.now() + 24 * 60 * 60 * 10000), // 1 day
            httpOnly: true, // Frontend JS cannot access this security.
            secure: process.env.NODE_ENV === 'production',
            // HTTPS only in production
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
            // Agar frontend aur backend alag domains par hon
        };

        // 2. Response: Token ko Cookie mein daalo aur User ka data JSON body mein bhejo
        res.status(200).cookie('token', token, options).json({
            message: 'Login successful',
            // YEH OBJECT FRONTEND KO ZAROORI HAI:
            user: {
                id: user._id,
                name: user.fullName,
                role: user.role,
                profileType: profileType, // 'student' ya 'teacher' ya 'admin' etc.
                profile: profile
            }
        });

        // res.json({
        //     message: 'Login successful',
        //     token,
        //     user: {
        //         id: user._id,
        //         name: user.fullName,
        //         role: user.role,
        //         profileType: profileType,
        //         profile: profile
        //     }
        // });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "An internal server error occurred." });
    }
}

// LOGOUT

export const logout = async (req, res) => {
    try {
        res.cookie('token', 'none', {
            maxAge: 0,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
        });

        // Successful response bhej dein
        res.status(200).json({
            success: true,
            message: "User logged out successfully"
        });

    } catch (error) {
        // Agar koi unexpected server error ho jaye to handle karein
        console.error("Logout error:", error);
        res.status(500).json({
            success: false,
            message: "An internal server error occurred during logout."
        });
    }
};
