#!/bin/bash

# Script to clear all caches and restart fresh

echo "🧹 Clearing caches..."
echo ""

# Clear node modules cache
if [ -d "node_modules/.cache" ]; then
    echo "Removing node_modules/.cache"
    rm -rf node_modules/.cache
fi

# Clear Expo cache
if [ -d ".expo" ]; then
    echo "Removing .expo cache"
    rm -rf .expo
fi

# Clear TypeScript cache
if [ -f "tsconfig.tsbuildinfo" ]; then
    echo "Removing TypeScript build info"
    rm -f tsconfig.tsbuildinfo
fi

# Clear Metro bundler cache
if [ -d "$TMPDIR/metro-*" ]; then
    echo "Removing Metro bundler cache"
    rm -rf $TMPDIR/metro-*
fi

# Clear React Native cache
if [ -d "$TMPDIR/react-*" ]; then
    echo "Removing React Native cache"
    rm -rf $TMPDIR/react-*
fi

echo ""
echo "✅ Cache cleared!"
echo ""
echo "Next steps:"
echo "  1. Restart your IDE (VS Code/Cursor)"
echo "  2. Run: npm start -- --clear"
echo ""
