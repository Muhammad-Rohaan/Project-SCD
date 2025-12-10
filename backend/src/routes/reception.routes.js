import express from 'express';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { registerStudent, fetchAllStudents, fetchStudentByRollNo, fetchStudentsByClass, updateStudent, deleteStudent } from '../controllers/reception.controller.js';   


// Example: import { createStudentProfile, collectFee, handleInquiry } from '../controllers/reception.controller.js';

const router = express.Router();

// Apply protect and authorize middleware to all routes in this file
router.use(protect, authorize('receptionist'));


// router.post('/admissions', );

// reception.routes.js
router.post('/az-students/admissions/register-student', registerStudent);

router.get('/az-students/fetch-all-students', fetchAllStudents);

router.get('/az-students/fetch-student-by-rollno/:rollNo', fetchStudentByRollNo);

router.get('/az-students/fetch-students-by-class/:className', fetchStudentsByClass);

router.patch('/az-students/update-student/:rollNo', updateStudent);

router.delete('/az-students/delete-student/:rollNo', deleteStudent);


router.post('/fees', (req, res) => res.json({ success: true, message: 'Fee collection endpoint' }));


router.get('/students', (req, res) => res.json({ success: true, message: 'Student search endpoint' }));

export default router;