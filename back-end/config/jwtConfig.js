import jwt from 'jsonwebtoken';
import { logger } from './logger.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
export const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret';
export const JWT_REFRESH_EXPIRE = process.env.JWT_REFRESH_EXPIRE || '30d';

export const generateAccessToken = (payload) => {
  try {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRE,
      issuer: 'foresite-api',
      audience: 'foresite-client',
    });
  } catch (error) {
    logger.error('Access token generation failed:', error);
    throw error;
  }
};

export const generateRefreshToken = (payload) => {
  try {
    return jwt.sign(payload, JWT_REFRESH_SECRET, {
      expiresIn: JWT_REFRESH_EXPIRE,
      issuer: 'foresite-api',
      audience: 'foresite-client',
    });
  } catch (error) {
    logger.error('Refresh token generation failed:', error);
    throw error;
  }
};

export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET, {
      issuer: 'foresite-api',
      audience: 'foresite-client',
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Access token expired');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid access token');
    }
    throw error;
  }
};

export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET, {
      issuer: 'foresite-api',
      audience: 'foresite-client',
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Refresh token expired');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid refresh token');
    }
    throw error;
  }
};

export const decodeToken = (token) => {
  try {
    return jwt.decode(token, { complete: true });
  } catch (error) {
    logger.error('Token decode failed:', error);
    return null;
  }
};
