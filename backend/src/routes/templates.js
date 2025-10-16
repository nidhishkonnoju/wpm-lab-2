import { Router } from 'express';
import Handlebars from 'handlebars';
import Template from '../models/Template.js';
import Customer from '../models/Customer.js';

const router = Router();

router.get('/', async (_req, res) => {
  const items = await Template.find().sort({ createdAt: -1 }).limit(200);
  res.json(items);
});

router.get('/:id', async (req, res) => {
  const item = await Template.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
});

router.post('/', async (req, res) => {
  const created = await Template.create(req.body);
  res.status(201).json(created);
});

router.put('/:id', async (req, res) => {
  const updated = await Template.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) return res.status(404).json({ message: 'Not found' });
  res.json(updated);
});

router.delete('/:id', async (req, res) => {
  const deleted = await Template.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Not found' });
  res.json({ ok: true });
});

router.post('/:id/preview', async (req, res) => {
  const { customerId } = req.body || {};
  const item = await Template.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  const customer = customerId ? await Customer.findById(customerId) : null;
  const context = customer ? customer.toObject() : { name: 'Traveler', email: 'demo@example.com', locale: 'en-US' };
  const compiled = Handlebars.compile(item.body);
  const rendered = compiled(context);
  res.json({ subject: item.subject, body: rendered, context });
});

export default router;


