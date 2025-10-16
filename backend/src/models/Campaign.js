import mongoose from 'mongoose';

const VariantSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Template', required: true },
    weight: { type: Number, default: 0.5 },
  },
  { _id: false }
);

const CampaignSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    channel: { type: String, enum: ['email'], default: 'email' },
    segmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Segment', required: true },
    variants: { type: [VariantSchema], default: [] },
    status: { type: String, enum: ['draft', 'launched', 'paused'], default: 'draft' },
  },
  { timestamps: true }
);

export default mongoose.model('Campaign', CampaignSchema);


