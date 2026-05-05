#!/bin/bash

# Simple Bootstrap Script for EC2
echo "🚀 Starting Server Bootstrap..."

# 1. Update system
sudo apt-get update -y

# 2. Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Install PM2 and serve
sudo npm install -g pm2 serve

# 4. Configure 2GB Swap Memory (for low-RAM instances)
if [ ! -f /swapfile ]; then
    echo "Creating 2GB swap file..."
    sudo fallocate -l 2G /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
fi

echo "✅ Bootstrap Complete! Node version: $(node -v)"
