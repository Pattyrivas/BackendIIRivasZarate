import { Router } from 'express';
import passport from 'passport';
import { userOnly } from '../middlewares/role-guards.js';
import { addToCart } from '../controllers/carts.controller.js';
import { purchase } from '../controllers/purchase.controller.js';

const router = Router();
const requireJwt = passport.authenticate('jwt', { session: false });

// user-only
router.post('/:cid/products/:pid', requireJwt, userOnly, addToCart);
router.post('/:cid/purchase', requireJwt, userOnly, purchase);

export default router;
