import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { restrictTo } from '../middleware/role.middleware.js';
import {
    createFeeRecord,
    payFee,
    getStudentFees
} from '../controllers/fee.controller.js';

const router = express.Router();

router.post('/', protect, restrictTo('admin', 'receptionist'), createFeeRecord);
router.patch('/:id/pay', protect, restrictTo('receptionist', 'admin'), payFee);
router.get('/student/:studentId', protect, restrictTo('student', 'admin', 'receptionist'), getStudentFees);

export default router;