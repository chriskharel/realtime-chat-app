import mysql from "mysql2";

const pool = mysql.createPool({
  // Railway MySQL environment variables (auto-provided)
  host: process.env.MYSQL_HOST || process.env.DB_HOST || 'localhost',
  port: process.env.MYSQL_PORT || process.env.DB_PORT || 3306,
  user: process.env.MYSQL_USER || process.env.DB_USER || 'root',
  password: process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || process.env.DB_NAME || 'chat_app',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Railway specific settings - detect production by presence of Railway MySQL variables
  ssl: process.env.MYSQL_HOST ? { rejectUnauthorized: false } : false,
  connectTimeout: 60000,
  acquireTimeout: 60000,
  timeout: 60000,
}).promise();

export default pool;
