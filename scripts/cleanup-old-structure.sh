#!/bin/bash

# Cleanup script for removing old file structure after migration
# Run this ONLY after verifying the new structure works correctly

echo "⚠️  WARNING: This script will permanently delete old files!"
echo "Make sure you have:"
echo "  1. Tested all screens and navigation"
echo "  2. Verified no import errors"
echo "  3. Committed your changes to git"
echo ""
read -p "Are you sure you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Cleanup cancelled."
    exit 0
fi

echo ""
echo "Starting cleanup..."
echo ""

# Remove old pawket components directory
if [ -d "components/pawket" ]; then
    echo "🗑️  Removing components/pawket/"
    rm -rf components/pawket/
fi

# Remove old standalone components (now in src/components/common)
echo "🗑️  Removing old standalone components..."
rm -f components/Collapsible.tsx
rm -f components/ExternalLink.tsx
rm -f components/HapticTab.tsx
rm -f components/HelloWave.tsx
rm -f components/ParallaxScrollView.tsx
rm -f components/PaywallButton.tsx
rm -f components/ThemedText.tsx
rm -f components/ThemedView.tsx

# Remove old UI components (now in src/components/ui)
if [ -d "components/ui" ]; then
    echo "🗑️  Removing old components/ui/"
    rm -rf components/ui/
fi

# Remove old hooks (now in src/hooks)
if [ -d "hooks" ]; then
    echo "🗑️  Removing old hooks/"
    rm -rf hooks/
fi

# Remove old contexts (now in src/contexts)
if [ -d "contexts" ]; then
    echo "🗑️  Removing old contexts/"
    rm -rf contexts/
fi

# Remove old services (now in src/services)
if [ -d "services" ]; then
    echo "🗑️  Removing old services/"
    rm -rf services/
fi

# Remove old config (now in src/config)
if [ -d "config" ]; then
    echo "🗑️  Removing old config/"
    rm -rf config/
fi

# Remove old constants (now in src/constants)
if [ -d "constants" ]; then
    echo "🗑️  Removing old constants/"
    rm -rf constants/
fi

# Remove old types (now in src/types)
if [ -d "types" ] && [ -d "src/types" ]; then
    echo "🗑️  Removing old types/"
    rm -rf types/
fi

# Remove old pawket route (replaced by main.tsx)
if [ -f "app/pawket.tsx" ]; then
    echo "🗑️  Removing app/pawket.tsx"
    rm -f app/pawket.tsx
fi

# Optionally remove (tabs) directory if not needed
read -p "Remove app/(tabs)/ directory? (yes/no): " remove_tabs
if [ "$remove_tabs" = "yes" ]; then
    if [ -d "app/(tabs)" ]; then
        echo "🗑️  Removing app/(tabs)/"
        rm -rf "app/(tabs)/"
    fi
fi

# Remove empty components directory if it exists
if [ -d "components" ] && [ -z "$(ls -A components)" ]; then
    echo "🗑️  Removing empty components/"
    rmdir components/
fi

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "Next steps:"
echo "  1. Run 'npm start' to verify everything still works"
echo "  2. Test all screens and navigation"
echo "  3. Commit the changes"
echo ""
