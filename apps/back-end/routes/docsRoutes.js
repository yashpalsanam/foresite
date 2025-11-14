import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'Foresite API Documentation',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      properties: '/api/properties',
      inquiries: '/api/inquiries',
      notifications: '/api/notifications',
      admin: '/api/admin',
      health: '/api/health',
    },
    documentation: {
      openapi: '/api/docs/openapi.yaml',
      architecture: '/api/docs/architecture',
    },
  });
});

router.get('/architecture', (req, res) => {
  res.json({
    message: 'API Architecture Overview',
    stack: {
      runtime: 'Node.js',
      framework: 'Express.js',
      database: 'MongoDB Atlas',
      cache: 'Redis',
      storage: 'Cloudinary',
      auth: 'JWT + Firebase',
      realtime: 'Socket.io',
      notifications: 'Firebase Cloud Messaging',
    },
    features: [
      'RESTful API',
      'JWT Authentication',
      'Role-based Access Control',
      'Real-time Updates',
      'Push Notifications',
      'Image Upload',
      'Geocoding',
      'Rate Limiting',
      'Caching',
      'Analytics Tracking',
    ],
  });
});

export default router;
