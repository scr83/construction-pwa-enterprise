#!/bin/bash
set -e

echo "🔥 FIXING BUILD ERROR - Duplicate FileText Import"
echo "==============================================="

cd /Users/scr/CONSTRUCTION-APP-v1.0

echo "🔍 Checking git status..."
git status --short

echo ""
echo "📝 Adding fix..."
git add .

echo ""
echo "✅ Committing build fix..."
git commit -m "🔥 HOTFIX: Remove duplicate FileText import

Build was failing due to duplicate FileText import in Icon component.
Removed duplicate import from Documents section, keeping it in Navigation section.

Error: the name \`FileText\` is defined multiple times
Fix: Keep FileText in Navigation section only

File: src/components/atoms/Icon/Icon.tsx"

echo ""
echo "🚀 Pushing fix..."
git push

echo ""
echo "✅ BUILD ERROR FIXED - Deployment should work now!"
echo ""
echo "🔧 Fix Applied:"
echo "└── Removed duplicate FileText import ✅"
