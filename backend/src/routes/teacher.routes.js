import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { restrictTo } from '../middleware/role.middleware.js';
import {
    getMyProfile,
    getMyClassStudents,
    getMyAttendanceRecords,
    getMyUploadedResults
} from '../controllers/teacher.controller.js';

const router = express.Router();

router.use(protect, restrictTo('teacher', 'admin'));
router.get('/me', getMyProfile);
router.get('/my-class/students', getMyClassStudents);
router.get('/my-attendance', getMyAttendanceRecords);
router.get('/my-results', getMyUploadedResults);

export default router;