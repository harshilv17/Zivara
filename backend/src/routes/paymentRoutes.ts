import { Router } from 'express';
import { createPaymentOrder, verifyPayment } from '../controllers/paymentController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

router.use(protect);

router.post('/create-order', createPaymentOrder);
router.post('/verify', verifyPayment);

export default router;
