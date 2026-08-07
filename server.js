import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

import authRouter from './server/routes/auth.js';
import postsRouter from './server/routes/posts.js';
import announcementsRouter from './server/routes/announcements.js';
import eventsRouter from './server/routes/events.js';
import hackathonsRouter from './server/routes/hackathons.js';
import clubsRouter from './server/routes/clubs.js';
import dashboardRouter from './server/routes/dashboard.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.use('/api/auth', authRouter);
  app.use('/api/posts', postsRouter);
  app.use('/api/announcements', announcementsRouter);
  app.use('/api/events', eventsRouter);
  app.use('/api/hackathons', hackathonsRouter);
  app.use('/api/clubs', clubsRouter);
  app.use('/api/dashboard', dashboardRouter);

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', serverTime: new Date().toISOString() });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '127.0.0.1', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
