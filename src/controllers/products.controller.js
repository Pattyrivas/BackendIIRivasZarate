import { ProductRepository } from '../repositories/product.repository.js';
const repo = new ProductRepository();

export const createProduct = async (req, res) => {
  try {
    const { title, price, stock, code, description = '', category = 'general' } = req.body;
    if (!title || price == null || stock == null) {
      return res.status(400).json({ status: 'error', message: 'title, price y stock son obligatorios' });
    }
    const created = await repo.create({ title, price, stock, code, description, category });
    return res.status(201).json({ status: 'success', payload: created });
  } catch (e) {
    return res.status(400).json({ status: 'error', message: e.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { pid } = req.params;
    const updated = await repo.updateById(pid, req.body);
    if (!updated) return res.status(404).json({ status: 'error', message: 'Product not found' });
    return res.json({ status: 'success', payload: updated });
  } catch (e) {
    return res.status(400).json({ status: 'error', message: e.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { pid } = req.params;
    const deleted = await repo.deleteById(pid);
    if (!deleted) return res.status(404).json({ status: 'error', message: 'Product not found' });
    return res.json({ status: 'success', payload: deleted });
  } catch (e) {
    return res.status(400).json({ status: 'error', message: e.message });
  }
};

export const listProducts = async (req, res) => {
  try {
    const { page = 1, limit = 20, category, q } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (q) filter.title = { $regex: String(q), $options: 'i' };
    const skip = (Number(page) - 1) * Number(limit);
    const products = await repo.findAll(filter, { skip, limit: Number(limit) });
    return res.json({ status: 'success', payload: products });
  } catch (e) {
    return res.status(400).json({ status: 'error', message: e.message });
  }
};

export const getProduct = async (req, res) => {
  try {
    const { pid } = req.params;
    const prod = await repo.findById(pid);
    if (!prod) return res.status(404).json({ status: 'error', message: 'Product not found' });
    return res.json({ status: 'success', payload: prod });
  } catch (e) {
    return res.status(400).json({ status: 'error', message: e.message });
  }
};
