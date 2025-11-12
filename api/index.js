import express from 'express';
import cors from 'cors';
import { config } from '../server/config/env.js';
import { errorHandler, notFound } from '../server/middleware/errorHandler.js';
import apiRoutes from '../server/routes/index.js';
import { connectDatabase } from '../server/config/database.js';

const app = express();

// Body parser middleware
app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));

// CORS middleware - Allow all origins for Vercel deployment
app.use(cors({
  origin: true,
  credentials: true,
}));

// API routes
app.use('/api', apiRoutes);

// 404 handler
app.use(notFound);

// Error handling middleware (must be last)
app.use(errorHandler);

// Connect to database on cold start
let isConnected = false;

export default async function handler(req, res) {
  try {
    // Connect to database if not already connected
    if (!isConnected) {
      await connectDatabase();
      isConnected = true;
    }

    // Handle the request with Express
    return app(req, res);
  } catch (error) {
    console.error('Serverless function error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
}
