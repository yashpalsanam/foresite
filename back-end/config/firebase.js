import admin from 'firebase-admin';
import { logger } from './logger.js';

let firebaseApp;

export const initializeFirebase = () => {
  try {
    // Check if Firebase credentials are available
    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_PRIVATE_KEY || !process.env.FIREBASE_CLIENT_EMAIL) {
      logger.warn('Firebase credentials not found - push notifications disabled');
      firebaseApp = null;
      return null;
    }

    const serviceAccount = {
      type: 'service_account',
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
    };

    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    logger.info('Firebase Admin SDK initialized');
    return firebaseApp;
  } catch (error) {
    logger.warn('Firebase initialization failed - push notifications disabled');
    firebaseApp = null;
    return null;
  }
};

export const getFirebaseApp = () => {
  return firebaseApp;
};

export const verifyFirebaseToken = async (token) => {
  if (!firebaseApp) {
    throw new Error('Firebase is not initialized');
  }
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    logger.error('Firebase token verification failed:', error.message);
    throw error;
  }
};

export const getFirebaseAuth = () => {
  if (!firebaseApp) return null;
  return admin.auth();
};

export const getFirebaseMessaging = () => {
  if (!firebaseApp) return null;
  return admin.messaging();
};
