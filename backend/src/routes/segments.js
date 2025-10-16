import { Router } from 'express';
import Segment from '../models/Segment.js';
import Customer from '../models/Customer.js';
import Event from '../models/Event.js';
import dayjs from 'dayjs';

const router = Router();

function rulesToMongo(rules) {
  const andClauses = [];
  for (const r of rules || []) {
    const field = r.field;
    switch (r.op) {
      case 'eq':
        andClauses.push({ [field]: r.value });
        break;
      case 'neq':
        andClauses.push({ [field]: { $ne: r.value } });
        break;
      case 'in':
        andClauses.push({ [field]: { $in: r.value } });
        break;
      case 'nin':
        andClauses.push({ [field]: { $nin: r.value } });
        break;
      case 'exists':
        andClauses.push({ [field]: { $exists: !!r.value } });
        break;
      default:
        break;
    }
  }
  return andClauses.length ? { $and: andClauses } : {};
}

router.get('/', async (_req, res) => {
  const items = await Segment.find().sort({ createdAt: -1 }).limit(200);
  res.json(items);
});

router.get('/:id', async (req, res) => {
  const item = await Segment.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
});

router.post('/', async (req, res) => {
  const created = await Segment.create(req.body);
  res.status(201).json(created);
});

router.put('/:id', async (req, res) => {
  const updated = await Segment.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) return res.status(404).json({ message: 'Not found' });
  res.json(updated);
});

router.delete('/:id', async (req, res) => {
  const deleted = await Segment.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Not found' });
  res.json({ ok: true });
});

router.post('/:id/preview', async (req, res) => {
  const seg = await Segment.findById(req.params.id);
  if (!seg) return res.status(404).json({ message: 'Not found' });
  const baseFilter = rulesToMongo(seg.rules);
  let ids = await Customer.find(baseFilter).select('_id').lean();
  ids = ids.map((d) => d._id);
  if (seg.daysLookback && seg.daysLookback > 0) {
    const since = dayjs().subtract(seg.daysLookback, 'day').toDate();
    const recent = await Event.distinct('customerId', { timestamp: { $gte: since } });
    const set = new Set(recent.map((x) => String(x)));
    ids = ids.filter((id) => set.has(String(id)));
  }
  const sample = await Customer.find({ _id: { $in: ids } }).limit(10);
  res.json({ count: ids.length, sample });
});

export default router;


