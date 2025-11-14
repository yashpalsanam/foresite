import express from 'express';
import {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  uploadPropertyImages,
  deletePropertyImage,
  getNearbyProperties,
  getFeaturedProperties,
  getPropertyStats,
} from '../controllers/propertyController.js';
import { authenticate, optionalAuth } from '../middlewares/authMiddleware.js';
import { isAdminOrAgent, isAdmin } from '../middlewares/roleMiddleware.js';
import { uploadMultiple } from '../middlewares/uploadMiddleware.js';
import { cacheMiddleware, invalidateCache } from '../middlewares/cache.js';

const router = express.Router();

router.get('/', optionalAuth, cacheMiddleware(600), getAllProperties);
router.get('/featured', cacheMiddleware(600), getFeaturedProperties);
router.get('/nearby', cacheMiddleware(300), getNearbyProperties);
router.get('/stats', authenticate, isAdmin, getPropertyStats);
router.get('/:id', optionalAuth, getPropertyById);
router.post('/', authenticate, isAdminOrAgent, invalidateCache(), createProperty);
router.put('/:id', authenticate, isAdminOrAgent, invalidateCache(), updateProperty);
router.delete('/:id', authenticate, isAdminOrAgent, invalidateCache(), deleteProperty);
router.post('/:id/images', authenticate, isAdminOrAgent, uploadMultiple, uploadPropertyImages);
router.delete('/:id/images/:imageId', authenticate, isAdminOrAgent, deletePropertyImage);

export default router;
