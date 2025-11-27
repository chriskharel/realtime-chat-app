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

// Flexible CORS configuration for Vercel deployments
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      "http://localhost:5173", 
      "http://localhost:5174", 
      "http://localhost:3000",
      process.env.FRONTEND_URL, // Main Vercel URL
    ].filter(Boolean);
    
    // Check exact matches first
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Check Vercel patterns
    const vercelPatterns = [
      /^https:\/\/realtime-chat-.*\.vercel\.app$/,
      /^https:\/\/realtime-chat-.*-krishna-kharels-projects\.vercel\.app$/,
      /^https:\/\/.*\.vercel\.app$/
    ];
    
    const isVercelDomain = vercelPatterns.some(pattern => pattern.test(origin));
    if (isVercelDomain) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.use(express.json());

// Serve static files (avatars)
app.use('/uploads', express.static('uploads'));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/user", userRoutes);

// Health check endpoint for Railway
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Chat API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.MYSQL_HOST ? 'production' : 'development'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Real-time Chat API',
    version: '1.0.0',
    status: 'Online',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      chats: '/api/chat',
      messages: '/api/message',
      users: '/api/user'
    }
  });
});

// Create HTTP server for socket.io
const server = http.createServer(app);

// Initialize socket.io with flexible CORS
const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      // Allow requests with no origin
      if (!origin) return callback(null, true);
      
      const allowedOrigins = [
        "http://localhost:5173", 
        "http://localhost:5174", 
        "http://localhost:3000",
        process.env.FRONTEND_URL,
      ].filter(Boolean);
      
      // Check exact matches
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      
      // Check Vercel patterns
      const vercelPatterns = [
        /^https:\/\/realtime-chat-.*\.vercel\.app$/,
        /^https:\/\/realtime-chat-.*-krishna-kharels-projects\.vercel\.app$/,
      ];
      
      const isVercelDomain = vercelPatterns.some(pattern => pattern.test(origin));
      if (isVercelDomain) {
        return callback(null, true);
      }
      
      callback(null, false);
    },
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling']
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
    const roomName = `chat_${chatId}`;
    socket.join(roomName);
    console.log(`🚪 User ${socket.userId} joined chat room: ${roomName}`);
    
    // Mark all messages in this chat as read if user is authenticated
    if (socket.userId) {
      await markChatMessagesAsRead(chatId, socket.userId);
      socket.to(roomName).emit("messages_read", { chatId, readerId: socket.userId });
    }
  });

  // LEAVE CHAT ROOM
  socket.on("leave_chat", (chatId) => {
    const roomName = `chat_${chatId}`;
    socket.leave(roomName);
    console.log(`🚪 User ${socket.userId} left chat room: ${roomName}`);
  });

  // SEND MESSAGE
  socket.on("send_message", (data) => {
    const { chatId, message } = data;
    const roomName = `chat_${chatId}`;
    console.log(`📨 Broadcasting message to room ${roomName}:`, message);
    
    // Emit to all users in the chat room except sender
    socket.to(roomName).emit("receive_message", message);
    
    // Send delivery confirmation to sender
    socket.emit("message_delivered", { messageId: message.id });
    console.log(`✅ Message delivered to room ${roomName}`);
  });

  // TYPING INDICATOR
  socket.on("typing_start", async (data) => {
    const { chatId } = data;
    const roomName = `chat_${chatId}`;
    if (socket.userId) {
      await setTypingStatus(chatId, socket.userId, true);
      socket.to(roomName).emit("user_typing", { 
        userId: socket.userId, 
        chatId, 
        isTyping: true 
      });
    }
  });

  socket.on("typing_stop", async (data) => {
    const { chatId } = data;
    const roomName = `chat_${chatId}`;
    if (socket.userId) {
      await setTypingStatus(chatId, socket.userId, false);
      socket.to(roomName).emit("user_typing", { 
        userId: socket.userId, 
        chatId, 
        isTyping: false 
      });
    }
  });

  // MESSAGE READ RECEIPT
  socket.on("message_read", async (data) => {
    const { messageId, chatId } = data;
    const roomName = `chat_${chatId}`;
    if (socket.userId) {
      socket.to(roomName).emit("message_read_receipt", { 
        messageId, 
        readerId: socket.userId 
      });
    }
  });

  // CHAT DELETE
  socket.on("chat_deleted", (data) => {
    const { chatId, deletedBy } = data;
    const roomName = `chat_${chatId}`;
    // Notify all users in the chat room that it was deleted
    socket.to(roomName).emit("chat_deleted", { chatId, deletedBy });
  });

  // MESSAGE DELETE
  socket.on("message_deleted", (data) => {
    const { messageId, chatId, deletedBy } = data;
    const roomName = `chat_${chatId}`;
    // Notify all users in the chat room that the message was deleted
    socket.to(roomName).emit("message_deleted", { messageId, chatId, deletedBy });
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

// Note: Migrations can be run manually with: node migrate.js
// Removed auto-migration to simplify deployment

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.MYSQL_HOST ? 'production' : 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});
