import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { fetchChatsRequest, accessChatRequest, deleteChatRequest } from "../api/chatApi.js";
import {
  fetchMessagesRequest,
  sendMessageRequest,
  sendFileMessageRequest,
  deleteMessageRequest,
} from "../api/messageApi.js";
import { socket } from "../socket/socket.js";
import useAuth from "../hooks/useAuth.js";

export const ChatContext = createContext();
export const useChat = () => useContext(ChatContext);

export function ChatProvider({ children }) {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatsLoading, setChatsLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);

  const selectedChat = useMemo(
    () => chats.find((chat) => chat.id === Number(selectedChatId)) || null,
    [chats, selectedChatId]
  );

  const resetChatState = () => {
    setChats([]);
    setSelectedChatId(null);
    setMessages([]);
    setChatsLoading(false);
    setMessagesLoading(false);
  };

  const loadChats = useCallback(async () => {
    if (!user) return;
    setChatsLoading(true);
    try {
      const res = await fetchChatsRequest();
      setChats(res.data);
    } catch (error) {
      console.error("Failed to fetch chats", error);
    } finally {
      setChatsLoading(false);
    }
  }, [user]);

  const startChat = useCallback(
    async (otherUserId) => {
      const trimmed = `${otherUserId}`.trim();
      if (!trimmed) throw new Error("Please enter a user id");
      const idNumber = Number(trimmed);
      if (Number.isNaN(idNumber)) {
        throw new Error("User id must be a number");
      }
      if (user && idNumber === user.id) {
        throw new Error("You cannot start a chat with yourself");
      }

      const res = await accessChatRequest(idNumber);
      setChats((prev) => {
        const exists = prev.find((chat) => chat.id === res.data.id);
        if (exists) return prev;
        return [res.data, ...prev];
      });
      return res.data;
    },
    [user]
  );

  const joinChat = useCallback(async (chatId) => {
    if (!chatId) return;
    setMessagesLoading(true);
    setSelectedChatId(Number(chatId));

    try {
      const res = await fetchMessagesRequest(chatId);
      setMessages(res.data);
      socket.emit("join_chat", chatId);
    } catch (error) {
      console.error("Failed to load messages", error);
    } finally {
      setMessagesLoading(false);
    }
  }, []);

  const sendMessage = useCallback(async (chatId, content) => {
    if (!chatId || !content.trim()) return null;
    const res = await sendMessageRequest(chatId, content.trim());
    setMessages((prev) => [...prev, res.data]);
    socket.emit("send_message", { chatId, message: res.data });
    return res.data;
  }, []);

  const sendFileMessage = useCallback(async (chatId, file, content = '') => {
    if (!chatId || !file) return null;
    const res = await sendFileMessageRequest(chatId, file, content);
    setMessages((prev) => [...prev, res.data]);
    socket.emit("send_message", { chatId, message: res.data });
    return res.data;
  }, []);

  const deleteChat = useCallback(async (chatId) => {
    if (!chatId) return;
    
    try {
      const res = await deleteChatRequest(chatId);
      
      // Remove chat from local state
      setChats((prev) => prev.filter(chat => chat.id !== Number(chatId)));
      
      // If this was the selected chat, clear selection
      if (Number(selectedChatId) === Number(chatId)) {
        setSelectedChatId(null);
        setMessages([]);
      }
      
      // Emit socket event to notify other users
      socket.emit("chat_deleted", { 
        chatId: Number(chatId), 
        deletedBy: user?.id 
      });
      
      return res.data;
    } catch (error) {
      console.error("Failed to delete chat:", error);
      throw error;
    }
  }, [selectedChatId, user?.id]);

  const deleteMessage = useCallback(async (messageId) => {
    if (!messageId) return;
    
    try {
      const res = await deleteMessageRequest(messageId);
      
      // Remove message from local state
      setMessages((prev) => prev.filter(message => message.id !== Number(messageId)));
      
      // Emit socket event to notify other users
      socket.emit("message_deleted", { 
        messageId: Number(messageId), 
        chatId: Number(selectedChatId),
        deletedBy: user?.id 
      });
      
      return res.data;
    } catch (error) {
      console.error("Failed to delete message:", error);
      throw error;
    }
  }, [selectedChatId, user?.id]);

  const selectChatById = useCallback(
    async (chatId) => {
      if (!chatId) return;
      await joinChat(chatId);
    },
    [joinChat]
  );

  useEffect(() => {
    if (user) {
      loadChats();
      // Authenticate user with socket
      socket.emit("authenticate", { userId: user.id });
    } else {
      resetChatState();
    }
  }, [user, loadChats]);

  useEffect(() => {
    const handleReceive = (message) => {
      const incomingChatId = message.chat_id ?? message.chatId;

      if (Number(incomingChatId) !== Number(selectedChatId)) return;

      setMessages((prev) => {
        if (message.id && prev.some((existing) => existing.id === message.id)) {
          return prev;
        }
        return [...prev, message];
      });
    };

    const handleMessageDelivered = (data) => {
      setMessages(prev => prev.map(msg => 
        msg.id === data.messageId 
          ? { ...msg, is_delivered: true, delivered_at: new Date().toISOString() }
          : msg
      ));
    };

    const handleMessageReadReceipt = (data) => {
      setMessages(prev => prev.map(msg => 
        msg.id === data.messageId 
          ? { ...msg, is_read: true, read_at: new Date().toISOString() }
          : msg
      ));
    };

    const handleMessagesRead = (data) => {
      if (Number(data.chatId) === Number(selectedChatId)) {
        setMessages(prev => prev.map(msg => 
          msg.sender_id === user?.id 
            ? { ...msg, is_read: true, read_at: new Date().toISOString() }
            : msg
        ));
      }
    };

    const handleChatDeleted = (data) => {
      const { chatId, deletedBy } = data;
      
      // Remove chat from local state
      setChats((prev) => prev.filter(chat => chat.id !== Number(chatId)));
      
      // If this was the selected chat, clear selection
      if (Number(selectedChatId) === Number(chatId)) {
        setSelectedChatId(null);
        setMessages([]);
      }
    };

    const handleMessageDeleted = (data) => {
      const { messageId, chatId, deletedBy } = data;
      
      // Remove message from local state if it's in the current chat
      if (Number(chatId) === Number(selectedChatId)) {
        setMessages((prev) => prev.filter(message => message.id !== Number(messageId)));
      }
    };

    socket.on("receive_message", handleReceive);
    socket.on("message_delivered", handleMessageDelivered);
    socket.on("message_read_receipt", handleMessageReadReceipt);
    socket.on("messages_read", handleMessagesRead);
    socket.on("chat_deleted", handleChatDeleted);
    socket.on("message_deleted", handleMessageDeleted);

    return () => {
      socket.off("receive_message", handleReceive);
      socket.off("message_delivered", handleMessageDelivered);
      socket.off("message_read_receipt", handleMessageReadReceipt);
      socket.off("messages_read", handleMessagesRead);
      socket.off("chat_deleted", handleChatDeleted);
      socket.off("message_deleted", handleMessageDeleted);
    };
  }, [selectedChatId, user?.id]);

  const value = useMemo(
    () => ({
      chats,
      chatsLoading,
      loadChats,
      startChat,
      joinChat,
      selectChatById,
      selectedChat,
      selectedChatId,
      messages,
      messagesLoading,
      sendMessage,
      sendFileMessage,
      deleteChat,
      deleteMessage,
    }),
    [
      chats,
      chatsLoading,
      loadChats,
      startChat,
      joinChat,
      selectChatById,
      selectedChat,
      selectedChatId,
      messages,
      messagesLoading,
      sendMessage,
      sendFileMessage,
      deleteChat,
      deleteMessage,
    ]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}
