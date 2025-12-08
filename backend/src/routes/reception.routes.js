import express from 'express';
import { protect, authorize } from '../middleware/auth.middleware.js';

// Import your reception controllers here
// Example: import { createStudentProfile, collectFee, handleInquiry } from '../controllers/reception.controller.js';

const router = express.Router();

// Apply protect and authorize middleware to all routes in this file
router.use(protect, authorize('receptionist'));


router.post('/admissions', (req, res) => res.json({ success: true, message: 'Student admission endpoint' }));


router.post('/fees', (req, res) => res.json({ success: true, message: 'Fee collection endpoint' }));


router.get('/students', (req, res) => res.json({ success: true, message: 'Student search endpoint' }));

export default router;