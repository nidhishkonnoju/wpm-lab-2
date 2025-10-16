import mongoose from 'mongoose';

const PreferencesSchema = new mongoose.Schema(
  {
    channels: { type: [String], default: ['email'] },
  },
  { _id: false }
);

const TraitsSchema = new mongoose.Schema(
  {
    tier: { type: String, enum: ['standard', 'silver', 'gold', 'platinum'], default: 'standard' },
  },
  { _id: false }
);

const CustomerSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    segment: { type: String, default: '' },
    lastBooking: { type: Date },
    locale: { type: String, default: 'en-US' },
    preferences: { type: PreferencesSchema, default: () => ({}) },
    traits: { type: TraitsSchema, default: () => ({}) },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

export default mongoose.model('Customer', CustomerSchema);


