import express from 'express';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { register } from '../controllers/auth.controller.js';
import { 
    deleteTeacherById, 
    fetchAllReceptionists, 
    fetchAllTeachers, 
    fetchTeachersByClass, 
    registerReceptionist, 
    registerTeacher, 
    removeReceptionist, 
    searchTeacherByClassAndSubject, 
    updateTeacher,
    registerStudent,
    fetchAllStudents,
    fetchStudentById,
    updateStudent,
    deleteStudentById
} from '../controllers/admin.controller.js';


// Example: import { getDashboardStats, manageUser } from '../controllers/admin.controller.js';

const router = express.Router();

// Apply protect and authorize middleware to all routes in this file
router.use(protect, authorize('admin'));



router.get('/dashboard', (req, res) => res.json({ success: true, message: 'Welcome to the Admin Dashboard' }));


router.post('/register-user', register);  // not good ...
// creating reception routes

router.post('/az-reception/register-receptionist', registerReceptionist);
router.get('/az-reception/fetch-all-receptionists', fetchAllReceptionists);
router.delete('/az-reception/delete-receptionist/:receptionRegId', removeReceptionist);

/**
 * teachers creation in admin 
 * api/admin/...
 */

router.post('/az-teachers/register-teacher', registerTeacher);

router.get('/az-teachers/fetch-all-teachers', fetchAllTeachers);

router.get('/az-teachers/fetch-teachers-by-class/:class', fetchTeachersByClass);

router.get('/az-teachers/fetch-teachers-by-class-and-subject/:class/:subject', searchTeacherByClassAndSubject);  // GET /api/admin/az-teachers/fetch-teachers-by-class-and-subject/9/computer

router.put('/az-teachers/update-teacher/:teacherRegId', updateTeacher);

router.delete('/az-teachers/delete-teacher/:teacherRegId', deleteTeacherById);

/**
 * students creation in admin
 * api/admin/...
 */

router.post('/az-students/register-student', registerStudent);
router.get('/az-students/fetch-all-students', fetchAllStudents);
router.get('/az-students/fetch-student/:studentRegId', fetchStudentById);
router.put('/az-students/update-student/:studentRegId', updateStudent);
router.delete('/az-students/delete-student/:studentRegId', deleteStudentById);


router.get('/finances', (req, res) => res.json({ success: true, message: 'Financial reports endpoint' }));

export default router;