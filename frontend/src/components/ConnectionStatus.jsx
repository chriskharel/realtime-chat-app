import { memo } from 'react';
import { useSocketConnection } from '../hooks/useSocket.js';
import useAuth from '../hooks/useAuth.js';

const ConnectionStatus = memo(function ConnectionStatus() {
  const { user } = useAuth();
  const { isConnected, reconnectAttempts, maxAttempts } = useSocketConnection(user);

  if (!user) return null;

  if (isConnected) {
    return (
      <div className="flex items-center space-x-2 text-green-400">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span className="text-xs">Connected</span>
      </div>
    );
  }

  if (reconnectAttempts > 0) {
    return (
      <div className="flex items-center space-x-2 text-yellow-400">
        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
        <span className="text-xs">
          Reconnecting... ({reconnectAttempts}/{maxAttempts})
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 text-red-400">
      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
      <span className="text-xs">Disconnected</span>
    </div>
  );
});

export default ConnectionStatus;
