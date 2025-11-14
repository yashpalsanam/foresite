import { sendFCMNotification, sendFCMMulticast } from '../config/fcm.js';
import User from '../models/User.js';
import { logger } from '../config/logger.js';

export const sendPushNotification = async (userId, notification, data = {}) => {
  try {
    const user = await User.findById(userId);
    
    if (!user || !user.fcmToken) {
      logger.warn(`User ${userId} has no FCM token`);
      return { success: false, message: 'No FCM token available' };
    }

    const result = await sendFCMNotification(user.fcmToken, notification, data);
    
    return result;
  } catch (error) {
    logger.error('Send push notification failed:', error.message);
    return { success: false, error: error.message };
  }
};

export const sendPushToMultipleUsers = async (userIds, notification, data = {}) => {
  try {
    const users = await User.find({ _id: { $in: userIds } });
    const tokens = users.filter(u => u.fcmToken).map(u => u.fcmToken);
    
    if (tokens.length === 0) {
      logger.warn('No FCM tokens found for users');
      return { success: false, message: 'No FCM tokens available' };
    }

    const result = await sendFCMMulticast(tokens, notification, data);
    
    return result;
  } catch (error) {
    logger.error('Send push to multiple users failed:', error.message);
    return { success: false, error: error.message };
  }
};

export const sendPushToAllUsers = async (notification, data = {}) => {
  try {
    const users = await User.find({ fcmToken: { $ne: null } });
    const tokens = users.map(u => u.fcmToken);
    
    if (tokens.length === 0) {
      logger.warn('No FCM tokens found');
      return { success: false, message: 'No FCM tokens available' };
    }

    const result = await sendFCMMulticast(tokens, notification, data);
    
    return result;
  } catch (error) {
    logger.error('Send push to all users failed:', error.message);
    return { success: false, error: error.message };
  }
};
