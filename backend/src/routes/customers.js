import { Router } from 'express';
import Customer from '../models/Customer.js';

const router = Router();

router.get('/', async (_req, res) => {
  const items = await Customer.find().sort({ createdAt: -1 }).limit(200);
  res.json(items);
});

router.get('/:id', async (req, res) => {
  const item = await Customer.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
});

router.post('/', async (req, res) => {
  const created = await Customer.create(req.body);
  res.status(201).json(created);
});

router.put('/:id', async (req, res) => {
  const updated = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) return res.status(404).json({ message: 'Not found' });
  res.json(updated);
});

router.delete('/:id', async (req, res) => {
  const deleted = await Customer.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Not found' });
  res.json({ ok: true });
});

export default router;


