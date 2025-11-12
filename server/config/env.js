import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const {
  NODE_ENV = 'development',
  PORT = '5000',
  MONGODB_URI,
  JWT_SECRET = 'your-secret-key-change-in-production',
  JWT_EXPIRES_IN = '7d',
  CLIENT_ORIGIN,
  USE_VITE,
} = process.env;

// Validate required environment variables in production
if (NODE_ENV === 'production') {
  const required = ['MONGODB_URI', 'JWT_SECRET'];
  const missing = required.filter((key) => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
  
  if (JWT_SECRET === 'your-secret-key-change-in-production') {
    throw new Error('JWT_SECRET must be changed in production');
  }
}

export const config = {
  env: NODE_ENV,
  port: parseInt(PORT, 10),
  isDevelopment: NODE_ENV === 'development',
  isProduction: NODE_ENV === 'production',
  
  mongodb: {
    uri: MONGODB_URI || (NODE_ENV === 'development' 
      ? 'mongodb://127.0.0.1:27017/skillbridge' 
      : undefined),
  },
  
  jwt: {
    secret: JWT_SECRET,
    expiresIn: JWT_EXPIRES_IN,
  },
  
  cors: {
    origin: CLIENT_ORIGIN || (NODE_ENV === 'production' ? undefined : '*'),
  },
  
  vite: {
    useVite: NODE_ENV === 'development' && USE_VITE !== 'false',
  },
};
