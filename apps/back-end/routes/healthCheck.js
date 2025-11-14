import express from 'express';
import mongoose from 'mongoose';
import { getRedisClient } from '../config/redis.js';
import { logger } from '../config/logger.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const healthCheck = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    services: {
      api: 'healthy',
      database: 'unknown',
      redis: 'unknown',
    },
  };

  try {
    const dbState = mongoose.connection.readyState;
    healthCheck.services.database = dbState === 1 ? 'healthy' : 'unhealthy';
  } catch (error) {
    healthCheck.services.database = 'unhealthy';
    logger.error('Database health check failed:', error);
  }

  try {
    const redisClient = getRedisClient();
    await redisClient.ping();
    healthCheck.services.redis = 'healthy';
  } catch (error) {
    healthCheck.services.redis = 'unhealthy';
    logger.error('Redis health check failed:', error);
  }

  const isHealthy = Object.values(healthCheck.services).every(
    (status) => status === 'healthy'
  );

  const statusCode = isHealthy ? 200 : 503;

  res.status(statusCode).json(healthCheck);
});

export default router;
