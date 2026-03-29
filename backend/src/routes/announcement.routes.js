import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/auth.middleware.js';
import {
    createAnnouncement,
    getAnnouncements,
    deleteAnnouncement
} from '../controllers/announcement.controller.js';

const router = express.Router();

router.post('/create-new-announcement', protect, authorize('admin', 'teacher', 'receptionist'), createAnnouncement);
router.get('/', protect, getAnnouncements);
// router.delete('/:id', protect, authorize('admin'), deleteAnnouncement);

export default router;