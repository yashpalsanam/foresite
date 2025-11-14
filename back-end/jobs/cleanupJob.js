import Notification from '../models/Notification.js';
import AnalyticsEvent from '../models/AnalyticsEvent.js';
import TokenBlacklist from '../models/TokenBlacklist.js';
import { logger } from '../config/logger.js';

export const cleanupExpiredNotifications = async () => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const result = await Notification.deleteMany({
      createdAt: { $lt: thirtyDaysAgo },
      isRead: true,
    });

    logger.info(`Cleanup: Deleted ${result.deletedCount} old notifications`);
    return result.deletedCount;
  } catch (error) {
    logger.error('Notification cleanup error:', error);
    throw error;
  }
};

export const cleanupOldAnalytics = async () => {
  try {
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

    const result = await AnalyticsEvent.deleteMany({
      createdAt: { $lt: ninetyDaysAgo },
    });

    logger.info(`Cleanup: Deleted ${result.deletedCount} old analytics events`);
    return result.deletedCount;
  } catch (error) {
    logger.error('Analytics cleanup error:', error);
    throw error;
  }
};

export const cleanupExpiredTokens = async () => {
  try {
    const result = await TokenBlacklist.removeExpired();

    logger.info(`Cleanup: Removed ${result} expired tokens`);
    return result;
  } catch (error) {
    logger.error('Token cleanup error:', error);
    throw error;
  }
};

export const runAllCleanupTasks = async () => {
  try {
    logger.info('Starting cleanup tasks...');

    const notifications = await cleanupExpiredNotifications();
    const analytics = await cleanupOldAnalytics();
    const tokens = await cleanupExpiredTokens();

    logger.info('All cleanup tasks completed', {
      notifications,
      analytics,
      tokens,
    });

    return {
      success: true,
      deleted: {
        notifications,
        analytics,
        tokens,
      },
    };
  } catch (error) {
    logger.error('Cleanup tasks failed:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};
