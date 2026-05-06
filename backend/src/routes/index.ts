import { Application } from 'express';
import authRoutes from './auth.routes';
import caseRoutes from './case.routes';
import documentRoutes from './document.routes';
import chatRoutes from './chat.routes';
import orderRoutes from './order.routes';
import analyticsRoutes from './analytics.routes';
import { Request, Response } from 'express';

export function setupRoutes(app: Application) {
  const API_PREFIX = '/api';

  app.use(`${API_PREFIX}/auth`, authRoutes);
  app.use(`${API_PREFIX}/cases`, caseRoutes);
  app.use(`${API_PREFIX}/documents`, documentRoutes);
  app.use(`${API_PREFIX}/chat`, chatRoutes);
  app.use(`${API_PREFIX}/orders`, orderRoutes);
  app.use(`${API_PREFIX}/analytics`, analyticsRoutes);

  // 404 handler
  app.use('*', (req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: `Route ${req.originalUrl} not found`
      }
    });
  });
}
