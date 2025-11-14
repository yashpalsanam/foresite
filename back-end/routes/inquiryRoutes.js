import express from 'express';
import {
  getAllInquiries,
  getInquiryById,
  createInquiry,
  updateInquiry,
  deleteInquiry,
  getMyInquiries,
  getInquiryStats,
  createPublicInquiry,
} from '../controllers/inquiryController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { isAdminOrAgent } from '../middlewares/roleMiddleware.js';
import { cacheMiddleware } from '../middlewares/cache.js';

const router = express.Router();

router.post('/public', createPublicInquiry);
router.get('/', authenticate, isAdminOrAgent, cacheMiddleware(300), getAllInquiries);
router.get('/my-inquiries', authenticate, getMyInquiries);
router.get('/stats', authenticate, isAdminOrAgent, getInquiryStats);
router.get('/:id', authenticate, getInquiryById);
router.post('/', authenticate, createInquiry);
router.put('/:id', authenticate, isAdminOrAgent, updateInquiry);
router.delete('/:id', authenticate, isAdminOrAgent, deleteInquiry);

export default router;
