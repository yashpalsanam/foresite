import dotenv from 'dotenv';
import { logger } from './logger.js';

dotenv.config();

const requiredEnvVars = [
  'NODE_ENV',
  'PORT',
  'MONGO_URI',
  'JWT_SECRET',
  'REDIS_HOST',
];

const optionalEnvVars = [
  'FIREBASE_PROJECT_ID',
  'FIREBASE_PRIVATE_KEY',
  'FIREBASE_CLIENT_EMAIL',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'GOOGLE_MAPS_API_KEY',
  'EMAIL_HOST',
  'EMAIL_USER',
  'EMAIL_PASSWORD',
];

export const validateEnv = () => {
  const missing = [];
  
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }

  if (missing.length > 0) {
    logger.error(`Missing required environment variables: ${missing.join(', ')}`);
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  const missingOptional = [];
  for (const envVar of optionalEnvVars) {
    if (!process.env[envVar]) {
      missingOptional.push(envVar);
    }
  }

  if (missingOptional.length > 0) {
    logger.warn(`Missing optional environment variables: ${missingOptional.join(', ')}`);
  }

  logger.info('Environment variables validated successfully');
  return true;
};

export const getEnv = (key, defaultValue = undefined) => {
  return process.env[key] || defaultValue;
};

export const isProduction = () => {
  return process.env.NODE_ENV === 'production';
};

export const isDevelopment = () => {
  return process.env.NODE_ENV === 'development';
};

export const isTest = () => {
  return process.env.NODE_ENV === 'test';
};
