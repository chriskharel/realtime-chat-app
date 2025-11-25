import pool from "../config/db.js";
import bcrypt from "bcrypt";

// Create a new user
export const createUser = async (name, email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const [result] = await pool.query(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, hashedPassword]
  );

  return { id: result.insertId, name, email };
};

// Find user by email (for login)
export const getUserByEmail = async (email) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0];
};

// Find user by ID
export const getUserById = async (id) => {
  const [rows] = await pool.query("SELECT id, name, email, avatar, is_online, last_seen FROM users WHERE id = ?", [id]);
  return rows[0];
};

// Update user avatar
export const updateUserAvatar = async (userId, avatarPath) => {
  const [result] = await pool.query(
    "UPDATE users SET avatar = ? WHERE id = ?",
    [avatarPath, userId]
  );
  return result.affectedRows > 0;
};

// Update user online status
export const updateUserOnlineStatus = async (userId, isOnline) => {
  const [result] = await pool.query(
    "UPDATE users SET is_online = ?, last_seen = CURRENT_TIMESTAMP WHERE id = ?",
    [isOnline, userId]
  );
  return result.affectedRows > 0;
};

// Get users by IDs (for chat participants)
export const getUsersByIds = async (userIds) => {
  if (!userIds.length) return [];
  const placeholders = userIds.map(() => '?').join(',');
  const [rows] = await pool.query(
    `SELECT id, name, email, avatar, is_online, last_seen FROM users WHERE id IN (${placeholders})`,
    userIds
  );
  return rows;
};
