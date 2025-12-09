import express from 'express';
import { protect, authorize } from '../middleware/auth.middleware.js';

// Import your teacher controllers here
// Example: import { getMyProfile, updateMyProfile, markAttendance } from '../controllers/teacher.controller.js';

const router = express.Router();

// Apply protect and authorize middleware to all routes in this file
router.use(protect, authorize('teacher'));

/**
 * GET /api/teacher/profile
 * Get the profile of the currently logged-in teacher
 * Private (Teacher)
 */
router.get('/profile', (req, res) => res.json({ success: true, user: req.user }));

/**
 * POST /api/teacher/attendance
 * Mark student attendance
 * Private (Teacher)
 */
router.post('/attendance', (req, res) => res.json({ success: true, message: 'Attendance marked successfully' }));

/**
 * POST /api/teacher/results
 * Upload student results
 * Private (Teacher)
 */
router.post('/results', (req, res) => res.json({ success: true, message: 'Results uploaded successfully' }));

export default router;