import StudentProfile from '../models/StudentProfile.model.js';
import User from '../models/User.model.js';

export const createStudent = async (req, res) => {
    try {
        const { fullName, email, password, rollNo, className, fatherName, fatherPhone } = req.body;

        const user = await User.create({
            fullName,
            email: email.toLowerCase(),
            password,
            role: 'student'
        });

        await StudentProfile.create({
            stdId: user._id,
            rollNo,
            className: className.toUpperCase(),
            fatherName,
            fatherPhone
        });

        res.status(201).json({
            success: true,
            message: 'Student created successfully'
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

export const getClassStudents = async (req, res) => {
    try {
        const students = await StudentProfile.find({
            className: req.params.className.toUpperCase()
        }).populate('stdId', 'fullName email').sort({ rollNo: 1 });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

export const getMyProfile = async (req, res) => {
    try {
        const profile = await StudentProfile.findOne({ stdId: req.user._id })
            .populate('stdId', 'fullName email');
        if (!profile) return res.status(404).json({ message: 'Profile not found' });
        res.json({ success: true, profile });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

export const getAllStudents = async (req, res) => {
    try {
        const students = await StudentProfile.find({})
            .populate('stdId', 'fullName email rollNo')
            .sort({ className: 1, rollNo: 1 });

        res.json({
            success: true,
            count: students.length,
            students
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};