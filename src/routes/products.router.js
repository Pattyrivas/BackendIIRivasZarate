import { Router } from 'express';
import passport from 'passport';
import { adminOnly } from '../middlewares/role-guards.js';
import { createProduct, updateProduct, deleteProduct, listProducts, getProduct } from '../controllers/products.controller.js';

const router = Router();
const requireJwt = passport.authenticate('jwt', { session: false });

router.get('/', listProducts);
router.get('/:pid', getProduct);

// admin-only
router.post('/', requireJwt, adminOnly, createProduct);
router.put('/:pid', requireJwt, adminOnly, updateProduct);
router.delete('/:pid', requireJwt, adminOnly, deleteProduct);

export default router;
