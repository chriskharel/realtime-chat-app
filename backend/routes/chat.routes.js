
import express from "express";
import { accessChat, fetchChats, deleteChatById } from "../controllers/chat.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/access", authMiddleware, accessChat);
router.get("/", authMiddleware, fetchChats);
router.delete("/:chatId", authMiddleware, deleteChatById);

export default router;
