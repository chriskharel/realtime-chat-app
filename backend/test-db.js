import dotenv from 'dotenv';
import mysql from 'mysql2';

dotenv.config();

console.log('Environment variables:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '[SET]' : '[NOT SET]');
console.log('DB_NAME:', process.env.DB_NAME);

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}).promise();

async function testConnection() {
  try {
    console.log('\nTesting database connection...');
    const [rows] = await pool.query('SELECT 1 as test');
    console.log('✅ Database connection successful:', rows);
    
    console.log('\nTesting tables...');
    const [tables] = await pool.query('SHOW TABLES');
    console.log('✅ Tables found:', tables);
    
    await pool.end();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Error details:', {
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState
    });
  }
}

testConnection();
