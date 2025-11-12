import { connectDatabase } from '../server/config/database.js';
import app from '../server/app.js';

// Connect to database on cold start
let isConnected = false;

async function ensureDbConnection() {
  if (!isConnected) {
    console.log('[Vercel] Connecting to database...');
    await connectDatabase();
    isConnected = true;
    console.log('[Vercel] Database connected successfully');
  }
}

export default async function handler(req, res) {
  try {
    // Ensure database is connected
    await ensureDbConnection();

    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // Handle preflight
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    // Log the request for debugging
    console.log(`[Vercel] ${req.method} ${req.url}`);

    // Pass to Express app
    return app(req, res);
  } catch (error) {
    console.error('[Vercel] Serverless function error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
}
