import { logger } from '../config/logger.js';

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    if (!roles.includes(req.user.role)) {
      logger.warn(`Unauthorized access attempt by user ${req.user.id} with role ${req.user.role}`);
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action',
      });
    }

    next();
  };
};

export const isAdmin = authorize('admin');
export const isAdminOrAgent = authorize('admin', 'agent');
export const isUser = authorize('user', 'agent', 'admin');
