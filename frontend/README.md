# 🎨 Frontend - Real-time Chat Application

This is the React frontend for the real-time chat application built with Vite, Tailwind CSS, and Socket.IO.

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks and functional components
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Socket.IO Client** - Real-time bidirectional communication
- **React Router** - Client-side routing and navigation
- **React Hot Toast** - Beautiful toast notifications
- **Axios** - HTTP client for API requests

## 📦 Key Dependencies

```json
{
  "react": "^18.x",
  "react-dom": "^18.x",
  "react-router-dom": "^6.x",
  "socket.io-client": "^4.x",
  "axios": "^1.x",
  "react-hot-toast": "^2.x",
  "tailwindcss": "^3.x"
}
```

## 🚀 Development

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Backend server running on port 8000

### Quick Start
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Access at http://localhost:5173
```

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 📁 Project Structure

```
src/
├── App.jsx                 # Main application component
├── main.jsx               # Application entry point
├── index.css              # Global styles and Tailwind imports
├── components/            # Reusable UI components
│   ├── Avatar.jsx         # User avatar component
│   ├── ChatList.jsx       # Chat sidebar component
│   ├── ChatRoom.jsx       # Main chat interface
│   ├── MessageInput.jsx   # Message input with file upload
│   ├── MessageList.jsx    # Message container
│   ├── MessageItem.jsx    # Individual message component
│   ├── TypingIndicator.jsx # Real-time typing indicator
│   └── ...
├── pages/                 # Page-level components
│   ├── Login.jsx          # Authentication page
│   ├── Register.jsx       # User registration
│   ├── ChatPage.jsx       # Main chat application
│   └── Profile.jsx        # User profile management
├── context/               # React Context providers
│   ├── AuthContext.jsx    # Authentication state management
│   └── ChatContext.jsx    # Chat state management
├── hooks/                 # Custom React hooks
│   └── useAuth.js         # Authentication hook
├── api/                   # API integration
│   ├── api.js             # Axios configuration
│   ├── authApi.js         # Authentication API calls
│   ├── chatApi.js         # Chat-related API calls
│   └── messageApi.js      # Message API calls
└── socket/                # Socket.IO client configuration
    └── socket.js          # Socket connection and event handlers
```

## 🎨 Styling

The application uses **Tailwind CSS** with a custom dark theme:

### Color Palette
- **Background:** `slate-950` (#020617)
- **Surface:** `slate-900` (#0f172a)
- **Border:** `slate-800` (#1e293b)
- **Text Primary:** `white` (#ffffff)
- **Text Secondary:** `slate-300` (#cbd5e1)
- **Accent:** `blue-600` (#2563eb)

### Custom Components
- Dark theme optimized for readability
- Responsive design for mobile and desktop
- Smooth animations and transitions
- Custom scrollbars and UI elements

## 🔌 Socket.IO Integration

Real-time features implemented:
- **Message delivery** - Instant message sending/receiving
- **Typing indicators** - Show when users are typing
- **Online status** - Real-time presence tracking
- **Message read receipts** - Track message delivery status

### Socket Events
```javascript
// Outgoing events
socket.emit('join_chat', chatId);
socket.emit('send_message', messageData);
socket.emit('typing_start', { chatId, userId });

// Incoming events
socket.on('receive_message', handleNewMessage);
socket.on('user_typing', handleTypingIndicator);
socket.on('user_online', handleUserOnline);
```

## 🔐 Authentication Flow

1. **Login/Register** - JWT token-based authentication
2. **Protected Routes** - Route guards for authenticated pages
3. **Token Storage** - Secure token storage in localStorage
4. **Auto-refresh** - Automatic token validation and refresh

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile:** 320px - 768px
- **Tablet:** 768px - 1024px  
- **Desktop:** 1024px+

Key responsive features:
- Collapsible chat sidebar on mobile
- Touch-friendly interface elements
- Adaptive grid layouts
- Mobile-optimized file upload

## 🚀 Production Build

### Build Configuration
```bash
# Production build
npm run build

# Preview production build
npm run preview
```

### Environment Variables
Create `.env.production` file:
```env
VITE_API_URL=https://your-backend-domain.com
VITE_SOCKET_URL=https://your-backend-domain.com
```

### Deployment
The built application (`dist/` folder) can be deployed to:
- **Vercel** (recommended)
- **Netlify**
- **AWS S3 + CloudFront**
- **Any static hosting service**

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Chat creation and navigation
- [ ] Real-time message sending
- [ ] File upload and preview
- [ ] Typing indicators
- [ ] Online status updates
- [ ] Mobile responsiveness
- [ ] Cross-browser compatibility

## ⚡ Performance Optimizations

- **Code Splitting** - Route-based code splitting
- **Lazy Loading** - Components loaded on demand
- **Image Optimization** - Compressed avatars and file previews
- **Memoization** - React.memo and useMemo for expensive operations
- **Efficient Re-renders** - Optimized useCallback usage

## 🔧 Development Tools

- **Vite** - Fast HMR and build optimization
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing with Tailwind
- **React DevTools** - Component debugging
- **Socket.IO DevTools** - Real-time event debugging

---

For more information, see the main project [README.md](../README.md)
