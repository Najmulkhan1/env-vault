import mongoose, { Schema, model, models } from 'mongoose';

const VariableSchema = new Schema({
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true }, //
  key: { type: String, required: true },
  encryptedValue: { type: String, required: true }, //
  iv: { type: String, required: true }, //
  authTag: { type: String, required: true }, //
  description: { type: String },
}, { timestamps: true });

// একই প্রজেক্টে একই নামে দুটি ভেরিয়েবল থাকতে পারবে না [cite: 92]
VariableSchema.index({ projectId: 1, key: 1 }, { unique: true });

const Variable = models.Variable || model('Variable', VariableSchema);
export default Variable;