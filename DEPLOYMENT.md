# 🚀 Deployment Checklist

## ✅ Pre-Deployment (Completed)
- [x] Code pushed to GitHub
- [x] Railway configuration files added
- [x] Health check endpoints added
- [x] Environment variables configured
- [x] Database migration script ready

## 📋 Railway Deployment Steps

### 1. Deploy Backend
- [ ] Go to [railway.app](https://railway.app)
- [ ] Sign in with GitHub
- [ ] Create new project from GitHub repo
- [ ] Select `chriskharel/realtime-chat-app`
- [ ] Set root directory to `backend`
- [ ] Deploy project

### 2. Add MySQL Database
- [ ] Click "+ New" in Railway dashboard
- [ ] Select "Database" → "MySQL"
- [ ] Wait for database to be created

### 3. Configure Environment Variables
Add these variables in Railway backend service:
```env
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-make-it-very-long-and-random-production-key-123456789
FRONTEND_URL=https://your-vercel-url.vercel.app
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760
```

### 4. Note Backend URL
- [ ] Copy your Railway backend URL (e.g., `https://backend-production-xxxx.up.railway.app`)

## 🌐 Vercel Deployment Steps

### 1. Deploy Frontend
- [ ] Go to [vercel.com](https://vercel.com)
- [ ] Click "New Project"
- [ ] Import `chriskharel/realtime-chat-app`
- [ ] Set root directory to `frontend`
- [ ] Framework: Vite
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`

### 2. Configure Environment Variables
Add these in Vercel project settings:
```env
VITE_API_URL=https://your-railway-backend-url.railway.app
VITE_SOCKET_URL=https://your-railway-backend-url.railway.app
```

### 3. Deploy
- [ ] Click "Deploy"
- [ ] Wait for deployment to complete
- [ ] Note your Vercel URL

## 🔄 Final Configuration

### 1. Update Backend CORS
- [ ] Go back to Railway
- [ ] Update `FRONTEND_URL` with your actual Vercel URL
- [ ] Wait for automatic redeploy

### 2. Test Deployment
- [ ] Visit backend health check: `https://your-backend.railway.app/health`
- [ ] Visit frontend: `https://your-frontend.vercel.app`
- [ ] Test user registration
- [ ] Test real-time messaging
- [ ] Test file uploads
- [ ] Test on mobile device

## 🎯 Success Indicators

### Backend (Railway)
- [ ] Health check returns 200 OK
- [ ] Database tables are created automatically
- [ ] API endpoints respond correctly
- [ ] File uploads work
- [ ] Socket.IO connections established

### Frontend (Vercel)
- [ ] Application loads without errors
- [ ] User can register/login
- [ ] Real-time messaging works
- [ ] Typing indicators appear
- [ ] Online status updates
- [ ] File sharing works
- [ ] Responsive on mobile

## 🐛 Troubleshooting

### Common Issues
1. **CORS Errors**
   - Ensure `FRONTEND_URL` in Railway matches your Vercel URL exactly
   - Check that both URLs use HTTPS

2. **Database Connection Issues**
   - Verify MySQL service is running in Railway
   - Check that migration ran successfully

3. **Socket.IO Connection Issues**
   - Ensure `VITE_SOCKET_URL` points to your Railway backend
   - Check that Railway allows WebSocket connections

4. **File Upload Issues**
   - Verify `uploads` directory permissions
   - Check file size limits

### Getting Help
- Railway Logs: Check the "Logs" tab in Railway dashboard
- Vercel Logs: Check the "Functions" tab in Vercel dashboard
- Browser Console: Check for frontend errors
- Network Tab: Verify API calls are reaching the backend

## 📱 URLs to Save

### Development
- Local Backend: http://localhost:8000
- Local Frontend: http://localhost:5173

### Production
- Backend (Railway): `https://your-backend.railway.app`
- Frontend (Vercel): `https://your-frontend.vercel.app`
- Health Check: `https://your-backend.railway.app/health`

## 🎉 You're Done!

Once all items are checked, your real-time chat application will be live and accessible worldwide! 🌍

Share your live application:
- Frontend URL: `https://your-frontend.vercel.app`
- GitHub Repository: `https://github.com/chriskharel/realtime-chat-app`
