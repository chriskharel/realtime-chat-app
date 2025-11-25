import { useState, useEffect } from "react";
import Avatar from "./Avatar.jsx";
import OnlineStatusIndicator from "./OnlineStatusIndicator.jsx";
import { getUserProfileRequest } from "../api/userApi.js";

export default function ChatItem({
  chat,
  isActive,
  onClick,
  onDelete,
  currentUserId,
}) {
  const [otherUser, setOtherUser] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const otherUserId = chat.user1_id === currentUserId ? chat.user2_id : chat.user1_id;

  useEffect(() => {
    if (otherUserId) {
      getUserProfileRequest(otherUserId)
        .then(response => setOtherUser(response.data))
        .catch(error => console.error("Error loading user profile:", error));
    }
  }, [otherUserId]);

  const handleDeleteClick = (e) => {
    e.stopPropagation(); // Prevent chat selection when clicking delete
    if (onDelete) {
      onDelete(chat.id, {
        chatId: chat.id,
        otherUserId,
        otherUserName: otherUser?.name
      });
    }
  };

  return (
    <div
      className={`group relative w-full rounded-xl border border-transparent bg-slate-900 px-4 py-3 transition hover:bg-slate-800 ${
        isActive ? "border-blue-500 bg-slate-800" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        type="button"
        onClick={() => onClick(chat.id)}
        className="w-full text-left"
      >
        <div className="flex items-center space-x-3">
          <Avatar 
            src={otherUser?.avatar} 
            name={otherUser?.name || `User ${otherUserId}`}
            size="sm"
            isOnline={otherUser?.is_online}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {otherUser?.name || `User #${otherUserId}`}
            </p>
            <OnlineStatusIndicator 
              isOnline={otherUser?.is_online} 
              lastSeen={otherUser?.last_seen}
              className="text-xs"
            />
          </div>
          <div className="flex items-center space-x-2">
            {isActive && (
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            )}
          </div>
        </div>
      </button>

      {/* Delete Button - Shows on hover */}
      {(isHovered || isActive) && (
        <button
          onClick={handleDeleteClick}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-red-600/20 p-2 text-red-400 opacity-0 transition-all duration-200 hover:bg-red-600/30 hover:text-red-300 group-hover:opacity-100"
          title="Delete chat"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
  );
}

