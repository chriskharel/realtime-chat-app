import pool from "../config/db.js";

// Set typing status for a user in a chat
export const setTypingStatus = async (chatId, userId, isTyping) => {
  try {
    await pool.query(
      `INSERT INTO typing_indicators (chat_id, user_id, is_typing) 
       VALUES (?, ?, ?) 
       ON DUPLICATE KEY UPDATE is_typing = ?, updated_at = CURRENT_TIMESTAMP`,
      [chatId, userId, isTyping, isTyping]
    );
    return true;
  } catch (error) {
    console.error('Error setting typing status:', error);
    return false;
  }
};

// Get typing users for a chat (excluding the current user)
export const getTypingUsers = async (chatId, excludeUserId) => {
  const [rows] = await pool.query(
    `SELECT ti.user_id, u.name, u.avatar 
     FROM typing_indicators ti 
     JOIN users u ON ti.user_id = u.id 
     WHERE ti.chat_id = ? AND ti.user_id != ? AND ti.is_typing = TRUE 
     AND ti.updated_at > DATE_SUB(NOW(), INTERVAL 10 SECOND)`,
    [chatId, excludeUserId]
  );
  return rows;
};

// Clean up old typing indicators (users who stopped typing)
export const cleanupTypingIndicators = async () => {
  const [result] = await pool.query(
    "UPDATE typing_indicators SET is_typing = FALSE WHERE updated_at < DATE_SUB(NOW(), INTERVAL 10 SECOND)"
  );
  return result.affectedRows;
};
