import mongoose from 'mongoose';

const userCollection = 'users';

const userSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true, trim: true },
    last_name:  { type: String, required: true, trim: true },
    email:      { type: String, required: true, unique: true, lowercase: true, index: true },
    age:        { type: Number, default: null, min: 0 },
    password:   { type: String, required: true }, // hash bcrypt
    role:       { type: String, enum: ['user', 'admin'], default: 'user', index: true },
    cart:       { type: mongoose.Schema.Types.ObjectId, ref: 'carts', default: null }
  },
  { timestamps: true }
);

export default mongoose.model(userCollection, userSchema);
