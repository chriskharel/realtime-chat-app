import pool from "../config/db.js";

// Create a new message (text or file)
export const createMessage = async (chatId, senderId, content, fileData = null) => {
  let query, params;
  
  if (fileData) {
    // Message with file attachment
    query = `INSERT INTO messages 
             (chat_id, sender_id, content, file_path, file_name, file_type, file_size, message_type, is_delivered, delivered_at) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    params = [
      chatId, 
      senderId, 
      content || '', 
      fileData.path, 
      fileData.originalName, 
      fileData.mimetype, 
      fileData.size, 
      fileData.type,
      true, 
      new Date()
    ];
  } else {
    // Text message
    query = "INSERT INTO messages (chat_id, sender_id, content, message_type, is_delivered, delivered_at) VALUES (?, ?, ?, ?, ?, ?)";
    params = [chatId, senderId, content, 'text', true, new Date()];
  }

  const [result] = await pool.query(query, params);
  const [rows] = await pool.query("SELECT * FROM messages WHERE id = ?", [result.insertId]);
  return rows[0];
};

// Get messages for a chat
export const getMessagesByChatId = async (chatId) => {
  const [rows] = await pool.query(
    "SELECT * FROM messages WHERE chat_id = ? ORDER BY created_at ASC",
    [chatId]
  );
  return rows;
};

// Mark message as read
export const markMessageAsRead = async (messageId, readerId) => {
  const [result] = await pool.query(
    "UPDATE messages SET is_read = ?, read_at = ? WHERE id = ? AND sender_id != ?",
    [true, new Date(), messageId, readerId]
  );
  return result.affectedRows > 0;
};

// Mark all messages in chat as read for a user
export const markChatMessagesAsRead = async (chatId, readerId) => {
  const [result] = await pool.query(
    "UPDATE messages SET is_read = ?, read_at = ? WHERE chat_id = ? AND sender_id != ? AND is_read = FALSE",
    [true, new Date(), chatId, readerId]
  );
  return result.affectedRows;
};

// Get unread message count for a chat
export const getUnreadMessageCount = async (chatId, userId) => {
  const [rows] = await pool.query(
    "SELECT COUNT(*) as unread_count FROM messages WHERE chat_id = ? AND sender_id != ? AND is_read = FALSE",
    [chatId, userId]
  );
  return rows[0].unread_count;
};

// Delete a message (only by sender)
export const deleteMessage = async (messageId, userId) => {
  // First get the message to check ownership and get file info
  const [message] = await pool.query(
    "SELECT * FROM messages WHERE id = ? AND sender_id = ?",
    [messageId, userId]
  );
  
  if (!message.length) {
    throw new Error("Message not found or you don't have permission to delete it");
  }
  
  // Delete the message
  const [result] = await pool.query(
    "DELETE FROM messages WHERE id = ? AND sender_id = ?",
    [messageId, userId]
  );
  
  if (result.affectedRows === 0) {
    throw new Error("Failed to delete message");
  }
  
  return message[0];
};