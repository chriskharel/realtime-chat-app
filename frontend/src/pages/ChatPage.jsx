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
      // Success feedback handled by context
    } catch (error) {
      console.error(error);
      toast.error("Failed to send message");
    }
  };

  const handleSendFileMessage = async (id, file, content) => {
    const loadingToast = toast.loading(`Uploading ${file.name}...`);
    try {
      await sendFileMessage(id, file, content);
      toast.success("File uploaded successfully!", { id: loadingToast });
    } catch (error) {
      console.error(error);
      toast.error("Failed to send file", { id: loadingToast });
    }
  };

  return (
    <div className="flex h-screen flex-col bg-gray-950">
      <Navbar />

      <main className="flex flex-1 overflow-hidden min-h-0">
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
