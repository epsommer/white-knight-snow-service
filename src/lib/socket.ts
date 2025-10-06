import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

export type SocketServer = SocketIOServer;

let io: SocketIOServer | undefined;

export function initializeSocket(httpServer: HTTPServer): SocketIOServer {
  if (io) {
    return io;
  }

  io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.NEXTAUTH_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Join rooms based on user role
    socket.on('join-room', (room: string) => {
      socket.join(room);
      console.log(`Socket ${socket.id} joined room: ${room}`);
    });

    // Leave room
    socket.on('leave-room', (room: string) => {
      socket.leave(room);
      console.log(`Socket ${socket.id} left room: ${room}`);
    });

    // Handle driver position updates
    socket.on('driver-position-update', (data: {
      driverId: string;
      latitude: number;
      longitude: number;
      status: string;
    }) => {
      // Broadcast to all clients in the 'dashboard' room
      io?.to('dashboard').emit('driver-position', data);
    });

    // Handle property status updates
    socket.on('property-status-update', (data: {
      propertyId: string;
      status: string;
    }) => {
      // Broadcast to all clients
      io?.emit('property-status', data);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
}

export function getSocketServer(): SocketIOServer | undefined {
  return io;
}

// Emit events from server-side
export function emitDriverPosition(data: {
  driverId: string;
  latitude: number;
  longitude: number;
  status: string;
}) {
  if (io) {
    io.to('dashboard').emit('driver-position', data);
  }
}

export function emitPropertyStatus(data: {
  propertyId: string;
  status: string;
}) {
  if (io) {
    io.emit('property-status', data);
  }
}
