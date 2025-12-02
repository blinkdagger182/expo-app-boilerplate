# Build Development Build for Physical Device

Since your app uses native modules (Superwall, RevenueCat), you need a development build instead of Expo Go.

## Quick Build & Install

### Option 1: Local Build (Fastest)

Make sure your iPhone is connected via USB, then run:

```bash
cd expo-app-boilerplate
npx expo run:ios --device
```

This will:
1. Build the app with all native modules
2. Install it on your connected iPhone
3. Start the Metro bundler

**Note**: This requires Xcode and takes 5-10 minutes for the first build.

### Option 2: EAS Build (Cloud Build)

If you don't want to use Xcode locally:

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure EAS
eas build:configure

# Build for iOS device (development)
eas build --profile development --platform ios

# Install on device
eas build:run -p ios
```

## After Installation

Once the development build is installed:

1. The app will be on your home screen (named "documentAI")
2. Open the app
3. It will connect to your Metro bundler automatically
4. You can now use all native features including Superwall!

## Troubleshooting

### "Unable to install"
- Make sure your iPhone is registered in your Apple Developer account
- Check that your device is trusted on your Mac

### "Code signing error"
- Open `ios/documentAI.xcworkspace` in Xcode
- Select your team in Signing & Capabilities
- Try building again

### Metro bundler not connecting
- Make sure both devices are on the same WiFi
- Run `npx expo start --clear` in the project directory
- Shake your device and tap "Enter URL manually"
- Enter: `http://YOUR_COMPUTER_IP:8081`
