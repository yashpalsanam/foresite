import express from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  getUserStats,
} from '../controllers/userController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { isAdmin, isAdminOrAgent } from '../middlewares/roleMiddleware.js';
import { cacheMiddleware } from '../middlewares/cache.js';

const router = express.Router();

router.get('/', authenticate, isAdminOrAgent, cacheMiddleware(300), getAllUsers);
router.get('/stats', authenticate, isAdmin, getUserStats);
router.get('/:id', authenticate, isAdminOrAgent, getUserById);
router.post('/', authenticate, isAdmin, createUser);
router.put('/:id', authenticate, isAdmin, updateUser);
router.delete('/:id', authenticate, isAdmin, deleteUser);
router.patch('/:id/toggle-status', authenticate, isAdmin, toggleUserStatus);

export default router;
