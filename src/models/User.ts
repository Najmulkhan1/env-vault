import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  name: { type: String },
  avatar: { type: String },
  twoFactorEnabled: { type: Boolean, default: false }, // [cite: 83]
  twoFactorSecret: { type: String }, // [cite: 83]
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

const User = models.User || model('User', UserSchema);
export default User;