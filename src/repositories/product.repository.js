import productModel from '../dao/models/product.model.js';

export class ProductRepository {
  create(data) { return productModel.create(data); }
  findById(id) { return productModel.findById(id); }
  findAll(filter = {}, opts = {}) { return productModel.find(filter, null, opts); }
  updateById(id, update) { return productModel.findByIdAndUpdate(id, update, { new: true }); }
  deleteById(id) { return productModel.findByIdAndDelete(id); }
  async decreaseStock(id, quantity) {
    const prod = await productModel.findById(id);
    if (!prod || prod.stock < quantity) return null;
    prod.stock -= quantity;
    await prod.save();
    return prod;
  }
}
