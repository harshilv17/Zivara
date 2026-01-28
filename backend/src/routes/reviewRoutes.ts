import { Router } from 'express';
import { getProductReviews, createReview, deleteReview } from '../controllers/reviewController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

router.get('/product/:productId', getProductReviews);
router.post('/product/:productId', protect, createReview);
router.delete('/:reviewId', protect, deleteReview);

export default router;
