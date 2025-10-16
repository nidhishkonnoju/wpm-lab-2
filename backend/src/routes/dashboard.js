import { Router } from 'express';
import Delivery from '../models/Delivery.js';

const router = Router();

router.get('/kpis', async (_req, res) => {
  const agg = await Delivery.aggregate([
    {
      $group: {
        _id: null,
        sends: { $sum: 1 },
        opens: { $sum: '$events.open' },
        clicks: { $sum: '$events.click' },
        converts: { $sum: '$events.convert' },
      },
    },
  ]);
  const r = agg[0] || { sends: 0, opens: 0, clicks: 0, converts: 0 };
  res.json({ sends: r.sends || 0, opens: r.opens || 0, clicks: r.clicks || 0, converts: r.converts || 0 });
});

export default router;


