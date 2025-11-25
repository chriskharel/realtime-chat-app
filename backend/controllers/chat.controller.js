import { findOrCreateChat, getUserChats, deleteChat } from "../models/chat.model.js";

export const accessChat = async (req, res) => {
  try {
    const userId = req.user.id;
    const { otherUserId } = req.body;

    if (!otherUserId) {
      return res.status(400).json({ message: "otherUserId is required" });
    }

    const chat = await findOrCreateChat(userId, otherUserId);

    res.json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const fetchChats = async (req, res) => {
  try {
    const chats = await getUserChats(req.user.id);
    res.json(chats);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteChatById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { chatId } = req.params;

    if (!chatId) {
      return res.status(400).json({ message: "Chat ID is required" });
    }

    const deletedChat = await deleteChat(chatId, userId);
    
    res.json({ 
      message: "Chat deleted successfully", 
      chat: deletedChat 
    });
  } catch (err) {
    console.error("Delete chat error:", err);
    if (err.message === "Chat not found or you don't have permission to delete it") {
      return res.status(404).json({ message: err.message });
    }
    res.status(500).json({ message: "Server error" });
  }
};
