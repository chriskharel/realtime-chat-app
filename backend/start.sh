#!/bin/bash
# Railway start script
echo "🚀 Starting Chat App Backend..."

# Run database migration
echo "📊 Running database migrations..."
npm run migrate

# Start the server
echo "🌟 Starting server..."
exec node server.js
