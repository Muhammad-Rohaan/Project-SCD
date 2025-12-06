import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { restrictTo } from '../middleware/role.middleware.js';
import { restrictToOwnClass } from '../middleware/restrictToOwnClass.middleware.js';
import {
    markAttendance,
    getClassAttendance,
    getMyAttendance
} from '../controllers/attendance.controller.js';

const router = express.Router();

router.post('/', protect, restrictTo('teacher', 'admin'), restrictToOwnClass, markAttendance);
router.get('/class/:className', protect, restrictTo('teacher', 'admin', 'receptionist'), restrictToOwnClass, getClassAttendance);
router.get('/me', protect, restrictTo('student'), getMyAttendance);

export default router;