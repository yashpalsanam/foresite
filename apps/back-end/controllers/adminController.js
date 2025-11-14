import User from '../models/User.js';
import Property from '../models/Property.js';
import Inquiry from '../models/Inquiry.js';
import Notification from '../models/Notification.js';
import AnalyticsEvent from '../models/AnalyticsEvent.js';
import { logger } from '../config/logger.js';
import { asyncHandler } from '../middlewares/errorMiddleware.js';

export const getDashboardStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalProperties = await Property.countDocuments();
  const totalInquiries = await Inquiry.countDocuments();
  const pendingInquiries = await Inquiry.countDocuments({ status: 'pending' });

  // Limit recent users to 5 most recent
  const recentUsers = await User.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select('name email role createdAt');

  // Limit recent properties to 5 most recent
  const recentProperties = await Property.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select('title price status listingType createdAt');

  // Limit recent inquiries to 5 most recent
  const recentInquiries = await Inquiry.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('property', 'title')
    .populate('user', 'name email');

  // User growth for last 12 months only
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

  const userGrowth = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: twelveMonthsAgo }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
    { $limit: 12 },
  ]);

  const propertyStats = await Property.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    data: {
      overview: {
        totalUsers,
        totalProperties,
        totalInquiries,
        pendingInquiries,
      },
      recentUsers,
      recentProperties,
      recentInquiries,
      userGrowth,
      propertyStats,
    },
  });
});

export const getAnalytics = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const dateFilter = {};
  if (startDate) dateFilter.$gte = new Date(startDate);
  if (endDate) dateFilter.$lte = new Date(endDate);

  const eventsByType = await AnalyticsEvent.aggregate([
    ...(Object.keys(dateFilter).length > 0 ? [{ $match: { createdAt: dateFilter } }] : []),
    {
      $group: {
        _id: '$eventType',
        count: { $sum: 1 },
      },
    },
  ]);

  const topProperties = await AnalyticsEvent.aggregate([
    {
      $match: {
        eventType: 'property_view',
        ...(Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {}),
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

  const deviceStats = await AnalyticsEvent.aggregate([
    ...(Object.keys(dateFilter).length > 0 ? [{ $match: { createdAt: dateFilter } }] : []),
    {
      $group: {
        _id: '$device',
        count: { $sum: 1 },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    data: {
      eventsByType,
      topProperties,
      deviceStats,
    },
  });
});

export const getSystemHealth = asyncHandler(async (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

  let redisStatus = 'disconnected';
  try {
    const redisClient = getRedisClient();
    await redisClient.ping();
    redisStatus = 'connected';
  } catch (error) {
    logger.error('Redis health check failed:', error);
  }

  const memoryUsage = process.memoryUsage();
  const uptime = process.uptime();

  res.status(200).json({
    success: true,
    data: {
      database: dbStatus,
      redis: redisStatus,
      uptime: Math.floor(uptime),
      memory: {
        rss: Math.round(memoryUsage.rss / 1024 / 1024),
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
      },
      timestamp: new Date(),
    },
  });
});

export const cleanupOldData = asyncHandler(async (req, res) => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const deletedNotifications = await Notification.deleteMany({
    createdAt: { $lt: thirtyDaysAgo },
    isRead: true,
  });

  const deletedEvents = await AnalyticsEvent.deleteMany({
    createdAt: { $lt: thirtyDaysAgo },
  });

  logger.info(`Cleanup completed: ${deletedNotifications.deletedCount} notifications, ${deletedEvents.deletedCount} events`);

  res.status(200).json({
    success: true,
    message: 'Cleanup completed successfully',
    data: {
      deletedNotifications: deletedNotifications.deletedCount,
      deletedEvents: deletedEvents.deletedCount,
    },
  });
});

export const bulkDeleteUsers = asyncHandler(async (req, res) => {
  const { userIds } = req.body;

  if (!Array.isArray(userIds) || userIds.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'User IDs array is required',
    });
  }

  const result = await User.deleteMany({ _id: { $in: userIds } });

  logger.info(`Bulk delete: ${result.deletedCount} users deleted`);

  res.status(200).json({
    success: true,
    message: `${result.deletedCount} users deleted successfully`,
  });
});

export const bulkDeleteProperties = asyncHandler(async (req, res) => {
  const { propertyIds } = req.body;

  if (!Array.isArray(propertyIds) || propertyIds.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Property IDs array is required',
    });
  }

  const result = await Property.deleteMany({ _id: { $in: propertyIds } });

  logger.info(`Bulk delete: ${result.deletedCount} properties deleted`);

  res.status(200).json({
    success: true,
    message: `${result.deletedCount} properties deleted successfully`,
  });
});
