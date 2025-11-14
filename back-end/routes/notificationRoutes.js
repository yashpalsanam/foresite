import express from 'express';
import {
  getAllNotifications,
  getNotificationById,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
  sendPushNotification,
  getUnreadCount,
} from '../controllers/notificationController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.get('/', authenticate, getAllNotifications);
router.get('/unread-count', authenticate, getUnreadCount);
router.get('/:id', authenticate, getNotificationById);
router.post('/', authenticate, isAdmin, createNotification);
router.post('/send-push', authenticate, isAdmin, sendPushNotification);
router.patch('/:id/read', authenticate, markAsRead);
router.patch('/mark-all-read', authenticate, markAllAsRead);
router.delete('/:id', authenticate, deleteNotification);
router.delete('/', authenticate, deleteAllNotifications);

export default router;
