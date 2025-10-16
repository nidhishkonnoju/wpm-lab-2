import mongoose from 'mongoose';

const DeliveryEventsSchema = new mongoose.Schema(
  {
    open: { type: Number, default: 0 },
    click: { type: Number, default: 0 },
    convert: { type: Number, default: 0 },
  },
  { _id: false }
);

const DeliverySchema = new mongoose.Schema(
  {
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', index: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', index: true },
    variant: { type: String, required: true },
    status: { type: String, enum: ['queued', 'sent', 'failed'], default: 'sent' },
    events: { type: DeliveryEventsSchema, default: () => ({}) },
  },
  { timestamps: true }
);

export default mongoose.model('Delivery', DeliverySchema);


