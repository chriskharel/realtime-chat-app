export default function ReadReceiptIndicator({ message, isSender }) {
  if (!isSender) return null;

  const getReceiptIcon = () => {
    if (message.is_read) {
      // Double checkmark blue (read)
      return (
        <div className="flex items-center text-blue-400">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
          </svg>
          <svg className="w-4 h-4 -ml-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
          </svg>
        </div>
      );
    } else if (message.is_delivered) {
      // Double checkmark gray (delivered)
      return (
        <div className="flex items-center text-slate-400">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
          </svg>
          <svg className="w-4 h-4 -ml-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
          </svg>
        </div>
      );
    } else {
      // Single checkmark gray (sent)
      return (
        <div className="flex items-center text-slate-400">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
          </svg>
        </div>
      );
    }
  };

  return (
    <div className="flex items-center space-x-1 mt-1">
      {getReceiptIcon()}
      <span className="text-[10px] uppercase tracking-wide text-slate-300">
        {message.created_at
          ? new Date(message.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "Just now"}
      </span>
    </div>
  );
}
