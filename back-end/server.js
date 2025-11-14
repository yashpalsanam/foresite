import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { createServer } from 'http';
import { Server } from 'socket.io';

import { connectDB } from './config/db.js';
import { connectRedis } from './config/redis.js';
import { initializeFirebase } from './config/firebase.js';
import { setupSocketIO } from './config/socket.js';
import { logger } from './config/logger.js';
import corsConfig from './config/cors.js';
import { validateEnv } from './config/env.js';

import { enforceHttps } from './middlewares/enforceHttps.js';
import { sanitizeMiddleware } from './middlewares/sanitize.js';
import { rateLimiter } from './middlewares/rateLimit.js';
import { compressionMiddleware } from './middlewares/compression.js';
import { helmetMiddleware } from './middlewares/helmet.js';
import { requestLogger } from './middlewares/requestLogger.js';
import { errorMiddleware } from './middlewares/errorMiddleware.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import propertyRoutes from './routes/propertyRoutes.js';
import inquiryRoutes from './routes/inquiryRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import healthCheckRoutes from './routes/healthCheck.js';
import docsRoutes from './routes/docsRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

validateEnv();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: corsConfig
});

const PORT = process.env.BACKEND_PORT || 3001;
const API_VERSION = process.env.API_VERSION || 'v1';
const API_V1 = `/api/${API_VERSION}`;

// ==========================================
// MIDDLEWARE SETUP
// ==========================================

if (process.env.NODE_ENV === 'production') {
  app.use(enforceHttps);
}

app.use(helmetMiddleware);
app.use(cors(corsConfig));
app.use(compressionMiddleware);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use(sanitizeMiddleware);
app.use(requestLogger);
app.use(rateLimiter);

// ==========================================
// API VERSION 1 ROUTES
// ==========================================

app.use(`${API_V1}/auth`, authRoutes);
app.use(`${API_V1}/users`, userRoutes);
app.use(`${API_V1}/properties`, propertyRoutes);
app.use(`${API_V1}/inquiries`, inquiryRoutes);
app.use(`${API_V1}/notifications`, notificationRoutes);
app.use(`${API_V1}/admin`, adminRoutes);
app.use(`${API_V1}/health`, healthCheckRoutes);
app.use(`${API_V1}/docs`, docsRoutes);
app.use(`${API_V1}/analytics`, analyticsRoutes);

// Also keep unversioned health check for monitoring tools (optional)
app.use('/api/health', healthCheckRoutes);

logger.info(`✅ API ${API_VERSION} routes mounted at ${API_V1}`);

// ==========================================
// ROOT ROUTE
// ==========================================

app.get('/', (req, res) => {
  res.json({
    message: 'Foresite API Server',
    version: '1.0.0',
    status: 'running',
    apiVersion: API_VERSION,
    timestamp: new Date().toISOString(),
    endpoints: {
      health: `${API_V1}/health`,
      docs: `${API_V1}/docs`,
      auth: `${API_V1}/auth`,
      users: `${API_V1}/users`,
      properties: `${API_V1}/properties`,
      inquiries: `${API_V1}/inquiries`,
      notifications: `${API_V1}/notifications`,
      admin: `${API_V1}/admin`,
      analytics: `${API_V1}/analytics`
    }
  });
});

// ==========================================
// ERROR HANDLERS
// ==========================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
    availableRoutes: {
      health: `${API_V1}/health`,
      docs: `${API_V1}/docs`
    }
  });
});

// Global error handler
app.use(errorMiddleware);

// ==========================================
// SERVER STARTUP
// ==========================================

const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();
    initializeFirebase();
    setupSocketIO(io);

    httpServer.listen(PORT, () => {
      logger.info('='.repeat(60));
      logger.info(`🚀 Foresite API Server Started`);
      logger.info('='.repeat(60));
      logger.info(`📍 Port: ${PORT}`);
      logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`📡 API Version: ${API_VERSION}`);
      logger.info(`🔗 Base URL: http://localhost:${PORT}${API_V1}`);
      logger.info(`💚 Health Check: http://localhost:${PORT}${API_V1}/health`);
      logger.info(`📚 API Docs: http://localhost:${PORT}${API_V1}/docs`);
      logger.info('='.repeat(60));
    });
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// ==========================================
// GRACEFUL SHUTDOWN
// ==========================================

process.on('unhandledRejection', (err) => {
  logger.error('⚠️  Unhandled Rejection:', err);
  httpServer.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  logger.error('⚠️  Uncaught Exception:', err);
  process.exit(1);
});

process.on('SIGTERM', () => {
  logger.info('📴 SIGTERM received, shutting down gracefully');
  httpServer.close(() => {
    logger.info('✅ Process terminated');
  });
});

process.on('SIGINT', () => {
  logger.info('📴 SIGINT received, shutting down gracefully');
  httpServer.close(() => {
    logger.info('✅ Process terminated');
  });
});

startServer();

export { app, io };