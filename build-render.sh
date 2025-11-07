#!/bin/bash
set -e

echo "🚀 Starting Render build process..."

# Step 1: Install main app dependencies
echo "📦 Installing main app dependencies..."
cd shopify-app
npm install

# Step 2: Build widget
echo "🎨 Building Eva chat widget..."
cd extensions/eva-chat-widget
npm install
npm run build
cd ../..

# Step 3: Generate Prisma client
echo "🗄️ Generating Prisma client..."
npx prisma generate

# Step 4: Build Remix app
echo "⚡ Building Remix app..."
npm run build:render

echo "✅ Build complete!"
