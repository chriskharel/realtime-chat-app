import { io } from "socket.io-client";

// Alternative socket configuration for Vercel deployment
// This file will be used when switching to Vercel API

// For Vercel deployment, use same origin (no CORS needed!)
const socketURL_VERCEL = typeof window !== 'undefined' ? window.location.origin : '';

// Keep original Railway URL as fallback
const socketURL_RAILWAY = import.meta.env.VITE_SOCKET_URL || "http://localhost:8000";

// Currently using Railway socket
export const socket = io(socketURL_RAILWAY, {
  transports: ["websocket", "polling"],
  autoConnect: false,
});

// Ready for Vercel switch
export const socketVercelReady = io(socketURL_VERCEL, {
  path: '/api/socketio',
  transports: ["websocket", "polling"],
  autoConnect: false,
});

export default socket;
