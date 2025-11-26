import { Server } from 'socket.io';

let io;

export default function handler(req, res) {
  if (!res.socket.server.io) {
    console.log('Setting up Socket.IO server for Vercel...');
    
    io = new Server(res.socket.server, {
      path: '/api/socketio',
      addTrailingSlash: false,
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
      },
      transports: ['websocket', 'polling']
    });

    io.on('connection', (socket) => {
      console.log('User connected:', socket.id);

      // USER AUTHENTICATION FOR SOCKET
      socket.on("authenticate", async (data) => {
        const { userId } = data;
        if (userId) {
          socket.userId = userId;
          
          // Broadcast user online status
          socket.broadcast.emit("user_online", { userId });
          console.log(`User ${userId} authenticated and marked online`);
        }
      });

      // JOIN CHAT ROOM
      socket.on("join_chat", async (chatId) => {
        socket.join(`chat_${chatId}`);
        console.log(`User ${socket.id} joined chat room: ${chatId}`);
        
        // Mark all messages in this chat as read if user is authenticated
        if (socket.userId) {
          socket.to(`chat_${chatId}`).emit("messages_read", { 
            chatId, 
            readerId: socket.userId 
          });
        }
      });

      // LEAVE CHAT ROOM
      socket.on("leave_chat", (chatId) => {
        socket.leave(`chat_${chatId}`);
        console.log(`User ${socket.id} left chat room: ${chatId}`);
      });

      // SEND MESSAGE
      socket.on("send_message", (data) => {
        const { chatId, message } = data;
        
        // Emit to all users in the chat room except sender
        socket.to(`chat_${chatId}`).emit("receive_message", message);
        
        // Send delivery confirmation to sender
        socket.emit("message_delivered", { messageId: message.id });
      });

      // TYPING INDICATOR
      socket.on("typing_start", async (data) => {
        const { chatId } = data;
        if (socket.userId) {
          socket.to(`chat_${chatId}`).emit("user_typing", { 
            userId: socket.userId, 
            chatId, 
            isTyping: true 
          });
        }
      });

      socket.on("typing_stop", async (data) => {
        const { chatId } = data;
        if (socket.userId) {
          socket.to(`chat_${chatId}`).emit("user_typing", { 
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
          socket.to(`chat_${chatId}`).emit("message_read_receipt", { 
            messageId, 
            readerId: socket.userId 
          });
        }
      });

      // CHAT DELETE
      socket.on("chat_deleted", (data) => {
        const { chatId, deletedBy } = data;
        // Notify all users in the chat room that it was deleted
        socket.to(`chat_${chatId}`).emit("chat_deleted", { chatId, deletedBy });
      });

      // MESSAGE DELETE
      socket.on("message_deleted", (data) => {
        const { messageId, chatId, deletedBy } = data;
        // Notify all users in the chat room that the message was deleted
        socket.to(`chat_${chatId}`).emit("message_deleted", { messageId, chatId, deletedBy });
      });

      // DISCONNECT
      socket.on("disconnect", async () => {
        console.log("User disconnected:", socket.id);
        
        if (socket.userId) {
          socket.broadcast.emit("user_offline", { userId: socket.userId });
        }
      });
    });

    res.socket.server.io = io;
  }
  
  res.end();
}

export const config = {
  api: {
    bodyParser: false,
  },
};
