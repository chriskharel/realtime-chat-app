import { io } from "socket.io-client";

// Use Vercel Socket.IO (same domain) - no CORS issues!
const socketURL = typeof window !== 'undefined' ? window.location.origin : '';

export const socket = io(socketURL, {
  path: '/api/socketio',
  transports: ["websocket", "polling"], // Add polling for better compatibility  
  autoConnect: false, // Connect manually after authentication
});
