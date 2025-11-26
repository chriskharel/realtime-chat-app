import { executeQuery } from '../lib/database/connection.js';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Simple security check - you should add proper authentication
  const { migrationSecret } = req.body;
  if (migrationSecret !== process.env.MIGRATION_SECRET) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    console.log('🗄️ Starting database migrations...');

    // Create users table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        avatar VARCHAR(500) DEFAULT NULL,
        is_online BOOLEAN DEFAULT FALSE,
        last_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table created/verified');

    // Create chats table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS chats (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user1_id INT NOT NULL,
        user2_id INT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user1_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (user2_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_chat (LEAST(user1_id, user2_id), GREATEST(user1_id, user2_id))
      )
    `);
    console.log('✅ Chats table created/verified');

    // Create messages table
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS messages (
        id INT PRIMARY KEY AUTO_INCREMENT,
        chat_id INT NOT NULL,
        sender_id INT NOT NULL,
        content TEXT NOT NULL,
        message_type ENUM('text', 'image', 'file') DEFAULT 'text',
        file_path VARCHAR(500) DEFAULT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE,
        FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_chat_created (chat_id, created_at),
        INDEX idx_sender (sender_id),
        INDEX idx_read (is_read)
      )
    `);
    console.log('✅ Messages table created/verified');

    console.log('🎉 Database migration completed successfully!');

    res.json({
      success: true,
      message: 'Database migration completed successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('💥 Migration failed:', error);
    res.status(500).json({
      success: false,
      message: 'Migration failed',
      error: error.message
    });
  }
}
