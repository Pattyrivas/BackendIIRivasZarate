import { PurchaseService } from '../services/purchase.service.js';
const purchaseService = new PurchaseService();

export const purchase = async (req, res) => {
  const result = await purchaseService.purchaseCart(req.user);
  if (!result.ok) return res.status(400).json({ status: 'error', ...result });
  res.json({ status: 'success', ...result });
};
