import mongoose from 'mongoose';

const RuleSchema = new mongoose.Schema(
  {
    field: { type: String, required: true }, // e.g., traits.tier or locale
    op: { type: String, enum: ['eq', 'neq', 'in', 'nin', 'exists'], required: true },
    value: { type: mongoose.Schema.Types.Mixed },
  },
  { _id: false }
);

const SegmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rules: { type: [RuleSchema], default: [] },
    daysLookback: { type: Number, default: 90 },
  },
  { timestamps: true }
);

export default mongoose.model('Segment', SegmentSchema);


