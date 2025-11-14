import { verifyAccessToken } from './jwtConfig.js';
import { logger } from './logger.js';

const connectedUsers = new Map();

export const setupSocketIO = (io) => {
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return next(new Error('Authentication token required'));
      }

      const decoded = verifyAccessToken(token);
      socket.userId = decoded.id;
      socket.userRole = decoded.role;
      
      next();
    } catch (error) {
      logger.error('Socket authentication failed:', error.message);
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.userId;
    connectedUsers.set(userId, socket.id);
    
    logger.info(`User connected: ${userId} (${socket.id})`);

    socket.join(`user_${userId}`);
    
    if (socket.userRole === 'admin') {
      socket.join('admins');
    }

    socket.on('join_room', (roomId) => {
      socket.join(roomId);
      logger.info(`User ${userId} joined room: ${roomId}`);
    });

    socket.on('leave_room', (roomId) => {
      socket.leave(roomId);
      logger.info(`User ${userId} left room: ${roomId}`);
    });

    socket.on('send_message', (data) => {
      const { roomId, message } = data;
      io.to(roomId).emit('receive_message', {
        senderId: userId,
        message,
        timestamp: new Date(),
      });
    });

    socket.on('disconnect', (reason) => {
      connectedUsers.delete(userId);
      logger.info(`User disconnected: ${userId} (${reason})`);
    });

    socket.on('error', (error) => {
      logger.error(`Socket error for user ${userId}:`, error);
    });
  });

  return io;
};

export const emitToUser = (io, userId, event, data) => {
  io.to(`user_${userId}`).emit(event, data);
};

export const emitToRoom = (io, roomId, event, data) => {
  io.to(roomId).emit(event, data);
};

export const emitToAdmins = (io, event, data) => {
  io.to('admins').emit(event, data);
};

export const broadcastToAll = (io, event, data) => {
  io.emit(event, data);
};

export const getConnectedUsers = () => {
  return Array.from(connectedUsers.keys());
};

export const isUserConnected = (userId) => {
  return connectedUsers.has(userId);
};
