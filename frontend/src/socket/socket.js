import { io } from "socket.io-client";

// Use environment variable for Socket URL in production
const socketURL = import.meta.env.VITE_SOCKET_URL || "http://localhost:8000";

export const socket = io(socketURL, {
  transports: ["websocket", "polling"], // Add polling for better compatibility
  autoConnect: false, // Connect manually after authentication
});

// Add debug logging for socket connection
socket.on("connect", () => {
  console.log("✅ Socket connected:", socket.id);
});

socket.on("disconnect", () => {
  console.log("❌ Socket disconnected");
});

socket.on("connect_error", (error) => {
  console.error("🔴 Socket connection error:", error);
});

socket.on("reconnect", (attemptNumber) => {
  console.log("🔄 Socket reconnected after", attemptNumber, "attempts");
});
