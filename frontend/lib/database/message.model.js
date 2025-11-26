import { executeQuery } from './connection.js';

export async function createMessage({ chatId, senderId, content, messageType = 'text', filePath = null }) {
  try {
    const result = await executeQuery(
      'INSERT INTO messages (chat_id, sender_id, content, message_type, file_path, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [chatId, senderId, content, messageType, filePath]
    );

    // Get the created message with sender details
    const message = await executeQuery(
      `SELECT m.*, u.name as sender_name, u.avatar as sender_avatar
       FROM messages m 
       JOIN users u ON m.sender_id = u.id
       WHERE m.id = ?`,
      [result.insertId]
    );

    // Update chat's updated_at timestamp
    await executeQuery(
      'UPDATE chats SET updated_at = NOW() WHERE id = ?',
      [chatId]
    );

    return message[0];
  } catch (error) {
    console.error('Error creating message:', error);
    throw error;
  }
}

export async function getChatMessages(chatId, userId, limit = 50, offset = 0) {
  try {
    // First verify user has access to this chat
    const chatAccess = await executeQuery(
      'SELECT * FROM chats WHERE id = ? AND (user1_id = ? OR user2_id = ?)',
      [chatId, userId, userId]
    );

    if (chatAccess.length === 0) {
      throw new Error('Chat not found or user not authorized');
    }

    const messages = await executeQuery(
      `SELECT m.*, u.name as sender_name, u.avatar as sender_avatar
       FROM messages m 
       JOIN users u ON m.sender_id = u.id
       WHERE m.chat_id = ?
       ORDER BY m.created_at DESC
       LIMIT ? OFFSET ?`,
      [chatId, limit, offset]
    );

    return messages.reverse(); // Return in chronological order
  } catch (error) {
    console.error('Error getting chat messages:', error);
    throw error;
  }
}

export async function markMessagesAsRead(chatId, userId) {
  try {
    await executeQuery(
      'UPDATE messages SET is_read = 1 WHERE chat_id = ? AND sender_id != ? AND is_read = 0',
      [chatId, userId]
    );
  } catch (error) {
    console.error('Error marking messages as read:', error);
    throw error;
  }
}

export async function deleteMessage(messageId, userId) {
  try {
    // First check if user owns this message
    const message = await executeQuery(
      'SELECT * FROM messages WHERE id = ? AND sender_id = ?',
      [messageId, userId]
    );

    if (message.length === 0) {
      throw new Error('Message not found or user not authorized');
    }

    await executeQuery('DELETE FROM messages WHERE id = ?', [messageId]);

    return { success: true };
  } catch (error) {
    console.error('Error deleting message:', error);
    throw error;
  }
}
