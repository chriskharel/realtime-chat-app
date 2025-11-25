import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";           // For socket.io server
import { Server } from "socket.io";

import authRoutes from "./routes/auth.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

// Import models for socket functionality
import { addUserSession, removeUserSession, isUserOnline } from "./models/session.model.js";
import { updateUserOnlineStatus } from "./models/user.model.js";
import { setTypingStatus } from "./models/typing.model.js";
import { markChatMessagesAsRead } from "./models/message.model.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// Serve static files (avatars)
app.use('/uploads', express.static('uploads'));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/user", userRoutes);

// Create HTTP server for socket.io
const server = http.createServer(app);

// Initialize socket.io
const io = new Server(server, {
  cors: {
    origin: "*",   // For development only
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // USER AUTHENTICATION FOR SOCKET
  socket.on("authenticate", async (data) => {
    const { userId } = data;
    if (userId) {
      socket.userId = userId;
      await addUserSession(userId, socket.id);
      await updateUserOnlineStatus(userId, true);
      
      // Broadcast user online status
      socket.broadcast.emit("user_online", { userId });
      console.log(`User ${userId} authenticated and marked online`);
    }
  });

  // JOIN CHAT ROOM
  socket.on("join_chat", async (chatId) => {
    socket.join(chatId);
    console.log(`User joined chat room: ${chatId}`);
    
    // Mark all messages in this chat as read if user is authenticated
    if (socket.userId) {
      await markChatMessagesAsRead(chatId, socket.userId);
      socket.to(chatId).emit("messages_read", { chatId, readerId: socket.userId });
    }
  });

  // LEAVE CHAT ROOM
  socket.on("leave_chat", (chatId) => {
    socket.leave(chatId);
    console.log(`User left chat room: ${chatId}`);
  });

  // SEND MESSAGE
  socket.on("send_message", (data) => {
    const { chatId, message } = data;
    
    // Emit to all users in the chat room except sender
    socket.to(chatId).emit("receive_message", message);
    
    // Send delivery confirmation to sender
    socket.emit("message_delivered", { messageId: message.id });
  });

  // TYPING INDICATOR
  socket.on("typing_start", async (data) => {
    const { chatId } = data;
    if (socket.userId) {
      await setTypingStatus(chatId, socket.userId, true);
      socket.to(chatId).emit("user_typing", { 
        userId: socket.userId, 
        chatId, 
        isTyping: true 
      });
    }
  });

  socket.on("typing_stop", async (data) => {
    const { chatId } = data;
    if (socket.userId) {
      await setTypingStatus(chatId, socket.userId, false);
      socket.to(chatId).emit("user_typing", { 
        userId: socket.userId, 
        chatId, 
        isTyping: false 
      });
    }
  });

  // MESSAGE READ RECEIPT
  socket.on("message_read", async (data) => {
    const { messageId, chatId } = data;
    if (socket.userId) {
      socket.to(chatId).emit("message_read_receipt", { 
        messageId, 
        readerId: socket.userId 
      });
    }
  });

  // CHAT DELETE
  socket.on("chat_deleted", (data) => {
    const { chatId, deletedBy } = data;
    // Notify all users in the chat room that it was deleted
    socket.to(chatId).emit("chat_deleted", { chatId, deletedBy });
  });

  // MESSAGE DELETE
  socket.on("message_deleted", (data) => {
    const { messageId, chatId, deletedBy } = data;
    // Notify all users in the chat room that the message was deleted
    socket.to(chatId).emit("message_deleted", { messageId, chatId, deletedBy });
  });

  // DISCONNECT
  socket.on("disconnect", async () => {
    console.log("User disconnected:", socket.id);
    
    if (socket.userId) {
      await removeUserSession(socket.id);
      
      // Check if user has other active sessions
      const stillOnline = await isUserOnline(socket.userId);
      if (!stillOnline) {
        await updateUserOnlineStatus(socket.userId, false);
        socket.broadcast.emit("user_offline", { userId: socket.userId });
      }
    }
  });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
