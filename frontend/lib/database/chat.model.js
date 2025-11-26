import { executeQuery } from './connection.js';

export async function createOrGetChat(user1Id, user2Id) {
  try {
    // Check if chat already exists between these users
    const existingChat = await executeQuery(
      `SELECT c.*, 
       u1.name as user1_name, u1.avatar as user1_avatar,
       u2.name as user2_name, u2.avatar as user2_avatar
       FROM chats c 
       JOIN users u1 ON (c.user1_id = u1.id OR c.user2_id = u1.id) AND u1.id = ?
       JOIN users u2 ON (c.user1_id = u2.id OR c.user2_id = u2.id) AND u2.id = ?
       WHERE (c.user1_id = ? AND c.user2_id = ?) OR (c.user1_id = ? AND c.user2_id = ?)`,
      [user1Id, user2Id, user1Id, user2Id, user2Id, user1Id]
    );

    if (existingChat.length > 0) {
      return existingChat[0];
    }

    // Create new chat
    const result = await executeQuery(
      'INSERT INTO chats (user1_id, user2_id, created_at, updated_at) VALUES (?, ?, NOW(), NOW())',
      [user1Id, user2Id]
    );

    // Get the created chat with user details
    const newChat = await executeQuery(
      `SELECT c.*, 
       u1.name as user1_name, u1.avatar as user1_avatar,
       u2.name as user2_name, u2.avatar as user2_avatar
       FROM chats c 
       JOIN users u1 ON c.user1_id = u1.id
       JOIN users u2 ON c.user2_id = u2.id
       WHERE c.id = ?`,
      [result.insertId]
    );

    return newChat[0];
  } catch (error) {
    console.error('Error creating/getting chat:', error);
    throw error;
  }
}

export async function getUserChats(userId) {
  try {
    const chats = await executeQuery(
      `SELECT c.*, 
       CASE 
         WHEN c.user1_id = ? THEN u2.name 
         ELSE u1.name 
       END as other_user_name,
       CASE 
         WHEN c.user1_id = ? THEN u2.id 
         ELSE u1.id 
       END as other_user_id,
       CASE 
         WHEN c.user1_id = ? THEN u2.avatar 
         ELSE u1.avatar 
       END as other_user_avatar,
       CASE 
         WHEN c.user1_id = ? THEN u2.is_online 
         ELSE u1.is_online 
       END as other_user_online,
       (SELECT content FROM messages WHERE chat_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message,
       (SELECT created_at FROM messages WHERE chat_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message_time,
       (SELECT COUNT(*) FROM messages WHERE chat_id = c.id AND sender_id != ? AND is_read = 0) as unread_count
       FROM chats c 
       JOIN users u1 ON c.user1_id = u1.id
       JOIN users u2 ON c.user2_id = u2.id
       WHERE c.user1_id = ? OR c.user2_id = ?
       ORDER BY c.updated_at DESC`,
      [userId, userId, userId, userId, userId, userId, userId]
    );

    return chats;
  } catch (error) {
    console.error('Error getting user chats:', error);
    throw error;
  }
}

export async function deleteChat(chatId, userId) {
  try {
    // First check if user is part of this chat
    const chat = await executeQuery(
      'SELECT * FROM chats WHERE id = ? AND (user1_id = ? OR user2_id = ?)',
      [chatId, userId, userId]
    );

    if (chat.length === 0) {
      throw new Error('Chat not found or user not authorized');
    }

    // Delete all messages in the chat first
    await executeQuery('DELETE FROM messages WHERE chat_id = ?', [chatId]);

    // Delete the chat
    await executeQuery('DELETE FROM chats WHERE id = ?', [chatId]);

    return { success: true };
  } catch (error) {
    console.error('Error deleting chat:', error);
    throw error;
  }
}
