import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { restrictTo } from '../middleware/role.middleware.js';
import { restrictToOwnClass } from '../middleware/restrictToOwnClass.middleware.js';
import {
    createStudent,
    getAllStudents,
    getClassStudents,
    getMyProfile
} from '../controllers/student.controller.js';

const router = express.Router();

router.post('/', protect, restrictTo('admin', 'receptionist'), createStudent);
router.get('/', protect, restrictTo('admin', 'receptionist'), getAllStudents);
router.get('/class/:className', protect, restrictTo('teacher', 'admin', 'receptionist'), restrictToOwnClass, getClassStudents);
router.get('/me', protect, restrictTo('student'), getMyProfile);

export default router;