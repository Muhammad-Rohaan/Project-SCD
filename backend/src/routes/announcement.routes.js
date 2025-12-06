import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { restrictTo } from '../middleware/role.middleware.js';
import {
    createAnnouncement,
    getAnnouncements,
    deleteAnnouncement
} from '../controllers/announcement.controller.js';

const router = express.Router();

router.post('/', protect, restrictTo('admin', 'teacher', 'receptionist'), createAnnouncement);
router.get('/', protect, getAnnouncements);
router.delete('/:id', protect, restrictTo('admin'), deleteAnnouncement);

export default router;