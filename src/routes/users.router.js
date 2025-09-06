import { Router } from "express";
import userModel from '../models/user.model.js';
import { createHash } from '../utils/password.js';
import { requireJwt, authorize } from '../middlewares/auth.js';

const router = Router();

// Listar (ADMIN)
router.get('/', requireJwt, authorize('admin'), async (req, res) => {
  const users = await userModel.find().select('-password').populate('cart');
  res.json({ status: 'success', payload: users });
});

// Crear (ADMIN)
router.post('/', requireJwt, authorize('admin'), async (req, res) => {
  const { first_name, last_name, email, age, password, role, cart } = req.body;
  if (email) email = String(email).trim().toLowerCase();
  const user = await userModel.create({
    first_name, last_name, email, age,
    password: createHash(password),
    role: role ?? 'user',
    cart: cart ?? null
  });
  const { password: _, ...safe } = user.toObject();
  res.json({ status: 'success', payload: safe });
});

// Actualizar (ADMIN) 
router.put('/:uid', requireJwt, authorize('admin'), async (req, res) => {
  const { uid } = req.params;
  const update = { ...req.body };
  if (update.email) update.email = String(update.email).trim().toLowerCase();
  if (update.password) update.password = createHash(update.password);
  const updated = await userModel.findByIdAndUpdate(uid, update, { new: true }).select('-password');
  if (!updated) return res.status(404).json({ status: 'error', message: 'User not found' });
  res.json({ status: 'success', payload: updated });
});

// Eliminar (ADMIN)
router.delete('/:uid', requireJwt, authorize('admin'), async (req, res) => {
  const { uid } = req.params;
  const result = await userModel.deleteOne({ _id: uid });
  res.json({ status: 'success', payload: result });
});

export default router;
