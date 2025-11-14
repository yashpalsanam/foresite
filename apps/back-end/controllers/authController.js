import User from '../models/User.js';
import TokenBlacklist from '../models/TokenBlacklist.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../config/jwtConfig.js';
import { sendEmail } from '../utils/sendEmail.js';
import { logger } from '../config/logger.js';
import { asyncHandler } from '../middlewares/errorMiddleware.js';
import crypto from 'crypto';

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, role } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'Email already registered',
    });
  }

  const user = await User.create({
    name,
    email,
    password,
    phone,
    role: role || 'user',
  });

  const accessToken = generateAccessToken({ id: user._id, role: user.role });
  const refreshToken = generateRefreshToken({ id: user._id, role: user.role });

  logger.info(`User registered: ${user.email}`);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password, fcmToken } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required',
    });
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials',
    });
  }

  if (!user.isActive) {
    return res.status(403).json({
      success: false,
      message: 'Account is inactive',
    });
  }

  if (fcmToken) {
    user.fcmToken = fcmToken;
  }

  user.lastLogin = new Date();
  await user.save();

  const accessToken = generateAccessToken({ id: user._id, role: user.role });
  const refreshToken = generateRefreshToken({ id: user._id, role: user.role });

  logger.info(`User logged in: ${user.email}`);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      accessToken,
      refreshToken,
    },
  });
});

export const logout = asyncHandler(async (req, res) => {
  const token = req.token;
  const user = req.user;

  if (token) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await TokenBlacklist.addToBlacklist(token, 'access', user._id, 'logout', expiresAt);
  }

  logger.info(`User logged out: ${user.email}`);

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({
      success: false,
      message: 'Refresh token is required',
    });
  }

  const isBlacklisted = await TokenBlacklist.isBlacklisted(refreshToken);
  if (isBlacklisted) {
    return res.status(401).json({
      success: false,
      message: 'Refresh token has been revoked',
    });
  }

  const decoded = verifyRefreshToken(refreshToken);

  const user = await User.findById(decoded.id);
  if (!user || !user.isActive) {
    return res.status(401).json({
      success: false,
      message: 'Invalid refresh token',
    });
  }

  const newAccessToken = generateAccessToken({ id: user._id, role: user.role });
  const newRefreshToken = generateRefreshToken({ id: user._id, role: user.role });

  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  await TokenBlacklist.addToBlacklist(refreshToken, 'refresh', user._id, 'logout', expiresAt);

  res.status(200).json({
    success: true,
    message: 'Token refreshed successfully',
    data: {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    },
  });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpire = Date.now() + 30 * 60 * 1000;
  await user.save();

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  try {
    await sendEmail({
      to: user.email,
      subject: 'Password Reset Request',
      html: `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
    });

    logger.info(`Password reset email sent to: ${user.email}`);

    res.status(200).json({
      success: true,
      message: 'Password reset email sent',
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    logger.error('Email send error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to send password reset email',
    });
  }
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or expired reset token',
    });
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  logger.info(`Password reset successful for: ${user.email}`);

  res.status(200).json({
    success: true,
    message: 'Password reset successful',
  });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    success: true,
    data: { user },
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;

  const user = await User.findById(req.user._id);

  if (name) user.name = name;
  if (phone) user.phone = phone;

  await user.save();

  logger.info(`Profile updated: ${user.email}`);

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: { user },
  });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');

  if (!(await user.comparePassword(currentPassword))) {
    return res.status(401).json({
      success: false,
      message: 'Current password is incorrect',
    });
  }

  user.password = newPassword;
  await user.save();

  logger.info(`Password changed: ${user.email}`);

  res.status(200).json({
    success: true,
    message: 'Password changed successfully',
  });
});
