# 💬 Real-time Chat Application

A modern, full-stack chat application built with React, Node.js, Socket.IO, and MySQL. Features real-time messaging, file sharing, typing indicators, online status tracking, and a beautiful dark theme UI.

![Chat App Preview](https://via.placeholder.com/800x400/1e293b/f1f5f9?text=Real-time+Chat+App)

## ✨ Features

### 🔐 **Authentication & Security**
- JWT-based user authentication
- Secure password hashing with bcrypt
- Protected routes and middleware
- Session management

### 💬 **Real-time Communication**
- Instant messaging with Socket.IO
- Real-time message delivery
- Message read receipts
- Typing indicators
- Online/offline status tracking

### 📁 **File Sharing**
- Image and file uploads
- File preview for images
- Support for multiple file formats
- File size validation (10MB limit)

### 🎨 **User Interface**
- Modern dark theme with Tailwind CSS
- Responsive design (mobile-friendly)
- Beautiful avatar system
- Smooth animations and transitions
- Chat management (delete messages/chats)

### 👥 **User Management**
- User profiles with avatars
- Online status indicators
- Last seen timestamps
- User search by ID

## 🛠️ Tech Stack

### **Frontend**
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Socket.IO Client** - Real-time communication
- **React Router** - Client-side routing
- **React Hot Toast** - Beautiful notifications
- **Axios** - HTTP client for API calls

### **Backend**
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Socket.IO** - Real-time bidirectional communication
- **MySQL** - Relational database
- **JWT** - JSON Web Tokens for authentication
- **Multer** - File upload middleware
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📦 Project Structure

```
realtime-chat-app/
├── README.md                    # Project documentation
├── .gitignore                  # Git ignore rules
├── backend/                    # Node.js backend
│   ├── server.js              # Main server file
│   ├── package.json           # Backend dependencies
│   ├── config/
│   │   └── db.js              # Database configuration
│   ├── controllers/           # Route controllers
│   │   ├── auth.controller.js
│   │   ├── chat.controller.js
│   │   ├── message.controller.js
│   │   └── user.controller.js
│   ├── middleware/            # Custom middleware
│   │   ├── auth.middleware.js
│   │   └── upload.middleware.js
│   ├── models/                # Database models
│   │   ├── user.model.js
│   │   ├── chat.model.js
│   │   ├── message.model.js
│   │   └── session.model.js
│   ├── routes/                # API routes
│   │   ├── auth.routes.js
│   │   ├── chat.routes.js
│   │   ├── message.routes.js
│   │   └── user.routes.js
│   ├── utils/                 # Utility functions
│   │   └── generateToken.js
│   └── uploads/               # File storage
│       ├── avatars/
│       └── chat-files/
└── frontend/                  # React frontend
    ├── package.json           # Frontend dependencies
    ├── index.html             # HTML template
    ├── vite.config.js         # Vite configuration
    ├── tailwind.config.js     # Tailwind configuration
    ├── src/
    │   ├── App.jsx            # Main app component
    │   ├── main.jsx           # App entry point
    │   ├── index.css          # Global styles
    │   ├── components/        # Reusable components
    │   │   ├── ChatList.jsx
    │   │   ├── ChatRoom.jsx
    │   │   ├── MessageInput.jsx
    │   │   ├── MessageList.jsx
    │   │   └── ...
    │   ├── pages/             # Page components
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── ChatPage.jsx
    │   │   └── Profile.jsx
    │   ├── context/           # React context
    │   │   ├── AuthContext.jsx
    │   │   └── ChatContext.jsx
    │   ├── hooks/             # Custom hooks
    │   │   └── useAuth.js
    │   ├── api/               # API functions
    │   │   ├── authApi.js
    │   │   ├── chatApi.js
    │   │   └── messageApi.js
    │   └── socket/            # Socket.IO client
    │       └── socket.js
    └── public/                # Static assets
```

## 🚀 Quick Start

### Prerequisites

Make sure you have the following installed:
- **Node.js** (v16 or higher)
- **MySQL** (v8 or higher)
- **npm** or **yarn**
- **Git**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/chriskharel/realtime-chat-app.git
   cd realtime-chat-app
   ```

2. **Setup Backend:**
   ```bash
   cd backend
   npm install
   ```

3. **Configure Database:**
   
   Create a `.env` file in the `backend` directory:
   ```env
   # Server Configuration
   NODE_ENV=development
   PORT=8000
   
   # Database Configuration
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=realtime_chat_db
   
   # JWT Secret (use a strong, random string)
   JWT_SECRET=your-super-secret-jwt-key-make-it-very-long-and-random
   
   # CORS Configuration
   FRONTEND_URL=http://localhost:5173
   
   # File Upload Configuration
   UPLOAD_DIR=uploads
   MAX_FILE_SIZE=10485760
   ```

4. **Create Database:**
   ```bash
   # Login to MySQL
   mysql -u root -p
   
   # Create database
   CREATE DATABASE realtime_chat_db;
   USE realtime_chat_db;
   ```

5. **Run Database Schema:**
   ```bash
   # Check database schema
   node check-schema.js
   
   # Start backend server
   npm run dev
   ```

6. **Setup Frontend:**
   ```bash
   cd ../frontend
   npm install
   
   # Start frontend development server
   npm run dev
   ```

7. **Access the Application:**
   - **Frontend:** http://localhost:5173
   - **Backend API:** http://localhost:8000
   - **Socket.IO:** ws://localhost:8000

## 🗄️ Database Schema

The application uses the following MySQL tables:

### **Users Table**
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  avatar VARCHAR(500) DEFAULT NULL,
  is_online BOOLEAN DEFAULT FALSE,
  last_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### **Chats Table**
```sql
CREATE TABLE chats (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user1_id INT NOT NULL,
  user2_id INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user1_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (user2_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### **Messages Table**
```sql
CREATE TABLE messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  chat_id INT NOT NULL,
  sender_id INT NOT NULL,
  content TEXT,
  message_type ENUM('text', 'image', 'file') DEFAULT 'text',
  file_path VARCHAR(500) DEFAULT NULL,
  file_name VARCHAR(255) DEFAULT NULL,
  file_size INT DEFAULT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## 🔧 API Endpoints

### **Authentication**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### **Users**
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/avatar` - Upload avatar
- `DELETE /api/users/avatar` - Delete avatar

### **Chats**
- `GET /api/chats` - Get user's chats
- `POST /api/chats` - Create new chat
- `DELETE /api/chats/:id` - Delete chat

### **Messages**
- `GET /api/messages/:chatId` - Get chat messages
- `POST /api/messages` - Send text message
- `POST /api/messages/file` - Send file message
- `DELETE /api/messages/:id` - Delete message

## 🌐 Socket.IO Events

### **Client to Server**
- `join_chat` - Join a chat room
- `leave_chat` - Leave a chat room
- `send_message` - Send a message
- `typing_start` - Start typing indicator
- `typing_stop` - Stop typing indicator

### **Server to Client**
- `receive_message` - Receive new message
- `message_deleted` - Message was deleted
- `user_typing` - User typing status
- `user_online` - User came online
- `user_offline` - User went offline

## 🚀 Deployment

### **Option 1: Vercel + Railway (Recommended)**

#### **Deploy Backend to Railway:**
1. Create account at [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Deploy backend service
4. Add MySQL database
5. Configure environment variables

#### **Deploy Frontend to Vercel:**
1. Create account at [vercel.com](https://vercel.com)
2. Connect your GitHub repository
3. Set build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Root Directory: `frontend`

### **Option 2: Digital Ocean Droplet**
```bash
# Create Ubuntu droplet
# Install Node.js, MySQL, Nginx
# Clone repository
# Setup PM2 for process management
# Configure reverse proxy with Nginx
```

### **Environment Variables for Production**

**Backend (.env.production):**
```env
NODE_ENV=production
PORT=8000
DB_HOST=your-production-db-host
DB_USER=your-production-db-user
DB_PASSWORD=your-production-db-password
DB_NAME=your-production-db-name
JWT_SECRET=your-super-secure-jwt-secret
FRONTEND_URL=https://your-frontend-domain.com
```

**Frontend (.env.production):**
```env
VITE_API_URL=https://your-backend-domain.com
VITE_SOCKET_URL=https://your-backend-domain.com
```

## 🧪 Testing

### **Manual Testing Checklist**
- [ ] User registration and login
- [ ] Real-time message sending/receiving
- [ ] File upload and sharing
- [ ] Typing indicators
- [ ] Online status updates
- [ ] Message deletion
- [ ] Chat management
- [ ] Mobile responsiveness

### **Load Testing**
```bash
# Test concurrent connections
# Monitor memory usage
# Check database performance
# Verify file upload limits
```

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt with salt rounds
- **Input Validation** - Sanitize user inputs
- **File Upload Security** - Type and size validation
- **CORS Configuration** - Restricted origins
- **SQL Injection Prevention** - Parameterized queries

## 📱 Mobile Support

The application is fully responsive and works on:
- iOS Safari
- Android Chrome
- Mobile browsers with WebSocket support
- Progressive Web App (PWA) ready

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch:** `git checkout -b feature/amazing-feature`
3. **Commit changes:** `git commit -m 'Add amazing feature'`
4. **Push to branch:** `git push origin feature/amazing-feature`
5. **Open Pull Request**

### **Development Guidelines**
- Follow existing code style
- Add comments for complex logic
- Test thoroughly before submitting PR
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Socket.IO** - Real-time communication
- **React** - Frontend framework
- **Tailwind CSS** - Styling framework
- **Express.js** - Backend framework
- **MySQL** - Database system

## 📞 Support

If you have any questions or need help:

- **GitHub Issues:** [Create an issue](https://github.com/chriskharel/realtime-chat-app/issues)
- **Email:** your-email@example.com
- **Documentation:** Check the code comments and this README

## 🏗️ Roadmap

### **Upcoming Features**
- [ ] Group chat functionality
- [ ] Voice/video calling
- [ ] Message reactions (emoji)
- [ ] Message forwarding
- [ ] Dark/light theme toggle  
- [ ] Push notifications
- [ ] Message search
- [ ] Chat export
- [ ] Admin dashboard
- [ ] Message encryption

---

**Made with ❤️ by [Chris Kharel](https://github.com/chriskharel)**

⭐ If you found this project helpful, please give it a star!
