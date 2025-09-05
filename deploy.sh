#!/bin/bash

echo "🚀 ConstructorPro PWA - Push to GitHub"
echo "======================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

echo "✅ Project directory confirmed"
echo "🔗 Repository: https://github.com/scr83/construction-pwa-enterprise"

# Add all changes to git
echo "📝 Adding changes to git..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "Deploy: ConstructorPro PWA - Ready for production $(date '+%Y-%m-%d %H:%M:%S')"

# Push to GitHub (this will trigger automatic Vercel deployment)
echo "🚀 Pushing to GitHub..."
git push origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 SUCCESS! Code pushed to construction-pwa-enterprise!"
    echo ""
    echo "📍 Vercel will now rebuild automatically:"
    echo "   🔗 GitHub: https://github.com/scr83/construction-pwa-enterprise"
    echo "   🌐 App URL: https://construction-app-theta.vercel.app"
    echo ""
    echo "⏱️  Vercel usually takes 2-3 minutes to rebuild"
    echo "📊 Monitor at: https://vercel.com/dashboard"
else
    echo "❌ Push failed. Please check your git configuration and try again."
    exit 1
fi
