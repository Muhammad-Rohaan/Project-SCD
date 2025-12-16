import UserModel from "../models/User.model.js";
import StudentProfile from "../models/StudentProfile.model.js";
import Fee from "../models/Fee.model.js";
import { register } from "./auth.controller.js";
import Attendance from "../models/Attendance.model.js";
import TeacherProfile from "../models/TeacherProfile.model.js";
import ReceptionProfileModel from "../models/ReceptionProfile.model.js";
import mongoose from "mongoose";

// POST /api/reception/az-students/register-student
export const registerStudent = async (req, res) => {
    let newUser = null;
    try {
        const {
            fullName,
            email = "temp@gmail.com",
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

        newUser = await register(null, null, { fullName, email, password, role: 'student' });


        // Step 2: Create StudentProfile
        await StudentProfile.create([{
            userId: newUser._id,
            rollNo: rollNo.toUpperCase(),
            stdName: fullName,
            fatherName,
            fatherPhone,
            contact,
            address,
            age,
            className: className.toUpperCase(),
            field
        }]);

        res.status(201).json({
            message: "Student registered successfully",
            rollNo: rollNo.toUpperCase()
        });

    } catch (error) {
        console.error("Student Registration Error:", error);

        // Manual Rollback: If user was created but profile failed, delete the user.
        if (newUser && newUser._id) {
            await UserModel.findByIdAndDelete(newUser._id);
        }

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

        const student = await StudentProfile.findOne({ rollNo });

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

        const students = await StudentProfile.find({ className });

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

//  /api/reception/az-students/update-student/:rollNo
export const updateStudent = async (req, res) => {
    try {

        // patch
        // const rollNo = req.params.rollNo.toUpperCase();
        // const updateData = req.body;

        // if (Object.keys(updateData).length === 0) {
        //     return res.status(400).json({ message: "No update data provided." });
        // }

        // // Find student profile
        // const studentProfile = await StudentProfile.findOne({ rollNo });
        // if (!studentProfile) {
        //     return res.status(404).json({ message: "Student not found." });
        // }

        // // Separate updates: User fields vs Profile fields
        // const { fullName, email, isActive, ...profileUpdates } = updateData;

        // // Update User if any user fields are provided
        // if (fullName || email || isActive !== undefined) {
        //     await UserModel.findByIdAndUpdate(
        //         studentProfile.userId,
        //         { fullName, email, isActive },
        //         { new: true, runValidators: true }
        //     );
        // }

        // // Always update profile fields (even if empty object, it won't change anything)
        // const updatedProfile = await StudentProfile.findByIdAndUpdate(
        //     studentProfile._id,
        //     { $set: profileUpdates },
        //     { new: true, runValidators: true }
        // ).populate('userId', 'fullName email isActive');

        const rollNo = req.body.params.toUpperCase();
        const updatedStdDoc = req.body;

        const updatedStd = await StudentProfile.findOneAndUpdate(
            {
                rollNo
            },
            updatedStdDoc,
            {
                new: true, runValidators: true
            }
        )
        
        if (!updatedStd) {
            return res.status(404).json({ message: "Student not found." });
        }



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

