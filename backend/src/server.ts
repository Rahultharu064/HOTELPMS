// Sanitize CLOUDINARY_URL before ANY imports, as cloudinary SDK throws on import if it's invalid
if (process.env.CLOUDINARY_URL && !process.env.CLOUDINARY_URL.startsWith('cloudinary://')) {
  console.warn('⚠️ Invalid CLOUDINARY_URL detected. Removing from environment to prevent crash.');
  delete process.env.CLOUDINARY_URL;
}

import app from './app';
console.log('App initialized and starting server...');
import http from 'http';
import { Server } from 'socket.io';
import { config } from './config';
import { prisma } from './config/database';

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: config.corsOrigin,
    credentials: true,
  },
});

// Store active connections and rooms
interface SocketUser {
  socketId: string;
  userId?: number;
  role?: string;
  roomId?: number;
}

const activeSockets: Map<string, SocketUser> = new Map();

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Store socket connection
  activeSockets.set(socket.id, { socketId: socket.id });

  // Authenticate user (will be implemented later with JWT)
  socket.on('authenticate', (data: { userId: number; role: string }) => {
    const user = activeSockets.get(socket.id);
    if (user) {
      user.userId = data.userId;
      user.role = data.role;
      activeSockets.set(socket.id, user);
      console.log(`User ${data.userId} (${data.role}) authenticated with socket ${socket.id}`);
    }
  });

  // Join room for specific room updates
  socket.on('join-room', (roomId: number) => {
    const roomName = `room-${roomId}`;
    socket.join(roomName);
    
    const user = activeSockets.get(socket.id);
    if (user) {
      user.roomId = roomId;
      activeSockets.set(socket.id, user);
    }
    
    console.log(`Socket ${socket.id} joined room-${roomId}`);
    
    // Send current room status
    socket.emit('room-status', { roomId, status: 'joined' });
  });

  // Leave room
  socket.on('leave-room', (roomId: number) => {
    const roomName = `room-${roomId}`;
    socket.leave(roomName);
    
    const user = activeSockets.get(socket.id);
    if (user && user.roomId === roomId) {
      user.roomId = undefined;
      activeSockets.set(socket.id, user);
    }
    
    console.log(`Socket ${socket.id} left room-${roomId}`);
  });

  // Join booking for real-time updates
  socket.on('join-booking', (bookingId: number) => {
    const bookingName = `booking-${bookingId}`;
    socket.join(bookingName);
    console.log(`Socket ${socket.id} joined booking-${bookingId}`);
  });

  // Leave booking
  socket.on('leave-booking', (bookingId: number) => {
    const bookingName = `booking-${bookingId}`;
    socket.leave(bookingName);
    console.log(`Socket ${socket.id} left booking-${bookingId}`);
  });

  // Join housekeeping dashboard
  socket.on('join-housekeeping', (_userId: number) => {
    socket.join('housekeeping-dashboard');
    console.log(`Socket ${socket.id} joined housekeeping dashboard`);
  });

  // Join front office dashboard
  socket.on('join-frontoffice', (_userId: number) => {
    socket.join('frontoffice-dashboard');
    console.log(`Socket ${socket.id} joined front office dashboard`);
  });

  // Handle room status change events from housekeeping
  socket.on('room-status-change', async (data: { 
    roomId: number; 
    oldStatus: string; 
    newStatus: string;
    performedBy: string;
  }) => {
    console.log(`Room ${data.roomId} status changed from ${data.oldStatus} to ${data.newStatus}`);
    
    // Broadcast to all clients in the room
    io.to(`room-${data.roomId}`).emit('room-status-updated', data);
    
    // Broadcast to housekeeping dashboard
    io.to('housekeeping-dashboard').emit('room-status-changed', data);
    
    // Broadcast to front office dashboard
    io.to('frontoffice-dashboard').emit('room-status-changed', data);
    
    // Store in database via service (implemented in service layer)
    // await roomService.updateRoomStatus(data.roomId, data.newStatus);
  });

  // Handle cleaning task updates
  socket.on('cleaning-task-update', (data: {
    taskId: number;
    status: string;
    assignedTo?: string;
    completedAt?: Date;
  }) => {
    console.log(`Cleaning task ${data.taskId} updated: ${data.status}`);
    
    // Broadcast to housekeeping dashboard
    io.to('housekeeping-dashboard').emit('cleaning-task-updated', data);
  });

  // Handle guest requests
  socket.on('guest-request', (data: {
    roomId: number;
    requestType: string;
    message: string;
    requestedBy: string;
  }) => {
    console.log(`Guest request from room ${data.roomId}: ${data.requestType}`);
    
    // Broadcast to housekeeping and front office
    io.to('housekeeping-dashboard').emit('new-guest-request', data);
    io.to('frontoffice-dashboard').emit('new-guest-request', data);
  });

  // Handle inventory updates
  socket.on('inventory-update', (data: {
    itemId: number;
    itemName: string;
    quantity: number;
    action: string;
  }) => {
    console.log(`Inventory update: ${data.itemName} - ${data.action}`);
    
    // Broadcast to housekeeping dashboard
    io.to('housekeeping-dashboard').emit('inventory-updated', data);
  });

  // Handle booking creation/updates
  socket.on('booking-event', (data: {
    bookingId: number;
    event: string;
    data: any;
  }) => {
    console.log(`Booking event: ${data.event} for booking ${data.bookingId}`);
    
    // Broadcast to specific booking room
    io.to(`booking-${data.bookingId}`).emit('booking-event', data);
    
    // Broadcast to front office dashboard
    io.to('frontoffice-dashboard').emit('booking-updated', data);
  });

  // Handle payment events
  socket.on('payment-event', (data: {
    bookingId: number;
    paymentId: number;
    status: string;
    amount: number;
  }) => {
    console.log(`Payment event: ${data.status} for booking ${data.bookingId}`);
    
    // Broadcast to specific booking room
    io.to(`booking-${data.bookingId}`).emit('payment-processed', data);
    
    // Broadcast to front office dashboard
    io.to('frontoffice-dashboard').emit('payment-received', data);
  });

  // Handle maintenance requests
  socket.on('maintenance-request', (data: {
    roomId: number;
    issue: string;
    priority: string;
    reportedBy: string;
  }) => {
    console.log(`Maintenance request for room ${data.roomId}: ${data.issue}`);
    
    // Broadcast to housekeeping dashboard
    io.to('housekeeping-dashboard').emit('maintenance-requested', data);
    
    // Broadcast to front office dashboard
    io.to('frontoffice-dashboard').emit('maintenance-requested', data);
  });

  // Handle notifications
  socket.on('notification', (data: {
    userId: number;
    title: string;
    message: string;
    type: string;
  }) => {
    console.log(`Notification for user ${data.userId}: ${data.title}`);
    
    // Find user's socket and send notification
    for (const [socketId, user] of activeSockets.entries()) {
      if (user.userId === data.userId) {
        io.to(socketId).emit('notification-received', data);
        break;
      }
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const user = activeSockets.get(socket.id);
    if (user) {
      console.log(`Client disconnected: ${socket.id} - User: ${user.userId || 'unauthenticated'}`);
    } else {
      console.log('Client disconnected:', socket.id);
    }
    activeSockets.delete(socket.id);
  });

  // Handle errors
  socket.on('error', (error: Error) => {
    console.error(`Socket error for ${socket.id}:`, error.message);
  });
});

// Make io accessible to routes
app.set('io', io);

// Graceful shutdown
const gracefulShutdown = async () => {
  console.log('Received shutdown signal, closing server...');
  
  // Close all socket connections
  for (const [socketId] of activeSockets) {
    const socket = io.sockets.sockets.get(socketId);
    if (socket) {
      socket.disconnect(true);
    }
  }
  
  server.close(async (error) => {
    if (error) {
      console.error('Error closing server:', error);
      process.exit(1);
    }
    
    console.log('HTTP server closed');
    
    try {
      await prisma.$disconnect();
      console.log('Database connection closed');
      process.exit(0);
    } catch (dbError) {
      console.error('Error closing database connection:', dbError);
      process.exit(1);
    }
  });

};

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  
  // Don't crash for specific service errors like Cloudinary configuration
  const errorMsg = reason?.message || '';
  if (errorMsg.includes('cloud_name') || errorMsg.includes('Cloudinary')) {
    console.warn('⚠️ Service configuration error detected. Server will remain running, but some features may fail.');
    return;
  }
  
  gracefulShutdown();
});

server.listen(config.port, () => {
  console.log(`🚀 Server running in ${config.nodeEnv} mode on port ${config.port}`);
  console.log(`📡 WebSocket server ready for connections`);
  console.log(`🔗 API endpoint: http://localhost:${config.port}/api`);
});