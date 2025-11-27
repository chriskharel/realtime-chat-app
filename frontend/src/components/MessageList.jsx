import { useEffect, useRef, memo } from "react";
import MessageItem from "./MessageItem.jsx";

// Skeleton loading component for messages
const MessageSkeleton = memo(function MessageSkeleton({ isRight = false }) {
  return (
    <div className={`flex ${isRight ? "justify-end" : "justify-start"} animate-pulse`}>
      <div className={`max-w-xs rounded-2xl px-4 py-3 ${isRight ? "rounded-br-none" : "rounded-bl-none"}`}>
        <div className={`h-4 rounded mb-2 ${isRight ? "bg-blue-700/30" : "bg-slate-700/50"}`}></div>
        <div className={`h-4 rounded w-3/4 ${isRight ? "bg-blue-700/30" : "bg-slate-700/50"}`}></div>
      </div>
    </div>
  );
});

const MessageList = memo(function MessageList({ messages, currentUserId, loading }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (loading) {
    return (
      <div className="flex-1 h-full overflow-y-auto overflow-x-hidden px-6 py-4" style={{ maxHeight: '100%' }}>
        <div className="space-y-4">
          {/* Skeleton loading messages */}
          {[...Array(6)].map((_, index) => (
            <MessageSkeleton key={index} isRight={index % 3 === 0} />
          ))}
        </div>
      </div>
    );
  }

  if (!messages.length) {
    return (
      <div className="flex flex-1 items-center justify-center text-slate-400">
        No messages yet. Start the conversation below.
      </div>
    );
  }

  return (
    <div className="flex-1 h-full overflow-y-auto overflow-x-hidden px-6 py-4" style={{ maxHeight: '100%' }}>
      <div className="space-y-4">
        {messages.map((message) => (
          <MessageItem
            key={message.id}
            message={message}
            isSender={
              message.sender_id === currentUserId ||
              message.senderId === currentUserId
            }
          />
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
});

export default MessageList;

