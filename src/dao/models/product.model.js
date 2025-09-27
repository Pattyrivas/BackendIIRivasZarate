import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, default: '' },
  price:       { type: Number, required: true },
  stock:       { type: Number, required: true, min: 0 },
  code:        { type: String, unique: true, index: true },
  category:    { type: String, default: 'general' }
}, { timestamps: true });

export default mongoose.model('products', productSchema);
