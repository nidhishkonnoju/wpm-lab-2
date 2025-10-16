import { Router } from 'express';
import Campaign from '../models/Campaign.js';
import Segment from '../models/Segment.js';
import Customer from '../models/Customer.js';
import Delivery from '../models/Delivery.js';

const router = Router();

function pickVariant(variants) {
  const total = variants.reduce((s, v) => s + (v.weight || 0), 0) || 1;
  const r = Math.random() * total;
  let acc = 0;
  for (const v of variants) {
    acc += v.weight || 0;
    if (r <= acc) return v;
  }
  return variants[0];
}

router.get('/', async (_req, res) => {
  const items = await Campaign.find().sort({ createdAt: -1 }).limit(200);
  res.json(items);
});

router.get('/:id', async (req, res) => {
  const item = await Campaign.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
});

router.post('/', async (req, res) => {
  const created = await Campaign.create(req.body);
  res.status(201).json(created);
});

router.put('/:id', async (req, res) => {
  const updated = await Campaign.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) return res.status(404).json({ message: 'Not found' });
  res.json(updated);
});

router.delete('/:id', async (req, res) => {
  const deleted = await Campaign.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Not found' });
  res.json({ ok: true });
});

router.post('/:id/launch', async (req, res) => {
  const camp = await Campaign.findById(req.params.id);
  if (!camp) return res.status(404).json({ message: 'Not found' });
  const seg = await Segment.findById(camp.segmentId);
  if (!seg) return res.status(400).json({ message: 'Segment not found' });

  // Find members by simple rules (reuse minimal translator)
  const rules = seg.rules || [];
  const filter = {};
  if (rules.length) {
    filter.$and = rules.map((r) => {
      switch (r.op) {
        case 'eq':
          return { [r.field]: r.value };
        case 'neq':
          return { [r.field]: { $ne: r.value } };
        case 'in':
          return { [r.field]: { $in: r.value } };
        case 'nin':
          return { [r.field]: { $nin: r.value } };
        case 'exists':
          return { [r.field]: { $exists: !!r.value } };
        default:
          return {};
      }
    });
  }
  const members = await Customer.find(filter).select('_id').lean();
  const deliveries = [];
  for (const m of members) {
    const chosen = pickVariant(camp.variants && camp.variants.length ? camp.variants : [{ key: 'A', weight: 1, templateId: null }]);
    deliveries.push({
      campaignId: camp._id,
      customerId: m._id,
      variant: chosen.key,
      status: 'sent',
      events: { open: 0, click: 0, convert: 0 },
    });
  }
  if (deliveries.length) await Delivery.insertMany(deliveries);
  camp.status = 'launched';
  await camp.save();
  res.json({ created: deliveries.length });
});

router.get('/:id/metrics', async (req, res) => {
  const id = req.params.id;
  const agg = await Delivery.aggregate([
    { $match: { campaignId: new Delivery.db.Types.ObjectId(id) } },
    {
      $group: {
        _id: '$variant',
        sends: { $sum: 1 },
        opens: { $sum: '$events.open' },
        clicks: { $sum: '$events.click' },
        converts: { $sum: '$events.convert' },
      },
    },
  ]);
  const totals = agg.reduce(
    (a, r) => ({
      sends: a.sends + r.sends,
      opens: a.opens + r.opens,
      clicks: a.clicks + r.clicks,
      converts: a.converts + r.converts,
    }),
    { sends: 0, opens: 0, clicks: 0, converts: 0 }
  );
  res.json({ variants: agg, totals });
});

export default router;


