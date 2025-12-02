#!/bin/bash

echo "🚀 Starting TestFlight Submission Process..."
echo ""

# Step 1: Check if project is initialized
if ! grep -q "projectId" app.json; then
  echo "📝 Initializing EAS project..."
  # This will need manual confirmation
  eas project:init
else
  echo "✅ EAS project already configured"
fi

echo ""
echo "🏗️  Starting iOS build for production..."
echo "This will take 10-15 minutes. You'll get a link to track progress."
echo ""

# Build for iOS
eas build --platform ios --profile production --non-interactive

echo ""
echo "✅ Build queued! Check status at:"
echo "https://expo.dev"
echo ""
echo "Once build completes, run:"
echo "eas submit --platform ios --latest"
