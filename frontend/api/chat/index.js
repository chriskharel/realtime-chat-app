import { authMiddleware } from '../../lib/middleware/auth.js';
import { getUserChats, createOrGetChat, deleteChat } from '../../lib/database/chat.model.js';

export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Apply auth middleware
    const user = await authMiddleware(req, res);
    if (!user) return; // authMiddleware handles the response

    if (req.method === 'GET') {
      const chats = await getUserChats(user.id);
      res.json({ success: true, chats });
    } else if (req.method === 'POST') {
      const { userId2 } = req.body;
      if (!userId2) {
        return res.status(400).json({ message: 'User ID is required' });
      }
      
      const chat = await createOrGetChat(user.id, userId2);
      res.json({ success: true, chat });
    } else if (req.method === 'DELETE') {
      const { chatId } = req.body;
      if (!chatId) {
        return res.status(400).json({ message: 'Chat ID is required' });
      }
      
      await deleteChat(chatId, user.id);
      res.json({ success: true, message: 'Chat deleted successfully' });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
