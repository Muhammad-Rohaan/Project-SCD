import UserModel from "../models/User.model.js";
// import StudentProfile from "../models/StudentProfile.model.js";
import TeacherProfile from "../models/TeacherProfile.model.js";


// teacher Crud Operations

// api/admin/register-teacher/create

export const registerTeacher = async (req, res) => {
    try {
        const {
            fullName,
            email,
            password,
            teacherRegId,
            cnic,
            qualification,
            salary,
            joiningDate,
            subjects,
            contact,
            address,
            age
        } = req.body;

        
        





    } catch (error) {
        res.status(400)
    }
}