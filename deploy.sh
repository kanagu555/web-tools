#!/bin/bash

# KodeKit Next.js Deployment Script
# This script handles the deployment process for the Next.js application

set -e

echo "🚀 Starting KodeKit Next.js deployment..."

# Check if required environment variables are set
if [ -z "$NEXT_PUBLIC_APP_URL" ]; then
    echo "⚠️  Warning: NEXT_PUBLIC_APP_URL is not set"
fi

# Clean previous builds
echo "🧹 Cleaning previous builds..."
yarn clean

# Install dependencies
echo "📦 Installing dependencies..."
yarn install --frozen-lockfile

# Run type checking
echo "🔍 Running type checks..."
yarn type-check

# Run linting
echo "🔧 Running ESLint..."
yarn lint

# Build the application
echo "🏗️  Building Next.js application..."
yarn build

# Generate sitemap
echo "🗺️  Generating sitemap..."
npx next-sitemap

# Run bundle analysis if requested
if [ "$ANALYZE" = "true" ]; then
    echo "📊 Running bundle analysis..."
    yarn build:analyze
fi

# Test the build
echo "🧪 Testing the build..."
yarn start &
SERVER_PID=$!
sleep 5

# Check if server is running
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Build test successful"
else
    echo "❌ Build test failed"
    kill $SERVER_PID
    exit 1
fi

kill $SERVER_PID

echo "🎉 Deployment preparation complete!"
echo "📋 Next steps:"
echo "   - Deploy to your hosting platform (Vercel, Netlify, etc.)"
echo "   - Update DNS settings if needed"
echo "   - Monitor application performance"

# If deploying to Vercel
if [ "$DEPLOY_TO_VERCEL" = "true" ]; then
    echo "🚀 Deploying to Vercel..."
    npx vercel --prod
fi