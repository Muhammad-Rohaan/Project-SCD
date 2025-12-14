import UserModel from "../models/User.model.js";
import StudentProfile from "../models/StudentProfile.model.js";
import Fee from "../models/Fee.model.js";
import { register } from "./auth.controller.js";
import Attendance from "../models/Attendance.model.js";
import TeacherProfile from "../models/TeacherProfile.model.js";
import ReceptionProfileModel from "../models/ReceptionProfile.model.js";


// receptions other methods (fees collection, attendance)

export const collectFee = async (req, res) => {
    try {

        const { rollNo, month, year, feesAmount } = req.body;

        if (!rollNo || !month || !year || !feesAmount) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }

        const student = await StudentProfile.findOne({
            rollNo: rollNo.toUpperCase()
        });

        if (!student) {
            res.status(404).json({ message: "Student not found" });
            return;
        }

        let fees = await Fee.findOne({
            stdId: student._id,
            month,
            year
        });

        if(!fees) {
            fees = new Fee(
                {
                    stdId: student._id,
                    rollNo: student.rollNo,
                    studentName: student.stdName,
                    className: student.className,
                    month,
                    year,
                    feesAmount,
                    collectedBy: req.user.fullName,
                    collectedDate: new Date()
                }
            );
        }

        fees.feesAmount = feesAmount;
        fees.collectedBy = req.user.fullName || "Receptionist";
        fees.collectedDate = new Date();

        await fees.save();

        if(fees.feesAmount > 0) {
            fees.status = 'paid';
            await fees.save();
        } else {
            fees.status = 'pending';
            await fees.save();
        }


        res.status(200).json({
            message: "Fee collected successfully",
            fees
        });

    } catch (error) {
        res.status(500).json({ message: "Error collecting fee", error: error.message });
    }
}

// 3. Get Student Fee Status by Roll No
export const getStudentFeeStatus = async (req, res) => {
    try {
        const { rollNo } = req.params;
        const student = await StudentProfile.findOne({ rollNo: rollNo.toUpperCase() });

        if (!student) return res.status(404).json({ message: "Student not found" });

        const fees = await Fee.find({ studentId: student._id }).sort({ month: -1 });

        res.status(200).json({
            student: {
                name: student.stdName,
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
            .sort({ month: 1 });

        // The 'studentId' in Fee.model.js is a String, not an ObjectId, so .populate() won't work as expected.
        // If you need student details, you would have to fetch them separately or change the schema.
        // For now, I'm removing the populate to prevent potential errors.

        res.status(200).json({ total: pending.length, pending });
    } catch (error) {
        res.status(500).json({ message: "Error fetching pending fees" });
    }
}