import { Router } from 'express';
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from '../controllers/cartController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

router.use(protect); // All cart routes require auth

router.get('/', getCart);
router.post('/add', addToCart);
router.patch('/item/:itemId', updateCartItem);
router.delete('/item/:itemId', removeFromCart);
router.delete('/clear', clearCart);

export default router;
