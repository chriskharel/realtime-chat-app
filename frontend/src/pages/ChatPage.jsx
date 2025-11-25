import { useEffect } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar.jsx";
import ChatList from "../components/ChatList.jsx";
import ChatRoom from "../components/ChatRoom.jsx";
import { useChat } from "../context/ChatContext.jsx";

export default function ChatPage() {
  const { chatId } = useParams();
  const {
    chats,
    chatsLoading,
    selectedChat,
    selectedChatId,
    selectChatById,
    startChat,
    joinChat,
    sendMessage,
    sendFileMessage,
    messages,
    messagesLoading,
  } = useChat();

  useEffect(() => {
    if (chatId) {
      selectChatById(chatId);
    }
  }, [chatId, selectChatById]);

  useEffect(() => {
    if (!chatId && chats.length && !selectedChatId) {
      joinChat(chats[0].id);
    }
  }, [chatId, chats, selectedChatId, joinChat]);

  const handleSelectChat = async (id) => {
    await selectChatById(id);
  };

  const handleStartChat = async (otherUserId) => {
    try {
      const chat = await startChat(otherUserId);
      await joinChat(chat.id);
      toast.success("Chat ready!");
    } catch (error) {
      toast.error(error.message || "Unable to start chat");
    }
  };

  const handleSendMessage = async (id, content) => {
    try {
      await sendMessage(id, content);
    } catch (error) {
      console.error(error);
      toast.error("Failed to send message");
    }
  };

  const handleSendFileMessage = async (id, file, content) => {
    try {
      await sendFileMessage(id, file, content);
    } catch (error) {
      console.error(error);
      toast.error("Failed to send file");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-950">
      <Navbar />

      <main className="flex flex-1 overflow-hidden">
        <div className="w-full max-w-sm border-r border-gray-900">
          <ChatList
            chats={chats}
            loading={chatsLoading}
            selectedChatId={selectedChatId}
            onSelectChat={handleSelectChat}
            onStartChat={handleStartChat}
          />
        </div>

        <ChatRoom
          chat={selectedChat}
          messages={messages}
          loadingMessages={messagesLoading}
          onSendMessage={handleSendMessage}
          onSendFileMessage={handleSendFileMessage}
        />
      </main>
    </div>
  );
}
