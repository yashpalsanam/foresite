import express from 'express';
import AnalyticsEvent from '../models/AnalyticsEvent.js';
import { authenticate, optionalAuth } from '../middlewares/authMiddleware.js';
import { asyncHandler } from '../middlewares/errorMiddleware.js';
import { logger } from '../config/logger.js';

const router = express.Router();

router.post('/track', optionalAuth, asyncHandler(async (req, res) => {
  const {
    eventType,
    eventName,
    sessionId,
    device,
    browser,
    os,
    referrer,
    path,
    query,
    relatedModel,
    relatedId,
    metadata,
    duration,
  } = req.body;

  const analyticsData = {
    eventType,
    eventName,
    sessionId,
    user: req.user?._id || null,
    ipAddress: req.ip,
    userAgent: req.get('user-agent'),
    device: device || 'unknown',
    browser,
    os,
    referrer,
    path,
    query,
    relatedModel,
    relatedId,
    metadata,
    duration,
  };

  const event = await AnalyticsEvent.create(analyticsData);

  logger.info(`Analytics event tracked: ${eventType} - ${eventName}`);

  res.status(201).json({
    success: true,
    message: 'Event tracked successfully',
    data: { eventId: event._id },
  });
}));

router.get('/events', authenticate, asyncHandler(async (req, res) => {
  const { page = 1, limit = 50, eventType, startDate, endDate } = req.query;

  const query = {};

  if (eventType) query.eventType = eventType;
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  const events = await AnalyticsEvent.find(query)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });

  const count = await AnalyticsEvent.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      events,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      total: count,
    },
  });
}));

router.get('/summary', authenticate, asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const dateFilter = {};
  if (startDate) dateFilter.$gte = new Date(startDate);
  if (endDate) dateFilter.$lte = new Date(endDate);

  const totalEvents = await AnalyticsEvent.countDocuments(
    Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {}
  );

  const eventsByType = await AnalyticsEvent.aggregate([
    ...(Object.keys(dateFilter).length > 0 ? [{ $match: { createdAt: dateFilter } }] : []),
    {
      $group: {
        _id: '$eventType',
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ]);

  const deviceBreakdown = await AnalyticsEvent.aggregate([
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
      totalEvents,
      eventsByType,
      deviceBreakdown,
    },
  });
}));

export default router;
