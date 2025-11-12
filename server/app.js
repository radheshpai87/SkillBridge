import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import logger from './utils/logger.js';
import apiRoutes from './routes/index.js';

const app = express();

// Body parser middleware
app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));

// CORS middleware
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
}));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on('finish', () => {
    const duration = Date.now() - start;
    if (path.startsWith('/api')) {
      logger.http(req.method, path, res.statusCode, duration, capturedJsonResponse);
    }
  });

  next();
});

// API routes
app.use('/api', apiRoutes);

// 404 handler
app.use(notFound);

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
