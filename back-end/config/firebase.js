import admin from 'firebase-admin';
import { logger } from './logger.js';

let firebaseApp;

export const initializeFirebase = () => {
  try {
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
    logger.error('Firebase initialization failed:', error.message);
    throw error;
  }
};

export const getFirebaseApp = () => {
  if (!firebaseApp) {
    throw new Error('Firebase is not initialized');
  }
  return firebaseApp;
};

export const verifyFirebaseToken = async (token) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    logger.error('Firebase token verification failed:', error.message);
    throw error;
  }
};

export const getFirebaseAuth = () => {
  return admin.auth();
};

export const getFirebaseMessaging = () => {
  return admin.messaging();
};
