import express from 'express';
import { login, register, getMe } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { restrictTo } from '../middleware/role.middleware.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', protect, restrictTo('admin'), register);
router.get('/me', protect, getMe);

export default router;