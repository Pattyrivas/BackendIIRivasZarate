import mongoose from 'mongoose';

const userCollection = 'users';

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true, trim: true, lowercase: true },
  age: { type: Number, required: true },
  password: { type: String, required: true },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: 'carts', default: null },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
});

export default mongoose.model(userCollection, userSchema);

