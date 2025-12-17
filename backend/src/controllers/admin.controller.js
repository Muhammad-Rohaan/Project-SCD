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
            rollNo,
            fatherName,
            fatherPhone,
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

/**
 * Fetch all students
 * /api/admin/az-students/fetch-all-students
 */
export const fetchAllStudents = async (req, res) => {
    try {
        const students = await StudentProfile.find().populate('userId', 'name email');
        res.status(200).json({
            students: students
        });
    } catch (error) {
        res.status(400).json({
            "errMsg": "Failed to fetch students"
        });
    }
};

/**
 * Fetch a single student by registration ID
 * /api/admin/az-students/fetch-student/:studentRegId
 */
export const fetchStudentById = async (req, res) => {
    try {
        const rollNo = req.params.studentRegId.toUpperCase();
        const student = await StudentProfile.findOne({ rollNo }).populate('userId', 'name email');
        if (!student) {
            return res.status(404).json({ msg: "Student not found" });
        }
        res.status(200).json({ student });
    } catch (error) {
        res.status(500).json({ message: "Error fetching student", error: error.message });
    }
};

/**
 * Update a student's profile
 * /api/admin/az-students/update-student/:studentRegId
 */
export const updateStudent = async (req, res) => {
    try {
        const rollNo = req.params.studentRegId.toUpperCase();
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

        if (Object.keys(profileUpdates).length > 0) {
            await StudentProfile.findByIdAndUpdate(
                studentProfile._id,
                profileUpdates,
                { new: true, runValidators: true }
            );
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