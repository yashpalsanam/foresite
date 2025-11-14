import morgan from 'morgan';
import { logger } from '../config/logger.js';
import { recordHttpRequest } from '../config/monitoring.js';

const stream = {
  write: (message) => logger.http(message.trim()),
};

const skip = (req) => {
  return req.path === '/api/health';
};

export const requestLogger = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  { stream, skip }
);

export const metricsMiddleware = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    recordHttpRequest(req.method, req.route?.path || req.path, res.statusCode, duration);
  });

  next();
};
