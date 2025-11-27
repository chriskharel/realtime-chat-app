import { useState, useEffect, useCallback, useRef } from "react";
import MessageList from "./MessageList.jsx";
import MessageInput from "./MessageInput.jsx";
import TypingIndicator from "./TypingIndicator.jsx";
import OnlineStatusIndicator from "./OnlineStatusIndicator.jsx";
import Avatar from "./Avatar.jsx";
import useAuth from "../hooks/useAuth.js";
import { getUserProfileRequest } from "../api/userApi.js";
import { socket } from "../socket/socket.js";

export default function ChatRoom({
  chat,
  messages,
  loadingMessages,
  onSendMessage,
  onSendFileMessage,
}) {
  const { user } = useAuth();
  const [otherUser, setOtherUser] = useState(null);
  const [typingUsers, setTypingUsers] = useState([]);
  const chatRoomRef = useRef(null);

  const otherUserId = chat ? (chat.user1_id === user?.id ? chat.user2_id : chat.user1_id) : null;

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e) => {
    // ESC - Focus input or blur if already focused
    if (e.key === 'Escape') {
      const messageInput = document.querySelector('input[type="text"]');
      if (document.activeElement === messageInput) {
        messageInput.blur();
      } else {
        messageInput?.focus();
      }
    }
    
    // Ctrl/Cmd + K - Quick focus input
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      document.querySelector('input[type="text"]')?.focus();
    }

    // Ctrl/Cmd + I - Show chat info (could add modal later)
    if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
      e.preventDefault();
      console.log('Chat info shortcut pressed');
    }
  }, []);

  // Add keyboard event listeners
  useEffect(() => {
    const element = chatRoomRef.current;
    if (element) {
      element.addEventListener('keydown', handleKeyDown);
      return () => element.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyDown]);

  // Load other user's profile
  useEffect(() => {
    if (otherUserId) {
      getUserProfileRequest(otherUserId)
        .then(response => setOtherUser(response.data))
        .catch(error => console.error("Error loading user profile:", error));
    }
  }, [otherUserId]);

  // Socket event listeners for typing indicators
  useEffect(() => {
    if (!chat?.id) return;

    const handleUserTyping = (data) => {
      if (data.chatId === chat.id && data.userId !== user?.id) {
        setTypingUsers(prev => {
          if (data.isTyping) {
            // Add user to typing list if not already there
            const exists = prev.find(u => u.userId === data.userId);
            if (!exists) {
              return [...prev, { userId: data.userId, name: otherUser?.name || `User ${data.userId}` }];
            }
            return prev;
          } else {
            // Remove user from typing list
            return prev.filter(u => u.userId !== data.userId);
          }
        });
      }
    };

    socket.on("user_typing", handleUserTyping);

    return () => {
      socket.off("user_typing", handleUserTyping);
    };
  }, [chat?.id, user?.id, otherUser?.name]);

  const handleTypingStart = () => {
    if (chat?.id) {
      socket.emit("typing_start", { chatId: chat.id });
    }
  };

  const handleTypingStop = () => {
    if (chat?.id) {
      socket.emit("typing_stop", { chatId: chat.id });
    }
  };

  if (!chat) {
    return (
      <section className="flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-center text-slate-400">
        <h2 className="text-2xl font-semibold text-white">
          Select a conversation
        </h2>
        <p className="mt-2 text-sm text-slate-300">
          Pick a chat from the left panel or start a new one.
        </p>
      </section>
    );
  }

  return (
    <section className="flex flex-1 flex-col bg-slate-950 h-full min-h-0">
      {/* Enhanced Header with Avatar and Online Status */}
      <header className="border-b border-slate-800 px-6 py-4 bg-slate-900 flex-shrink-0">
        <div className="flex items-center space-x-4">
          <Avatar 
            src={otherUser?.avatar} 
            name={otherUser?.name || `User ${otherUserId}`}
            size="md"
            isOnline={otherUser?.is_online}
          />
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-white">
              {otherUser?.name || `User #${otherUserId}`}
            </h2>
            <OnlineStatusIndicator 
              isOnline={otherUser?.is_online} 
              lastSeen={otherUser?.last_seen}
            />
          </div>
          <div className="text-xs text-slate-300">
            Chat #{chat.id}
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 min-h-0">
          <MessageList
            messages={messages}
            currentUserId={user?.id}
            loading={loadingMessages}
          />
        </div>
        
        {/* Typing Indicator */}
        <TypingIndicator typingUsers={typingUsers} />
      </div>

      {/* Message Input */}
      <div className="flex-shrink-0">
        <MessageInput
          onSend={(value) => onSendMessage?.(chat.id, value)}
          onSendFile={(file, content) => onSendFileMessage?.(chat.id, file, content)}
          onTypingStart={handleTypingStart}
          onTypingStop={handleTypingStop}
          disabled={loadingMessages}
        />
      </div>
    </section>
  );
}

