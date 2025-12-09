import express from 'express';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { register } from '../controllers/auth.controller.js';

import { registerTeacher } from '../controllers/admin.controller.js';
// Example: import { getDashboardStats, manageUser } from '../controllers/admin.controller.js';

const router = express.Router();

// Apply protect and authorize middleware to all routes in this file
router.use(protect, authorize('admin'));



router.get('/dashboard', (req, res) => res.json({ success: true, message: 'Welcome to the Admin Dashboard' }));


router.post('/register-user', register);

router.post('/register-teacher/create', registerTeacher)


router.get('/finances', (req, res) => res.json({ success: true, message: 'Financial reports endpoint' }));

export default router;