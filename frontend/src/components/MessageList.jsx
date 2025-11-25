import { useEffect, useRef } from "react";
import MessageItem from "./MessageItem.jsx";

export default function MessageList({ messages, currentUserId, loading }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center text-slate-400">
        Loading messages…
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
    <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
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
  );
}

