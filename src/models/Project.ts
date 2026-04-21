import mongoose, { Schema, model, models } from 'mongoose';

const ProjectSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // [cite: 86]
  tags: [{ type: String }],
  colorLabel: { type: String, default: "#000000" },
  encryptedDEK: { type: String, required: true }, // [cite: 86]
  variableCount: { type: Number, default: 0 },
}, { timestamps: true });

const Project = models.Project || model('Project', ProjectSchema);
export default Project;