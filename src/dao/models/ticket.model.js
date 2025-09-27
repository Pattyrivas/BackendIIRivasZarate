import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  code: { type: String, unique: true, index: true },
  purchase_datetime: { type: Date, default: Date.now },
  amount: { type: Number, required: true },
  purchaser: { type: String, required: true },
  items: [{
    product:  { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
    quantity: Number,
    price:    Number,
    subtotal: Number
  }]
}, { timestamps: true });

export default mongoose.model('tickets', ticketSchema);
