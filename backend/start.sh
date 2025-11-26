#!/bin/bash
echo "🚀 Starting Chat App Backend..."
echo "📊 Running database migrations..."
node migrate.js
echo "🌟 Starting server..."
node server.js
