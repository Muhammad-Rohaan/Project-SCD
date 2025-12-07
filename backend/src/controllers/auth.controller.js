import UserModel from "../models/User.model.js";
import StudentProfile from "../models/StudentProfile.model.js";
import TeacherProfile from "../models/TeacherProfile.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


export const register = async (req, res) => {
    try {

        const { fullName, email, password, role, isActive } = req.body;
        const encryptedPassword = await bcrypt.hash(password, 10);

        const newUser = new UserModel({
            fullName,
            email,
            password: encryptedPassword,
            role,
            isActive
        });

        await newUser.save();

        res.status(200).json({
            msg: `User registered successfully ${newUser.fullName}`

        });


    } catch (error) {
        res.status(401).json({
            msg: "An err occured in registering"
        });
    }
}

// Login

export const login = async (req, res) => {
    try {

        const { fullName, email, identifier, password } = req.body;

        let user;

        // 1. Try as Roll No (Student)
        const student = await StudentProfile.findOne({ rollNo: identifier.toUpperCase() }).populate('userId');
        if (student && student.userId) {
            user = student.userId;
            user.profileType = 'student';
            user.profile = student;
        }

        // 2. Try as TeacherRegID
        if (!user) {
            const teacher = await TeacherProfile.findOne({ teacherRegId: identifier.toUpperCase() }).populate('userId');
            if (teacher && teacher.userId) {
                user = teacher.userId;
                user.profileType = 'teacher';
                user.profile = teacher;
            }
        }

        // 3. Try as Email (Admin / Reception)
        if (!user) {
            user = await UserModel.findOne({
                email: identifier.toLowerCase(),
                role: { $in: ['admin', 'receptionist'] }
            }).select('+password');
            if (user) user.profileType = user.role;
        }

        if (!user || !(await user.comparePassword?.(password) || await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN
            }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                role: user.role,
                name: user.profile?.fullName || 'User',
                identifier: identifier,
                profileType: user.profileType
            }
        });


    } catch (error) {
        res.status(400).json({
            msg: "err in log in"
        })
    }
}



// no need to export here do it before the func statr

