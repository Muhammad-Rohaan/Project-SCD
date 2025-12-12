// routes/fee.routes.js
import express from 'express';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { 
    createFeeVoucher, 
    collectFee, 
    getStudentFeeStatus,
    getAllPendingFees 
} from '../controllers/reception.controller.js';

const router = express.Router();

router.use(protect, authorize('receptionist'));

// router.post('/create-voucher', createFeeVoucher);
router.post('/collect/:studentId/:month', collectFee);
router.get('/student/:rollNo', getStudentFeeStatus);
router.get('/pending', getAllPendingFees);

export default router;