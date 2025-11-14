import { cacheGet, cacheSet, cacheDel } from '../config/redis.js';
import { logger } from '../config/logger.js';
import { cacheHitRate, cacheMissRate } from '../config/monitoring.js';

export const cacheMiddleware = (duration = 300) => {
  return async (req, res, next) => {
    if (req.method !== 'GET') {
      return next();
    }

    const key = `cache:${req.originalUrl}`;

    try {
      const cachedData = await cacheGet(key);

      if (cachedData) {
        logger.info(`Cache hit: ${key}`);
        cacheHitRate.inc({ cache_type: 'api' });
        return res.status(200).json({
          ...cachedData,
          cached: true,
        });
      }

      logger.info(`Cache miss: ${key}`);
      cacheMissRate.inc({ cache_type: 'api' });

      const originalJson = res.json.bind(res);
      res.json = (data) => {
        if (res.statusCode === 200 && data.success !== false) {
          cacheSet(key, data, duration).catch(err => {
            logger.error('Cache set error:', err);
          });
        }
        return originalJson(data);
      };

      next();
    } catch (error) {
      logger.error('Cache middleware error:', error);
      next();
    }
  };
};

export const invalidateCache = (pattern) => {
  return async (req, res, next) => {
    res.on('finish', async () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          const key = pattern || `cache:${req.baseUrl}*`;
          await cacheDel(key);
          logger.info(`Cache invalidated: ${key}`);
        } catch (error) {
          logger.error('Cache invalidation error:', error);
        }
      }
    });
    next();
  };
};

export const clearCacheByKey = async (key) => {
  try {
    await cacheDel(key);
    logger.info(`Cache cleared: ${key}`);
    return true;
  } catch (error) {
    logger.error('Clear cache error:', error);
    return false;
  }
};
