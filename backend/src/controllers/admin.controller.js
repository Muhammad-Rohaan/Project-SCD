import UserModel from "../models/User.model.js";
// import StudentProfile from "../models/StudentProfile.model.js";
import TeacherProfile from "../models/TeacherProfile.model.js";


// teacher Crud Operations

// api/admin/AZ-teachers/register-teacher
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
            classes,
            contact,
            address,
            age
        } = req.body;

        const user = await UserModel.create({
            fullName: fullName,
            email,
            password,
            role: 'teacher'
        });

        // 2. TeacherProfile banao
        await TeacherProfile.create({
            userId: user._id,
            teacherRegId: teacherRegId.toUpperCase(),
            cnic,
            qualification,
            salary,
            joiningDate,
            subjects,
            classes,
            contact,
            address,
            age
        });

        res.status(201).json({
            "message": "Teacher registered successfully",
            "teacherRegId": teacherRegId.toUpperCase()
        });


    } catch (error) {
        res.status(400).json({
            "errMsg": "Teacher registration failed"
        });
    }
}

// api/admin/az-teachers/fetch-all-teachers
export const fetchAllTeachers = async (req, res) => {
    try {
        const teachers = await TeacherProfile.find();
        res.status(200).json({
            "teachers": teachers
        });
    } catch (error) {
        res.status(400).json({
            "errMsg": "Teacher fetching failed"
        });
    }
}

/**
 * get teachers by class 
 * api/admin/az-teachers/fetch-teachers-byClass/:class
 */

export const fetchTeachersByClass = async (req, res) => {
    try {

        const classNumberFilter = Number(req.params.class);

        if (!classNumberFilter) {   // if not work see the below func
            res.status(400).json({
                "msg": "Class number must be entered"
            });
        }

        const curTeachers = await TeacherProfile.find({
            classes: classNumberFilter
        });


        res.status(200).json({
            "TotalCount": curTeachers.length,
            "Teachers": curTeachers
        });


    } catch (error) {
        res.status(500).json({ message: "Can not find By Class Errrrrr ", error: error.message });
    }
}

/**
 * get search teachers by class + subject 
 * /admin/az-teachers/fetch-teachers-by-class-and-subject/:class/:subject
 */

export const searchTeacherByClassAndSubject = async (req, res) => {
    try {

        const clsFilter = Number(req.params.class);
        const subjectFilter = req.params.subject.toLowerCase();

        if (isNaN(classNumberFilter)) {
            res.status(400).json({
                "msg": "Class number must be entered"
            });
        }


        const curTeacher = await TeacherProfile.find(
            {
                classes: clsFilter,
                subjects: {
                    $in: [subjectFilter]
                }
            }
        );

        res.status(200).json({
            "TotalCount": curTeacher.length,
            "Teachers": curTeacher
        });


    } catch (error) {
        res.status(500).json({ message: "Can not find By Class and subjetcs Errrrrr ", error: error.message });
    }
}

