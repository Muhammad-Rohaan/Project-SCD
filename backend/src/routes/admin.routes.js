import express from 'express';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { register } from '../controllers/auth.controller.js';
// Example: import { getDashboardStats, manageUser } from '../controllers/admin.controller.js';

const router = express.Router();

// Apply protect and authorize middleware to all routes in this file
router.use(protect, authorize('admin'));

/**
 * @route   GET /api/admin/dashboard
 * @desc    Get statistics for the admin dashboard
 * @access  Private (Admin)
 */
router.get('/dashboard', (req, res) => res.json({ success: true, message: 'Welcome to the Admin Dashboard' }));

/**
 * @route   POST /api/admin/register-user
 * @desc    Register a new user (student, teacher, etc.)
 * @access  Private (Admin)
 */
router.post('/register-user', register);

/**
 * @route   GET /api/admin/finances
 * @desc    Get overall financial reports
 * @access  Private (Admin)
 */
router.get('/finances', (req, res) => res.json({ success: true, message: 'Financial reports endpoint' }));

export default router;