'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000';

    const socketInstance = io(socketUrl, {
      transports: ['polling', 'websocket'], // Try polling first
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      timeout: 10000,
      autoConnect: true,
    });

    socketInstance.on('connect', () => {
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Socket connected');
      }
      setIsConnected(true);
    });

    socketInstance.on('disconnect', (reason) => {
      if (process.env.NODE_ENV === 'development') {
        console.log('🔌 Socket disconnected:', reason);
      }
      setIsConnected(false);
    });

    socketInstance.on('connect_error', (error) => {
      // Silently handle connection errors - just update state
      setIsConnected(false);
      // Only log in development and not for timeout errors
      if (process.env.NODE_ENV === 'development' && error.message !== 'timeout') {
        console.warn('⚠️ Socket connection issue (this is normal if server is not running)');
      }
    });

    socketInstance.on('error', () => {
      // Silently handle errors
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return { socket, isConnected };
}

export function useSocketEvent<T>(
  socket: Socket | null,
  eventName: string,
  callback: (data: T) => void
) {
  useEffect(() => {
    if (!socket) return;

    socket.on(eventName, callback);

    return () => {
      socket.off(eventName, callback);
    };
  }, [socket, eventName, callback]);
}
