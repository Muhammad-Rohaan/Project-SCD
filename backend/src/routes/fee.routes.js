// routes/fee.routes.js
import express from 'express';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { 
    collectFee, 
    getStudentFeeStatus,
    getAllPendingFees,
    getTotalRevenue,
    getAllTransactions
} from '../controllers/fees.controller.js';

const router = express.Router();

// Receptionist routes
router.post('/collect', protect, authorize('receptionist'), collectFee);
router.get('/student/:rollNo', protect, authorize('receptionist'), getStudentFeeStatus);

// Admin routes
router.get('/pending', protect, authorize('admin'), getAllPendingFees);
router.get('/revenue', protect, authorize('admin'), getTotalRevenue);
router.get('/transactions', protect, authorize('admin'), getAllTransactions);

export default router;