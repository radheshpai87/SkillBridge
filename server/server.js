import { createServer } from 'http';
import app from './app.js';
import { config } from './config/env.js';
import { connectDatabase } from './config/database.js';
import { setupVite, serveStatic } from './lib/vite.js';
import logger from './utils/logger.js';

(async () => {
  try {
    // Connect to database
    await connectDatabase();

    // Create HTTP server
    const server = createServer(app);

    // Decide how to serve frontend assets:
    // - In development, by default we use Vite middleware (setupVite).
    // - If `USE_VITE=false` is set (when you want to run the client dev server separately),
    //   we skip Vite middleware and also skip static serving so the server only exposes the API.
    if (config.vite.useVite) {
      await setupVite(app, server);
    } else if (config.isProduction) {
      // In production we serve the built assets from dist/public
      serveStatic(app);
    } else {
      // Development with USE_VITE=false: do not serve frontend from the server.
      // The frontend can be run separately with `npm run dev:client`.
      logger.info('Development mode: skipping Vite middleware (USE_VITE=false) — API only');
    }

    // Start server
    server.listen(config.port, '0.0.0.0', () => {
      logger.success(`🚀 Server running on port ${config.port}`);
      logger.info(`Environment: ${config.env}`);
      logger.info(`MongoDB: ${config.mongodb.uri ? 'Connected' : 'Not configured'}`);
    });

    // Graceful shutdown
    const shutdown = async (signal) => {
      logger.info(`${signal} received, shutting down gracefully...`);
      server.close(() => {
        logger.info('Server closed');
        process.exit(0);
      });

      // Force close after 10 seconds
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
})();
