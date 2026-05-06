import { Server as SocketIOServer } from 'socket.io';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';

export function setupWebSocket(io: SocketIOServer) {
  // Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      socket.data.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role
      };
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.data.user.id;
    logger.info(`User connected via WebSocket: ${userId}`);

    // Join user's personal room
    socket.join(`user:${userId}`);

    // Handle chat message streaming (for future real-time streaming)
    socket.on('chat:stream', (data) => {
      logger.info('Chat stream requested', { userId, conversationId: data.conversationId });
      // TODO: Implement streaming responses
    });

    // Handle typing indicators
    socket.on('chat:typing', (data) => {
      socket.to(`conversation:${data.conversationId}`).emit('chat:typing', {
        userId,
        isTyping: data.isTyping
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${userId}`);
    });
  });

  logger.info('WebSocket server initialized');
}

// Helper function to emit to specific user
export function emitToUser(io: SocketIOServer, userId: string, event: string, data: any) {
  io.to(`user:${userId}`).emit(event, data);
}
