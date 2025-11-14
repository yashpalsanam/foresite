/**
 * CORS Configuration for Foresite Backend
 * Exports CORS options object to be used with cors() middleware in server.js
 */

import { logger } from './logger.js';

const allowedOrigins = [
  'http://localhost:3000',      // Next.js website (dev)
  'http://localhost:3001',      // Admin panel (dev)
  'http://localhost:5173',      // Vite dev server (alternative)
  'http://localhost:4173',      // Vite preview
  'http://127.0.0.1:3000',      // Localhost alternative
  'http://127.0.0.1:3001',      // Localhost alternative
  'https://foresite.com',       // Production website
  'https://admin.foresite.com', // Production admin panel
  'https://www.foresite.com',   // Production website (www)
];

// Add environment-specific origins if defined
if (process.env.ADMIN_PANEL_URL) {
  allowedOrigins.push(process.env.ADMIN_PANEL_URL);
  logger.info(`Added custom admin panel URL to CORS: ${process.env.ADMIN_PANEL_URL}`);
}

if (process.env.WEBSITE_URL) {
  allowedOrigins.push(process.env.WEBSITE_URL);
  logger.info(`Added custom website URL to CORS: ${process.env.WEBSITE_URL}`);
}

// Development mode - allow all localhost ports
if (process.env.NODE_ENV === 'development') {
  logger.info('🔓 Development mode: CORS relaxed for localhost');
}

const corsConfig = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, curl, etc.)
    if (!origin) {
      return callback(null, true);
    }

    // In development, allow all localhost/127.0.0.1 origins
    if (process.env.NODE_ENV === 'development') {
      const isLocalhost = origin.startsWith('http://localhost') || 
                         origin.startsWith('http://127.0.0.1');
      if (isLocalhost) {
        return callback(null, true);
      }
    }

    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logger.warn(`[CORS] Blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  
  credentials: true, // Allow cookies and auth headers
  
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'X-CSRF-Token',
    'X-Refresh-Token',
  ],
  
  exposedHeaders: [
    'X-Total-Count',
    'X-Page-Count',
    'X-RateLimit-Limit',
    'X-RateLimit-Remaining',
  ],
  
  maxAge: 86400, // Cache preflight requests for 24 hours
  
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204
};

// Log CORS configuration on startup
logger.info('📡 CORS Configuration Loaded:');
logger.info(`   Allowed Origins: ${allowedOrigins.length} configured`);
logger.info(`   Credentials: ${corsConfig.credentials ? 'Enabled' : 'Disabled'}`);
logger.info(`   Methods: ${corsConfig.methods.join(', ')}`);

export default corsConfig;