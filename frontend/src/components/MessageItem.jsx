import { useState } from "react";
import FileMessage from "./FileMessage.jsx";
import ReadReceiptIndicator from "./ReadReceiptIndicator.jsx";
import DeleteMessageModal from "./DeleteMessageModal.jsx";
import { useChat } from "../context/ChatContext.jsx";

export default function MessageItem({ message, isSender }) {
  const { deleteMessage } = useChat();
  const [isHovered, setIsHovered] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    loading: false
  });
  
  const isFileMessage = message.message_type === 'image' || message.message_type === 'file';

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setDeleteModal({
      isOpen: true,
      loading: false
    });
  };

  const handleConfirmDelete = async () => {
    setDeleteModal(prev => ({ ...prev, loading: true }));
    
    try {
      await deleteMessage(message.id);
      setDeleteModal({
        isOpen: false,
        loading: false
      });
    } catch (error) {
      console.error("Failed to delete message:", error);
      alert("Failed to delete message. Please try again.");
      setDeleteModal(prev => ({ ...prev, loading: false }));
    }
  };

  const handleCloseDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      loading: false
    });
  };

  return (
    <>
      <div className={`flex ${isSender ? "justify-end" : "justify-start"}`}>
        <div 
          className={`group relative max-w-xs rounded-2xl px-4 py-3 text-sm shadow-md sm:max-w-md ${
            isSender
              ? "bg-blue-600 text-white rounded-br-none"
              : "bg-slate-800 text-slate-100 rounded-bl-none"
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {isFileMessage ? (
            <FileMessage message={message} isSender={isSender} />
          ) : (
            <p className="leading-relaxed">{message.content}</p>
          )}
          
          <ReadReceiptIndicator message={message} isSender={isSender} />

          {/* Delete Button - Only show for sender's messages on hover */}
          {isSender && (isHovered || deleteModal.isOpen) && (
            <button
              onClick={handleDeleteClick}
              className={`absolute -top-2 -right-2 rounded-full p-1.5 text-xs opacity-0 transition-all duration-200 hover:scale-110 group-hover:opacity-100 ${
                isSender 
                  ? "bg-red-600/20 text-red-300 hover:bg-red-600/30" 
                  : "bg-red-600/20 text-red-400 hover:bg-red-600/30"
              }`}
              title="Delete message"
            >
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Delete Message Modal */}
      <DeleteMessageModal
        isOpen={deleteModal.isOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        messageInfo={message}
        loading={deleteModal.loading}
      />
    </>
  );
}

