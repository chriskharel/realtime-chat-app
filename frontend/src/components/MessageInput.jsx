import { useState, useRef, useCallback, memo } from "react";
import toast from "react-hot-toast";

const MessageInput = memo(function MessageInput({ onSend, onSendFile, disabled, onTypingStart, onTypingStop }) {
  const [value, setValue] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);
  const fileInputRef = useRef(null);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!value.trim() && !selectedFile) return;

    // Stop typing indicator
    if (isTypingRef.current) {
      onTypingStop?.();
      isTypingRef.current = false;
    }

    if (selectedFile) {
      await onSendFile?.(selectedFile, value);
      setSelectedFile(null);
      setFilePreview(null);
    } else {
      await onSend?.(value);
    }
    
    setValue("");
  }, [value, selectedFile, onSend, onSendFile, onTypingStop]);

  const handleFileSelect = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setSelectedFile(file);

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setFilePreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }

    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const handleRemoveFile = useCallback(() => {
    setSelectedFile(null);
    setFilePreview(null);
  }, []);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);

    // Handle typing indicators
    if (newValue.trim() && !isTypingRef.current) {
      // Start typing
      onTypingStart?.();
      isTypingRef.current = true;
    } else if (!newValue.trim() && isTypingRef.current) {
      // Stop typing immediately if input is empty
      onTypingStop?.();
      isTypingRef.current = false;
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator
    if (newValue.trim()) {
      typingTimeoutRef.current = setTimeout(() => {
        if (isTypingRef.current) {
          onTypingStop?.();
          isTypingRef.current = false;
        }
      }, 2000); // Stop typing after 2 seconds of inactivity
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-slate-800 bg-slate-950 px-4 py-4"
    >
      {/* File preview */}
      {selectedFile && (
        <div className="mb-3 p-3 bg-slate-900 border border-slate-800 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {filePreview ? (
                <img src={filePreview} alt="Preview" className="w-12 h-12 rounded object-cover" />
              ) : (
                <div className="w-12 h-12 bg-slate-800 border border-slate-700 rounded flex items-center justify-center">
                  <span className="text-2xl">📎</span>
                </div>
              )}
              <div>
                <p className="text-sm text-white font-medium">{selectedFile.name}</p>
                <p className="text-xs text-slate-300">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemoveFile}
              className="text-slate-300 hover:text-red-400 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center space-x-3 rounded-2xl border border-slate-700 bg-slate-900 px-4 py-2">
        {/* File upload button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="text-slate-300 hover:text-blue-400 transition-colors"
          disabled={disabled}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx,.txt,.zip,.rar"
        />

        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          placeholder={selectedFile ? "Add a caption..." : "Type a message"}
          className="flex-1 bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 rounded px-1 py-1 transition-all"
          disabled={disabled}
          autoFocus
        />
        
        <button
          type="submit"
          disabled={disabled || (!value.trim() && !selectedFile)}
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-800 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </form>
  );
});

export default MessageInput;

