export default function FileMessage({ message, isSender }) {
  const baseUrl = "http://localhost:8000";
  
  const getFileIcon = (fileType, mimeType) => {
    if (mimeType?.startsWith('image/')) {
      return '🖼️';
    } else if (mimeType?.includes('pdf')) {
      return '📄';
    } else if (mimeType?.includes('word') || mimeType?.includes('document')) {
      return '📝';
    } else if (mimeType?.includes('zip') || mimeType?.includes('rar')) {
      return '🗜️';
    } else {
      return '📎';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileClick = () => {
    window.open(`${baseUrl}${message.file_path}`, '_blank');
  };

  if (message.message_type === 'image') {
    return (
      <div className="max-w-xs sm:max-w-md">
        <img
          src={`${baseUrl}${message.file_path}`}
          alt={message.file_name}
          className="rounded-lg cursor-pointer hover:opacity-90 transition-opacity max-h-64 object-cover"
          onClick={handleFileClick}
        />
        {message.content && (
          <p className="mt-2 text-sm">{message.content}</p>
        )}
      </div>
    );
  }

  return (
    <div 
      className="flex items-center space-x-3 p-3 bg-slate-700 rounded-lg cursor-pointer hover:bg-slate-600 transition-colors max-w-xs sm:max-w-md"
      onClick={handleFileClick}
    >
      <div className="text-2xl">
        {getFileIcon(message.message_type, message.file_type)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">
          {message.file_name}
        </p>
        <p className="text-xs text-slate-400">
          {formatFileSize(message.file_size)}
        </p>
      </div>
      <div className="text-slate-400">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
    </div>
  );
}
