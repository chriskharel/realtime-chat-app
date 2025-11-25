export default function OnlineStatusIndicator({ isOnline, lastSeen, className = "" }) {
  const formatLastSeen = (lastSeenDate) => {
    if (!lastSeenDate) return "Last seen: Unknown";
    
    const now = new Date();
    const lastSeenTime = new Date(lastSeenDate);
    const diffInMinutes = Math.floor((now - lastSeenTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Last seen: Just now";
    if (diffInMinutes < 60) return `Last seen: ${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Last seen: ${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `Last seen: ${diffInDays}d ago`;
    
    return `Last seen: ${lastSeenTime.toLocaleDateString()}`;
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="flex items-center space-x-1">
        <div
          className={`w-2 h-2 rounded-full ${
            isOnline ? "bg-green-500" : "bg-slate-500"
          }`}
        />
        <span className="text-xs text-slate-300">
          {isOnline ? "Online" : formatLastSeen(lastSeen)}
        </span>
      </div>
    </div>
  );
}
