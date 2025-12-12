import UserModel from "../models/User.model.js";
import StudentProfile from "../models/StudentProfile.model.js";
import Fee from "../models/Fee.model.js";
import Attendance from "../models/Attendance.model.js";
import TeacherProfile from "../models/TeacherProfile.model.js";
import ReceptionProfileModel from "../models/ReceptionProfile.model.js";
import mongoose from "mongoose";

// POST /api/reception/az-students/register-student
export const registerStudent = async (req, res) => {
    try {
        const {
            fullName,
            email,
            password,
            rollNo,
            fatherName,
            fatherPhone,
            contact,
            address,
            age,
            className,
            field
        } = req.body;

        // Step 1: Create User with role 'student'
        const user = await UserModel.create({
            fullName,
            email,
            password,
            role: 'student'
        });

        // Step 2: Create StudentProfile
        await StudentProfile.create({
            userId: user._id,
            rollNo: rollNo.toUpperCase(),
            fatherName,
            fatherPhone,
            contact,
            address,
            age,
            className: className.toUpperCase(),
            field
        });

        res.status(201).json({
            message: "Student registered successfully",
            rollNo: rollNo.toUpperCase()
        });

    } catch (error) {
        console.error("Student Registration Error:", error);

        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            const value = error.keyValue[field];
            let message = "Already exists";

            if (field === "email") message = "Email already registered";
            else if (field === "rollNo") message = "Roll Number already taken";
            else if (field === "fatherPhone") message = "Father phone already used";

            return res.status(409).json({
                message: `Registration failed: ${message} (${value})`
            });
        }

        res.status(500).json({
            message: "An internal server error occurred during student registration.",
            error: error.message
        });
    }
}

// GET /api/reception/az-students/fetch-all-students
export const fetchAllStudents = async (req, res) => {
    try {
        const students = await StudentProfile.find()
            .populate('userId', 'fullName email isActive');

        res.status(200).json({
            total: students.length,
            students
        });
    } catch (error) {
        console.error("Fetch All Students Error:", error);
        res.status(500).json({ message: "Failed to fetch students", error: error.message });
    }
}

// GET /api/reception/az-students/fetch-student-by-rollno/:rollNo
export const fetchStudentByRollNo = async (req, res) => {
    try {
        const rollNo = req.params.rollNo.toUpperCase();

        const student = await StudentProfile.findOne({ rollNo })
            .populate('userId', 'fullName email isActive');

        if (!student) {
            return res.status(404).json({ message: "Student not found with this Roll No." });
        }

        res.status(200).json({ student });
    } catch (error) {
        console.error("Fetch Student By RollNo Error:", error);
        res.status(500).json({ message: "Error fetching student", error: error.message });
    }
}

// GET /api/reception/az-students/fetch-students-by-class/:className
export const fetchStudentsByClass = async (req, res) => {
    try {
        const className = req.params.className.toUpperCase();

        const students = await StudentProfile.find({ className })
            .populate('userId', 'fullName email isActive')
            .sort({ rollNo: 1 });

        res.status(200).json({
            total: students.length,
            class: className,
            students
        });
    } catch (error) {
        console.error("Fetch Students By Class Error:", error);
        res.status(500).json({ message: "Error fetching students by class", error: error.message });
    }
}

// PATCH /api/reception/az-students/update-student/:rollNo
export const updateStudent = async (req, res) => {
    try {
        const rollNo = req.params.rollNo.toUpperCase();
        const updateData = req.body;

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "No update data provided." });
        }

        // Find student profile
        const studentProfile = await StudentProfile.findOne({ rollNo });
        if (!studentProfile) {
            return res.status(404).json({ message: "Student not found." });
        }

        // Separate updates: User fields vs Profile fields
        const { fullName, email, isActive, ...profileUpdates } = updateData;

        // Update User if any user fields are provided
        if (fullName || email || isActive !== undefined) {
            await UserModel.findByIdAndUpdate(
                studentProfile.userId,
                { fullName, email, isActive },
                { new: true, runValidators: true }
            );
        }

        // Always update profile fields (even if empty object, it won't change anything)
        const updatedProfile = await StudentProfile.findByIdAndUpdate(
            studentProfile._id,
            { $set: profileUpdates },
            { new: true, runValidators: true }
        ).populate('userId', 'fullName email isActive');

        res.status(200).json({
            message: "Student updated successfully",
            student: updatedProfile
        });

    } catch (error) {
        console.error("Update Student Error:", error);

        if (error.code === 11000) {
            return res.status(409).json({
                message: "Update failed: Duplicate value detected (Email or Roll No already exists)."
            });
        }

        res.status(500).json({
            message: "An error occurred while updating the student.",
            error: error.message
        });
    }
}

// DELETE /api/reception/az-students/delete-student/:rollNo
export const deleteStudent = async (req, res) => {
    try {
        const rollNo = req.params.rollNo.toUpperCase();

        const studentProfile = await StudentProfile.findOne({ rollNo });
        if (!studentProfile) {
            return res.status(404).json({ message: "Student not found with this Roll No." });
        }

        // Delete StudentProfile first
        await StudentProfile.deleteOne({ _id: studentProfile._id });

        // Then delete associated User
        await UserModel.findByIdAndDelete(studentProfile.userId);

        res.status(200).json({
            message: "Student deleted successfully",
            deletedRollNo: rollNo
        });

    } catch (error) {
        console.error("Delete Student Error:", error);
        res.status(500).json({
            message: "Error deleting student",
            error: error.message
        });
    }
}

// receptions other methods (fees collection, attendance)

export const collectFee = async (req, res) => {
    try {
        const { studentId, month } = req.params;
        const { paid_Amount } = req.body;

        const fee = await Fee.findOne({ studentId, month });

        if (!fee) {
            return res.status(404).json({ message: "Fee record not found" });
        }

        if (fee.status === 'paid') {
            return res.status(400).json({ message: "Fee already paid!" });
        }

        fee.paid_Amount = paid_Amount || fee.amount;
        fee.status = fee.paid_Amount >= fee.amount ? 'paid' : 'pending';
        fee.collectedBy = req.user.fullName || req.user.email;

        await fee.save();

        res.status(200).json({
            message: "Fee collected successfully",
            fee
        });

    } catch (error) {
        res.status(500).json({ message: "Error collecting fee", error: error.message });
    }
}

// 3. Get Student Fee Status by Roll No
export const getStudentFeeStatus = async (req, res) => {
    try {
        const { rollNo } = req.params;
        const student = await StudentProfile.findOne({ rollNo: rollNo.toUpperCase() }).populate('userId');

        if (!student) return res.status(404).json({ message: "Student not found" });

        const fees = await Fee.find({ studentId: student._id }).sort({ month: -1 });

        res.status(200).json({
            student: {
                name: student.userId.fullName,
                rollNo: student.rollNo,
                className: student.className
            },
            fees
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching fee status" });
    }
}

// 4. Get All Pending Fees (Receptionist Dashboard)
export const getAllPendingFees = async (req, res) => {
    try {
        const pending = await Fee.find({ status: { $ne: 'paid' } })
            .populate('studentId', 'rollNo className')
            .sort({ month: 1 });

        res.status(200).json({ total: pending.length, pending });
    } catch (error) {
        res.status(500).json({ message: "Error fetching pending fees" });
    }
}