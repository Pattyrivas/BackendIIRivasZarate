import { CartRepository } from '../repositories/cart.repository.js';
import { ProductRepository } from '../repositories/product.repository.js';
import { TicketRepository } from '../repositories/ticket.repository.js';
import { nanoid } from 'nanoid';

const cartsRepo = new CartRepository();
const productsRepo = new ProductRepository();
const ticketsRepo = new TicketRepository();

export class PurchaseService {
  async purchaseCart(user) {
    const cart = await cartsRepo.findById(user.cart);
    if (!cart || !cart.items?.length) return { ok: false, error: 'Cart empty or not found' };

    const purchased = [];
    const notAvailable = [];
    let total = 0;

    for (const it of cart.items) {
      const product = await productsRepo.findById(it.product);
      if (!product) { notAvailable.push({ product: it.product, reason: 'not found' }); continue; }
      if (product.stock >= it.quantity) {
        const updated = await productsRepo.decreaseStock(product._id, it.quantity);
        if (!updated) { notAvailable.push({ product: product._id, reason: 'stock changed' }); continue; }
        const subtotal = product.price * it.quantity;
        total += subtotal;
        purchased.push({ product: product._id, quantity: it.quantity, price: product.price, subtotal });
      } else {
        notAvailable.push({ product: product._id, reason: 'insufficient stock' });
      }
    }

    if (purchased.length === 0) return { ok: false, error: 'No items available to purchase', notAvailable };

    const ticket = await ticketsRepo.create({
      code: nanoid(12),
      amount: total,
      purchaser: user.email,
      items: purchased
    });

    const remaining = notAvailable.map(n => ({
      product: n.product,
      quantity: cart.items.find(i => String(i.product) === String(n.product))?.quantity || 0
    }));
    await cartsRepo.setItems(cart._id, remaining);

    return { ok: true, ticket, notAvailable };
  }
}
