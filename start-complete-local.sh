#!/bin/bash

# Complete Local Setup (Backend + Frontend)
# Use this if Railway backend is having issues

echo "🚀 COMPLETE LOCAL CHAT APP SETUP"
echo "================================"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo -e "${BLUE}📋 COMPLETE LOCAL SETUP:${NC}"
echo "- Backend: Local Node.js server (Port 8000)"
echo "- Frontend: Local Vite dev server (Port 5173)"
echo "- Database: Railway MySQL (or local MySQL)"
echo ""

echo -e "${YELLOW}🔧 Step 1: Setup Backend${NC}"
cd backend

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
else
    echo "✅ Backend dependencies already installed"
fi

echo ""
echo -e "${YELLOW}📄 Step 2: Environment Setup${NC}"
if [ ! -f ".env" ]; then
    echo -e "${RED}⚠️ Missing .env file in backend directory${NC}"
    echo "Create backend/.env with your database credentials:"
    echo ""
    echo "DB_HOST=your_database_host"
    echo "DB_PORT=3306"
    echo "DB_USER=your_username"
    echo "DB_PASSWORD=your_password"
    echo "DB_NAME=your_database_name"
    echo "JWT_SECRET=your_jwt_secret_key"
    echo "PORT=8000"
    echo ""
    echo "Press Enter when ready to continue..."
    read
fi

echo ""
echo -e "${YELLOW}🚀 Step 3: Start Backend Server${NC}"
echo "Starting backend on http://localhost:8000..."
echo ""
echo -e "${GREEN}🎉 Instructions:${NC}"
echo "1. Backend will start on: http://localhost:8000"
echo "2. Open NEW TERMINAL and run: ./start-local-demo.sh"
echo "3. Frontend will be available on: http://localhost:5173"
echo ""
echo "Starting backend server..."

# Start the backend server
npm run dev
