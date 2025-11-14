import express from 'express';
import {
  getDashboardStats,
  getAnalytics,
  getSystemHealth,
  cleanupOldData,
  bulkDeleteUsers,
  bulkDeleteProperties,
} from '../controllers/adminController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';
import { cacheMiddleware } from '../middlewares/cache.js';

const router = express.Router();

router.use(authenticate);
router.use(isAdmin);

router.get('/dashboard', cacheMiddleware(60), getDashboardStats);
router.get('/analytics', cacheMiddleware(300), getAnalytics);
router.get('/system-health', getSystemHealth);
router.post('/cleanup', cleanupOldData);
router.post('/bulk-delete-users', bulkDeleteUsers);
router.post('/bulk-delete-properties', bulkDeleteProperties);

export default router;
