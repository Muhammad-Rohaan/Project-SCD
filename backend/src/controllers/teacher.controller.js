import TeacherProfile from "../models/TeacherProfile.model.js";
import StudentProfile from "../models/StudentProfile.model.js";
import Attendance from '../models/Attendance.model.js';
import ResultImage from '../models/ResultImage.model.js';

// Teacher apna profile dekh sakta hai
export const getMyProfile = async (req, res) => {
    try {
        const profile = await TeacherProfile.findOne({ userId: req.user._id })
            .populate('userId', 'fullname email');

        if (!profile) {
            return res.status(404).json({ message: 'Teacher profile not found' });
        }

        res.json({
            success: true,
            profile
        });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Teacher apni class ke students dekh sakta hai
export const getMyClassStudents = async (req, res) => {
    try {
        const teacher = await TeacherProfile.findOne({ userId: req.user._id });
        if (!teacher || !teacher.className) {
            return res.status(404).json({ message: 'No class assigned to you' });
        }

        const students = await StudentProfile.find({ className: teacher.className })
            .select('stdId fullName rollNo fatherName fatherPhone')
            .sort({ rollNo: 1 });

        res.json({
            success: true,
            className: teacher.className,
            count: students.length,
            students
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Teacher nai jo Attendance mark ki wo dekh sake
export const getMyAttendanceRecords = async (req, res) => {
    try {
        const records = await Attendance.find({ markedBy: req.user._id })
            .sort({ date: -1 })
            .limit(100);

        res.json({
            success: true,
            count: records.length,
            data: records
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Teacher nai jo results upload kiyey hai
export const getMyUploadedResults = async (req, res) => {
    try {
        const results = await ResultImage.find({ uploadedBy: req.user._id })
            .sort({ uploadedAt: -1 });

        res.json({
            success: true,
            count: results.length,
            data: results
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};