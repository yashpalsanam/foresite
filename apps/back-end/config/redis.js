import { createClient } from 'redis';
import { logger } from './logger.js';

let redisClient;

export const connectRedis = async () => {
  try {
    redisClient = createClient({
      socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        reconnectStrategy: false,
      },
      password: process.env.REDIS_PASSWORD || undefined,
    });

    redisClient.on('error', (err) => {
      logger.warn('Redis unavailable - caching disabled');
    });

    await redisClient.connect();
    await redisClient.ping();
    logger.info('Redis connection successful');

    return redisClient;
  } catch (error) {
    logger.warn('Redis connection failed - continuing without caching');
    redisClient = null;
    return null;
  }
};

export const getRedisClient = () => {
  if (!redisClient || !redisClient.isOpen) {
    return null;
  }
  return redisClient;
};

export const disconnectRedis = async () => {
  if (redisClient) {
    await redisClient.quit();
    logger.info('Redis connection closed');
  }
};

export const cacheGet = async (key) => {
  if (!redisClient || !redisClient.isOpen) return null;
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    logger.error('Redis get error:', error);
    return null;
  }
};

export const cacheSet = async (key, value, expiryInSeconds = 3600) => {
  if (!redisClient || !redisClient.isOpen) return false;
  try {
    await redisClient.setEx(key, expiryInSeconds, JSON.stringify(value));
    return true;
  } catch (error) {
    logger.error('Redis set error:', error);
    return false;
  }
};

export const cacheDel = async (key) => {
  if (!redisClient || !redisClient.isOpen) return false;
  try {
    await redisClient.del(key);
    return true;
  } catch (error) {
    logger.error('Redis delete error:', error);
    return false;
  }
};

export const cacheFlush = async () => {
  if (!redisClient || !redisClient.isOpen) return false;
  try {
    await redisClient.flushAll();
    logger.info('Redis cache flushed');
    return true;
  } catch (error) {
    logger.error('Redis flush error:', error);
    return false;
  }
};
