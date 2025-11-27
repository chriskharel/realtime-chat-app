import { useEffect, useRef, useCallback } from 'react';
import { socket } from '../socket/socket.js';

export function useSocketConnection(user) {
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectTimeoutRef = useRef(null);

  const handleReconnect = useCallback(() => {
    if (reconnectAttempts.current < maxReconnectAttempts) {
      const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 10000);
      
      reconnectTimeoutRef.current = setTimeout(() => {
        console.log(`Reconnection attempt ${reconnectAttempts.current + 1}/${maxReconnectAttempts}`);
        socket.connect();
        reconnectAttempts.current += 1;
      }, delay);
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    const handleConnect = () => {
      console.log('✅ Socket connected');
      reconnectAttempts.current = 0;
      socket.emit("authenticate", { userId: user.id });
    };

    const handleDisconnect = (reason) => {
      console.log('❌ Socket disconnected:', reason);
      
      // Only attempt reconnect for non-intentional disconnects
      if (reason === 'io server disconnect') {
        // Server initiated disconnect, don't reconnect automatically
        return;
      }
      
      handleReconnect();
    };

    const handleConnectError = (error) => {
      console.error('❌ Socket connection error:', error);
      handleReconnect();
    };

    const handleReconnectSuccess = () => {
      console.log('✅ Socket reconnected successfully');
      reconnectAttempts.current = 0;
      socket.emit("authenticate", { userId: user.id });
    };

    // Initial connection
    if (!socket.connected) {
      socket.connect();
    } else {
      socket.emit("authenticate", { userId: user.id });
    }

    // Event listeners
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);
    socket.on('reconnect', handleReconnectSuccess);

    return () => {
      // Clear timeout on cleanup
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }

      // Remove listeners
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
      socket.off('reconnect', handleReconnectSuccess);
    };
  }, [user, handleReconnect]);

  const isConnected = socket.connected;
  const connectionState = {
    isConnected,
    reconnectAttempts: reconnectAttempts.current,
    maxAttempts: maxReconnectAttempts
  };

  return connectionState;
}

export function useOptimizedSocketListeners(eventHandlers = {}) {
  const listenersRef = useRef(new Map());

  useEffect(() => {
    // Remove old listeners
    listenersRef.current.forEach((handler, event) => {
      socket.off(event, handler);
    });
    listenersRef.current.clear();

    // Add new listeners
    Object.entries(eventHandlers).forEach(([event, handler]) => {
      if (typeof handler === 'function') {
        socket.on(event, handler);
        listenersRef.current.set(event, handler);
      }
    });

    return () => {
      // Cleanup all listeners
      listenersRef.current.forEach((handler, event) => {
        socket.off(event, handler);
      });
      listenersRef.current.clear();
    };
  }, [eventHandlers]);

  return socket;
}
