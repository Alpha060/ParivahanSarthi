import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { authRouter } from './routes/auth';
import { applicationsRouter } from './routes/applications';
import { appointmentsRouter } from './routes/appointments';
import { paymentsRouter } from './routes/payments';
import { rtosRouter } from './routes/rtos';
import { grievancesRouter } from './routes/grievances';
import { noticesRouter } from './routes/notices';
import { officersRouter } from './routes/officers';
import { prisma } from './db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Parsing Middlewares
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? (process.env.ALLOWED_ORIGINS?.split(',') || true) : true,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    system: 'Parivahan Sarathi National Portal API',
    version: '4.2.0-PROD',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/applications', applicationsRouter);
app.use('/api/appointments', appointmentsRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/rtos', rtosRouter);
app.use('/api/grievances', grievancesRouter);
app.use('/api/notices', noticesRouter);
app.use('/api/officers', officersRouter);

// 404 Catch-All Handler for API Routes
app.use('/api/*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: `API Route '${req.method} ${req.originalUrl}' not found on Parivahan Sarathi Server.`
  });
});

// Global Error Handling Middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled Server Exception:', err);
  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error. Please contact MoRTH NIC Helpdesk.'
  });
});

// Only listen when running standalone (not inside Vercel serverless function)
if (!process.env.VERCEL) {
  const server = app.listen(PORT, () => {
    console.log(`🚀 Parivahan Sarathi Production API Server active on http://localhost:${PORT}`);
  });

  // Graceful Shutdown
  const shutdown = async () => {
    console.log('Shutting down server gracefully...');
    await prisma.$disconnect();
    server.close(() => {
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

export default app;
export { app };
