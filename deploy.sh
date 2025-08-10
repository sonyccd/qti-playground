#!/bin/bash

# Manual deployment script for Firebase Hosting
echo "🚀 Starting Firebase deployment..."

# Build the application
echo "📦 Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

# Deploy to Firebase
echo "🔥 Deploying to Firebase Hosting..."
npx firebase deploy --only hosting

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🌐 Your app is live at:"
    echo "   https://qti-playground.web.app"
    echo "   https://qti-playground.firebaseapp.com"
else
    echo "❌ Deployment failed"
    echo "Please run 'npm run firebase:login' if you haven't authenticated"
fi