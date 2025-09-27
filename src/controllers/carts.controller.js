import { CartRepository } from '../repositories/cart.repository.js';
const repo = new CartRepository();

export const addToCart = async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity = 1 } = req.body;
  const cart = await repo.addItem(cid, pid, Number(quantity));
  if (!cart) return res.status(404).json({ status:'error', message:'Cart not found' });
  res.json({ status:'success', payload: cart });
};
