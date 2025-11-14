import client from 'prom-client';
import { logger } from './logger.js';

const register = new client.Registry();

client.collectDefaultMetrics({ register });

export const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5],
});

export const httpRequestTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

export const activeConnections = new client.Gauge({
  name: 'active_connections',
  help: 'Number of active connections',
});

export const dbConnectionPool = new client.Gauge({
  name: 'db_connection_pool_size',
  help: 'Size of database connection pool',
});

export const cacheHitRate = new client.Counter({
  name: 'cache_hit_rate',
  help: 'Cache hit rate',
  labelNames: ['cache_type'],
});

export const cacheMissRate = new client.Counter({
  name: 'cache_miss_rate',
  help: 'Cache miss rate',
  labelNames: ['cache_type'],
});

register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestTotal);
register.registerMetric(activeConnections);
register.registerMetric(dbConnectionPool);
register.registerMetric(cacheHitRate);
register.registerMetric(cacheMissRate);

export const getMetrics = async () => {
  try {
    return await register.metrics();
  } catch (error) {
    logger.error('Error getting metrics:', error);
    throw error;
  }
};

export const recordHttpRequest = (method, route, statusCode, duration) => {
  httpRequestTotal.inc({ method, route, status_code: statusCode });
  httpRequestDuration.observe({ method, route, status_code: statusCode }, duration);
};

export default register;
