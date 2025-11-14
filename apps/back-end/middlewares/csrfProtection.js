import csrf from 'csurf';
import { logger } from '../config/logger.js';

export const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  },
});

export const csrfErrorHandler = (err, req, res, next) => {
  if (err.code !== 'EBADCSRFTOKEN') {
    return next(err);
  }

  logger.warn(`CSRF token validation failed for IP: ${req.ip}`);
  
  res.status(403).json({
    success: false,
    message: 'Invalid CSRF token',
  });
};
