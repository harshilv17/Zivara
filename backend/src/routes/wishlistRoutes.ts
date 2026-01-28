import { Router } from 'express';
import { getWishlist, addToWishlist, removeFromWishlist, checkWishlist } from '../controllers/wishlistController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

router.use(protect);

router.get('/', getWishlist);
router.post('/', addToWishlist);
router.delete('/:productId', removeFromWishlist);
router.get('/check/:productId', checkWishlist);

export default router;
