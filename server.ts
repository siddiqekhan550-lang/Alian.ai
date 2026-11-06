import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { authRouter } from './server/routes/auth.js';
import { creditsRouter } from './server/routes/credits.js';
import { generationsRouter } from './server/routes/generations.js';
import { uploadsRouter } from './server/routes/uploads.js';
import { adminRouter } from './server/routes/admin.js';
import { downloadRouter } from './server/routes/download.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Body parser with 50mb limit for reference media uploads
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // API Routes
  app.use('/api/auth', authRouter);
  app.use('/api/credits', creditsRouter);
  app.use('/api/generations', generationsRouter);
  app.use('/api/uploads', uploadsRouter);
  app.use('/api/admin', adminRouter);
  app.use('/api/download', downloadRouter);

  // Health check endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      app: 'Alien.ai',
      time: new Date().toISOString(),
    });
  });

  // Vite development middleware or static production serving
  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Global error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Server Uncaught Error:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Alien.ai] Creative Platform running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start Alien.ai server:', err);
  process.exit(1);
});
