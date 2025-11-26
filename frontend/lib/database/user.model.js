import { executeQuery } from './connection.js';

export async function createUser({ name, email, password }) {
  try {
    const result = await executeQuery(
      'INSERT INTO users (name, email, password, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
      [name, email, password]
    );

    return {
      id: result.insertId,
      name,
      email,
      avatar: null
    };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function getUserByEmail(email) {
  try {
    const results = await executeQuery(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return results[0] || null;
  } catch (error) {
    console.error('Error getting user by email:', error);
    throw error;
  }
}

export async function getUserById(id) {
  try {
    const results = await executeQuery(
      'SELECT id, name, email, avatar, is_online, created_at FROM users WHERE id = ?',
      [id]
    );
    return results[0] || null;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    throw error;
  }
}

export async function updateUserOnlineStatus(userId, isOnline) {
  try {
    await executeQuery(
      'UPDATE users SET is_online = ?, last_seen = NOW() WHERE id = ?',
      [isOnline, userId]
    );
  } catch (error) {
    console.error('Error updating user online status:', error);
    throw error;
  }
}

export async function getAllUsers(currentUserId) {
  try {
    const results = await executeQuery(
      'SELECT id, name, email, avatar, is_online, last_seen FROM users WHERE id != ? ORDER BY name',
      [currentUserId]
    );
    return results;
  } catch (error) {
    console.error('Error getting all users:', error);
    throw error;
  }
}
