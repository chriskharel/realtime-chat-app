export default function Avatar({ src, name, size = "md", isOnline = false, className = "" }) {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-12 h-12 text-sm",
    lg: "w-16 h-16 text-lg",
    xl: "w-24 h-24 text-xl"
  };

  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const baseUrl = "http://localhost:8000"; 

  return (
    <div className={`relative ${className}`}>
      <div className={`
        ${sizeClasses[size]} 
        rounded-full 
        overflow-hidden 
        bg-gradient-to-br from-blue-500 to-purple-600 
        flex items-center justify-center 
        font-semibold text-white
        border-2 border-gray-700
      `}>
        {src ? (
          <img
            src={src.startsWith('http') ? src : `${baseUrl}${src}`}
            alt={name || "Avatar"}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div
          className={`
            w-full h-full flex items-center justify-center
            ${src ? 'hidden' : 'flex'}
          `}
        >
          {getInitials(name)}
        </div>
      </div>
      
      {/* Online status indicator */}
      {isOnline && (
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-gray-900 rounded-full"></div>
      )}
    </div>
  );
}
