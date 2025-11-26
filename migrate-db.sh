#!/bin/bash
# Database migration script for Vercel deployment

BASE_URL="https://frontend-rmncn608w-krishna-kharels-projects.vercel.app"
MIGRATION_SECRET="my_secret_migration_key_2024"

echo "🗄️ Running database migration on Vercel..."
echo "URL: $BASE_URL/api/migrate"
echo ""

# Run migration
curl -X POST "$BASE_URL/api/migrate" \
  -H "Content-Type: application/json" \
  -d "{\"migrationSecret\": \"$MIGRATION_SECRET\"}" \
  -w "\n\nStatus Code: %{http_code}\n"

echo ""
echo "✅ Migration request sent!"
echo ""
echo "📋 Check the response above:"
echo "- Status 200 = Migration successful"
echo "- Status 401 = Wrong migration secret"  
echo "- Status 500 = Database connection error"
