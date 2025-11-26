import { io } from "socket.io-client";

// Use environment variable for Socket URL in production
const socketURL = import.meta.env.VITE_SOCKET_URL || "http://localhost:8000";

export const socket = io(socketURL, {
  transports: ["websocket", "polling"], // Add polling for better compatibility
  autoConnect: false, // Connect manually after authentication
});
