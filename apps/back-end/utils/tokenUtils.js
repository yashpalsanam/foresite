import jwt from 'jsonwebtoken';
import { logger } from '../config/logger.js';

export const generateToken = (payload, secret, expiresIn) => {
  try {
    return jwt.sign(payload, secret, { expiresIn });
  } catch (error) {
    logger.error('Token generation failed:', error);
    throw error;
  }
};

export const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    logger.error('Token verification failed:', error);
    throw error;
  }
};

export const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    logger.error('Token decode failed:', error);
    return null;
  }
};

export const extractTokenFromHeader = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.split(' ')[1];
};
