import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure storage for chat files
const chatFileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/chat-files"));
  },
  filename: (req, file, cb) => {
    // Generate unique filename: chatId_timestamp_originalname
    const chatId = req.body.chatId || 'chat';
    const timestamp = Date.now();
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${chatId}_${timestamp}_${sanitizedName}`);
  }
});

// File filter for chat files (images and documents)
const chatFileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|pdf|doc|docx|txt|zip|rar/;
  const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = /image\/|application\/pdf|application\/msword|text\/|application\/zip|application\/x-rar/.test(file.mimetype);

  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb(new Error("Only images, PDFs, documents, and archive files are allowed"));
  }
};

// Create multer upload instance for chat files
export const uploadChatFile = multer({
  storage: chatFileStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: chatFileFilter
});

// Error handling middleware for chat file uploads
export const handleChatFileUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File size too large. Maximum 10MB allowed.' });
    }
    return res.status(400).json({ message: error.message });
  }
  
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  
  next();
};
