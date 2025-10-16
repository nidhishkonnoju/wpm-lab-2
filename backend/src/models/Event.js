import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
    type: { type: String, enum: ['view', 'open', 'click', 'book'], required: true },
    props: { type: Object, default: {} },
    timestamp: { type: Date, default: () => new Date(), index: true },
  },
  { timestamps: false }
);

export default mongoose.model('Event', EventSchema);


