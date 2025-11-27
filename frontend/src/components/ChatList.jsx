import { useState } from "react";
import toast from "react-hot-toast";
import ChatItem from "./ChatItem.jsx";
import DeleteChatModal from "./DeleteChatModal.jsx";
import useAuth from "../hooks/useAuth.js";
import { useChat } from "../context/ChatContext.jsx";

export default function ChatList({
  chats,
  loading,
  selectedChatId,
  onSelectChat,
  onStartChat,
}) {
  const { user } = useAuth();
  const { deleteChat } = useChat();
  const [targetUserId, setTargetUserId] = useState("");
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    chatInfo: null,
    loading: false
  });

  const handleStart = async (e) => {
    e.preventDefault();
    if (!onStartChat) return;
    await onStartChat(targetUserId);
    setTargetUserId("");
  };

  const handleDeleteChat = (chatId, chatInfo) => {
    setDeleteModal({
      isOpen: true,
      chatInfo,
      loading: false
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.chatInfo) return;

    setDeleteModal(prev => ({ ...prev, loading: true }));
    
    try {
      await deleteChat(deleteModal.chatInfo.chatId);
      setDeleteModal({
        isOpen: false,
        chatInfo: null,
        loading: false
      });
    } catch (error) {
      console.error("Failed to delete chat:", error);
      toast.error("Failed to delete chat. Please try again.");
      setDeleteModal(prev => ({ ...prev, loading: false }));
    }
  };

  const handleCloseDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      chatInfo: null,
      loading: false
    });
  };

  return (
    <aside className="flex h-full w-full flex-col bg-slate-950" style={{backgroundColor: '#020617'}}>
      <div className="border-b border-slate-800 px-4 py-5 bg-slate-900" style={{backgroundColor: '#0f172a'}}>
        <h2 className="text-lg font-semibold text-white">Chats</h2>
        <p className="text-xs text-slate-400">
          Logged in as <span className="text-slate-200">{user?.email}</span>
        </p>
        <form onSubmit={handleStart} className="mt-4 space-y-2">
          <label className="text-xs uppercase tracking-wide text-slate-400">
            Start chat with user id
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={targetUserId}
              onChange={(e) => setTargetUserId(e.target.value)}
              placeholder="Enter user id"
              className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:bg-slate-700"
            />
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-800 disabled:opacity-50"
              disabled={!targetUserId.trim()}
            >
              Start
            </button>
          </div>
        </form>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {loading ? (
          <p className="text-center text-sm text-slate-400">Loading chats…</p>
        ) : chats.length === 0 ? (
          <p className="text-center text-sm text-slate-400">
            No chats yet. Start a conversation above.
          </p>
        ) : (
          chats.map((chat) => (
            <ChatItem
              key={chat.id}
              chat={chat}
              currentUserId={user?.id}
              isActive={chat.id === Number(selectedChatId)}
              onClick={onSelectChat}
              onDelete={handleDeleteChat}
            />
          ))
        )}
      </div>

      {/* Delete Chat Modal */}
      <DeleteChatModal
        isOpen={deleteModal.isOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        chatInfo={deleteModal.chatInfo}
        loading={deleteModal.loading}
      />
    </aside>
  );
}

