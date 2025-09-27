import { Router } from "express";
import { createHash } from '../utils/password.js';
import { requireJwt, authorize } from '../middlewares/auth.js';
import { UserRepository } from '../repositories/user.repository.js';

const router = Router();
const usersRepo = new UserRepository();

// Listar (ADMIN)
router.get('/', requireJwt, authorize('admin'), async (req, res) => {
  const users = await usersRepo.findAll();
  res.json({ status: 'success', payload: users });
});

// Crear (ADMIN)
router.post('/', requireJwt, authorize('admin'), async (req, res) => {
  const { first_name, last_name, email, age, password, role, cart } = req.body;
  const payload = {
    first_name,
    last_name,
    email: String(email).trim().toLowerCase(),
    age,
    password: createHash(password),
    role: role ?? 'user',
    cart: cart ?? null
  };
  const created = await usersRepo.create(payload);
  res.status(201).json({ status: 'success', payload: { ...created.toObject(), password: undefined } });
});

// Actualizar (ADMIN)
router.put('/:uid', requireJwt, authorize('admin'), async (req, res) => {
  const { uid } = req.params;
  const update = { ...req.body };
  if (update.email)    update.email = String(update.email).trim().toLowerCase();
  if (update.password) update.password = createHash(update.password);
  const updated = await usersRepo.updateById(uid, update);
  if (!updated) return res.status(404).json({ status: 'error', message: 'User not found' });
  res.json({ status: 'success', payload: updated });
});

// Eliminar (ADMIN)
router.delete('/:uid', requireJwt, authorize('admin'), async (req, res) => {
  const { uid } = req.params;
  const result = await usersRepo.deleteById(uid);
  res.json({ status: 'success', payload: result });
});

export default router;
