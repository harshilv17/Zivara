import { Router } from 'express';
import { signup, login, getMe } from '../controllers/authController';
import { updateProfile } from '../controllers/profileController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', protect, getMe);
router.patch('/profile', protect, updateProfile);

export default router;

