import { authMiddleware } from '../lib/middleware/auth.js';
import { getAllUsers } from '../lib/database/user.model.js';

export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Apply auth middleware
    const user = await authMiddleware(req, res);
    if (!user) return; // authMiddleware handles the response

    const users = await getAllUsers(user.id);
    res.json({ success: true, users });
  } catch (error) {
    console.error('Users API error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
