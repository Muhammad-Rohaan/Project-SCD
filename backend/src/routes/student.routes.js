import express from 'express';
import { protect, authorize } from '../middleware/auth.middleware.js';

// Import your student controllers here
// Example: import { getMyProfile, getMyAttendance, getMyResults } from '../controllers/student.controller.js';

const router = express.Router();

// Apply protect and authorize middleware to all routes in this file
router.use(protect, authorize('student'));

/**
 * @route   GET /api/student/profile
 * @desc    Get the profile of the currently logged-in student
 * @access  Private (Student)
 */
router.get('/profile', (req, res) => res.json({ success: true, user: req.user }));

/**
 * @route   GET /api/student/attendance
 * @desc    Get the attendance record for the logged-in student
 * @access  Private (Student)
 */
router.get('/attendance', (req, res) => res.json({ success: true, message: 'Your attendance record' }));

/**
 * @route   GET /api/student/fees
 * @desc    Get the fee status for the logged-in student
 * @access  Private (Student)
 */
router.get('/fees', (req, res) => res.json({ success: true, message: 'Your fee status' }));


export default router;