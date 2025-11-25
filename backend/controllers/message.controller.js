import { 
  createMessage, 
  getMessagesByChatId, 
  markMessageAsRead, 
  markChatMessagesAsRead,
  getUnreadMessageCount,
  deleteMessage 
} from "../models/message.model.js";
import fs from 'fs';
import path from 'path';

export const sendMessage = async (req, res) => {
  try {
    const { chatId, content } = req.body;

    if (!chatId || (!content && !req.file)) {
      return res.status(400).json({ message: "chatId and either content or file required" });
    }

    let fileData = null;
    if (req.file) {
      // Determine message type based on file
      let messageType = 'file';
      if (req.file.mimetype.startsWith('image/')) {
        messageType = 'image';
      }

      fileData = {
        path: `/uploads/chat-files/${req.file.filename}`,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        type: messageType
      };
    }

    const message = await createMessage(chatId, req.user.id, content || '', fileData);

    res.status(201).json(message);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error sending message" });
  }
};

export const getChatMessages = async (req, res) => {
  try {
    const chatId = req.params.chatId;
    const messages = await getMessagesByChatId(chatId);

    res.json(messages);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching messages" });
  }
};

// Mark message as read
export const markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    const readerId = req.user.id;

    const success = await markMessageAsRead(messageId, readerId);
    
    if (success) {
      res.json({ message: "Message marked as read" });
    } else {
      res.status(400).json({ message: "Unable to mark message as read" });
    }
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({ message: "Server error" });
  }
};

// Mark all messages in chat as read
export const markChatAsRead = async (req, res) => {
  try {
    const { chatId } = req.params;
    const readerId = req.user.id;

    const markedCount = await markChatMessagesAsRead(chatId, readerId);
    
    res.json({ 
      message: "Messages marked as read", 
      markedCount 
    });
  } catch (error) {
    console.error('Error marking chat as read:', error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get unread count for a chat
export const getUnreadCount = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;

    const unreadCount = await getUnreadMessageCount(chatId, userId);
    
    res.json({ unreadCount });
  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteMessageById = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    if (!messageId) {
      return res.status(400).json({ message: "Message ID is required" });
    }

    const deletedMessage = await deleteMessage(messageId, userId);
    
    // If the message had a file attachment, delete the file
    if (deletedMessage.file_path) {
      const filePath = path.join(process.cwd(), 'uploads', 'chat-files', path.basename(deletedMessage.file_path));
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (fileError) {
        console.error('Error deleting file:', fileError);
        // Don't fail the request if file deletion fails
      }
    }
    
    res.json({ 
      message: "Message deleted successfully", 
      deletedMessage: {
        id: deletedMessage.id,
        chat_id: deletedMessage.chat_id
      }
    });
  } catch (err) {
    console.error("Delete message error:", err);
    if (err.message === "Message not found or you don't have permission to delete it") {
      return res.status(404).json({ message: err.message });
    }
    res.status(500).json({ message: "Server error" });
  }
};



