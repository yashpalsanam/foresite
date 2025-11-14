import AnalyticsEvent from '../models/AnalyticsEvent.js';
import Property from '../models/Property.js';
import User from '../models/User.js';
import { logger } from '../config/logger.js';

export const aggregateDailyAnalytics = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const events = await AnalyticsEvent.aggregate([
      {
        $match: {
          createdAt: { $gte: today, $lt: tomorrow },
        },
      },
      {
        $group: {
          _id: '$eventType',
          count: { $sum: 1 },
        },
      },
    ]);

    logger.info('Daily analytics aggregated', { date: today, events });

    return {
      success: true,
      date: today,
      events,
    };
  } catch (error) {
    logger.error('Analytics aggregation error:', error);
    throw error;
  }
};

export const updatePropertyViewCounts = async () => {
  try {
    const propertyViews = await AnalyticsEvent.aggregate([
      {
        $match: {
          eventType: 'property_view',
          relatedModel: 'Property',
        },
      },
      {
        $group: {
          _id: '$relatedId',
          views: { $sum: 1 },
        },
      },
    ]);

    for (const item of propertyViews) {
      await Property.findByIdAndUpdate(item._id, {
        views: item.views,
      });
    }

    logger.info(`Updated view counts for ${propertyViews.length} properties`);

    return {
      success: true,
      updated: propertyViews.length,
    };
  } catch (error) {
    logger.error('View count update error:', error);
    throw error;
  }
};

export const generateWeeklyReport = async () => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const totalEvents = await AnalyticsEvent.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    const newUsers = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    const newProperties = await Property.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    const topProperties = await AnalyticsEvent.aggregate([
      {
        $match: {
          eventType: 'property_view',
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: '$relatedId',
          views: { $sum: 1 },
        },
      },
      { $sort: { views: -1 } },
      { $limit: 10 },
    ]);

    const report = {
      period: 'Last 7 days',
      totalEvents,
      newUsers,
      newProperties,
      topProperties,
      generatedAt: new Date(),
    };

    logger.info('Weekly report generated', report);

    return {
      success: true,
      report,
    };
  } catch (error) {
    logger.error('Weekly report generation error:', error);
    throw error;
  }
};
