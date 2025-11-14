import { getFirebaseMessaging } from './firebase.js';
import { logger } from './logger.js';

export const sendFCMNotification = async (token, notification, data = {}) => {
  try {
    const messaging = getFirebaseMessaging();
    
    const message = {
      token,
      notification: {
        title: notification.title,
        body: notification.body,
        imageUrl: notification.image || undefined,
      },
      data: {
        ...data,
        clickAction: data.clickAction || 'FLUTTER_NOTIFICATION_CLICK',
      },
      android: {
        priority: 'high',
        notification: {
          sound: 'default',
          channelId: 'foresite_notifications',
        },
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
          },
        },
      },
    };

    const response = await messaging.send(message);
    logger.info('FCM notification sent successfully:', response);
    return { success: true, messageId: response };
  } catch (error) {
    logger.error('FCM notification failed:', error.message);
    return { success: false, error: error.message };
  }
};

export const sendFCMMulticast = async (tokens, notification, data = {}) => {
  try {
    const messaging = getFirebaseMessaging();
    
    const message = {
      tokens,
      notification: {
        title: notification.title,
        body: notification.body,
        imageUrl: notification.image || undefined,
      },
      data: {
        ...data,
        clickAction: data.clickAction || 'FLUTTER_NOTIFICATION_CLICK',
      },
      android: {
        priority: 'high',
        notification: {
          sound: 'default',
          channelId: 'foresite_notifications',
        },
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
          },
        },
      },
    };

    const response = await messaging.sendEachForMulticast(message);
    logger.info(`FCM multicast sent: ${response.successCount}/${tokens.length} succeeded`);
    return {
      success: true,
      successCount: response.successCount,
      failureCount: response.failureCount,
      responses: response.responses,
    };
  } catch (error) {
    logger.error('FCM multicast failed:', error.message);
    return { success: false, error: error.message };
  }
};

export const subscribeTopic = async (tokens, topic) => {
  try {
    const messaging = getFirebaseMessaging();
    const response = await messaging.subscribeToTopic(tokens, topic);
    logger.info(`Subscribed ${response.successCount} tokens to topic: ${topic}`);
    return { success: true, count: response.successCount };
  } catch (error) {
    logger.error('Topic subscription failed:', error.message);
    return { success: false, error: error.message };
  }
};

export const unsubscribeTopic = async (tokens, topic) => {
  try {
    const messaging = getFirebaseMessaging();
    const response = await messaging.unsubscribeFromTopic(tokens, topic);
    logger.info(`Unsubscribed ${response.successCount} tokens from topic: ${topic}`);
    return { success: true, count: response.successCount };
  } catch (error) {
    logger.error('Topic unsubscription failed:', error.message);
    return { success: false, error: error.message };
  }
};
