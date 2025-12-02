#!/bin/bash

# Build and submit to TestFlight
echo "Building for iOS TestFlight..."

# Configure EAS project if needed
eas build:configure

# Build for iOS production
eas build --platform ios --profile production --non-interactive

echo ""
echo "Build started! Check the EAS dashboard for progress:"
echo "https://expo.dev/accounts/rizhanruslan/projects/documentai/builds"
echo ""
echo "Once the build completes, submit to TestFlight with:"
echo "eas submit --platform ios --latest"
