import { Router } from 'express';
import { protect, adminOnly } from '../middlewares/authMiddleware';
import {
  validateCoupon,
  applyCoupon,
  getAllCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from '../controllers/couponController';

const router = Router();

// Public routes (for checkout)
router.post('/validate', protect, validateCoupon);
router.post('/apply', protect, applyCoupon);

// Admin routes
router.get('/', protect, adminOnly, getAllCoupons);
router.post('/', protect, adminOnly, createCoupon);
router.put('/:id', protect, adminOnly, updateCoupon);
router.delete('/:id', protect, adminOnly, deleteCoupon);

export default router;
