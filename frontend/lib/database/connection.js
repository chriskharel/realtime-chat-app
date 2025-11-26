import mysql from 'mysql2/promise';

let connection;

export async function getConnection() {
  if (!connection) {
    try {
      connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: process.env.DB_HOST !== 'localhost' ? { rejectUnauthorized: false } : false,
        connectTimeout: 60000,
        acquireTimeout: 60000,
        timeout: 60000,
      });
      
      console.log('Database connected successfully');
    } catch (error) {
      console.error('Database connection failed:', error);
      throw error;
    }
  }
  return connection;
}

export async function executeQuery(query, params = []) {
  try {
    const conn = await getConnection();
    const [results] = await conn.execute(query, params);
    return results;
  } catch (error) {
    console.error('Query execution failed:', error);
    throw error;
  }
}
