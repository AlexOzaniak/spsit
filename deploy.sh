#!/bin/bash
# Deployment script for production

echo "🚀 Starting deployment..."

# Make sure .env variables are set
if [ -z "$DB_HOST" ] || [ -z "$DB_USER" ] || [ -z "$DB_PASSWORD" ] || [ -z "$DB_NAME" ]; then
  echo "❌ Error: Missing required environment variables"
  echo "Please set: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME"
  exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production

# Start server
echo "✅ Starting server..."
npm start
