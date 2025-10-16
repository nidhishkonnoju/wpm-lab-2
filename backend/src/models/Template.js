import mongoose from 'mongoose';

const TemplateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    channel: { type: String, enum: ['email'], default: 'email' },
    subject: { type: String, default: '' },
    body: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Template', TemplateSchema);


