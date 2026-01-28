import { Router } from 'express';
import { createOrder, getOrders, getOrder, getAllOrders, updateOrderStatus, updatePaymentStatus } from '../controllers/orderController';
import { protect, adminOnly } from '../middlewares/authMiddleware';

const router = Router();

router.use(protect);

router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrder);
router.patch('/:id/payment', updatePaymentStatus);

// Admin routes
router.get('/admin/all', adminOnly, getAllOrders);
router.patch('/admin/:id/status', adminOnly, updateOrderStatus);

export default router;
