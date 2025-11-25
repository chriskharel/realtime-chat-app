import pool from "../config/db.js";

// Add user session when they connect
export const addUserSession = async (userId, socketId) => {
  try {
    await pool.query(
      "INSERT INTO user_sessions (user_id, socket_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE last_activity = CURRENT_TIMESTAMP",
      [userId, socketId]
    );
    return true;
  } catch (error) {
    console.error('Error adding user session:', error);
    return false;
  }
};

// Remove user session when they disconnect
export const removeUserSession = async (socketId) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM user_sessions WHERE socket_id = ?",
      [socketId]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error removing user session:', error);
    return false;
  }
};

// Get user ID by socket ID
export const getUserBySocketId = async (socketId) => {
  const [rows] = await pool.query(
    "SELECT user_id FROM user_sessions WHERE socket_id = ?",
    [socketId]
  );
  return rows[0]?.user_id || null;
};

// Check if user is online (has active sessions)
export const isUserOnline = async (userId) => {
  const [rows] = await pool.query(
    "SELECT COUNT(*) as session_count FROM user_sessions WHERE user_id = ?",
    [userId]
  );
  return rows[0].session_count > 0;
};

// Get all online users
export const getOnlineUsers = async () => {
  const [rows] = await pool.query(
    `SELECT DISTINCT u.id, u.name, u.avatar 
     FROM users u 
     JOIN user_sessions us ON u.id = us.user_id 
     WHERE us.last_activity > DATE_SUB(NOW(), INTERVAL 5 MINUTE)`
  );
  return rows;
};

// Clean up old sessions
export const cleanupOldSessions = async () => {
  const [result] = await pool.query(
    "DELETE FROM user_sessions WHERE last_activity < DATE_SUB(NOW(), INTERVAL 10 MINUTE)"
  );
  return result.affectedRows;
};
