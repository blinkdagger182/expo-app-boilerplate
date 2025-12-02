#!/bin/bash

echo "🚀 Deploying documentAI to Production (TestFlight)"
echo "=================================================="
echo ""
echo "App Configuration:"
echo "  Name: documentAI"
echo "  Bundle ID: com.riskcreatives.documentai"
echo "  Platform: iOS"
echo "  Profile: production"
echo ""
echo "This will:"
echo "  1. Build your app on EAS servers (10-15 minutes)"
echo "  2. Set up iOS credentials automatically"
echo "  3. Create a production build"
echo ""
echo "After the build completes, you can submit to TestFlight with:"
echo "  eas submit --platform ios --latest"
echo ""
read -p "Press Enter to start the build..."

# Start the build
eas build --platform ios --profile production

echo ""
echo "✅ Build started!"
echo ""
echo "Track your build at: https://expo.dev/accounts/rizhanruslan/projects/documentai/builds"
echo ""
echo "Once complete, submit to TestFlight:"
echo "  eas submit --platform ios --latest"
