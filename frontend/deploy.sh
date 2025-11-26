#!/bin/bash
# Quick Vercel deployment script for backend API

echo "🚀 Deploying backend API to Vercel..."

# Ensure we're in the right directory
cd "$(dirname "$0")"

# Ensure we're on the right branch
git checkout vercel-api-implementation

# Push latest changes
echo "📤 Pushing latest changes to GitHub..."
git push origin vercel-api-implementation

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
npx vercel --prod --yes

echo "✅ Deployment complete!"
echo "📋 Next steps:"
echo "1. Add environment variables in Vercel dashboard"
echo "2. Test API endpoints: https://your-app.vercel.app/api/health"
echo "3. Run database migration: POST https://your-app.vercel.app/api/migrate"
