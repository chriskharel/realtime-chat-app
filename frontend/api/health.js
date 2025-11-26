export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  res.status(200).json({
    status: 'OK',
    message: 'Vercel Chat API is running',
    timestamp: new Date().toISOString(),
    environment: 'production',
    version: '1.0.0',
    endpoints: {
      auth: {
        login: '/api/auth/login',
        register: '/api/auth/register'
      },
      chat: '/api/chat',
      message: '/api/message',
      user: '/api/user',
      socket: '/api/socketio',
      migrate: '/api/migrate',
      health: '/api/health'
    }
  });
}
