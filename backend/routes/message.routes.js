

import express from "express";
import { 
  sendMessage, 
  getChatMessages,
  markAsRead,
  markChatAsRead,
  getUnreadCount,
  deleteMessageById
} from "../controllers/message.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { uploadChatFile, handleChatFileUploadError } from "../middleware/chatFileUpload.middleware.js";

const router = express.Router();

router.post("/send", authMiddleware, uploadChatFile.single('file'), handleChatFileUploadError, sendMessage);
router.get("/:chatId", authMiddleware, getChatMessages);
router.put("/:messageId/read", authMiddleware, markAsRead);
router.put("/chat/:chatId/read", authMiddleware, markChatAsRead);
router.get("/chat/:chatId/unread-count", authMiddleware, getUnreadCount);
router.delete("/:messageId", authMiddleware, deleteMessageById);

export default router;
