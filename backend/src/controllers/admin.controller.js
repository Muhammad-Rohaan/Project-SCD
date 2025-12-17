/**
 * =================================================================
 *                      Student CRUD Operations
 * =================================================================
 */

/**
 * Register a new student
 * /api/admin/az-students/register-student
 */
export const registerStudent = async (req, res) => {
    let user = null;
    try {
        const {
            fullName,
            email,
            password,
            receptionRegId,
            cnic,
            salary,
            joiningDate,
            contact,
            address
        } = req.body;

        const user = await register(null, null, { fullName, email, password, role: 'receptionist' });





        await ReceptionProfileModel.create([{
            userId: user._id,
            receptionistFullName: fullName,
            receptionRegId: receptionRegId.toUpperCase(),
            cnic,
            salary,
            joiningDate,
            contact,
            address
        }]);

        // Success response
        res.status(201).json({
            message: "Receptionist registered successfully",
            receptionRegId: receptionRegId.toUpperCase()
        });

    } catch (error) {
        console.error("Receptionist Registration Error:", error);

        // Manual Rollback
        if (user && user._id) {
            await UserModel.findByIdAndDelete(user._id);
        }

        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            const value = error.keyValue[field];
            let message = "Already exists";

            if (field === "email") message = "Email already registered";
            else if (field === "cnic") message = "CNIC already registered";
            else if (field === "receptionRegId") message = "Receptionist Registration ID already taken";

            return res.status(409).json({
                message: `Registration failed: ${message} (${value})`
            });
        }

        res.status(500).json({
            message: "An internal server error occurred during Receptionist registration.",
            error: error.message
        });
    }
}

export const removeReceptionist = async (req, res) => {
    try {

        const receptionRegId = req.params.receptionRegId.toUpperCase();
        const curRecp = await ReceptionProfileModel.findOne({ receptionRegId })

        if (!curRecp) {
            res.status(404).json({
                "msg": "No Data Found"
            });
        }

        const deletedRecp = await ReceptionProfileModel.deleteOne({
            receptionRegId
        });

        // del user
        await UserModel.findByIdAndDelete(curRecp.userId)


        res.status(200).json({
            "msg": `Deleted receptionist`
        })




    } catch (error) {
        res.status(400).json({
            "msg": "Err in deleting Receptionist",
            "error": error
        })
    }
}


// teacher Crud Operations

// api/admin/AZ-teachers/register-teacher
// api/admin/AZ-teachers/register-teacher
export const registerTeacher = async (req, res) => {
    let user = null;
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
            age,
            className,
            field,
        } = req.body;

        user = await register(null, null, { fullName, email, password, role: 'student' });

        await StudentProfile.create({
            userId: user._id,
            stdName: fullName,
            rollNo: rollNo.toUpperCase(),
            fatherName,
            fatherPhone,
            contact,
            address,
            age,
            className,
            field,
        });

        res.status(201).json({
            message: "Student registered successfully",
            rollNo: rollNo.toUpperCase(),
        });

    } catch (error) {
        console.error("Student Registration Error:", error);

        if (user && user._id) {
            await UserModel.findByIdAndDelete(user._id);
        }

        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            const value = error.keyValue[field];
            let message = "Already exists";

            if (field === "email") message = "Email already registered";
            else if (field === "rollNo") message = "Roll number already exists";

            return res.status(409).json({
                message: `Registration failed: ${message} (${value})`
            });
        }

        res.status(500).json({
            message: "An internal server error occurred during student registration.",
            error: error.message
        });
    }
};

// api/admin/az-reception/fetch-all-receptionists

export const fetchAllReceptionists = async (req, res) => {
    try {
        const receptionists = await ReceptionProfileModel.find();
        res.status(200).json({
            receptionists: receptionists
        });
    } catch (error) {
        res.status(400).json({
            "errMsg": "Failed to fetch receptionists"
        });
    }
};

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
};

/**
 * get teachers by class 
 * api/admin/az-teachers/fetch-teachers-byClass/:class
 */

export const fetchTeachersByClass = async (req, res) => {
    try {

        const classNumberFilter = Number(req.params.class);

        if (isNaN(classNumberFilter)) {
            res.status(400).json({
                "msg": "Class number must be entered"
            });
        }

        const curTeachers = await TeacherProfile.find({
            classes: classNumberFilter
        }); //.populate('userId', 'fullName email')


        res.status(200).json({
            "TotalCount": curTeachers.length,
            "Teachers": curTeachers
        });


    } catch (error) {
        res.status(500).json({ message: "Can not find By Class Errrrrr ", error: error.message });
    }
};

/**
 * get search teachers by class + subject 
 * /admin/az-teachers/fetch-teachers-by-class-and-subject/:class/:subject
 */

export const searchTeacherByClassAndSubject = async (req, res) => {
    try {

        const clsFilter = Number(req.params.class);
        const subjectFilter = req.params.subject.toLowerCase();

        if (isNaN(clsFilter)) {
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
        );  // .populate('userId', 'fullName email')

        res.status(200).json({
            "TotalCount": curTeacher.length,
            "Teachers": curTeacher
        });


    } catch (error) {
        res.status(500).json({ message: "Can not find By Class and subjetcs Errrrrr ", error: error.message });
    }
}

/**
 * update teacher
 * /admin/az-teachers/update-teacher/:teacherRegId
 */

export const updateTeacher = async (req, res) => {
    try {

        const { teacherRegId } = req.params;
        const updateData = req.body;

        const studentProfile = await StudentProfile.findOne({ rollNo });

        if (!studentProfile) {
            return res.status(404).json({ message: "Student not found" });
        }

        const { fullName, email, ...profileUpdates } = updateData;
        const userUpdates = { name: fullName, email };

        Object.keys(userUpdates).forEach(key => userUpdates[key] === undefined && delete userUpdates[key]);

        if (Object.keys(userUpdates).length > 0) {
            await UserModel.findByIdAndUpdate(studentProfile.userId, userUpdates, { new: true, runValidators: true });
        }

        // // Update TeacherProfile model
        // const updatedTeacherProfile = await TeacherProfile.findByIdAndUpdate(
        //     teacherProfile._id,
        //     profileUpdates,
        //     { new: true, runValidators: true }
        // ).populate('userId', 'fullName email isActive');

        // res.status(200).json({
        //     message: "Teacher updated successfully.",
        //     teacher: updatedTeacherProfile
        // });

        const teacherRegId = req.params.teacherRegId.toUpperCase();
        const updTeacherDoc = req.body;

        const updatedTeacherRecord = await TeacherProfile.findOneAndUpdate(
            {
                teacherRegId
            },
            updTeacherDoc,
            { new: true, runValidators: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "Teacher not found." });
        }

        const finalStudentProfile = await StudentProfile.findById(studentProfile._id).populate('userId', 'name email');

        res.status(200).json({
            message: "Student updated successfully.",
            student: finalStudentProfile
        });

    } catch (error) {
        console.error("Update Student Error:", error);
        res.status(500).json({
            message: "An error occurred while updating the student.",
            error: error.message
        });
    }
};

/**
 * update the specific field (patch)
 * 
 */

/**
 * Delete a student
 * /api/admin/az-students/delete-student/:studentRegId
 */
export const deleteStudentById = async (req, res) => {
    try {
        const rollNo = req.params.studentRegId.toUpperCase();
        const student = await StudentProfile.findOne({ rollNo });

        if (!student) {
            return res.status(404).json({ msg: "Student not found" });
        }

        await StudentProfile.deleteOne({ rollNo });
        await UserModel.findByIdAndDelete(student.userId);

        res.status(200).json({
            msg: "Student deleted successfully"
        });

    } catch (error) {
        res.status(400).json({
            "msg": "Error in deleting student",
            "error": error
        });
    }
};