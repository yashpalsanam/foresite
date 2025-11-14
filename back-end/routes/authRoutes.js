import express from 'express';
import {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  getMe,
  updateProfile,
  changePassword,
} from '../controllers/authController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { authRateLimiter } from '../middlewares/rateLimit.js';

const router = express.Router();

router.post('/register', authRateLimiter, register);
router.post('/login', authRateLimiter, login);
router.post('/logout', authenticate, logout);
router.post('/refresh-token', refreshToken);
router.post('/forgot-password', authRateLimiter, forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/me', authenticate, getMe);
router.put('/update-profile', authenticate, updateProfile);
router.put('/change-password', authenticate, changePassword);

export default router;
