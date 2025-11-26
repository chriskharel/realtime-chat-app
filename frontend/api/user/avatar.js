import { authMiddleware } from '../../lib/middleware/auth.js';
import { parseMultipartForm, saveUploadedFile } from '../../lib/middleware/upload.js';
import { executeQuery } from '../../lib/database/connection.js';

export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Apply auth middleware
    const user = await authMiddleware(req, res);
    if (!user) return; // authMiddleware handles the response

    // Parse multipart form data
    const { fields, files } = await parseMultipartForm(req);

    // Save uploaded file
    const fileData = await saveUploadedFile(files.avatar, user.id, 'avatar');

    // Update user's avatar in database
    await executeQuery(
      'UPDATE users SET avatar = ?, updated_at = NOW() WHERE id = ?',
      [fileData.url, user.id]
    );

    res.json({
      success: true,
      message: 'Avatar uploaded successfully',
      avatar: fileData.url,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: fileData.url
      }
    });

  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({ 
      message: error.message || 'Server error',
      success: false 
    });
  }
}

export const config = {
  api: {
    bodyParser: false, // Disable default body parser for file uploads
  },
};
