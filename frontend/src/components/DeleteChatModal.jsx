import { useState } from "react";

export default function DeleteChatModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  chatInfo,
  loading = false 
}) {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="mx-4 w-full max-w-md rounded-xl bg-slate-900 border border-slate-700 shadow-2xl">
        <div className="p-6">
          {/* Header */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white">
              Delete Chat
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              Are you sure you want to delete this chat? This action cannot be undone.
            </p>
          </div>

          {/* Chat Info */}
          {chatInfo && (
            <div className="mb-6 rounded-lg bg-slate-800 p-3">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600">
                  <span className="text-sm font-medium text-white">
                    {chatInfo.otherUserName?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    {chatInfo.otherUserName || `User ${chatInfo.otherUserId}`}
                  </p>
                  <p className="text-xs text-slate-500">
                    Chat ID: {chatInfo.chatId}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Warning */}
          <div className="mb-6 rounded-lg bg-red-900/20 border border-red-800/30 p-3">
            <div className="flex items-start space-x-2">
              <svg 
                className="mt-0.5 h-4 w-4 text-red-400 flex-shrink-0" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path 
                  fillRule="evenodd" 
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" 
                  clipRule="evenodd" 
                />
              </svg>
              <div>
                <p className="text-sm text-red-400 font-medium">
                  All messages will be permanently deleted
                </p>
                <p className="text-xs text-red-300 mt-1">
                  This will delete all messages, files, and chat history for all participants.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 rounded-lg border border-slate-600 bg-transparent px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                    />
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Deleting...</span>
                </>
              ) : (
                <span>Delete Chat</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
