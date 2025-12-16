import express from 'express'
import { authorize, protect } from '../middleware/auth.middleware';


const router = express.Router();

router.use(protect, authorize("receptionist"));

// /api/reception/attendance

// router.post('/markAttendance', )
// Check FINE 



export default router;