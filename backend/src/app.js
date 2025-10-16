import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { connectToDatabase } from './config/db.js';

// Routes
import customersRouter from './routes/customers.js';
import eventsRouter from './routes/events.js';
import segmentsRouter from './routes/segments.js';
import templatesRouter from './routes/templates.js';
import campaignsRouter from './routes/campaigns.js';
import dashboardRouter from './routes/dashboard.js';

const app = express();

app.use(cors({ origin: ['http://localhost:4200', 'http://127.0.0.1:4200'], credentials: false }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/customers', customersRouter);
app.use('/api/events', eventsRouter);
app.use('/api/segments', segmentsRouter);
app.use('/api/templates', templatesRouter);
app.use('/api/campaigns', campaignsRouter);
app.use('/api/dashboard', dashboardRouter);

// Global error handler (minimal)
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  // Fallback safe error
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 4000;

async function start() {
  await connectToDatabase();
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Backend listening on http://localhost:${PORT}`);
  });
}

start().catch((e) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server', e);
  process.exit(1);
});

export default app;


