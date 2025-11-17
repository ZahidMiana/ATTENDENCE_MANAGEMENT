#!/bin/bash

# Generate unique project name with timestamp
TIMESTAMP=$(date +%s)
PROJECT_NAME="blockchain-attendance-zahid-$TIMESTAMP"

echo "🚀 Deploying with unique project name: $PROJECT_NAME"

# Deploy with Vercel CLI using unique name
npx vercel --name "$PROJECT_NAME" --prod

echo "✅ Deployment complete!"
echo "🌐 Your app should be available at: https://$PROJECT_NAME.vercel.app"