// routes/fee.routes.js
import express from 'express';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { 
    collectFee, 
    getStudentFeeStatus
} from '../controllers/fees.controller.js';

const router = express.Router();

router.use(protect, authorize('receptionist', "admin"));  // check

// router.post('/create-voucher', createFeeVoucher);
router.post('/collect', collectFee);
router.get('/student/:rollNo', getStudentFeeStatus);


// router.get('/pending', getAllPendingFees);

export default router;