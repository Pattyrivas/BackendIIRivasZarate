import cartModel from '../dao/models/cart.model.js';

export class CartRepository {
  create(data = {}) { return cartModel.create(data); }
  findById(id) { return cartModel.findById(id).populate('items.product'); }
  async addItem(cartId, productId, quantity) {
    const cart = await cartModel.findById(cartId);
    if (!cart) return null;
    const idx = cart.items.findIndex(i => String(i.product) === String(productId));
    if (idx >= 0) cart.items[idx].quantity += quantity;
    else cart.items.push({ product: productId, quantity });
    await cart.save();
    return cart;
  }
  async setItems(cartId, items) {
    const cart = await cartModel.findById(cartId);
    if (!cart) return null;
    cart.items = items;
    await cart.save();
    return cart;
  }
  clear(cartId) { return cartModel.findByIdAndUpdate(cartId, { items: [] }, { new: true }); }
}
