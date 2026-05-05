#!/bin/bash

# Simple Deployment Script
echo "🚢 Starting Deployment..."

# Navigate to project root (adjust path if needed)
cd ~/Zivara || exit

# 1. Pull latest code
git pull origin main

# 2. Setup Backend
echo "📦 Setting up Backend..."
cd backend
npm install
npx prisma generate
npx prisma migrate deploy
# Restart backend with PM2
pm2 restart all || pm2 start src/index.ts --name "zivara-backend" --interpreter ts-node

# 3. Setup Frontend
echo "📦 Setting up Frontend..."
cd ../frontend
npm install
npm run build
# Serve frontend with PM2
pm2 restart zivara-frontend || pm2 start "serve -s out -p 3000" --name "zivara-frontend"

echo "✅ Deployment Successful!"
