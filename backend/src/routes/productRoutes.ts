import { Router } from 'express';
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct, getCategories, seedProducts } from '../controllers/productController';
import { protect, adminOnly } from '../middlewares/authMiddleware';

const router = Router();

// Public routes
router.get('/', getProducts);
router.get('/categories', getCategories);
router.post('/seed', seedProducts);  // Must be before /:id
router.get('/:id', getProduct);

// Protected routes (Admin only)
router.post('/', protect, adminOnly, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

export default router;

