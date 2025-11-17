#!/bin/bash

echo "🔧 Testing Vercel Build Process Locally..."

# Step 1: Install dependencies
echo "📦 Installing dependencies..."
npm install

# Step 2: Build client (this happens automatically via postinstall)
echo "🏗️ Building client..."
npm run build

# Step 3: Check if build was successful
if [ -d "client/dist" ]; then
    echo "✅ Client build successful - client/dist exists"
    
    # Check for key files
    if [ -f "client/dist/index.html" ]; then
        echo "✅ index.html found"
    else
        echo "❌ index.html NOT found"
    fi
    
    if [ -d "client/dist/assets" ]; then
        echo "✅ assets folder found"
    else
        echo "❌ assets folder NOT found"
    fi
    
else
    echo "❌ Client build FAILED - client/dist does not exist"
    exit 1
fi

# Step 4: Test server
echo "🚀 Testing server..."
echo "Starting server on port 5000..."
echo "Visit: http://localhost:5000"
echo "Test API: http://localhost:5000/api"
echo "Press Ctrl+C to stop"

NODE_ENV=production node server.js