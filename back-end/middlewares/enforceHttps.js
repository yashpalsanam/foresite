import { logger } from '../config/logger.js';

export const enforceHttps = (req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https' && process.env.NODE_ENV === 'production') {
    logger.warn(`HTTP request detected, redirecting to HTTPS: ${req.url}`);
    return res.redirect(301, `https://${req.hostname}${req.url}`);
  }
  next();
};
