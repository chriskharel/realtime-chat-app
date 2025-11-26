#!/bin/bash
# Test script for Vercel API endpoints

BASE_URL="https://frontend-rmncn608w-krishna-kharels-projects.vercel.app"

echo "🧪 Testing Vercel API Endpoints..."
echo "Base URL: $BASE_URL"
echo ""

# Test health endpoint
echo "1. Testing Health Endpoint..."
curl -s "$BASE_URL/api/health" | jq '.' 2>/dev/null || echo "Health endpoint response (raw):"
curl -s "$BASE_URL/api/health"
echo ""
echo ""

# Test registration
echo "2. Testing User Registration..."
curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com", 
    "password": "password123"
  }' | jq '.' 2>/dev/null || curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "email": "test@example.com", "password": "password123"}'
echo ""
echo ""

# Test login
echo "3. Testing User Login..."
curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }' | jq '.' 2>/dev/null || curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
echo ""
echo ""

echo "✅ API endpoint testing complete!"
echo ""
echo "📋 Next steps:"
echo "1. Add environment variables in Vercel dashboard"
echo "2. Run database migration: POST $BASE_URL/api/migrate"
echo "3. Switch frontend to use Vercel APIs"
