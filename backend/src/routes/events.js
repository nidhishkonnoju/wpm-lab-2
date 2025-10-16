import { Router } from 'express';
import Event from '../models/Event.js';

const router = Router();

router.post('/', async (req, res) => {
  const created = await Event.create(req.body);
  res.status(201).json(created);
});

router.get('/', async (req, res) => {
  const { customerId } = req.query;
  const query = customerId ? { customerId } : {};
  const items = await Event.find(query).sort({ timestamp: -1 }).limit(500);
  res.json(items);
});

export default router;


