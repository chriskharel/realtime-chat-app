import dotenv from 'dotenv';
import mysql from 'mysql2';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}).promise();

async function checkSchema() {
  try {
    console.log('\n🔍 Checking database schema...\n');
    
    // Check users table structure
    console.log('=== USERS TABLE ===');
    const [userColumns] = await pool.query('DESCRIBE users');
    userColumns.forEach(col => {
      console.log(`- ${col.Field}: ${col.Type} ${col.Null === 'YES' ? '(nullable)' : '(not null)'} ${col.Default ? `default: ${col.Default}` : ''}`);
    });
    
    // Check messages table structure
    console.log('\n=== MESSAGES TABLE ===');
    const [messageColumns] = await pool.query('DESCRIBE messages');
    messageColumns.forEach(col => {
      console.log(`- ${col.Field}: ${col.Type} ${col.Null === 'YES' ? '(nullable)' : '(not null)'} ${col.Default ? `default: ${col.Default}` : ''}`);
    });
    
    // Check if file sharing fields exist
    const fileFields = ['file_path', 'file_name', 'file_type', 'file_size', 'message_type'];
    const existingFields = messageColumns.map(col => col.Field);
    console.log('\n=== FILE SHARING FIELDS CHECK ===');
    fileFields.forEach(field => {
      if (existingFields.includes(field)) {
        console.log(`✅ ${field} exists`);
      } else {
        console.log(`❌ ${field} missing`);
      }
    });
    
    // Check if new tables exist
    console.log('\n=== CHECKING NEW TABLES ===');
    try {
      const [typingTable] = await pool.query('DESCRIBE typing_indicators');
      console.log('✅ typing_indicators table exists');
      typingTable.forEach(col => {
        console.log(`  - ${col.Field}: ${col.Type}`);
      });
    } catch (error) {
      console.log('❌ typing_indicators table does not exist');
    }
    
    try {
      const [sessionsTable] = await pool.query('DESCRIBE user_sessions');
      console.log('✅ user_sessions table exists');
      sessionsTable.forEach(col => {
        console.log(`  - ${col.Field}: ${col.Type}`);
      });
    } catch (error) {
      console.log('❌ user_sessions table does not exist');
    }
    
    console.log('\n🎯 Schema check complete!');
    
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
  } finally {
    await pool.end();
  }
}

checkSchema();
