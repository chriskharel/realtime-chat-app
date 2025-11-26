import { authMiddleware } from '../../lib/middleware/auth.js';
import { 
  createMessage, 
  getChatMessages, 
  markMessagesAsRead, 
  deleteMessage 
} from '../../lib/database/message.model.js';

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
      const { chatId, limit = 50, offset = 0 } = req.query;
      
      if (!chatId) {
        return res.status(400).json({ message: 'Chat ID is required' });
      }
      
      const messages = await getChatMessages(chatId, user.id, parseInt(limit), parseInt(offset));
      res.json({ success: true, messages });
    } 
    else if (req.method === 'POST') {
      const { chatId, content, messageType = 'text', filePath = null } = req.body;
      
      if (!chatId || !content) {
        return res.status(400).json({ message: 'Chat ID and content are required' });
      }
      
      const message = await createMessage({
        chatId,
        senderId: user.id,
        content,
        messageType,
        filePath
      });
      
      res.json({ success: true, message });
    }
    else if (req.method === 'PUT') {
      const { chatId } = req.body;
      
      if (!chatId) {
        return res.status(400).json({ message: 'Chat ID is required' });
      }
      
      await markMessagesAsRead(chatId, user.id);
      res.json({ success: true, message: 'Messages marked as read' });
    }
    else if (req.method === 'DELETE') {
      const { messageId } = req.body;
      
      if (!messageId) {
        return res.status(400).json({ message: 'Message ID is required' });
      }
      
      await deleteMessage(messageId, user.id);
      res.json({ success: true, message: 'Message deleted successfully' });
    }
    else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Message API error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
