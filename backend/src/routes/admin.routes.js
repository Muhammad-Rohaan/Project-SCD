import express from 'express';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { register } from '../controllers/auth.controller.js';
import { fetchAllTeachers, fetchTeachersByClass, registerTeacher } from '../controllers/admin.controller.js';


// Example: import { getDashboardStats, manageUser } from '../controllers/admin.controller.js';

const router = express.Router();

// Apply protect and authorize middleware to all routes in this file
router.use(protect, authorize('admin'));



router.get('/dashboard', (req, res) => res.json({ success: true, message: 'Welcome to the Admin Dashboard' }));


router.post('/register-user', register);

router.post('/az-teachers/register-teacher', registerTeacher)

router.get('/az-teachers/fetch-all-teachers', fetchAllTeachers)

router.get('/az-teachers/fetch-teachers-by-class/:class', fetchTeachersByClass)

router.get('/az-teachers/fetch-teachers-by-class-and-subject/:class/:subject', )  // GET /api/admin/az-teachers/fetch-teachers-by-class-and-subject/9/computer



router.get('/finances', (req, res) => res.json({ success: true, message: 'Financial reports endpoint' }));

export default router;