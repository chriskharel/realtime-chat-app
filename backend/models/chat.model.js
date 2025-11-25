import pool from "../config/db.js";

export const findOrCreateChat = async (user1, user2) => {

  const [existing] = await pool.query(
    "SELECT * FROM chats WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)",
    [user1, user2, user2, user1]
  );

  if (existing.length) return existing[0];

  // If not exist → create new chat
  const [result] = await pool.query(
    "INSERT INTO chats (user1_id, user2_id) VALUES (?, ?)",
    [user1, user2]
  );

  return { id: result.insertId, user1_id: user1, user2_id: user2 };
};

//chats for a user
export const getUserChats = async (userId) => {
  const [rows] = await pool.query(
    "SELECT * FROM chats WHERE user1_id = ? OR user2_id = ?",
    [userId, userId]
  );
  return rows;
};

// Get a single chat by ID
export const getChatById = async (chatId) => {
  const [rows] = await pool.query("SELECT * FROM chats WHERE id = ?", [chatId]);
  return rows[0];
};

// Delete a chat and all related data
export const deleteChat = async (chatId, userId) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    // First verify that the user is part of this chat
    const [chat] = await connection.query(
      "SELECT * FROM chats WHERE id = ? AND (user1_id = ? OR user2_id = ?)",
      [chatId, userId, userId]
    );
    
    if (!chat.length) {
      throw new Error("Chat not found or you don't have permission to delete it");
    }
    
    // Delete typing indicators for this chat
    await connection.query(
      "DELETE FROM typing_indicators WHERE chat_id = ?",
      [chatId]
    );
    
    // Delete all messages in this chat
    await connection.query(
      "DELETE FROM messages WHERE chat_id = ?",
      [chatId]
    );
    
    // Finally delete the chat itself
    await connection.query(
      "DELETE FROM chats WHERE id = ?",
      [chatId]
    );
    
    await connection.commit();
    return chat[0];
    
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
