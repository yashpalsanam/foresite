import Notification from '../models/Notification.js';
import { sendFCMNotification } from '../config/fcm.js';
import { logger } from '../config/logger.js';
import { asyncHandler } from '../middlewares/errorMiddleware.js';

export const getAllNotifications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, isRead, type, priority } = req.query;

  const query = { recipient: req.user._id };

  if (isRead !== undefined) query.isRead = isRead === 'true';
  if (type) query.type = type;
  if (priority) query.priority = priority;

  const notifications = await Notification.find(query)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });

  const count = await Notification.countDocuments(query);
  const unreadCount = await Notification.countDocuments({ recipient: req.user._id, isRead: false });

  res.status(200).json({
    success: true,
    data: {
      notifications,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      total: count,
      unreadCount,
    },
  });
});

export const getNotificationById = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return res.status(404).json({
      success: false,
      message: 'Notification not found',
    });
  }

  if (notification.recipient.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized',
    });
  }

  res.status(200).json({
    success: true,
    data: { notification },
  });
});

export const createNotification = asyncHandler(async (req, res) => {
  const { recipient, title, message, type, priority, category, actionUrl, actionText } = req.body;

  const notification = await Notification.create({
    recipient,
    sender: req.user._id,
    title,
    message,
    type,
    priority,
    category,
    actionUrl,
    actionText,
  });

  logger.info(`Notification created: ${notification._id}`);

  res.status(201).json({
    success: true,
    message: 'Notification created successfully',
    data: { notification },
  });
});

export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return res.status(404).json({
      success: false,
      message: 'Notification not found',
    });
  }

  if (notification.recipient.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized',
    });
  }

  await notification.markAsRead();

  res.status(200).json({
    success: true,
    message: 'Notification marked as read',
    data: { notification },
  });
});

export const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { recipient: req.user._id, isRead: false },
    { isRead: true, readAt: new Date() }
  );

  logger.info(`All notifications marked as read for user: ${req.user._id}`);

  res.status(200).json({
    success: true,
    message: 'All notifications marked as read',
  });
});

export const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return res.status(404).json({
      success: false,
      message: 'Notification not found',
    });
  }

  if (notification.recipient.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized',
    });
  }

  await notification.deleteOne();

  logger.info(`Notification deleted: ${notification._id}`);

  res.status(200).json({
    success: true,
    message: 'Notification deleted successfully',
  });
});

export const deleteAllNotifications = asyncHandler(async (req, res) => {
  await Notification.deleteMany({ recipient: req.user._id });

  logger.info(`All notifications deleted for user: ${req.user._id}`);

  res.status(200).json({
    success: true,
    message: 'All notifications deleted successfully',
  });
});

export const sendPushNotification = asyncHandler(async (req, res) => {
  const { userId, title, message, data } = req.body;

  const user = await User.findById(userId);

  if (!user || !user.fcmToken) {
    return res.status(400).json({
      success: false,
      message: 'User not found or FCM token not available',
    });
  }

  const result = await sendFCMNotification(user.fcmToken, { title, body: message }, data);

  if (result.success) {
    logger.info(`Push notification sent to user: ${userId}`);
    res.status(200).json({
      success: true,
      message: 'Push notification sent successfully',
    });
  } else {
    res.status(500).json({
      success: false,
      message: 'Failed to send push notification',
    });
  }
});

export const getUnreadCount = asyncHandler(async (req, res) => {
  const unreadCount = await Notification.countDocuments({
    recipient: req.user._id,
    isRead: false,
  });

  res.status(200).json({
    success: true,
    data: { unreadCount },
  });
});
